// js/state.js
import { baseScoreIncrement } from './config.js';

export let players = [];
export let currentPlayerIndex = 0;
export let currentAnswer = '';
export let isFrogChoosing = false;
export let infoModalCallback = null;
export let isSeerPeeking = false;
export let seerPeekTargetChest = null;
export let frogMultipliers = new Map(); // Stores chestElement -> multiplier
export let currentQuestionBasePoints = 0;
export let currentQuestionMultiplier = 1;
export const scoreIncrement = baseScoreIncrement; // Use config value

// --- State Modifier Functions ---

export function setPlayers(newPlayers) {
    // Ensure each player object has an inventory array AND effect COUNTERS when set
    players = newPlayers.map(player => ({
        ...player, // Spread existing properties
        score: player.score || 0, // Ensure score exists
        inventory: player.inventory || [], // Add empty inventory if missing
        // --- CHANGE TO COUNTERS ---
        infiniteMoneyGlitchCount: player.infiniteMoneyGlitchCount || 0,
        tickCardCount: player.tickCardCount || 0,
        // --- END COUNTERS ---
    }));
    // console.log("Players set in state (with effect counts):", players); // Keep logs for now if needed
}

export function setCurrentPlayerIndex(index) {
    if (index >= 0 && index < players.length) {
        currentPlayerIndex = index;
    } else {
        console.error(`Invalid player index attempted: ${index}`);
        currentPlayerIndex = 0; // Reset to first player as a fallback
    }
}

export function addCardToPlayerInventory(playerIndex, cardFilename) {
    if (players[playerIndex] && players[playerIndex].inventory) {
        players[playerIndex].inventory.push(cardFilename);
         // Log inventory after adding
        // console.log(`[State] Player ${playerIndex} inventory after add:`, JSON.parse(JSON.stringify(players[playerIndex].inventory)));
    } else {
        console.error(`Cannot add card to inventory: Player ${playerIndex} or inventory array not found.`);
    }
}

// --- NEW: Function to remove a card ---
export function removeCardFromPlayerInventory(playerIndex, cardFilename) {
    if (!players[playerIndex] || !players[playerIndex].inventory) {
        console.error(`Cannot remove card: Player ${playerIndex} or inventory not found.`);
        return false; // Indicate failure
    }

    const inventory = players[playerIndex].inventory;
    const cardIndexToRemove = inventory.indexOf(cardFilename);

    if (cardIndexToRemove > -1) {
        inventory.splice(cardIndexToRemove, 1); // Remove the first occurrence
        console.log(`[State] Removed '${cardFilename}' from player ${playerIndex}. New inventory:`, JSON.parse(JSON.stringify(inventory)));
        return true; // Indicate success
    } else {
        console.warn(`[State] Card '${cardFilename}' not found in player ${playerIndex}'s inventory for removal.`);
        return false; // Indicate card not found
    }
}

// --- *** ADD export HERE *** ---
export function incrementPlayerInfiniteMoneyGlitch(playerIndex) {
    if (players[playerIndex]) {
        // Check value BEFORE incrementing
        const currentCount = players[playerIndex].infiniteMoneyGlitchCount || 0;
        players[playerIndex].infiniteMoneyGlitchCount = currentCount + 1;
        // Log BEFORE and AFTER
        console.log(`[State DEBUG] Player ${playerIndex} Glitch BEFORE: ${currentCount}, AFTER: ${players[playerIndex].infiniteMoneyGlitchCount}`);
    } else {
        console.error(`Cannot increment Infinite Money Glitch: Player ${playerIndex} not found.`);
    }
}

// --- *** ADD export HERE *** ---
export function incrementPlayerTickCard(playerIndex) {
     if (players[playerIndex]) {
        // Check value BEFORE incrementing
        const currentCount = players[playerIndex].tickCardCount || 0;
        players[playerIndex].tickCardCount = currentCount + 1;
        // Log BEFORE and AFTER
        console.log(`[State DEBUG] Player ${playerIndex} Tick BEFORE: ${currentCount}, AFTER: ${players[playerIndex].tickCardCount}`);
    } else {
        console.error(`Cannot increment Tick Card: Player ${playerIndex} not found.`);
    }
}
// --- END CHANGE FUNCTIONS ---


export function setCurrentAnswer(answer) {
    currentAnswer = answer;
}

export function setFrogChoosing(value) {
    isFrogChoosing = Boolean(value);
}

export function setInfoModalCallback(callback) {
    infoModalCallback = callback;
}

export function setSeerPeeking(value) {
    isSeerPeeking = Boolean(value);
}

export function setSeerPeekTargetChest(chestElement) {
    seerPeekTargetChest = chestElement;
}

export function setChestMultiplier(chestElement, multiplier) {
    if (multiplier > 1) {
        frogMultipliers.set(chestElement, multiplier);
    } else {
        frogMultipliers.delete(chestElement); // Remove if multiplier is 1 or less
    }
}

export function getChestMultiplier(chestElement) {
    return frogMultipliers.get(chestElement) || 1; // Default to 1 if not found
}

export function deleteChestMultiplier(chestElement) {
    frogMultipliers.delete(chestElement);
}

export function clearFrogMultipliers() {
    frogMultipliers.clear();
}

export function setCurrentQuestionParams(basePoints, multiplier) {
    currentQuestionBasePoints = basePoints || 0;
    currentQuestionMultiplier = multiplier || 1;
}

export function resetCurrentQuestionParams() {
    currentQuestionBasePoints = 0;
    currentQuestionMultiplier = 1;
}