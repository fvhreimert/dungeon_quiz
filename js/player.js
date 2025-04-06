// js/player.js
import * as DOM from './domElements.js';
import * as state from './state.js';
import * as config from './config.js';
import { cancelSeerPeekMode } from './features/seer.js';
// Import for the inventory modal
import { showInventoryModal } from './modals/inventoryModal.js';

// --- Player Display and Score ---

export function createPlayerDisplays() {
    if (!DOM.playerCardsContainer) {
        console.error("Cannot create player displays: Container missing.");
        return;
    }
    DOM.playerCardsContainer.innerHTML = ''; // Clear existing cards

    state.players.forEach((player, index) => {
        const card = document.createElement('div');
        card.classList.add('player-card');
        card.id = `player-card-${index}`;
        card.dataset.playerIndex = index;

        // --- Player Info Top Section (Name + Inventory Icon) ---
        const playerInfoTop = document.createElement('div');
        playerInfoTop.classList.add('player-info-top'); // New class for layout

        const nameEl = document.createElement('div');
        nameEl.classList.add('player-name');
        nameEl.textContent = player.name;

        const inventoryIcon = document.createElement('img');
        inventoryIcon.src = 'images/inventory.png'; // Path to your icon
        inventoryIcon.alt = 'Inventory';
        inventoryIcon.title = `${player.name}'s Inventory`;
        inventoryIcon.classList.add('inventory-button-icon'); // Class for styling & listener
        inventoryIcon.dataset.playerIndex = index; // Store index on icon too

        // Add click listener to the icon
        inventoryIcon.addEventListener('click', handleInventoryIconClick);

        playerInfoTop.appendChild(nameEl);
        playerInfoTop.appendChild(inventoryIcon); // Add icon next to name container
        // --- End Player Info Top ---

        const scoreEl = document.createElement('div');
        scoreEl.classList.add('player-score');
        scoreEl.id = `player-score-${index}`;

        const buttonsEl = document.createElement('div');
        buttonsEl.classList.add('score-buttons');
        // (Score buttons creation remains the same)
        const addBtn = document.createElement('button');
        // --- FIX: Use state.scoreIncrement consistently ---
        addBtn.textContent = `+${state.scoreIncrement}`; // Use state value
        addBtn.title = `Add points for ${player.name}`;
        addBtn.dataset.action = 'add';
        addBtn.addEventListener('click', (e) => handleManualScoreUpdate(e, index, state.scoreIncrement)); // Pass state value
        const subtractBtn = document.createElement('button');
        subtractBtn.classList.add('subtract-score');
         // --- FIX: Use state.scoreIncrement consistently ---
        subtractBtn.textContent = `-${state.scoreIncrement}`; // Use state value
        subtractBtn.title = `Subtract points for ${player.name}`;
        subtractBtn.dataset.action = 'subtract';
        subtractBtn.addEventListener('click', (e) => handleManualScoreUpdate(e, index, -state.scoreIncrement)); // Pass negative state value
        // --- END FIX ---
        buttonsEl.appendChild(addBtn);
        buttonsEl.appendChild(subtractBtn);


        // Existing inventory display (collected card icons)
        const inventoryEl = document.createElement('div');
        inventoryEl.classList.add('player-inventory'); // The row of collected card icons
        inventoryEl.id = `player-inventory-${index}`;


        // Append elements to the card in order
        card.appendChild(playerInfoTop); // Add the container with name and icon button
        card.appendChild(scoreEl);
        card.appendChild(buttonsEl);
        card.appendChild(inventoryEl); // Append the collected items display

        // Click listener for the *whole card* (still needed for turn change)
        card.addEventListener('click', handlePlayerCardClick);

        DOM.playerCardsContainer.appendChild(card);

        updateScoreDisplay(index, player.score);
        updatePlayerInventoryDisplay(index); // Update the collected items display
    });
    updateTurnIndicator();
}

// --- Handler for Inventory Icon Click ---
function handleInventoryIconClick(event) {
    event.stopPropagation(); // IMPORTANT: Prevent card click handler (turn change)
    const playerIndex = parseInt(event.currentTarget.dataset.playerIndex);
    if (!isNaN(playerIndex)) {
        console.log(`Inventory icon clicked for player ${playerIndex}`);
        showInventoryModal(playerIndex); // Show the modal for this player
    } else {
        console.error("Could not get player index from inventory icon.");
    }
}

