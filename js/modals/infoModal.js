// js/modals/infoModal.js
import * as DOM from '../domElements.js';
import * as state from '../state.js';

export function showInfoModal(title = "Notification", message, callback = null) {
    if (!DOM.infoModal || !DOM.infoModalTitle || !DOM.infoModalText || !DOM.infoModalOkBtn) {
        console.error("Cannot show info modal: Elements missing.", { title, message });
        return;
    }
    DOM.infoModalTitle.textContent = title;
    DOM.infoModalText.textContent = message;
    state.setInfoModalCallback(callback); // Use state setter
    DOM.infoModal.style.display = 'flex';
    DOM.infoModalOkBtn.focus();
}

export function closeInfoModal() {
    if (DOM.infoModal) DOM.infoModal.style.display = 'none';

    // Execute and clear the callback
    if (typeof state.infoModalCallback === 'function') {
        try {
            state.infoModalCallback();
        } catch (error) {
            console.error("Error executing info modal callback:", error);
        }
    }
    state.setInfoModalCallback(null); // Use state setter

    if (DOM.infoModalTitle) DOM.infoModalTitle.textContent = "";
    if (DOM.infoModalText) DOM.infoModalText.textContent = "";
}

// Add event listeners for the info modal within this module
export function setupInfoModalListeners() {
    if (DOM.infoModalOkBtn) DOM.infoModalOkBtn.addEventListener('click', closeInfoModal);
    else console.warn("Listener not added: Info Modal OK Btn not found");

    if (DOM.infoModalCloseBtn) DOM.infoModalCloseBtn.addEventListener('click', closeInfoModal);
    else console.warn("Listener not added: Info Modal Close Btn not found");

    if (DOM.infoModal) {
        DOM.infoModal.addEventListener('click', (event) => {
            if (event.target === DOM.infoModal) closeInfoModal();
        });
        // Prevent clicks inside the content from closing the modal
        if(DOM.infoModalContent) DOM.infoModalContent.addEventListener('click', (e) => e.stopPropagation());
    } else console.warn("Listeners not added: Info Modal not found");
}