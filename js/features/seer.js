// js/features/seer.js
import * as DOM from '../domElements.js';
import * as state from '../state.js';
import { showInfoModal } from '../modals/infoModal.js';
import { closeSeerPeekModal } from '../modals/seerModal.js';
// --- ADDED IMPORTS ---
import { modifyPlayerScore } from '../player.js'; // To deduct score

// --- ADDED COST ---
const SEER_COST = 50;

export function handleDrunkenSeerClick() {
     // --- AFFORDABILITY CHECK ---
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer) {
        console.error("Drunken Seer: Cannot find current player.");
        return;
    }
    if (currentPlayer.score < SEER_COST) {
        showInfoModal("Not Enough Points!", `The Drunken Seer demands ${SEER_COST} points for a glimpse, but you only have ${currentPlayer.score}.`);
        return; // Stop execution
    }
    // --- END CHECK ---

    // Prevent overlapping actions or use on empty board
    if (state.isFrogChoosing || state.isSeerPeeking) return;
    const unopenedChestsCount = document.querySelectorAll('.chest:not(.opened)').length;
    if (unopenedChestsCount === 0) {
        showInfoModal("Drunken Seer", "The Seer belches... No unopened chests to peek at!");
        return;
    }

    // --- DEDUCT COST (BEFORE showing prompt) ---
    modifyPlayerScore(state.currentPlayerIndex, -SEER_COST);
     console.log(`Player ${currentPlayer.name} paid ${SEER_COST} points for the Drunken Seer.`);
    // --- END DEDUCTION ---

    const currentPlayerName = currentPlayer.name || 'Adventurer';
    // Use the info modal callback to activate peek mode *after* the user clicks OK
    showInfoModal(
        "Drunken Seer",
        `${currentPlayerName}, the Seer offers a glimpse (cost: ${SEER_COST} pts paid)! Click OK, then pick a chest to peek inside.`,
        () => { activateSeerPeekMode(); } // Pass activate function as callback
    );
}

// Rest of seer.js remains the same (activateSeerPeekMode, cancelSeerPeekMode)
// ...

function activateSeerPeekMode() {
    console.log("Activating Seer Peek Mode");
    state.setSeerPeeking(true); // Set state flag
    state.setSeerPeekTargetChest(null); // Clear any previous target

    // Mark all unopened chests as available for peeking
    document.querySelectorAll('.chest:not(.opened)').forEach(chest => {
        chest.classList.add('seer-peek-available');
    });

    // Visually indicate Seer mode is active and disable other features
    if (DOM.drunkenSeerImg) DOM.drunkenSeerImg.style.filter = 'brightness(1.3) saturate(1.5)';
    if (DOM.cardJesterImg) DOM.cardJesterImg.style.pointerEvents = 'none';
    if (DOM.frogOfFateImg) DOM.frogOfFateImg.style.pointerEvents = 'none';
    if (DOM.sacrificialGobletImg) DOM.sacrificialGobletImg.style.pointerEvents = 'none';
    // Add class to body? Might be useful for global styling overrides
    DOM.body.classList.add('seer-mode-active');
}

export function cancelSeerPeekMode() {
    if (!state.isSeerPeeking) return; // Only cancel if active

    console.log("Cancelling Seer Peek Mode");
    state.setSeerPeeking(false); // Reset state flag
    state.setSeerPeekTargetChest(null); // Clear target

    // Remove peek available class from all chests
    document.querySelectorAll('.chest.seer-peek-available').forEach(chest => {
        chest.classList.remove('seer-peek-available');
    });

    // Restore normal visuals and re-enable other features
    if (DOM.drunkenSeerImg) DOM.drunkenSeerImg.style.filter = 'none';
    if (DOM.cardJesterImg) DOM.cardJesterImg.style.pointerEvents = 'auto';
    if (DOM.frogOfFateImg) DOM.frogOfFateImg.style.pointerEvents = 'auto';
    if (DOM.sacrificialGobletImg) DOM.sacrificialGobletImg.style.pointerEvents = 'auto';
    DOM.body.classList.remove('seer-mode-active');

    // Ensure the peek modal is closed if the mode is cancelled externally
    closeSeerPeekModal();
}