// --- Displays small icons on the player card ---
export function updatePlayerInventoryDisplay(playerIndex) {
    const inventoryContainer = document.getElementById(`player-inventory-${playerIndex}`);
    const player = state.players[playerIndex];

    if (!inventoryContainer) {
        // console.warn(`Inventory container not found for player ${playerIndex}. Cannot update display.`);
        return;
    }
     if (!player || !Array.isArray(player.inventory)) {
        // console.warn(`Player data or inventory array invalid for player ${playerIndex}. Clearing display.`);
        inventoryContainer.innerHTML = ''; // Clear display if data is bad
        return;
    }

    inventoryContainer.innerHTML = ''; // Clear previous icons before re-rendering

    player.inventory.forEach(cardFilename => {
        const img = document.createElement('img');
        img.src = config.cardsFolderPath + cardFilename;
        const cardName = cardFilename.replace('.png', '').replace(/_/g, ' ');
        img.alt = cardName;
        img.title = cardName;
        img.classList.add('inventory-card-icon');
        inventoryContainer.appendChild(img);
    });
}

// --- Updates the score text and style ---
export function updateScoreDisplay(playerIndex, newScore) {
    const scoreElement = document.getElementById(`player-score-${playerIndex}`);
    if (scoreElement) {
        // 1. ALWAYS set the text content first.
        scoreElement.textContent = newScore;

        // 2. Clear previous state classes AND animation class
        scoreElement.classList.remove('score-positive', 'score-negative', 'score-change');

        // 3. Apply positive/negative class.
        if (newScore >= 0) { // Zero is considered positive for styling
            scoreElement.classList.add('score-positive');
        } else {
            scoreElement.classList.add('score-negative');
        }

        // 4. Trigger score change animation.
        // Check if the element is actually visible before triggering animation
        // This can prevent unnecessary reflows if scores update while hidden
        if (scoreElement.offsetParent !== null) {
             void scoreElement.offsetWidth; // Force reflow only if visible
             scoreElement.classList.add('score-change');

            // Remove animation class after it finishes
            setTimeout(() => {
                const currentScoreElement = document.getElementById(`player-score-${playerIndex}`);
                // Check if element still exists before removing class
                if (currentScoreElement) currentScoreElement.classList.remove('score-change');
            }, 500); // Match animation duration in CSS
        }
    } else {
         // console.warn(`Score element not found for player index ${playerIndex} during update.`);
    }
}

// --- Modifies score in state and updates display ---
export function modifyPlayerScore(playerIndex, amount) {
     // Add a check for NaN amount
    if (isNaN(amount)) {
        console.error(`Invalid amount for score modification: ${amount} (Player Index: ${playerIndex})`);
        return; // Prevent score corruption
    }
    if (playerIndex >= 0 && playerIndex < state.players.length) {
        const currentScore = state.players[playerIndex].score;
        const newScore = currentScore + amount;
        state.players[playerIndex].score = newScore; // Update score in state array
        updateScoreDisplay(playerIndex, newScore); // Update the DOM
    } else {
        console.error(`Invalid player index for score modification: ${playerIndex}`);
    }
}

// --- Handles clicks on manual +/- score buttons ---
function handleManualScoreUpdate(event, playerIndex, rawAmount) {
    event.stopPropagation(); // Prevent card click handler

    // Use the points from the *currently open question* if available, otherwise default
    const pointsToApply = state.currentQuestionBasePoints || state.scoreIncrement;
    // Apply the multiplier from the currently open question
    const actualAmount = (rawAmount > 0 ? 1 : -1) * pointsToApply * state.currentQuestionMultiplier;

    console.log(`Manual score update: Player=${playerIndex}, Base=${pointsToApply}, Multiplier=${state.currentQuestionMultiplier}, RawButton=${rawAmount}, ActualChange=${actualAmount}`);

    if (actualAmount !== 0) {
        modifyPlayerScore(playerIndex, actualAmount);
    } else {
        console.warn("Manual score update resulted in zero change (maybe base points were 0?).");
    }
}


// --- Turn Management ---

