import { Item } from "prismarine-item";
import { ESMap } from "typescript";
import { ArmorPieces } from "./AATypes";



export const armorPieces: ArmorPieces[] = ["head", "torso", "legs", "feet"];

export const armorPlacement = {
    leather_helmet: "head",
    leather_chestplate: "torso",
    leather_leggings: "legs",
    leather_boots: "feet",
    golden_helmet: "head",
    golden_chestplate: "torso",
    golden_leggings: "legs",
    golden_boots: "feet",
    chainmail_helmet: "head",
    chainmail_chestplate: "torso",
    chainmail_leggings: "legs",
    chainmail_boots: "feet",
    iron_helmet: "head",
    iron_chestplate: "torso",
    iron_leggings: "legs",
    iron_boots: "feet",
    diamond_helmet: "head",
    diamond_chestplate: "torso",
    diamond_leggings: "legs",
    diamond_boots: "feet",
    netherite_helmet: "head",
    netherite_chestplate: "torso",
    netherite_leggings: "legs",
    netherite_boots: "feet",
    turtle_helmet: "head",
    elytra: "torso",
    shield: "off-hand",
    other: "hand",
} as const;

export const armorRankings = {
    leather_helmet: [1, 0],
    leather_chestplate: [3, 0],
    leather_leggings: [2, 0],
    leather_boots: [1, 0],
    golden_helmet: [2, 0],
    golden_chestplate: [5, 0],
    golden_leggings: [3, 0],
    golden_boots: [1, 0],
    chainmail_helmet: [2, 0],
    chainmail_chestplate: [5, 0],
    chainmail_leggings: [4, 0],
    chainmail_boots: [1, 0],
    iron_helmet: [2, 0],
    iron_chestplate: [6, 0],
    iron_leggings: [5, 0],
    iron_boots: [2, 0],
    diamond_helmet: [3, 2],
    diamond_chestplate: [8, 2],
    diamond_leggings: [6, 2],
    diamond_boots: [3, 2],
    netherite_helmet: [3, 3],
    netherite_chestplate: [8, 3],
    netherite_leggings: [6, 3],
    netherite_boots: [3, 3],
    turtle_helmet: [2, 0],
    elytra: [0, 0],
    shield: [10, 0],
    other: [0, 0],
} as const;

export const enchantmentRankingsPerLevel = {
    mending: 1,
    protection: 0.5,
    blast_protection: 0.4,
    frost_walker: 0.4,
    thorns: 0.33,
    soul_speed: 0.33,
    unbreaking: 0.2,
    other: 0,
} as const;

