// js/modals/inventoryModal.js
import * as DOM from '../domElements.js';
import * as state from '../state.js';
import * as config from '../config.js';
import { showInfoModal } from './infoModal.js';
import { prepareAndShowPlayerSelectModal, closePlayerSelectModal } from './playerSelectModal.js';
import { modifyPlayerScore, updatePlayerInventoryDisplay } from '../player.js';
import { showRouletteModal } from './rouletteModal.js';
import { showTreasureMapModal } from './treasureMapModal.js'; // <-- IMPORT TREASURE MODAL

let activatingPlayerIndex = -1;

// --- Get necessary DOM elements (Add these to domElements.js too) ---
const inventoryModal = DOM.getElement('#inventory-modal', false); // Modal itself
const inventoryModalTitle = DOM.getElement('#inventory-modal-title', false);
const inventoryCardsContainer = DOM.getElement('#inventory-modal-cards', false);
const inventoryCloseBtn = inventoryModal ? DOM.getElement('.inventory-close-button', false) : null;
const inventoryModalContent = inventoryModal ? DOM.getElement('.inventory-content', false) : null; // Get content area


// --- Show Inventory Modal ---
export function showInventoryModal(playerIndex) {
    if (!inventoryModal || !inventoryModalTitle || !inventoryCardsContainer) {
        console.error("Cannot show inventory modal: Required elements missing.");
        return;
    }

    const player = state.players[playerIndex];
    if (!player) {
        console.error(`Cannot show inventory: Player ${playerIndex} not found.`);
        return;
    }

    // Update Title
    inventoryModalTitle.textContent = `${player.name}'s Inventory`;

    // Clear previous cards
    inventoryCardsContainer.innerHTML = '';

    // --- Stacking Logic ---
    const cardCounts = {};
    if (player.inventory && player.inventory.length > 0) {
        player.inventory.forEach(cardFilename => {
            cardCounts[cardFilename] = (cardCounts[cardFilename] || 0) + 1;
        });

        // --- Display Cards with Counts ---
        for (const cardFilename in cardCounts) {
            const count = cardCounts[cardFilename];

            const cardWrapper = document.createElement('div');
            cardWrapper.classList.add('inventory-modal-card-item');
            cardWrapper.dataset.filename = cardFilename; // Store filename
            cardWrapper.dataset.playerIndex = playerIndex; // Store player index

            const img = document.createElement('img');
            img.src = config.cardsFolderPath + cardFilename;
            const cardName = cardFilename.replace('.png', '').replace(/_/g, ' ');
            img.alt = cardName;
            img.title = cardName; // Tooltip for card name
            img.classList.add('inventory-modal-card-image');

            cardWrapper.appendChild(img);
            
                    // --- Display Cards with Counts ---
            for (const cardFilename in cardCounts) {
                const count = cardCounts[cardFilename];

                // ... create elements ...

                // --- DEBUG LOGGING ---
                console.log(`[Inventory Check] Card: "${cardFilename}", Is Active: ${config.activeCards.has(cardFilename)}`);
                // --- END DEBUG LOGGING ---

                // Check if card is active and add listener/class
                if (config.activeCards.has(cardFilename)) {
                    cardWrapper.classList.add('active-card'); // Add class for styling
                    cardWrapper.title = `${cardName} (Click to Use)`; // More specific tooltip
                    if (count > 1) { cardWrapper.title = `${cardName} (x${count}) (Click to Use)`; } // Update tooltip with count if needed
                    cardWrapper.addEventListener('click', handleActivateCardClick);
                } else {
                    cardWrapper.title = `${cardName}${count > 1 ? ` (x${count})` : ''} (Passive)`; // Indicate passive cards
                }
                // ... append cardWrapper ...
            }

            // Add count indicator if count > 1
            if (count > 1) {
                const countSpan = document.createElement('span');
                countSpan.classList.add('inventory-card-count');
                countSpan.textContent = `x${count}`;
                cardWrapper.appendChild(countSpan);
                img.title = `${cardName} (x${count})`; // Update tooltip
            }

            // Check if card is active and add listener/class
            if (config.activeCards.has(cardFilename)) {
                cardWrapper.classList.add('active-card'); // Add class for styling
                cardWrapper.title = `${cardName} (Click to Use)`; // More specific tooltip
                 if (count > 1) { cardWrapper.title = `${cardName} (x${count}) (Click to Use)`; } // Update tooltip with count if needed
                cardWrapper.addEventListener('click', handleActivateCardClick);
            } else {
                 cardWrapper.title = `${cardName}${count > 1 ? ` (x${count})` : ''} (Passive)`; // Indicate passive cards
            }


            inventoryCardsContainer.appendChild(cardWrapper);
        }
    } else {
        inventoryCardsContainer.textContent = "Inventory is empty.";
        inventoryCardsContainer.style.textAlign = "center"; // Center empty message
    }

    // Show the modal
    inventoryModal.style.display = 'flex';
}

