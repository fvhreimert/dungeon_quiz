// js/domElements.js

// Helper function for getting elements, includes error logging
// --- ADD 'export' KEYWORD HERE ---
export function getElement(selector, required = true) {
    // --- END CHANGE ---
        const element = document.querySelector(selector);
        if (!element && required) {
            console.error(`DOM Error: Element "${selector}" not found!`);
        } else if (!element && !required) {
            // console.warn(`DOM Warning: Optional element "${selector}" not found.`); // Optional: Keep or remove warning
        }
        return element;
    }
    
    // Body
    export const body = getElement('body'); // Now uses the exported function
    
    // Setup Modal Elements
    export const setupModal = getElement('#setup-modal');
    export const playerCountInput = getElement('#player-count');
    // ... rest of the exports remain the same, they implicitly use getElement ...
    export const submitPlayerCountBtn = getElement('#submit-player-count');
    export const playerCountStep = getElement('#player-count-step');
    export const playerNamesStep = getElement('#player-names-step');
    export const playerNameInputsContainer = getElement('#player-name-inputs');
    export const setupError = getElement('#setup-error');
    export const startGameBtn = getElement('#start-game-btn');
    
    // Main Game Area Elements
    export const gameEnvironment = getElement('.game-environment');
    export const mainGameArea = getElement('.main-game-area');
    export const questionsGrid = getElement('.questions-grid');
    export const categoriesContainer = getElement('.categories');
    export const playerInfoArea = getElement('#player-info-area');
    export const playerCardsContainer = getElement('#player-cards-container');
    
    // Question Modal Elements
    export const questionModal = getElement('#question-modal');
    export const modalQuestion = getElement('#question-text');
    export const modalAnswer = getElement('#answer-text');
    export const modalPointsDisplay = getElement('#question-points-display');
    export const revealBtn = getElement('#reveal-answer-btn');
    export const closeBtn = questionModal ? getElement('.close-button', true) : null;
    export const nextTurnBtn = getElement('#next-turn-btn');
    export const questionModalContent = questionModal ? getElement('.modal-content', true) : null;
    
    // Side Icon Elements
    export const cardJesterImg = getElement('#card-jester-img');
    export const frogOfFateImg = getElement('#frog-of-fate-img');
    export const drunkenSeerImg = getElement('#drunken-seer-img');
    export const sacrificialGobletImg = getElement('#sacrificial-goblet-img');
    
    // Card Modal Elements
    export const cardModal = getElement('#card-modal');
    export const cardImage = getElement('#card-image');
    export const cardCloseBtn = cardModal ? getElement('.card-close-button', true) : null;
    export const cardModalContent = cardModal ? getElement('.modal-content', true) : null;
    
    
    // Player Select Modal Elements
    export const playerSelectModal = getElement('#player-select-modal');
    export const playerSelectList = getElement('#player-select-list');
    export const playerSelectCloseBtn = playerSelectModal ? getElement('.player-select-close', true) : null;
    export const playerSelectError = getElement('#player-select-error');
    export const playerSelectModalContent = playerSelectModal ? getElement('.modal-content', true) : null;
    
    
    // Info Modal Elements
    export const infoModal = getElement('#info-modal');
    export const infoModalTitle = getElement('#info-modal-title');
    export const infoModalText = getElement('#info-modal-text');
    export const infoModalOkBtn = getElement('#info-modal-ok-btn');
    export const infoModalCloseBtn = infoModal ? getElement('.info-modal-close', true) : null;
    export const infoModalContent = infoModal ? getElement('.modal-content', true) : null;
    
    
    // Seer Peek Modal Elements
    export const seerPeekModal = getElement('#seer-peek-modal');
    export const seerPeekWords = getElement('#seer-peek-words');
    export const seerAcceptBtn = getElement('#seer-accept-btn');
    export const seerRejectBtn = getElement('#seer-reject-btn');
    export const seerPeekModalContent = seerPeekModal ? getElement('.modal-content', true) : null;
    
    // Sacrificial Goblet Input Modal Elements
    export const gobletInputModal = getElement('#goblet-input-modal');
    export const gobletInputCloseBtn = gobletInputModal ? getElement('.goblet-input-close', true) : null;
    export const gobletAmountSlider = getElement('#goblet-amount-slider');
    export const gobletAmountDisplay = getElement('#goblet-amount-display');
    export const gobletAcceptBtn = getElement('#goblet-accept-btn');
    export const gobletInputContent = gobletInputModal ? getElement('.modal-content', true) : null;
    
    // --- Inventory Modal Elements (Ensure these use the exported getElement) ---
    export const inventoryModal = getElement('#inventory-modal', false); // Allow optional
    export const inventoryModalTitle = getElement('#inventory-modal-title', false);
    export const inventoryCardsContainer = getElement('#inventory-modal-cards', false);
    export const inventoryCloseBtn = inventoryModal ? getElement('.inventory-close-button', false) : null;
    export const inventoryModalContent = inventoryModal ? getElement('.inventory-content', false) : null;

    // --- Roulette Modal Elements ---
    export const rouletteModal = getElement('#roulette-modal', false);
    export const rouletteCloseBtn = rouletteModal ? getElement('.roulette-close-button', false) : null;
    export const rouletteAmountSlider = getElement('#roulette-amount-slider', false);
    export const rouletteAmountDisplay = getElement('#roulette-amount-display', false);
    export const rouletteGambleBtn = getElement('#roulette-gamble-btn', false);
    export const rouletteError = getElement('#roulette-error', false);
    export const rouletteModalContent = rouletteModal ? getElement('.roulette-content', false) : null;

        // --- Treasure Map Modal Elements ---
    export const treasureMapModal = getElement('#treasure-map-modal', false);
    export const treasureMapCloseBtn = treasureMapModal ? getElement('.treasure-map-close-button', false) : null;
    export const treasureSlotShovelImg = treasureMapModal ? getElement('#treasure-slot-shovel img', false) : null;
    export const treasureSlotMapImg = treasureMapModal ? getElement('#treasure-slot-map img', false) : null;
    export const treasureSlotCompassImg = treasureMapModal ? getElement('#treasure-slot-compass img', false) : null;
    export const openTreasureBtn = getElement('#open-treasure-btn', false);
    export const treasureMapStatus = getElement('#treasure-map-status', false);
    export const treasureMapModalContent = treasureMapModal ? getElement('.treasure-map-content', false) : null;

