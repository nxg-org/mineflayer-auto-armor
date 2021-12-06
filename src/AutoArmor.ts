import { Bot } from "mineflayer";
import { Entity } from "prismarine-entity";
import { Item } from "prismarine-item";
import { ESMap } from "typescript";
import { promisify } from "util";
import md, { IndexedData } from "minecraft-data";
import { armorPieces, armorRankings, armorPlacement } from "./AAConsts";
import { AutoArmorOptions } from "./AAInterfaces";
import { calculateWorth } from "./AAFuncs";

const sleep = promisify(setTimeout);

export class AutoArmor {
    bot: Bot;
    enabled: boolean;
    autoReplace: boolean;
    waitTick: number;
    priority: string;
    bannedArmor: string[];
    ignoreInventoryCheck: boolean;
    checkOnItemPickup: boolean;
    items: { [id: number]: md.Item; };
    currentlyEquipping: boolean;
    wornArmor: ESMap<string, Item | undefined>;

    constructor(bot: Bot, options?: AutoArmorOptions) {
        this.bot = bot;
        this.enabled = options?.enabled ?? true;
        this.autoReplace = options?.autoReplace ?? true;
        this.checkOnItemPickup = options?.checkOnItemPickup ?? false;
        this.waitTick = options?.waitTick ?? 5;
        this.priority = options?.priority ?? "raw"; //* planned "durability" | "enchantments" | "armorType" | "raw"
        this.bannedArmor = options?.bannedArmor ?? [];
        this.wornArmor = options?.wornArmor ?? new Map<string, Item | undefined>();
        this.ignoreInventoryCheck = options?.ignoreInventoryCheck ?? false;
        this.currentlyEquipping = false;

        this.items = {};
        this.bot.once("spawn", () => {
            this.items = md(this.bot.version).items;
        });
        

        this.bot.on("entityAttributes", this.selfArmorCheck.bind(this));
        this.bot.on("spawn", () => {
            this.currentlyEquipping = false;
        });
        this.bot.on("death", () => {
            this.currentlyEquipping = false;
        });
        this.bot.on("playerCollect", this.playerCollectCheck.bind(this));
    }

    disable() {
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
    }

    disableAuto() {
        this.autoReplace = false;
    }

    enableAuto() {
        this.autoReplace = true;
    }

    addBannedArmor(armorName: string) {
        this.bannedArmor.push(armorName);
    }

    removeBannedArmor(...armorNames: string[]) {
        this.bannedArmor = this.bannedArmor.filter((name) => !armorNames.includes(name));
    }

    // This is messy but works on every version.
    // If there's a better way to get an item from an entity on the ground, let me know.
    armorFromGround(item: Entity) {
        // let metadata = item.metadata.find((obj) => Object.keys(obj).some((key) => key.includes("Id")));
        let metadata = item.metadata[item.metadata.length - 1];

        //@ts-expect-error
        let key = metadata[Object.keys(metadata).find((key) => key.includes("Id"))!];

        let rawitem = this.items[key];

        //@ts-expect-error
        let place = armorPlacement[rawitem.name] ?? armorPlacement.other;
        if (armorPieces.includes(place)) this.armorPiece(place);
    }

    async emitWrapper(func: (...args: any[]) => Promise<any> | Promise<void> | Promise<unknown> | void, ...args: any) {
        if (this.currentlyEquipping) return;
        this.currentlyEquipping = true;
        this.bot.emit("autoArmorStartedEquipping");
        await func(...args);
        this.currentlyEquipping = false;
        this.bot.emit("autoArmorStoppedEquipping");
    }

    async unequipArmor(waitTicks?: number) {
        await this.emitWrapper(async () => {
            if (this.autoReplace) return;
            for (let i = 0; i < armorPieces.length; i++) {
                await this.bot.waitForTicks(this.waitTick ?? waitTicks);
                await this.bot.util.builtInsPriority({group: "inventory", priority: 1}, this.bot.unequip, armorPieces[i]);
                this.wornArmor.set(armorPieces[i], undefined);
            }
        });
    }

    async equipArmor(waitTicks?: number) {
        await this.emitWrapper(async () => {
            for (let i = 0; i < armorPieces.length; i++) {
                const piece = armorPieces[i];
                if (!this.bot.inventory.slots[this.bot.getEquipmentDestSlot(piece)]) {
                    await this.bot.waitForTicks(this.waitTick ?? waitTicks);
                    await this.armorPiece(armorPieces[i]);
                }
            }
        });
    }

    async armorPiece(target: string, manual = false) {
        const bestChoices = this.bot.inventory
            .items()
            .filter((item) => item.name in armorRankings)
            .filter((item) => !this.bannedArmor.includes(item.name))
            //@ts-ignore
            .filter((item) => armorPlacement[item.name] === target)
            .sort((a, b) => calculateWorth(b.name, b.enchants) - calculateWorth(a.name, a.enchants));
        // .sort((a, b) => {
        // console.log(a.durabilityUsed, b.durabilityUsed)
        // return a.durabilityUsed - b.durabilityUsed});

        if (bestChoices.length === 0) return manual ? Error("No Armor found.") : null;

        const bestArmor = bestChoices[0];

        const currentArmor = this.bot.inventory.slots[this.bot.getEquipmentDestSlot(target)];

        if (
            calculateWorth(currentArmor?.name ?? "other", currentArmor?.enchants) > calculateWorth(bestArmor?.name, bestArmor?.enchants) ||
            currentArmor?.durabilityUsed < bestArmor?.durabilityUsed
        )
            return manual ? Error("Better armor already equipped.") : null;

        const requiresConfirmation = this.bot.inventory.requiresConfirmation;
        if (this.ignoreInventoryCheck) this.bot.inventory.requiresConfirmation = false;

        //@ts-expect-error
        const place = armorPlacement[bestArmor.name];

        await this.bot.util.builtInsPriority({group: "inventory", priority: 1}, this.bot.equip, bestArmor, place)
        this.wornArmor.set(place, bestArmor);
        this.bot.inventory.requiresConfirmation = requiresConfirmation;

        this.bot.emit("autoArmorEquippedItem", bestArmor);

        return;
    }

    async selfArmorCheck(who: Entity) {
        if (!this.enabled || who !== this.bot.entity || !this.autoReplace) return;
        try {
            await this.equipArmor();
        } catch (e) {
            console.log(e);
        }
    }

    async playerCollectCheck(who: Entity, item: Entity) {
        if (who.username !== this.bot.username || !this.checkOnItemPickup) return;
        try {
            await this.bot.waitForTicks(1);
            await this.armorFromGround(item);
        } catch (e) {}
    }
}