// --- NEW: Handle Clicking an Active Card in the Inventory ---
function handleActivateCardClick(event) {
    const cardWrapper = event.currentTarget;
    const cardFilename = cardWrapper.dataset.filename;
    const playerIndex = parseInt(cardWrapper.dataset.playerIndex);

    if (isNaN(playerIndex) || !cardFilename) {
        console.error("Could not activate card: Missing data.", { playerIndex, cardFilename });
        return;
    }

    console.log(`Attempting to activate card '${cardFilename}' for player ${playerIndex}`);

    // --- Check if it's a treasure card FIRST ---
    if (cardFilename === config.treasureCards.shovel ||
        cardFilename === config.treasureCards.map ||
        cardFilename === config.treasureCards.compass)
    {
        closeInventoryModal(); // Close inventory
        showTreasureMapModal(playerIndex); // Show the treasure map modal
        return; // Stop processing here for treasure cards
    }
    // --- END Treasure Card Check ---

    // Close the inventory modal *before* showing other modals/actions (if not a treasure card)
    closeInventoryModal();

    // Use a switch for other active cards
    switch (cardFilename) {
        case 'loot_goblin.png':
            activateLootGoblin(playerIndex);
            break;
        case 'roulette.png':
            activateRoulette(playerIndex);
            break;
        case 'piggy_bank.png':
            activatePiggyBank(playerIndex);
            break;
        case 'spiny_shell.png': // <-- ADD SPINY SHELL CASE
            activateSpinyShell(playerIndex);
            break;
        // Add other non-treasure active cards here
        default:
            console.warn(`No activation logic defined for non-treasure active card: ${cardFilename}`);
            break;
    }
}

function activatePiggyBank(playerIndex) {
    const piggyAmount = 150;
    const player = state.players[playerIndex];
    if (!player) {
        console.error("Piggy Bank Error: Player not found", playerIndex);
        return;
    }

    console.log(`Activating Piggy Bank for player ${playerIndex} (${player.name})`);

    // 1. Award points
    modifyPlayerScore(playerIndex, piggyAmount);

    // 2. Consume card
    const cardRemoved = state.removeCardFromPlayerInventory(playerIndex, 'piggy_bank.png');
    if (cardRemoved) {
        updatePlayerInventoryDisplay(playerIndex); // Update player card visual
    }

    // 3. Show confirmation (optional, but good UX)
    showInfoModal("Oink!", `${player.name} broke the Piggy Bank and found ${piggyAmount} points!`);
}

// --- NEW: Loot Goblin Logic ---
function activateLootGoblin(pIndex) {
    activatingPlayerIndex = pIndex; // Store the user's index

    if (state.players.length < 2) {
        showInfoModal("Lonely Goblin", "The Loot Goblin needs someone else to steal from!");
        activatingPlayerIndex = -1; // Reset stored index
        return;
    }

    // Prepare and show player select modal, passing the victim selection handler
    // Optional: Modify prepareAndShowPlayerSelectModal to accept a title
    // prepareAndShowPlayerSelectModal(handleLootGoblinVictimSelection, "Choose a Loot Target!");
    prepareAndShowPlayerSelectModal(handleLootGoblinVictimSelection);
}

function handleLootGoblinVictimSelection(victimIndex) {
    const userIndex = activatingPlayerIndex; // Retrieve the user's index
    activatingPlayerIndex = -1; // Reset stored index

    if (userIndex < 0 || userIndex >= state.players.length) {
        console.error("Loot Goblin Error: Invalid activating player index", userIndex);
        return;
    }
    if (victimIndex < 0 || victimIndex >= state.players.length) {
        console.error("Loot Goblin Error: Invalid victim index", victimIndex);
        return;
    }
    // Should already be checked by playerSelectModal, but double-check
    if (userIndex === victimIndex) {
        console.error("Loot Goblin Error: Cannot target self.");
        return;
    }

    const victimPlayer = state.players[victimIndex];
    const userPlayer = state.players[userIndex];
    const stealAmount = 200;

    console.log(`Loot Goblin: Player ${userIndex} (${userPlayer.name}) attempts to steal ${stealAmount} from Player ${victimIndex} (${victimPlayer.name})`);

    // Apply score changes
    modifyPlayerScore(victimIndex, -stealAmount);
    modifyPlayerScore(userIndex, stealAmount);

    // Consume the card
    const cardRemoved = state.removeCardFromPlayerInventory(userIndex, 'loot_goblin.png');

    // Update the user's visual inventory on their player card (if it were visible)
    if (cardRemoved) {
        updatePlayerInventoryDisplay(userIndex);
    }

    // Show confirmation
    showInfoModal("Yoink!", `${userPlayer.name} uses the Loot Goblin to steal ${stealAmount} points from ${victimPlayer.name}!`);
}

