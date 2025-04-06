// js/modals/playerSelectModal.js
import * as DOM from '../domElements.js';
import * as state from '../state.js';
import { showError } from '../utils.js';

// --- Module-level variable to store the callback ---
let onPlayerSelectedCallback = null;

// --- Function to show the modal ---
// Takes the function to call upon selection as an argument
export function prepareAndShowPlayerSelectModal(callback) {
    if (!DOM.playerSelectList || !DOM.playerSelectError || !DOM.playerSelectModal) {
        console.error("Cannot prepare player select modal: Elements missing.");
        return;
    }
    console.log("[PlayerSelectModal] Preparing modal. Callback received:", typeof callback); // Log type of callback

    // *** STORE THE CALLBACK ***
    onPlayerSelectedCallback = callback; // Assign the passed function here

    DOM.playerSelectList.innerHTML = '';
    DOM.playerSelectError.style.display = 'none';

    let potentialVictims = 0;
    state.players.forEach((player, index) => {
        if (index !== state.currentPlayerIndex) {
            const playerButton = document.createElement('button');
            playerButton.textContent = player.name;
            playerButton.dataset.targetIndex = index;
            DOM.playerSelectList.appendChild(playerButton);
            potentialVictims++;
        }
    });

    if (potentialVictims > 0) {
        DOM.playerSelectModal.style.display = 'flex';
    } else {
        console.error("[PlayerSelectModal] Error: No potential victims found.");
        closePlayerSelectModal(); // Close if no options
    }
}

// --- Handler for clicking a player button ---
function handleGobletTargetSelect(event) {
    // Ensure click is on a BUTTON directly within the list
    if (event.target.tagName !== 'BUTTON' || !event.target.closest('#player-select-list')) {
        return;
    }

    const targetIndex = parseInt(event.target.dataset.targetIndex);
    console.log("[PlayerSelectModal] Button clicked for targetIndex:", targetIndex); // Log click

    if (!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < state.players.length) {
        if (targetIndex === state.currentPlayerIndex) {
            showError("Cannot choose yourself!", DOM.playerSelectError);
            return;
        }

        // *** EXECUTE THE STORED CALLBACK ***
        console.log("[PlayerSelectModal] Checking stored callback:", typeof onPlayerSelectedCallback); // Log type before calling
        if (typeof onPlayerSelectedCallback === 'function') {
            try {
                // Call the function that was passed in (should be handleVictimSelection)
                onPlayerSelectedCallback(targetIndex);
                 console.log("[PlayerSelectModal] Callback executed successfully."); // Log success
            } catch (error) {
                console.error("[PlayerSelectModal] Error executing player select callback:", error);
            }
        } else {
            // This is the warning you were seeing!
            console.warn("[PlayerSelectModal] No callback function defined or stored for player selection.");
        }

        // Clear callback *after* potential execution (or maybe clear it in close modal?)
        // onPlayerSelectedCallback = null; // Let close modal handle clearing

        // Close the modal AFTER handling the click and callback
        closePlayerSelectModal();

    } else {
        console.error("[PlayerSelectModal] Invalid target index:", event.target.dataset.targetIndex);
        showError("Invalid player selected.", DOM.playerSelectError);
    }
}

// --- Function to close the modal ---
export function closePlayerSelectModal() {
    if (DOM.playerSelectModal) DOM.playerSelectModal.style.display = 'none';
    if (DOM.playerSelectList) DOM.playerSelectList.innerHTML = ''; // Clear list
    if (DOM.playerSelectError) DOM.playerSelectError.style.display = 'none';

    // *** Clear the callback when the modal is closed ***
    console.log("[PlayerSelectModal] Closing modal, clearing callback."); // Log clear
    onPlayerSelectedCallback = null;
}

// --- Setup Listeners (called once from main.js) ---
export function setupPlayerSelectModalListeners() {
     if (DOM.playerSelectCloseBtn) {
        DOM.playerSelectCloseBtn.addEventListener('click', closePlayerSelectModal);
     } else console.warn("Listener not added: Player Select Close Btn not found");

     if (DOM.playerSelectModal) {
         // Close on background click
         DOM.playerSelectModal.addEventListener('click', (event) => {
             if (event.target === DOM.playerSelectModal) closePlayerSelectModal();
         });
         // Prevent content click from closing
         if(DOM.playerSelectModalContent) DOM.playerSelectModalContent.addEventListener('click', (e) => e.stopPropagation());

         // Attach the selection handler to the LIST container using event delegation
         if(DOM.playerSelectList) {
            DOM.playerSelectList.addEventListener('click', handleGobletTargetSelect);
         } else console.warn("Listener not added: Player Select List not found");

     } else console.warn("Listeners not added: Player Select Modal not found");
}