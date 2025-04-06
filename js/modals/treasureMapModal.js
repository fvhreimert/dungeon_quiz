// js/modals/treasureMapModal.js
import * as DOM from '../domElements.js';
import * as state from '../state.js';
import * as config from '../config.js';
import { modifyPlayerScore, updatePlayerInventoryDisplay } from '../player.js';
import { showInfoModal } from './infoModal.js';

let currentTreasurePlayerIndex = -1;
const placeholderImage = 'images/card_placeholder.png'; // Path to your placeholder

export function showTreasureMapModal(playerIndex) {
    if (!DOM.treasureMapModal || !DOM.openTreasureBtn || !DOM.treasureSlotShovelImg || !DOM.treasureSlotMapImg || !DOM.treasureSlotCompassImg) {
        console.error("Cannot show Treasure Map modal: Required elements missing.");
        return;
    }

    currentTreasurePlayerIndex = playerIndex;

    // --- FIX: Define player and check it BEFORE using it ---
    const player = state.players[playerIndex]; // Define player first
    if (!player) {                             // Check if player exists
        console.error("Treasure Map: Cannot find player", playerIndex);
        currentTreasurePlayerIndex = -1;
        return; // Exit if player not found
    }
    // --- END FIX ---

    // Now it's safe to use 'player'
    const inventory = player.inventory || []; // Now this line is okay
    const hasShovel = inventory.includes(config.treasureCards.shovel);
    const hasMap = inventory.includes(config.treasureCards.map);
    const hasCompass = inventory.includes(config.treasureCards.compass);

    // Update card slot images - set src="" if missing
    DOM.treasureSlotShovelImg.src = hasShovel ? config.cardsFolderPath + config.treasureCards.shovel : "";
    DOM.treasureSlotMapImg.src = hasMap ? config.cardsFolderPath + config.treasureCards.map : "";
    DOM.treasureSlotCompassImg.src = hasCompass ? config.cardsFolderPath + config.treasureCards.compass : "";

    // Add/Remove a class to the image or slot for styling empty ones
    DOM.treasureSlotShovelImg.classList.toggle('slot-empty', !hasShovel);
    DOM.treasureSlotMapImg.classList.toggle('slot-empty', !hasMap);
    DOM.treasureSlotCompassImg.classList.toggle('slot-empty', !hasCompass);

    const canOpen = hasShovel && hasMap && hasCompass;
    DOM.openTreasureBtn.disabled = !canOpen;
    if (DOM.treasureMapStatus) {
         DOM.treasureMapStatus.textContent = canOpen ? "All items found! The treasure awaits!" : "Keep searching for the missing pieces...";
    }

    DOM.treasureMapModal.style.display = 'flex';
}

function handleOpenTreasureClick() {
    if (currentTreasurePlayerIndex < 0) {
        console.error("Treasure Error: No player index stored.");
        closeTreasureMapModal();
        return;
    }
    const playerIndex = currentTreasurePlayerIndex;
    const player = state.players[playerIndex];
     if (!player || !player.inventory) {
        console.error("Treasure Error: Player or inventory not found for index", playerIndex);
        closeTreasureMapModal();
        return;
    }

     // Final verification (important!)
    const inventory = player.inventory;
    const hasShovel = inventory.includes(config.treasureCards.shovel);
    const hasMap = inventory.includes(config.treasureCards.map);
    const hasCompass = inventory.includes(config.treasureCards.compass);

    if (!(hasShovel && hasMap && hasCompass)) {
         console.error("Treasure Error: Player tried to open treasure without all cards (button should be disabled).");
         showInfoModal("Missing Pieces!", "You don't seem to have all the required items anymore!");
         closeTreasureMapModal(); // Close modal as state is inconsistent
        return;
    }

    console.log(`Player ${playerIndex} (${player.name}) is opening the treasure!`);

    // 1. Award Points
    modifyPlayerScore(playerIndex, config.TREASURE_REWARD);

    // 2. Remove ONE of each card
    let removedShovel = state.removeCardFromPlayerInventory(playerIndex, config.treasureCards.shovel);
    let removedMap = state.removeCardFromPlayerInventory(playerIndex, config.treasureCards.map);
    let removedCompass = state.removeCardFromPlayerInventory(playerIndex, config.treasureCards.compass);

     // Log removal status (optional)
     console.log(`Card removal status - Shovel: ${removedShovel}, Map: ${removedMap}, Compass: ${removedCompass}`);

    // 3. Update player card inventory visual (if needed/visible)
    if (removedShovel || removedMap || removedCompass) { // Update if any were removed
        updatePlayerInventoryDisplay(playerIndex);
    }

    // 4. Close this modal and show confirmation
    closeTreasureMapModal();
    showInfoModal("TREASURE FOUND!", `${player.name} combined the map pieces and unearthed a legendary hoard! +${config.TREASURE_REWARD} points!`);
}


export function closeTreasureMapModal() {
    if (DOM.treasureMapModal) {
        DOM.treasureMapModal.style.display = 'none';
    }
    currentTreasurePlayerIndex = -1;
    if(DOM.openTreasureBtn) DOM.openTreasureBtn.disabled = true;
    if(DOM.treasureMapStatus) DOM.treasureMapStatus.textContent = '';
    // Reset images to empty src and remove empty class
    if(DOM.treasureSlotShovelImg) {
        DOM.treasureSlotShovelImg.src = "";
        DOM.treasureSlotShovelImg.classList.remove('slot-empty');
    }
    if(DOM.treasureSlotMapImg) {
        DOM.treasureSlotMapImg.src = "";
        DOM.treasureSlotMapImg.classList.remove('slot-empty');
    }
    if(DOM.treasureSlotCompassImg) {
        DOM.treasureSlotCompassImg.src = "";
        DOM.treasureSlotCompassImg.classList.remove('slot-empty');
    }
}

// Setup listeners for the treasure map modal
export function setupTreasureMapModalListeners() {
    if (!DOM.treasureMapModal) return;

    if (DOM.treasureMapCloseBtn) {
        DOM.treasureMapCloseBtn.addEventListener('click', closeTreasureMapModal);
    } else console.warn("Listener not added: Treasure Map Close Btn missing.");

    if (DOM.openTreasureBtn) {
        DOM.openTreasureBtn.addEventListener('click', handleOpenTreasureClick);
    } else console.warn("Listener not added: Open Treasure Btn missing.");

    // Background click
    DOM.treasureMapModal.addEventListener('click', (event) => {
        if (event.target === DOM.treasureMapModal) closeTreasureMapModal();
    });
     // Prevent content click from closing
    if(DOM.treasureMapModalContent) {
         DOM.treasureMapModalContent.addEventListener('click', (e) => e.stopPropagation());
    }
}