// js/modals/cardModal.js
import * as DOM from '../domElements.js';
import * as config from '../config.js';
import { showInfoModal } from './infoModal.js'; // Import necessary functions

export function showCard(cardFilename) {
     if (!DOM.cardModal || !DOM.cardImage) {
        console.error("Cannot show card: Modal/Image element missing.");
        return;
    }
    DOM.cardImage.src = config.cardsFolderPath + cardFilename;
    DOM.cardImage.alt = cardFilename.replace('.png', '').replace(/_/g, ' ');
    DOM.cardModal.style.display = 'flex';
}

export function closeCardModal() {
    if (DOM.cardModal) DOM.cardModal.style.display = 'none';
    if (DOM.cardImage) DOM.cardImage.src = ""; // Clear image src
}

export function setupCardModalListeners() {
     if (DOM.cardCloseBtn) DOM.cardCloseBtn.addEventListener('click', closeCardModal);
     else console.warn("Listener not added: Card Close Btn not found");

     if (DOM.cardModal) {
        DOM.cardModal.addEventListener('click', (event) => {
             if (event.target === DOM.cardModal) closeCardModal();
        });
         if(DOM.cardModalContent) DOM.cardModalContent.addEventListener('click', (e) => e.stopPropagation());
     } else console.warn("Listeners not added: Card Modal not found");
}