function activateSpinyShell(userIndex) {
    const players = state.players;
    if (!players || players.length < 1) { // Need at least one player (the user)
        console.error("Spiny Shell Error: No players found.");
        return; // Should not happen in normal gameplay
    }

    const userPlayer = players[userIndex];
    if (!userPlayer) {
        console.error("Spiny Shell Error: User player not found", userIndex);
        return;
    }

    let leaderIndex = -1;
    let maxScore = -Infinity;

    // Find player with the highest score (can be the user)
    players.forEach((player, index) => {
        if (player.score > maxScore) {
            maxScore = player.score;
            leaderIndex = index;
        }
    });

    // Check edge cases
    if (leaderIndex === -1) {
        console.warn("Spiny Shell: No leader found (maybe all scores are -Infinity?).");
        showInfoModal("Hmm?", "The Spiny Shell spins aimlessly... no clear leader found.");
        return;
    }
    // --- REMOVED SELF-TARGET CHECK ---
    // if (leaderIndex === userIndex) {
    //     showInfoModal("Can't Target Self!", "You can't hit yourself with the Spiny Shell!");
    //     return;
    // }

     if (maxScore <= 0) {
         // Show slightly different message if hitting self vs another
         const targetName = (leaderIndex === userIndex) ? "You have" : `${players[leaderIndex].name} has`;
         showInfoModal("No Effect!", `${targetName} no points to lose! The shell fizzles.`);
         return;
     }

    const leaderPlayer = players[leaderIndex];
    const leaderScore = leaderPlayer.score;

    // Calculate points to take (20% rounded down)
    const pointsToTake = Math.floor(leaderScore * 0.20);

    if (pointsToTake <= 0) {
         const targetName = (leaderIndex === userIndex) ? "You don't" : `${leaderPlayer.name} doesn't`;
         console.warn(`Spiny Shell: Calculated points to take is ${pointsToTake}. No effect.`);
         showInfoModal("No Effect!", `${targetName} have enough points for the shell to make an impact.`);
         return;
     }

    // Determine the target name for the message
    const targetDisplayName = (leaderIndex === userIndex) ? "themselves" : leaderPlayer.name;
    console.log(`Spiny Shell: Player ${userIndex} (${userPlayer.name}) targets leader ${leaderIndex} (${targetDisplayName}) with score ${leaderScore}. Leader loses ${pointsToTake} points.`);

    // 1. Apply score changes - ONLY to the leader
    modifyPlayerScore(leaderIndex, -pointsToTake); // Leader loses points
    // --- REMOVED USER GAINING POINTS ---
    // modifyPlayerScore(userIndex, pointsToTake);   // User gains points

    // 2. Consume card
    const cardRemoved = state.removeCardFromPlayerInventory(userIndex, 'spiny_shell.png');
    if (cardRemoved) {
        updatePlayerInventoryDisplay(userIndex); // Update player card visual
    }

    // 3. Show confirmation - adjusted message
     const gainMessagePart = (leaderIndex === userIndex) ? "" : ` ${userPlayer.name} watches gleefully!`; // No gain message if hitting self
    showInfoModal("Shell Shock!", `${userPlayer.name} hit ${targetDisplayName} with a Spiny Shell! They lose ${pointsToTake} points!${gainMessagePart}`);
}

// --- NEW: Roulette Logic Trigger ---
function activateRoulette(playerIndex) {
    console.log(`Triggering Roulette for player ${playerIndex}`);
    // Show the dedicated Roulette modal - THIS LINE WILL NOW WORK
    showRouletteModal(playerIndex);
    // The rest of the logic is handled within rouletteModal.js
}

// --- Close Inventory Modal ---
export function closeInventoryModal() {
    if (inventoryModal) {
        inventoryModal.style.display = 'none';
        // Optional: Clear content when closed to save memory, but might cause flicker if reopened quickly
        // if (inventoryCardsContainer) inventoryCardsContainer.innerHTML = '';
        // if (inventoryModalTitle) inventoryModalTitle.textContent = 'Player Inventory';
    }
}

// --- Setup Listeners ---
export function setupInventoryModalListeners() {
    if (!inventoryModal) {
        // console.warn("Inventory Modal not found, cannot add listeners.");
        return;
    }

    if (inventoryCloseBtn) {
        inventoryCloseBtn.addEventListener('click', closeInventoryModal);
    } else console.warn("Listener not added: Inventory Modal Close Btn missing.");

    // Close on background click
    inventoryModal.addEventListener('click', (event) => {
        if (event.target === inventoryModal) {
            closeInventoryModal();
        }
    });

    // Prevent clicks inside content from closing modal
     if (inventoryModalContent) {
        inventoryModalContent.addEventListener('click', (e) => e.stopPropagation());
    } else console.warn("Listener not added: Inventory Modal Content missing (for stopPropagation).");
}