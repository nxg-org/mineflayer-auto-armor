
import { Bot } from "mineflayer";
import { Item } from "prismarine-item";
import { AutoArmor } from "./AutoArmor";
import utilPlugin from "@nxg-org/mineflayer-util-plugin";

declare module "mineflayer" {
    interface Bot {
        autoArmor: AutoArmor;
    }
    interface BotEvents {
        autoArmorStartedEquipping: () => void;
        autoArmorEquippedItem: (item: Item) => void;
        autoArmorStoppedEquipping: () => void;
    }
}

export default function plugin(bot: Bot) {
    if (!bot.hasPlugin(utilPlugin)) bot.loadPlugin(utilPlugin)
    const autoarmor = new AutoArmor(bot);
    bot.autoArmor = autoarmor;
}