// --- MODIFIED: Function to apply turn-based effects ---
function applyTurnBasedEffects() {
    console.log("--- Applying Turn-Based Effects ---");
    state.players.forEach((player, index) => {
        let totalChange = 0; // Track net change for the player this turn
        let changeDescription = [];

        // --- Check Infinite Money Glitch Count ---
        if (player.infiniteMoneyGlitchCount > 0) {
            const glitchAmount = 10 * player.infiniteMoneyGlitchCount;
            totalChange += glitchAmount;
            changeDescription.push(`+${glitchAmount} (Glitch x${player.infiniteMoneyGlitchCount})`);
            console.log(`Calculated +${glitchAmount} for ${player.name} (Infinite Money Glitch x${player.infiniteMoneyGlitchCount})`);
        }

        // --- Check Tick Card Count ---
        if (player.tickCardCount > 0) {
            const tickAmount = -1 * player.tickCardCount;
            totalChange += tickAmount;
            changeDescription.push(`${tickAmount} (Tick x${player.tickCardCount})`);
            console.log(`Calculated ${tickAmount} for ${player.name} (Tick Card x${player.tickCardCount})`);
        }

        // --- Apply the total calculated change ---
        if (totalChange !== 0) {
            modifyPlayerScore(index, totalChange);
            console.log(`Score updated for ${player.name}: ${changeDescription.join(', ')}. Total: ${totalChange > 0 ? '+' : ''}${totalChange}`);
        }

        // Add more ongoing effects checks here (e.g., if player.regenCount > 0 ...)

    });
    console.log("--- Finished Applying Turn-Based Effects ---");
}

// --- Advances turn to the next player ---
export function nextTurn() {
    // --- APPLY TURN-BASED EFFECTS FIRST ---
    applyTurnBasedEffects();
    // --- END APPLY EFFECTS ---

    if (state.players.length > 0) {
        const newIndex = (state.currentPlayerIndex + 1) % state.players.length;
        state.setCurrentPlayerIndex(newIndex); // Update state
        console.log(`--- Turn advanced to Player ${newIndex} (${state.players[newIndex]?.name || 'Unknown'}) ---`);
        updateTurnIndicator(); // Update visuals

        // If the Seer was peeking, changing turns should cancel it
        if (state.isSeerPeeking) {
            cancelSeerPeekMode();
        }
    } else {
        console.warn("Next turn called with no players.");
    }
}

// --- Updates the visual indicator for the active player ---
export function updateTurnIndicator() {
    // Remove active class from all cards first
    document.querySelectorAll('.player-card').forEach(card => card.classList.remove('active-turn'));

    if (state.players.length > 0 && state.players[state.currentPlayerIndex]) {
        const currentCard = document.getElementById(`player-card-${state.currentPlayerIndex}`);
        if (currentCard) {
            currentCard.classList.add('active-turn');
             // Optional: Scroll the player info area to show the active player
            currentCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            // console.warn(`Active turn indicator: Player card ${state.currentPlayerIndex} not found.`);
        }
    }
}

// --- Handles clicking the player card (not buttons/icon) to change turn ---
function handlePlayerCardClick(event) {
    // Ignore clicks on the inventory icon or score buttons
    if (event.target.closest('.inventory-button-icon') || event.target.closest('.score-buttons')) {
        return;
    }
    // Ignore click if the card already represents the active turn
    if (event.currentTarget.classList.contains('active-turn')) {
        return;
    }

    const clickedCard = event.currentTarget;
    const playerIndex = parseInt(clickedCard.dataset.playerIndex);

    if (!isNaN(playerIndex) && playerIndex >= 0 && playerIndex < state.players.length) {
        // --- APPLY TURN-BASED EFFECTS before manually changing turn ---
        applyTurnBasedEffects();
        // --- END APPLY EFFECTS ---

        state.setCurrentPlayerIndex(playerIndex); // Update state
         console.log(`--- Turn manually changed to Player ${playerIndex} (${state.players[playerIndex]?.name || 'Unknown'}) ---`);
        updateTurnIndicator(); // Update visuals

        // If switching players manually, cancel Seer mode
        if (state.isSeerPeeking) {
            cancelSeerPeekMode();
        }
    } else {
        console.error("Could not determine player index from clicked card:", clickedCard);
    }
}