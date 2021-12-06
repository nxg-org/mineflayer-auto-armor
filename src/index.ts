
import { Bot } from "mineflayer";
import { Item } from "prismarine-item";
import { AutoArmor } from "./src/AutoArmor";

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
    const autoarmor = new AutoArmor(bot);
    bot.autoArmor = autoarmor;
}