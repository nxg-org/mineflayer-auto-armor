
// Okay, seems like armor equation isn't actually that bad. At least for the basics.

import { Item } from "prismarine-item"
import { ESMap } from "typescript"
import { armorRankings, enchantmentRankingsPerLevel } from "./AAConsts"
import { NormalizedEnchant } from "./AAInterfaces"

// Basic protection enchant for physical damage is as follows:
// (4 * level) per piece, stacks additively AFTER original armor calculation.
// EX: diamond armor = 80%. prot 3, 3, 2, 2 = 10 prot points. 4 * 10 = 40%. 100 - 80 = 20%, 40% of 20% is 8%. total is 88% damage reduction.
// May be outdated, have to cross-reference.
// Anyway, let's get started.

// nvm. https://www.desmos.com/calculator/jzkjlil4ss

export function newCalcForPhysical(armorName: string, enchantments: NormalizedEnchant[] = []) {
    //@ts-expect-error
    const armor = armorRankings[armorName] ?? armorRankings.other
    const enchantLevel = enchantments.map((enchant) => enchant.name === "protection" ? enchant.lvl : 0).reduce((a, b) => a + b, 0)

    //apply 10 damage to armor damage reduction calculation. 
    // returning damage blocked by armor.
    let first = armor[0] - (10 / (2 + (armor[1]/4)))
    if (first < armor[0]/5) first = armor[0]/5
    if (first > 20) first = 20
    const result = (10 * (1 - (first / 25))) * (1 - (enchantLevel / 100)) //across entire armor set, it's /25. Did 100 as 1/25 / 4 = 1/100
    console.log(armor, armorName, result)
    return  result
}


export function newNewCalcForPhysical(wornArmor: ESMap<string, Item | undefined>, armorName: string, enchantments: NormalizedEnchant[] = []) {
    const add = (a: number, b: number) => a + b
    const enchantFunc = (enchant: NormalizedEnchant) => enchant?.name === "protection" ? enchant.lvl : 0
    let obj: Item[] = []
    for (const value of wornArmor.values() as any) obj.push(value)

    const allButCheckingArmor = obj.filter(value =>  !!value && value?.name !== armorName)
    console.log(armorName, allButCheckingArmor.length)
    //@ts-expect-error
    const allArmorProt = allButCheckingArmor.map(armor => (armorRankings[armor?.name] ?? armorRankings.other)[0]).reduce(add, 0) + (armorRankings[armorName] ?? armorRankings.other)[0]
    //@ts-expect-error
    const allArmorToughness = allButCheckingArmor.map(armor => (armorRankings[armor?.name] ?? armorRankings.other)[1]).reduce(add, 0) + (armorRankings[armorName] ?? armorRankings.other)[1]
    const allEnchants = allButCheckingArmor.map(armor => armor.enchants.map(enchantFunc).reduce(add, 0)).reduce(add, 0) + enchantments.map(enchantFunc).reduce(add, 0)

    //apply 10 damage to armor damage reduction calculation. 
    // returning damage blocked by armor.
    let first = allArmorProt - (10 / (2 + (allArmorToughness / 4)))
    if (first < allArmorProt / 5) first = allArmorProt / 5
    if (first > 20) first = 20
    const result = (10 * (1 - (first / 25))) * (1 - (allEnchants / 25)) //across entire armor set, it's /25. Did 100 as 1/25 / 4 = 1/100
    console.log(armorName,result)
    return  result
}



export function calculateWorth(armorName: string, enchantments: NormalizedEnchant[] = []) {
    //@ts-expect-error
    return ((armorRankings[armorName] ?? armorRankings.other)[0] + enchantments.map((enchant) => (enchantmentRankingsPerLevel[enchant.name] ?? enchantmentRankingsPerLevel.other) * enchant.lvl).reduce((a, b) => a + b, 0));
}