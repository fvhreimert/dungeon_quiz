export const gameData = [
        // --- Game Data (Ensure 6 categories, 5 questions each) ---
        { name: "POTENT POTABLES", questions: [
                { q: "What common tavern drink is made from fermented barley?", a: "What is Ale (or Beer)?" }, // 200
                { q: "This magical blue liquid restores a small amount of mana.", a: "What is a Mana Potion?" }, // 400
                { q: "Said to grant courage, this potion might just be strong liquor.", a: "What is Liquid Courage?" }, // 600
                { q: "Q4 Potable?", a: "A4 Potable"}, // 800
                { q: "Q5 Potable?", a: "A5 Potable"}  // 1000 <-- ADDED
            ]},
        { name: "MONSTERS", questions: [
                { q: "These small, green-skinned creatures often attack in groups.", a: "What are Goblins?" }, // 200
                { q: "A large, winged reptile known for breathing fire.", a: "What is a Dragon?" }, // 400
                { q: "This undead creature is often found guarding tombs and drains life.", a: "What is a Wight (or Wraith/Spectre)?" }, // 600
                { q: "Q4 Monster?", a: "A4 Monster"}, // 800
                { q: "Q5 Monster?", a: "A5 Monster"}  // 1000 <-- ADDED
            ]},
        { name: "MAGIC ITEMS", questions: [
                { q: "A container that can hold more on the inside than it appears.", a: "What is a Bag of Holding?" }, // 200
                { q: "This footwear grants the wearer the ability to move silently.", a: "What are Boots of Elvenkind (or Silence)?" }, // 400
                { q: "Often found as a ring or amulet, it protects from magical attacks.", a: "What is an Amulet of Proof against Detection and Location (or Ring of Spell Turning/Protection)?" }, // 600
                { q: "Q4 Item?", a: "A4 Item"}, // 800
                { q: "Q5 Item?", a: "A5 Item"}  // 1000 <-- ADDED
            ]},
        { name: "DUNGEON LORE", questions: [
                { q: "Q1 Lore?", a: "A1 Lore"}, { q: "Q2 Lore?", a: "A2 Lore"},
                { q: "Q3 Lore?", a: "A3 Lore"}, { q: "Q4 Lore?", a: "A4 Lore"},
                { q: "Q5 Lore?", a: "A5 Lore"} // 1000 <-- ADDED
            ]},
        { name: "TRAPS & TRICKS", questions: [
                { q: "Q1 Trap?", a: "A1 Trap"}, { q: "Q2 Trap?", a: "A2 Trap"},
                { q: "Q3 Trap?", a: "A3 Trap"}, { q: "Q4 Trap?", a: "A4 Trap"},
                { q: "Q5 Trap?", a: "A5 Trap"} // 1000 <-- ADDED
            ]},
        // --- ADDED 6th CATEGORY ---
        { name: "LOCATIONS", questions: [
                { q: "Q1 Location?", a: "A1 Location"}, // 200
                { q: "Q2 Location?", a: "A2 Location"}, // 400
                { q: "Q3 Location?", a: "A3 Location"}, // 600
                { q: "Q4 Location?", a: "A4 Location"}, // 800
                { q: "Q5 Location?", a: "A5 Location"}  // 1000
            ]}
        // --- END ADDED CATEGORY ---
    ];
    
    
    export const cardFiles = [
            // ... (keep existing card files) ...
            'spiny_shell.png'
    ];
    export const cardsFolderPath = 'cards/';
    
    // --- UPDATED BASE SCORE INCREMENT ---
    export const baseScoreIncrement = 200; // Set base increment for 200, 400, etc.
    // --- END UPDATE ---
// --- List of cards that can be activated from inventory ---
export const activeCards = new Set([
        'loot_goblin.png',
        'roulette.png',
        // --- ADD TREASURE CARDS ---
        'shovel.png',
        'map.png',
        'compass.png',
        'piggy_bank.png',
        'spiny shell.png'
        // --- END ADD ---
    ]);
    
    // --- NEW: Treasure Map Configuration ---
    export const treasureCards = {
        shovel: 'shovel.png',
        map: 'map.png',
        compass: 'compass.png'
    };
    export const TREASURE_REWARD = 1500;
    // --- END NEW ---