
# mineflayer-auto-armor

[![GitHub issues](https://img.shields.io/github/issues/nxg-org/mineflayer-auto-armor?style=flat-square)](https://github.com/nxg-org/mineflayer-auto-armor/issues) [![GitHub stars](https://img.shields.io/github/stars/nxg-org/mineflayer-auto-armor?style=flat-square)](https://github.com/nxg-org/mineflayer-auto-armor/stargazers) [![GitHub license](https://img.shields.io/github/license/nxg-org/mineflayer-auto-armor?style=flat-square)](https://github.com/nxg-org/mineflayer-auto-armor/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/@nxg-org/mineflayer-auto-armor?style=flat-square)](https://www.npmjs.com/package/@nxg-org/mineflayer-auto-armor) [![Discord](https://img.shields.io/discord/ytKSJPbUX6?label=Discord&style=flat-square)](https://discord.gg/ytKSJPbUX6 )

## Overview

**mineflayer-auto-armor** is a plugin for [mineflayer](https://github.com/PrismarineJS/mineflayer) bots that automatically sorts, selects, and equips the best available armor based on configurable parameters. It enhances your bot's defenses by continuously monitoring its inventory, comparing armor stats using a ranking system, and managing equipping actions efficiently.

## Features

- **Automatic Equipping:** Monitors your bot's inventory and equips the best armor for each slot.
- **Manual Control:** Offers methods to manually trigger equipping or unequipping routines.
- **Dynamic Auto-Replacement:** Automatically replaces worn armor with better options when available.
- **Event Hooks:** Emits events (`autoArmorStartedEquipping`, `autoArmorEquippedItem`, `autoArmorStoppedEquipping`) during the equipping process.
- **Customizable Behavior:** Configure options like auto-replacement, equipping delays, banned armor items, and more.
- **TypeScript Support:** Fully typed codebase for reliable integration.
- **Seamless Integration:** Attaches directly to your mineflayer bot instance.

## Installation

Install the plugin via yarn or npm. Ensure you have a mineflayer bot project set up:

```bash
# Using yarn
yarn add @nxg-org/mineflayer-auto-armor

# Using npm
npm install @nxg-org/mineflayer-auto-armor
```

## Usage

After creating your bot, load the plugin to attach an `autoArmor` instance to your bot. The plugin listens to several events (such as `entityAttributes`, `playerCollect`, and `spawn`) to manage armor equipping automatically. You also have direct access to a variety of methods to control the behavior manually.

### Basic Integration

```js
const mineflayer = require('mineflayer');
const autoArmorPlugin = require('@nxg-org/mineflayer-auto-armor');

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'Bot'
});

// Load the autoArmor plugin
bot.loadPlugin(autoArmorPlugin);
```

### Key Methods and Controls

The `AutoArmor` class (defined in `src/AutoArmor.ts`) provides several methods:

- **Auto-Equipping:**  
  - `equipArmor(waitTicks?)`: Scans your bot’s inventory and equips armor on empty slots.  
  - `unequipArmor(waitTicks?)`: Unequips current armor (only effective when auto-replacement is disabled).

- **Manual Equipping of a Specific Slot:**  
  - `armorPiece(target, manual = false)`: Evaluates and equips the best armor for a specific slot (e.g., `"head"`, `"torso"`, `"legs"`, `"feet"`). If called manually and no better armor is found, it returns an error.

- **Auto-Replace Controls:**  
  - `disableAuto()`: Disables auto-replacement so that the bot won’t automatically swap out currently worn armor.  
  - `enableAuto()`: Re-enables auto-replacement.

- **Banned Armor Management:**  
  - `addBannedArmor(armorName)`: Adds an armor name to the banned list (it will be ignored during equipping).  
  - `removeBannedArmor(...armorNames)`: Removes one or more armor items from the banned list.

- **Event Emission:**  
  The class wraps equipping actions with an `emitWrapper` method that emits:
  - `autoArmorStartedEquipping` before starting an equipping routine.
  - `autoArmorEquippedItem` after each armor item is equipped.
  - `autoArmorStoppedEquipping` after completing the routine.

- **Reactive Armor Checks:**  
  The plugin listens for:
  - `entityAttributes` events to trigger `selfArmorCheck` (re-equips if a better armor is found).
  - `playerCollect` events to check armor from items on the ground (if enabled via `checkOnItemPickup`).

### Manual Usage Example

You can control the armor equipping process manually as needed:

```js
// Manually trigger the equipping process:
bot.autoArmor.equipArmor();

// To unequip armor (if auto-replacement is turned off):
bot.autoArmor.unequipArmor();

// To target a specific armor slot:
bot.autoArmor.armorPiece("head", true);

// Toggle auto-replacement:
bot.autoArmor.disableAuto(); // Disable auto replacement
bot.autoArmor.enableAuto();  // Enable auto replacement
```

### Listening to Events

Hook into the plugin’s events to receive real-time updates:

```js
bot.on('autoArmorStartedEquipping', () => {
  console.log('Auto armor equipping started.');
});

bot.on('autoArmorEquippedItem', (item) => {
  console.log(`Equipped: ${item.name}`);
});

bot.on('autoArmorStoppedEquipping', () => {
  console.log('Auto armor equipping stopped.');
});
```

## Configuration

Customize the plugin’s behavior using options defined in the `AutoArmorOptions` interface. Options include:

- **enabled:** Toggle the auto armor functionality.
- **autoReplace:** Automatically replace worn armor if a better option is found.
- **waitTick:** Delay (in ticks) between each equipping action.
- **priority:** Define the armor evaluation priority (e.g., `"raw"`, with plans for `"durability"`, `"enchantments"`, etc.).
- **bannedArmor:** List of armor items that should not be equipped.
- **ignoreInventoryCheck:** Option to bypass inventory confirmation checks.
- **checkOnItemPickup:** Automatically trigger an armor check when new items are picked up.
- **armorTimeout:** (Optional) Set a timeout for equipping actions.
- **wornArmor:** (Optional) Tracks the currently worn armor items.

Pass these options during initialization if you wish to customize the behavior.

## Development

The project is written in TypeScript. Source files are located in the `src/` directory:

- **AATypes.ts:** Type definitions for armor pieces.
- **AAInterfaces.ts:** Interfaces including configuration options.
- **AAFuncs.ts:** Contains the `calculateWorth` function to rank armor based on stats.
- **AAConsts.ts:** Defines constants such as armor placements and rankings.
- **AutoArmor.ts:** Main class with methods for equipping, unequipping, and checking armor.
- **index.ts:** Entry point that integrates the plugin with mineflayer.

To build the project, run:

```bash
tsc
```

This compiles the TypeScript files to JavaScript in the `lib/` directory.

## Support & Contributions

For support or to report issues, join our [Discord server](https://discord.gg/ytKSJPbUX6). Contributions are welcome! Please open issues or submit pull requests via the [GitHub repository](https://github.com/nxg-org/mineflayer-auto-armor).

## License

This project is licensed under the [GPL-3.0 License](https://opensource.org/licenses/GPL-3.0).
