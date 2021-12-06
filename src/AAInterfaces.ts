import { Item } from "prismarine-item";
import { ESMap } from "typescript";

// Stolen from prismarine-item
export interface NormalizedEnchant {
    name: string;
    lvl: number;
}

export interface AutoArmorOptions {
    enabled: boolean;
    autoReplace: boolean;
    waitTick: number;
    priority: string;
    bannedArmor: string[];
    ignoreInventoryCheck: boolean;
    checkOnItemPickup: boolean;
    armorTimeout?: number;
    wornArmor?: ESMap<string, Item | undefined>;
}
