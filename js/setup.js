// js/setup.js
import * as DOM from './domElements.js';
import * as state from './state.js';
import { showError } from './utils.js';

// Callback to signal setup completion to main.js
let onSetupCompleteCallback = null;

export function startSetup(onComplete) {
    onSetupCompleteCallback = onComplete; // Store the callback
    showSetupStep('count'); // Show the first step
    if (DOM.playerCountInput) DOM.playerCountInput.focus();

    // Setup listeners specific to the setup phase
    setupSetupListeners();
}

function showSetupStep(stepToShow) {
    if (!DOM.playerCountStep || !DOM.playerNamesStep || !DOM.setupError) {
        console.error("Cannot show setup step: Required elements missing.");
        return;
    }
    // Hide all steps first
    DOM.playerCountStep.style.display = 'none';
    DOM.playerNamesStep.style.display = 'none';
    // Clear and hide error message
    DOM.setupError.textContent = '';
    DOM.setupError.style.display = 'none';

    // Show the requested step
    if (stepToShow === 'count') {
        DOM.playerCountStep.style.display = 'block';
    } else if (stepToShow === 'names') {
        DOM.playerNamesStep.style.display = 'block';
    }
}

function generateNameInputs(numPlayers) {
    if (!DOM.playerNameInputsContainer) {
        console.error("Cannot generate name inputs: Container not found.");
        return;
    }
    DOM.playerNameInputsContainer.innerHTML = ''; // Clear previous inputs
    for (let i = 0; i < numPlayers; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Player ${i + 1} Name`;
        input.id = `player-name-${i}`;
        input.required = true; // Basic HTML validation
        DOM.playerNameInputsContainer.appendChild(input);
    }
    showSetupStep('names'); // Show the name input step
    // Focus the first name input field
    const firstInput = DOM.playerNameInputsContainer.querySelector('input');
    if (firstInput) firstInput.focus();
}

function handlePlayerCountSubmit() {
    if (!DOM.playerCountInput) {
        console.error("Cannot submit count: Input missing.");
        return;
    }
    const count = parseInt(DOM.playerCountInput.value);
    if (isNaN(count) || count < 1 || count > 6) { // Add reasonable upper limit
        showError("Please enter a number between 1 and 6.", DOM.setupError);
        DOM.playerCountInput.focus();
        return;
    }
    generateNameInputs(count);
}

function handleStartGameAttempt() {
    if (!DOM.playerNameInputsContainer || !DOM.body) {
        console.error("Cannot start game: Core elements missing.");
        return;
    }
    const tempPlayers = [];
    const nameInputs = DOM.playerNameInputsContainer.querySelectorAll('input[type="text"]');
    let allNamesValid = true;

    nameInputs.forEach((input, index) => {
        const name = input.value.trim();
        if (name === "") {
            allNamesValid = false;
            input.style.borderColor = '#ff6b6b'; // Highlight empty field
        } else {
            input.style.borderColor = ''; // Reset border color if valid
            tempPlayers.push({
                name: name, // Use entered name
                score: 0,
                id: `player-${index}`, // Simple ID based on index
                // inventory: [] // No need to explicitly add flags here
                                  // state.setPlayers will add them
            });
        }
    });

    if (!allNamesValid) {
        showError("Please enter a name for each player.", DOM.setupError);
        return;
    }

    if (tempPlayers.length > 0) {
        // Use the state setter which ensures the inventory exists
        state.setPlayers(tempPlayers);
        state.setCurrentPlayerIndex(0); // Start with the first player

        // Hide setup modal and show game environment
        DOM.body.classList.remove('setup-active');
        DOM.body.classList.add('game-active');

        // Signal completion to main.js
        if (typeof onSetupCompleteCallback === 'function') {
            onSetupCompleteCallback();
        } else {
            console.error("Setup complete, but no callback provided to main.js!");
        }

    } else {
        // This case should ideally be prevented by count validation, but good fallback
        showError("No players were created. Please go back.", DOM.setupError);
        showSetupStep('count');
    }
}

// Listeners specific to the setup process
function setupSetupListeners() {
    // console.log("Checking submitPlayerCountBtn element:", DOM.submitPlayerCountBtn); // Keep console logs for debugging if needed
    if (DOM.submitPlayerCountBtn) {
         DOM.submitPlayerCountBtn.addEventListener('click', () => { // Using arrow function
             // console.log("Submit Player Count Button Clicked!");
             handlePlayerCountSubmit();
         });
    } else console.warn("Listener not added: Submit Player Count Btn missing.");
    if (DOM.startGameBtn) {
         DOM.startGameBtn.addEventListener('click', handleStartGameAttempt);
    } else console.warn("Listener not added: Start Game Btn missing.");

    // Allow Enter key press in count input
    if (DOM.playerCountInput) {
        DOM.playerCountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission if inside a form
                handlePlayerCountSubmit();
            }
        });
    } else console.warn("Listener not added: Player Count Input missing.");

    // Allow Enter key press in name inputs to move to next or start game
    if (DOM.playerNameInputsContainer) {
        DOM.playerNameInputsContainer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                e.preventDefault();
                const inputs = Array.from(DOM.playerNameInputsContainer.querySelectorAll('input'));
                const currentIndex = inputs.indexOf(e.target);

                if (currentIndex === inputs.length - 1) {
                    // If Enter pressed on the last input, attempt to start game
                    handleStartGameAttempt();
                } else if (currentIndex !== -1 && currentIndex + 1 < inputs.length) {
                    // Move focus to the next input field
                    inputs[currentIndex + 1].focus();
                }
            }
        });
    } else console.warn("Listener not added: Player Name Inputs Container missing.");
}