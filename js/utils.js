// js/utils.js
import * as DOM from './domElements.js';

export function showError(message, target = DOM.setupError) {
    if (!target) {
        console.error("Cannot show error: Target element missing.", message);
        return;
    }
    target.textContent = message;
    target.style.display = 'block';
}

// Can add other generic functions here later, like shuffleArray, etc.