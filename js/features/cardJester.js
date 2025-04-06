// js/features/cardJester.js
import * as state from '../state.js';
import * as config from '../config.js';
import { showCard } from '../modals/cardModal.js';
import { showInfoModal } from '../modals/infoModal.js';
import { cancelSeerPeekMode } from './seer.js';
import { modifyPlayerScore } from '../player.js';
// --- Import for updating display ---
import { updatePlayerInventoryDisplay } from '../player.js';

// --- Corrected Cost ---
const JESTER_COST = 75; // As per original request

export function handleDrawCard() {
    // --- AFFORDABILITY CHECK ---
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer) {
        console.error("Card Jester: Cannot find current player.");
        return;
    }
    if (currentPlayer.score < JESTER_COST) {
        showInfoModal("Not Enough Points!", `The Card Jester demands ${JESTER_COST} points, but you only have ${currentPlayer.score}.`);
        return; // Stop execution
    }
    // --- END CHECK ---

    // Prevent overlapping actions
    if (state.isFrogChoosing) return;
    if (state.isSeerPeeking) cancelSeerPeekMode();

    // Check if deck is empty
    if (config.cardFiles.length === 0) {
        showInfoModal("Empty Deck", "The Deck of Darks is empty! The Jester shrugs.");
        return;
    }

    // --- DEDUCT COST (BEFORE showing card) ---
    modifyPlayerScore(state.currentPlayerIndex, -JESTER_COST);
    console.log(`Player ${currentPlayer.name} paid ${JESTER_COST} points for the Card Jester.`);
    // --- END DEDUCTION ---

    // --- Draw Card ---
    const randomIndex = Math.floor(Math.random() * config.cardFiles.length);
    const randomCardFilename = config.cardFiles[randomIndex];

    // --- Show Card Modal ---
    showCard(randomCardFilename); // Show the drawn card popup

    // --- ADD TO STATE INVENTORY ---
    state.addCardToPlayerInventory(state.currentPlayerIndex, randomCardFilename);
    console.log(`Added ${randomCardFilename} to player ${state.currentPlayerIndex}'s inventory (state).`);
    // --- END ADD TO STATE ---

    // --- *** APPLY CARD EFFECT *** ---
    applyCardEffect(state.currentPlayerIndex, randomCardFilename);
    // --- *** END APPLY EFFECT *** ---


    // --- UPDATE VISUAL INVENTORY DISPLAY ---
    // Note: This display is currently hidden by CSS, but the logic remains
    updatePlayerInventoryDisplay(state.currentPlayerIndex);
    console.log(`Updated visual inventory display for player ${state.currentPlayerIndex}.`);
    // --- END UPDATE DISPLAY ---

}


// --- FUNCTION TO HANDLE CARD EFFECTS ---
function applyCardEffect(playerIndex, cardFilename) {
    const playerName = state.players[playerIndex]?.name || 'The player';

    console.log(`Applying effect for card: ${cardFilename} to player ${playerIndex} (${playerName})`);

    switch (cardFilename) {
        case 'infinite_money_glitch.png':
            // --- CHANGE TO INCREMENT COUNT ---
            state.incrementPlayerInfiniteMoneyGlitch(playerIndex);
            console.log(`Incremented Infinite Money Glitch count for player ${playerIndex}`);
            // --- END CHANGE ---
            break;

        case 'tick_card.png':
             // --- CHANGE TO INCREMENT COUNT ---
            state.incrementPlayerTickCard(playerIndex);
            console.log(`Incremented Tick Card count for player ${playerIndex}`);
             // --- END CHANGE ---
            break;

        // --- Add cases for other cards here later ---
        // case 'compass.png':
        //     // ... compass logic ...
        //     break;

        default:
            console.log(`No specific effect implemented for card: ${cardFilename}`);
            break;
    }
}
// --- END FUNCTION ---