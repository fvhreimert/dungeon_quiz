// --- Paste this code to replace your entire script.js file ---

document.addEventListener('DOMContentLoaded', () => {

    // --- Game Data (Ensure 5 categories, 4 questions each) ---
    const gameData = [
        { name: "POTENT POTABLES", questions: [
                { q: "What common tavern drink is made from fermented barley?", a: "What is Ale (or Beer)?" },
                { q: "This magical blue liquid restores a small amount of mana.", a: "What is a Mana Potion?" },
                { q: "Said to grant courage, this potion might just be strong liquor.", a: "What is Liquid Courage?" },
                { q: "Q4 Potable?", a: "A4 Potable"} ]},
        { name: "MONSTERS", questions: [
                { q: "These small, green-skinned creatures often attack in groups.", a: "What are Goblins?" },
                { q: "A large, winged reptile known for breathing fire.", a: "What is a Dragon?" },
                { q: "This undead creature is often found guarding tombs and drains life.", a: "What is a Wight (or Wraith/Spectre)?" },
                { q: "Q4 Monster?", a: "A4 Monster"} ]},
        { name: "MAGIC ITEMS", questions: [
                { q: "A container that can hold more on the inside than it appears.", a: "What is a Bag of Holding?" },
                { q: "This footwear grants the wearer the ability to move silently.", a: "What are Boots of Elvenkind (or Silence)?" },
                { q: "Often found as a ring or amulet, it protects from magical attacks.", a: "What is an Amulet of Proof against Detection and Location (or Ring of Spell Turning/Protection)?" },
                { q: "Q4 Item?", a: "A4 Item"} ]},
        { name: "DUNGEON LORE", questions: [
                { q: "Q1 Lore?", a: "A1 Lore"}, { q: "Q2 Lore?", a: "A2 Lore"},
                { q: "Q3 Lore?", a: "A3 Lore"}, { q: "Q4 Lore?", a: "A4 Lore"} ]},
        { name: "TRAPS & TRICKS", questions: [
                { q: "Q1 Trap?", a: "A1 Trap"}, { q: "Q2 Trap?", a: "A2 Trap"},
                { q: "Q3 Trap?", a: "A3 Trap"}, { q: "Q4 Trap?", a: "A4 Trap"} ]}
    ];

    // --- Card Data ---
    const cardFiles = [
        'card_01.png', 'card_02.png', 'card_03.png', 'card_04.png',
        'card_05.png', 'card_06.png', 'card_07.png', 'card_08.png',
        'card_09.png', 'card_10.png' // Add ALL your card filenames
    ];
    const cardsFolderPath = 'cards/';

    // --- DOM Elements ---
    // Added checks for each element right after declaration
    const body = document.body;
    const setupModal = document.getElementById('setup-modal');
    if (!setupModal) console.error("DOM Error: #setup-modal not found!");
    const playerCountInput = document.getElementById('player-count');
    if (!playerCountInput) console.error("DOM Error: #player-count not found!");
    const submitPlayerCountBtn = document.getElementById('submit-player-count');
    if (!submitPlayerCountBtn) console.error("DOM Error: #submit-player-count not found!");
    const playerCountStep = document.getElementById('player-count-step');
    if (!playerCountStep) console.error("DOM Error: #player-count-step not found!");
    const playerNamesStep = document.getElementById('player-names-step');
    if (!playerNamesStep) console.error("DOM Error: #player-names-step not found!");
    const playerNameInputsContainer = document.getElementById('player-name-inputs');
    if (!playerNameInputsContainer) console.error("DOM Error: #player-name-inputs not found!");
    const setupError = document.getElementById('setup-error');
    if (!setupError) console.error("DOM Error: #setup-error not found!");
    const startGameBtn = document.getElementById('start-game-btn');
    if (!startGameBtn) console.error("DOM Error: #start-game-btn not found!");

    const gameEnvironment = document.querySelector('.game-environment');
    if (!gameEnvironment) console.error("DOM Error: .game-environment not found!");
    const mainGameArea = document.querySelector('.main-game-area');
    if (!mainGameArea) console.error("DOM Error: .main-game-area not found!");
    const questionsGrid = document.querySelector('.questions-grid');
    if (!questionsGrid) console.error("DOM Error: .questions-grid not found!");
    const categoriesContainer = document.querySelector('.categories');
    if (!categoriesContainer) console.error("DOM Error: .categories not found!");
    const playerInfoArea = document.getElementById('player-info-area');
    if (!playerInfoArea) console.error("DOM Error: #player-info-area not found!");
    const playerCardsContainer = document.getElementById('player-cards-container');
    if (!playerCardsContainer) console.error("DOM Error: #player-cards-container not found!");

    const questionModal = document.getElementById('question-modal');
    if (!questionModal) console.error("DOM Error: #question-modal not found!");
    const modalQuestion = document.getElementById('question-text');
    if (!modalQuestion) console.error("DOM Error: #question-text not found!");
    const modalAnswer = document.getElementById('answer-text');
    if (!modalAnswer) console.error("DOM Error: #answer-text not found!");
    const modalPointsDisplay = document.getElementById('question-points-display'); // New points display
    if (!modalPointsDisplay) console.error("DOM Error: #question-points-display not found!");
    const revealBtn = document.getElementById('reveal-answer-btn');
    if (!revealBtn) console.error("DOM Error: #reveal-answer-btn not found!");
    // Get closeBtn AFTER confirming questionModal exists
    const closeBtn = questionModal ? questionModal.querySelector('.close-button') : null;
    if (!closeBtn) console.error("DOM Error: .close-button within #question-modal not found!");
    const nextTurnBtn = document.getElementById('next-turn-btn');
    if (!nextTurnBtn) console.error("DOM Error: #next-turn-btn not found!");


    const cardJesterImg = document.getElementById('card-jester-img');
    if (!cardJesterImg) console.error("DOM Error: #card-jester-img not found!");
    const frogOfFateImg = document.getElementById('frog-of-fate-img');
    if (!frogOfFateImg) console.error("DOM Error: #frog-of-fate-img not found!");
    const drunkenSeerImg = document.getElementById('drunken-seer-img');
    if (!drunkenSeerImg) console.error("DOM Error: #drunken-seer-img not found!");
    const sacrificialGobletImg = document.getElementById('sacrificial-goblet-img');
    if (!sacrificialGobletImg) console.error("DOM Error: #sacrificial-goblet-img not found!");

    const cardModal = document.getElementById('card-modal');
    if (!cardModal) console.error("DOM Error: #card-modal not found!");
    const cardImage = document.getElementById('card-image');
    if (!cardImage) console.error("DOM Error: #card-image not found!");
    const cardCloseBtn = cardModal ? cardModal.querySelector('.card-close-button') : null;
    if (!cardCloseBtn) console.error("DOM Error: .card-close-button within #card-modal not found!");

    const playerSelectModal = document.getElementById('player-select-modal');
    if (!playerSelectModal) console.error("DOM Error: #player-select-modal not found!");
    const playerSelectList = document.getElementById('player-select-list');
    if (!playerSelectList) console.error("DOM Error: #player-select-list not found!");
    const playerSelectCloseBtn = playerSelectModal ? playerSelectModal.querySelector('.player-select-close') : null;
    if (!playerSelectCloseBtn) console.error("DOM Error: .player-select-close within #player-select-modal not found!");
    const playerSelectError = document.getElementById('player-select-error');
    if (!playerSelectError) console.error("DOM Error: #player-select-error not found!");

    const infoModal = document.getElementById('info-modal');
    if (!infoModal) console.error("DOM Error: #info-modal not found!");
    const infoModalTitle = document.getElementById('info-modal-title');
    if (!infoModalTitle) console.error("DOM Error: #info-modal-title not found!");
    const infoModalText = document.getElementById('info-modal-text');
    if (!infoModalText) console.error("DOM Error: #info-modal-text not found!");
    const infoModalOkBtn = document.getElementById('info-modal-ok-btn');
    if (!infoModalOkBtn) console.error("DOM Error: #info-modal-ok-btn not found!");
    const infoModalCloseBtn = infoModal ? infoModal.querySelector('.info-modal-close') : null;
    if (!infoModalCloseBtn) console.error("DOM Error: .info-modal-close within #info-modal not found!");

    const seerPeekModal = document.getElementById('seer-peek-modal');
    if (!seerPeekModal) console.error("DOM Error: #seer-peek-modal not found!");
    const seerPeekWords = document.getElementById('seer-peek-words');
    if (!seerPeekWords) console.error("DOM Error: #seer-peek-words not found!");
    const seerAcceptBtn = document.getElementById('seer-accept-btn');
    if (!seerAcceptBtn) console.error("DOM Error: #seer-accept-btn not found!");
    const seerRejectBtn = document.getElementById('seer-reject-btn');
    if (!seerRejectBtn) console.error("DOM Error: #seer-reject-btn not found!");


    // --- Game State ---
    let players = [];
    let currentPlayerIndex = 0;
    let currentAnswer = '';
    const scoreIncrement = 100; // Default value if points missing
    let isFrogChoosing = false; // Lock during animation
    let infoModalCallback = null;
    let isSeerPeeking = false;
    let seerPeekTargetChest = null;
    let frogMultipliers = new Map(); // Stores chestElement -> multiplier (e.g., 2, 4, 8, 16)
    let currentQuestionBasePoints = 0; // Points of the currently open question
    let currentQuestionMultiplier = 1; // Multiplier of the currently open question


    // --- Setup Phase Functions ---
    function showSetupStep(stepToShow) {
        // Check if elements exist before manipulating
        if (!playerCountStep || !playerNamesStep || !setupError) {
            console.error("Cannot show setup step: Required elements missing.");
            return;
        }
        playerCountStep.style.display = 'none';
        playerNamesStep.style.display = 'none';
        setupError.textContent = '';
        setupError.style.display = 'none';
        if (stepToShow === 'count') playerCountStep.style.display = 'block';
        else if (stepToShow === 'names') playerNamesStep.style.display = 'block';
    }
    function generateNameInputs(numPlayers) {
        if (!playerNameInputsContainer) {
             console.error("Cannot generate name inputs: Container not found."); return;
        }
        playerNameInputsContainer.innerHTML = '';
        for (let i = 0; i < numPlayers; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Player ${i + 1} Name`;
            input.id = `player-name-${i}`;
            input.required = true;
            playerNameInputsContainer.appendChild(input);
        }
        showSetupStep('names');
        const firstInput = playerNameInputsContainer.querySelector('input');
        if (firstInput) firstInput.focus();
    }
    function handlePlayerCountSubmit() {
        if (!playerCountInput) { console.error("Cannot submit count: Input missing."); return; }
        const count = parseInt(playerCountInput.value);
        if (isNaN(count) || count < 1 || count > 6) {
            showError("Please enter a number between 1 and 6.");
            playerCountInput.focus(); return;
        }
        generateNameInputs(count);
    }
    function showError(message, target = setupError) {
        if (!target) { console.error("Cannot show error: Target element missing.", message); return; }
        target.textContent = message;
        target.style.display = 'block';
    }
    function handleStartGame() {
        if (!playerNameInputsContainer || !body) {
            console.error("Cannot start game: Core elements missing."); return;
        }
        players = [];
        const nameInputs = playerNameInputsContainer.querySelectorAll('input[type="text"]');
        let allNamesValid = true;
        nameInputs.forEach((input, index) => {
            const name = input.value.trim();
            if (name === "") { allNamesValid = false; input.style.borderColor = '#ff6b6b'; }
            else { input.style.borderColor = ''; }
            players.push({ name: name || `Player ${index + 1}`, score: 0, id: `player-${index}` });
        });
        if (!allNamesValid) { showError("Please enter a name for each player."); return; }
        if (players.length > 0) {
            currentPlayerIndex = 0;
            body.classList.remove('setup-active'); body.classList.add('game-active');
            initializeGame();
        } else { showError("No players specified."); showSetupStep('count'); }
    }

    // --- Game Phase Functions ---
    function initializeGame() {
        console.log("Initializing game...");
        frogMultipliers.clear();
        document.querySelectorAll('.frog-multiplier-text').forEach(el => el.remove());
        document.querySelectorAll('.chest').forEach(chest => {
             removeFrogChestVisuals(chest);
             chest.classList.remove('opened', 'seer-peek-available');
             const img = chest.querySelector('img');
             if (img) img.src = 'images/treasure_chest.png';
        });
        isFrogChoosing = false;
        if (frogOfFateImg) { frogOfFateImg.style.opacity = '1'; frogOfFateImg.style.pointerEvents = 'auto'; }

        isSeerPeeking = false;
        seerPeekTargetChest = null;
        currentQuestionBasePoints = 0;
        currentQuestionMultiplier = 1;

        // Check core elements before proceeding
        if (!questionsGrid || !categoriesContainer || !playerCardsContainer) {
             console.error("Cannot initialize game fully: Board/Player elements missing.");
             return;
        }

        createBoard();
        createPlayerDisplays();
        updateTurnIndicator();
        addGameEventListeners();
    }

    // *** MODIFIED addGameEventListeners with Checks ***
    function addGameEventListeners() {
        console.log("Adding game event listeners...");
        console.log("Checking modal buttons:", { revealBtn, closeBtn, nextTurnBtn }); // Log elements

        // Side Icons
        if (cardJesterImg) cardJesterImg.addEventListener('click', handleDrawCard); else console.warn("Listener not added: Card Jester Img not found");
        if (frogOfFateImg) frogOfFateImg.addEventListener('click', activateFrogOfFate); else console.warn("Listener not added: Frog of Fate Img not found");
        if (drunkenSeerImg) drunkenSeerImg.addEventListener('click', handleDrunkenSeerClick); else console.warn("Listener not added: Drunken Seer Img not found");
        if (sacrificialGobletImg) sacrificialGobletImg.addEventListener('click', handleSacrificialGoblet); else console.warn("Listener not added: Sacrificial Goblet Img not found");

        // Card Modal
        if (cardCloseBtn) cardCloseBtn.addEventListener('click', closeCardModal); else console.warn("Listener not added: Card Close Btn not found");
        if (cardModal) {
            cardModal.addEventListener('click', (event) => { if (event.target === cardModal) closeCardModal(); });
            const cardContent = cardModal.querySelector('.modal-content');
            if (cardContent) cardContent.addEventListener('click', (e) => e.stopPropagation());
        } else console.warn("Listeners not added: Card Modal not found");

        // --- Question Modal Listeners (with checks) ---
        if (revealBtn) {
            revealBtn.addEventListener('click', revealAnswer);
        } else {
            console.error("FATAL: Reveal Answer button not found, cannot attach listener.");
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModalAndMaybePassTurn);
        } else {
            console.error("FATAL: Question Modal Close button not found, cannot attach listener.");
        }
        if (nextTurnBtn) {
            nextTurnBtn.addEventListener('click', closeModalAndMaybePassTurn);
        } else {
            console.error("FATAL: Next Turn button not found, cannot attach listener.");
        }
        if (questionModal) {
            questionModal.addEventListener('click', (event) => { if (event.target === questionModal) closeModalAndMaybePassTurn(); });
            const qContent = questionModal.querySelector('.modal-content');
            if (qContent) qContent.addEventListener('click', (event) => { event.stopPropagation(); });
            else console.warn("Could not attach stopPropagation to question modal content.");
        } else {
             console.error("FATAL: Question Modal not found, cannot attach background click listener.");
        }
        // --- End Question Modal Listeners ---

        // Player Select Modal
        if (playerSelectCloseBtn) playerSelectCloseBtn.addEventListener('click', closePlayerSelectModal); else console.warn("Listener not added: Player Select Close Btn not found");
        if (playerSelectModal) {
             playerSelectModal.addEventListener('click', (event) => { if (event.target === playerSelectModal) closePlayerSelectModal(); });
             const psContent = playerSelectModal.querySelector('.modal-content');
             if (psContent) psContent.addEventListener('click', (e) => e.stopPropagation());
             if (playerSelectList) playerSelectList.addEventListener('click', handleGobletTargetSelect); else console.warn("Listener not added: Player Select List not found");
        } else console.warn("Listeners not added: Player Select Modal not found");

        // Info Modal
        if (infoModalOkBtn) infoModalOkBtn.addEventListener('click', closeInfoModal); else console.warn("Listener not added: Info Modal OK Btn not found");
        if (infoModalCloseBtn) infoModalCloseBtn.addEventListener('click', closeInfoModal); else console.warn("Listener not added: Info Modal Close Btn not found");
        if (infoModal) {
             infoModal.addEventListener('click', (event) => { if (event.target === infoModal) closeInfoModal(); });
             const iContent = infoModal.querySelector('.modal-content');
             if (iContent) iContent.addEventListener('click', (e) => e.stopPropagation());
        } else console.warn("Listeners not added: Info Modal not found");

        // Seer Peek Modal
        if (seerAcceptBtn) seerAcceptBtn.addEventListener('click', handleSeerAccept); else console.warn("Listener not added: Seer Accept Btn not found");
        if (seerRejectBtn) seerRejectBtn.addEventListener('click', handleSeerReject); else console.warn("Listener not added: Seer Reject Btn not found");
        if (seerPeekModal) {
             const spContent = seerPeekModal.querySelector('.modal-content');
             if (spContent) spContent.addEventListener('click', (e) => e.stopPropagation());
        } else console.warn("Listeners not added: Seer Peek Modal not found");
    }


    // --- Board and Player Display ---
    function createBoard() {
         // Added checks
         if (!questionsGrid || !categoriesContainer) {
             console.error("Cannot create board: Grid or Categories container missing."); return;
         }
         questionsGrid.innerHTML = ''; categoriesContainer.innerHTML = '';
         const numCategories = gameData.length;
         questionsGrid.style.gridTemplateColumns = `repeat(${numCategories}, 1fr)`;
         categoriesContainer.style.gridTemplateColumns = `repeat(${numCategories}, 1fr)`;
         gameData.forEach((category, categoryIndex) => {
             const categoryHeader = document.createElement('div');
             categoryHeader.classList.add('category-header'); categoryHeader.textContent = category.name;
             categoriesContainer.appendChild(categoryHeader);
             const column = document.createElement('div'); column.classList.add('category-column');
             const baseValue = 100;
             category.questions.forEach((questionData, questionIndex) => {
                 const chestWrapper = document.createElement('div'); chestWrapper.classList.add('chest');
                 chestWrapper.dataset.categoryIndex = categoryIndex; chestWrapper.dataset.questionIndex = questionIndex;
                 const points = (questionIndex + 1) * baseValue; chestWrapper.dataset.points = points;
                 const chestImg = document.createElement('img'); chestImg.src = 'images/treasure_chest.png';
                 chestImg.alt = `Chest ${categoryIndex}-${questionIndex} (${points} points)`;
                 chestWrapper.appendChild(chestImg);
                 chestWrapper.addEventListener('click', handleChestClick); // Attach listener here
                 column.appendChild(chestWrapper);
             });
             questionsGrid.appendChild(column);
         });
     }

    function createPlayerDisplays() {
        if (!playerCardsContainer) { console.error("Cannot create player displays: Container missing."); return; }
        playerCardsContainer.innerHTML = '';
        players.forEach((player, index) => {
            const card = document.createElement('div');
            card.classList.add('player-card');
            card.id = `player-card-${index}`;
            card.dataset.playerIndex = index;

            const nameEl = document.createElement('div');
            nameEl.classList.add('player-name');
            nameEl.textContent = player.name;

            const scoreEl = document.createElement('div');
            scoreEl.classList.add('player-score');
            scoreEl.id = `player-score-${index}`;

            const buttonsEl = document.createElement('div');
            buttonsEl.classList.add('score-buttons');

            const addBtn = document.createElement('button');
            addBtn.textContent = `+${scoreIncrement}`;
            addBtn.title = `Add points for ${player.name}`;
            addBtn.dataset.action = 'add';
            addBtn.addEventListener('click', (e) => handleManualScoreUpdate(e, index, scoreIncrement));

            const subtractBtn = document.createElement('button');
            subtractBtn.classList.add('subtract-score');
            subtractBtn.textContent = `-${scoreIncrement}`;
            subtractBtn.title = `Subtract points for ${player.name}`;
            subtractBtn.dataset.action = 'subtract';
            subtractBtn.addEventListener('click', (e) => handleManualScoreUpdate(e, index, -scoreIncrement));

            buttonsEl.appendChild(addBtn);
            buttonsEl.appendChild(subtractBtn);

            card.appendChild(nameEl);
            card.appendChild(scoreEl);
            card.appendChild(buttonsEl);

            card.addEventListener('click', handlePlayerCardClick);
            playerCardsContainer.appendChild(card);
            updateScoreDisplay(index, player.score);
        });
    }

    function handlePlayerCardClick(event) {
        if (event.target.closest('.score-buttons')) return;
        if (event.currentTarget.classList.contains('active-turn')) return;
        const clickedCard = event.currentTarget;
        const playerIndex = parseInt(clickedCard.dataset.playerIndex);
        if (!isNaN(playerIndex) && playerIndex >= 0 && playerIndex < players.length) {
            currentPlayerIndex = playerIndex;
            updateTurnIndicator();
            if (isSeerPeeking) { cancelSeerPeekMode(); }
        } else { console.error("Could not determine player index:", clickedCard); }
    }

    function updateScoreDisplay(playerIndex, newScore) {
        const scoreElement = document.getElementById(`player-score-${playerIndex}`);
        if (scoreElement) {
            scoreElement.textContent = newScore;
            scoreElement.classList.remove('score-positive', 'score-negative');
            if (newScore >= 0) { scoreElement.classList.add('score-positive'); }
            else { scoreElement.classList.add('score-negative'); }
            scoreElement.classList.remove('score-change');
            void scoreElement.offsetWidth;
            scoreElement.classList.add('score-change');
            setTimeout(() => scoreElement.classList.remove('score-change'), 500);
        } else {
            // Log less intrusively if happens often during setup/dynamic changes
            // console.warn(`Score element not found for player index ${playerIndex} during update.`);
        }
    }

    function modifyPlayerScore(playerIndex, amount) {
        if (playerIndex >= 0 && playerIndex < players.length) {
            players[playerIndex].score += amount;
            updateScoreDisplay(playerIndex, players[playerIndex].score);
        } else { console.error(`Invalid player index for score modification: ${playerIndex}`); }
    }

    function handleManualScoreUpdate(event, playerIndex, rawAmount) {
        event.stopPropagation();
        const pointsToApply = currentQuestionBasePoints || scoreIncrement;
        const actualAmount = (rawAmount > 0 ? 1 : -1) * pointsToApply * currentQuestionMultiplier;

        console.log(`Manual score update: Player=${playerIndex}, Base=${pointsToApply}, Multiplier=${currentQuestionMultiplier}, RawButton=${rawAmount}, ActualChange=${actualAmount}`);

        if (actualAmount !== 0) {
            modifyPlayerScore(playerIndex, actualAmount);
        } else {
            console.warn("Manual score update resulted in zero change.");
        }
    }

    // --- Turn Management ---
    function nextTurn() {
        if (players.length > 0) {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            updateTurnIndicator();
            if (isSeerPeeking) { cancelSeerPeekMode(); }
        }
    }
    function updateTurnIndicator() {
        document.querySelectorAll('.player-card').forEach(card => card.classList.remove('active-turn'));
        if (players.length > 0 && players[currentPlayerIndex]) {
           const currentCard = document.getElementById(`player-card-${currentPlayerIndex}`);
           if (currentCard) currentCard.classList.add('active-turn');
           else console.warn(`Active turn indicator: Player card ${currentPlayerIndex} not found.`);
        }
    }

    // --- Helper Function to Update Frog Visuals ---
    function updateFrogChestVisuals(chestElement, multiplier) {
        if (!chestElement) return;
        removeFrogChestVisuals(chestElement);

        if (multiplier >= 2) {
            let highlightClass = 'frog-highlight-2x';
            let levelClass = 'level-1';
            if (multiplier >= 16) {
                highlightClass = 'frog-highlight-16x'; levelClass = 'level-4';
            } else if (multiplier >= 8) {
                highlightClass = 'frog-highlight-8x'; levelClass = 'level-3';
            } else if (multiplier >= 4) {
                highlightClass = 'frog-highlight-4x'; levelClass = 'level-2';
            }
            chestElement.classList.add(highlightClass);

            const multiplierText = document.createElement('span');
            multiplierText.classList.add('frog-multiplier-text', levelClass);
            multiplierText.textContent = `${multiplier}x`;
            chestElement.appendChild(multiplierText);
        }
    }

    // --- Helper Function to Remove Frog Visuals ---
    function removeFrogChestVisuals(chestElement) {
         if (!chestElement) return;
         chestElement.classList.remove(
             'frog-highlight-2x', 'frog-highlight-4x', 'frog-highlight-8x', 'frog-highlight-16x',
             'temp-frog-highlight', 'frog-final-choice-animation'
         );
         const existingMultiplierText = chestElement.querySelector('.frog-multiplier-text');
         if (existingMultiplierText) {
             existingMultiplierText.remove();
         }
    }


    // *** MODIFIED handleChestClick with SAFE element access ***
    function handleChestClick(event) {
        const chest = event.currentTarget;

        if (isSeerPeeking) {
            if (!chest || chest.classList.contains('opened') || !chest.classList.contains('seer-peek-available')) { return; }
            seerPeekTargetChest = chest;
            const catIndexPeek = parseInt(chest.dataset.categoryIndex);
            const qIndexPeek = parseInt(chest.dataset.questionIndex);
            if (gameData[catIndexPeek]?.questions[qIndexPeek]) { // Optional chaining
                const questionText = gameData[catIndexPeek].questions[qIndexPeek].q;
                showSeerPeekModalContent(questionText);
            } else {
                console.error("Seer Peek Error: Could not find question data.");
                showInfoModal("Error", "The Seer gets confused...");
                cancelSeerPeekMode();
            }
            return;
        }

        if (isFrogChoosing || !chest || chest.classList.contains('opened')) return;

        chest.classList.add('opened');
        const chestImg = chest.querySelector('img');
        if (chestImg) chestImg.src = 'images/treasure_chest_open.png';

        currentQuestionMultiplier = frogMultipliers.get(chest) || 1;
        currentQuestionBasePoints = parseInt(chest.dataset.points) || scoreIncrement;

        if (currentQuestionMultiplier > 1) {
            console.log(`Opening chest with Frog multiplier: ${currentQuestionMultiplier}x`);
            frogMultipliers.delete(chest);
            removeFrogChestVisuals(chest);
        } else {
             console.log("Opening standard chest.");
        }
        chest.classList.remove('seer-peek-available');

        const catIndex = parseInt(chest.dataset.categoryIndex);
        const qIndex = parseInt(chest.dataset.questionIndex);

        // Use optional chaining for safer access
        if (gameData[catIndex]?.questions[qIndex]) {
            const questionData = gameData[catIndex].questions[qIndex];
            const totalPoints = currentQuestionBasePoints * currentQuestionMultiplier;

            // --- SAFE Update Displays ---
            if (modalPointsDisplay) {
                modalPointsDisplay.textContent = `${totalPoints} POINTS`;
            } else {
                console.error("Points display element (#question-points-display) not found!");
            }
            if (modalQuestion) {
                modalQuestion.textContent = questionData.q;
            } else {
                 console.error("Question text element (#question-text) not found!");
            }

            currentAnswer = questionData.a;
            if (modalAnswer) {
                modalAnswer.textContent = currentAnswer;
                modalAnswer.style.display = 'none';
            } else {
                 console.error("Answer text element (#answer-text) not found!");
            }

            // --- SAFE Button/Modal Updates ---
            if (revealBtn) revealBtn.style.display = 'inline-block'; else console.error("Reveal button not found for display update!");
            if (nextTurnBtn) nextTurnBtn.style.display = 'none'; else console.error("Next turn button not found for display update!");
            if (questionModal) questionModal.style.display = 'flex'; else console.error("Question modal not found for display update!");

        } else {
            console.error("Error: Could not find question data for chest:", `Cat ${catIndex}, Q ${qIndex}`);
            showInfoModal("Error", "Could not load question data for this chest.");
            chest.classList.remove('opened');
            if (chestImg) chestImg.src = 'images/treasure_chest.png';
            currentQuestionBasePoints = 0;
            currentQuestionMultiplier = 1;
        }
     }

    // *** MODIFIED revealAnswer with SAFE element access ***
    function revealAnswer() {
        console.log("revealAnswer triggered");
        // Check elements before modifying
        if (!modalAnswer || !revealBtn || !nextTurnBtn) {
             console.error("Cannot reveal answer: One or more required modal elements missing.");
             return;
        }
        modalAnswer.style.display = 'block';
        revealBtn.style.display = 'none';
        nextTurnBtn.style.display = 'inline-block';
    }

    // *** MODIFIED closeModalAndMaybePassTurn with SAFE element access ***
    function closeModalAndMaybePassTurn() {
        console.log("closeModalAndMaybePassTurn triggered");
        // Check essential elements first - including modal itself
        if (!questionModal || !modalQuestion || !modalAnswer || !modalPointsDisplay || !revealBtn || !nextTurnBtn) {
            console.error("Cannot close modal properly: One or more required modal elements not found.");
            // Attempt to hide modal as fallback if it exists
            if (questionModal) questionModal.style.display = 'none';
            // Reset state anyway to prevent issues
            currentQuestionBasePoints = 0;
            currentQuestionMultiplier = 1;
            return; // Stop execution
        }

        const wasAnswerRevealed = modalAnswer.style.display === 'block';
        questionModal.style.display = 'none'; // Hide modal

        // Clear content (already checked elements)
        modalQuestion.textContent = '';
        modalAnswer.textContent = '';
        modalAnswer.style.display = 'none';
        modalPointsDisplay.textContent = '';

        // Reset buttons
        revealBtn.style.display = 'inline-block';
        nextTurnBtn.style.display = 'none';
        currentAnswer = '';

        // Reset question-specific state
        console.log("Closing question modal, resetting question points/multiplier.");
        currentQuestionBasePoints = 0;
        currentQuestionMultiplier = 1;

        // Handle game state
        if (isSeerPeeking) { cancelSeerPeekMode(); }
        if (wasAnswerRevealed) nextTurn();
        else console.log("Question modal closed before answer revealed. Turn not passed.");
    }


    // --- Side Icon Handlers (Mostly unchanged, just ensure checks) ---
    function handleDrawCard() {
        if (isFrogChoosing) return;
        if (isSeerPeeking) cancelSeerPeekMode();
        if (!cardModal || !cardImage) { console.error("Cannot draw card: Modal/Image element missing."); return; }

        if (cardFiles.length === 0) { showInfoModal("Empty Deck", "The Deck of Darks is empty!"); return; }
        const randomIndex = Math.floor(Math.random() * cardFiles.length);
        const randomCardFilename = cardFiles[randomIndex];
        cardImage.src = cardsFolderPath + randomCardFilename;
        cardImage.alt = randomCardFilename.replace('.png', '').replace(/_/g, ' ');
        cardModal.style.display = 'flex';
    }
    function closeCardModal() {
         if (cardModal) cardModal.style.display = 'none';
         if (cardImage) cardImage.src = "";
    }

    function activateFrogOfFate() {
        if (isFrogChoosing) return;
        if (isSeerPeeking) cancelSeerPeekMode();

        const unopenedChests = Array.from(document.querySelectorAll('.chest:not(.opened)'));
        if (unopenedChests.length === 0) {
            showInfoModal("Frog of Fate", "The Frog of Fate sighs... No unopened chests remain!");
            return;
        }
        console.log(`Frog starting selection from ${unopenedChests.length} unopened chests.`);

        isFrogChoosing = true;
        if (frogOfFateImg) { frogOfFateImg.style.opacity = '0.5'; frogOfFateImg.style.pointerEvents = 'none'; }

        unopenedChests.forEach(chest => {
            chest.classList.remove('temp-frog-highlight', 'frog-final-choice-animation');
        });

        let highlightCount = 0;
        const maxHighlights = 18 + Math.floor(Math.random() * 15);
        const finalChosenChest = unopenedChests[Math.floor(Math.random() * unopenedChests.length)];

        const existingMultiplierBefore = frogMultipliers.get(finalChosenChest) || 0;
        console.log(`Frog intends to choose:`, finalChosenChest, ` Existing Multiplier: ${existingMultiplierBefore}x`);

        function performHighlight() {
            document.querySelectorAll('.temp-frog-highlight').forEach(el => {
                 el.classList.remove('temp-frog-highlight');
            });

            if (highlightCount >= maxHighlights) {
                console.log("Frog animation finished. Applying selection to:", finalChosenChest);
                let currentMultiplier = frogMultipliers.get(finalChosenChest) || 0;
                let newMultiplier = currentMultiplier === 0 ? 2 : Math.min(currentMultiplier * 2, 16);
                frogMultipliers.set(finalChosenChest, newMultiplier);
                console.log(`Chest multiplier updated to ${newMultiplier}x`);
                updateFrogChestVisuals(finalChosenChest, newMultiplier);

                finalChosenChest.classList.add('frog-final-choice-animation');
                 setTimeout(() => {
                    finalChosenChest.classList.remove('frog-final-choice-animation');
                 }, 600);

                isFrogChoosing = false;
                if (frogOfFateImg) { frogOfFateImg.style.opacity = '1'; frogOfFateImg.style.pointerEvents = 'auto'; }
                console.log("Frog selection complete.");
                return;
            }

            const currentUnopenedAnim = Array.from(document.querySelectorAll('.chest:not(.opened)'));
            if (currentUnopenedAnim.length > 0) {
                const randomChestToHighlight = currentUnopenedAnim[Math.floor(Math.random() * currentUnopenedAnim.length)];
                randomChestToHighlight.classList.add('temp-frog-highlight');
            }

            highlightCount++;
            const highlightDuration = 70 + Math.random() * 110;
            setTimeout(performHighlight, highlightDuration);
        }
        performHighlight();
    }

    // Seer Functions (Added checks for elements)
    function handleDrunkenSeerClick() {
        if (isFrogChoosing || isSeerPeeking) return;
        const unopenedChestsCount = document.querySelectorAll('.chest:not(.opened)').length;
        if (unopenedChestsCount === 0) {
            showInfoModal("Drunken Seer", "The Seer belches... No unopened chests!"); return;
        }
        const currentPlayerName = players[currentPlayerIndex]?.name || 'Adventurer';
        showInfoModal(
            "Drunken Seer",
            `${currentPlayerName}, the Seer offers a glimpse! OK, then pick a chest.`,
            () => { activateSeerPeekMode(); }
        );
    }
    function activateSeerPeekMode() {
        console.log("Activating Seer Peek Mode");
        isSeerPeeking = true; seerPeekTargetChest = null;
        document.querySelectorAll('.chest:not(.opened)').forEach(chest => {
            chest.classList.add('seer-peek-available'); });
        // Check elements before styling/disabling
        if (drunkenSeerImg) drunkenSeerImg.style.filter = 'brightness(1.3) saturate(1.5)';
        if (cardJesterImg) cardJesterImg.style.pointerEvents = 'none';
        if (frogOfFateImg) frogOfFateImg.style.pointerEvents = 'none';
        if (sacrificialGobletImg) sacrificialGobletImg.style.pointerEvents = 'none';
    }
    function cancelSeerPeekMode() {
        console.log("Cancelling Seer Peek Mode");
        isSeerPeeking = false; seerPeekTargetChest = null;
        document.querySelectorAll('.chest.seer-peek-available').forEach(chest => {
            chest.classList.remove('seer-peek-available'); });
        // Check elements before restoring
        if (drunkenSeerImg) drunkenSeerImg.style.filter = 'none';
        if (cardJesterImg) cardJesterImg.style.pointerEvents = 'auto';
        if (frogOfFateImg) frogOfFateImg.style.pointerEvents = 'auto';
        if (sacrificialGobletImg) sacrificialGobletImg.style.pointerEvents = 'auto';
        closeSeerPeekModal();
    }
    function showSeerPeekModalContent(questionText) {
        if (!seerPeekWords || !seerPeekModal || !seerAcceptBtn) {
             console.error("Cannot show seer content: Modal elements missing."); return;
        }
        // ... (word processing logic) ...
        const words = questionText.split(/[\s-]+/);
        const commonWords = new Set(['a', 'an', 'the', 'is', 'of', 'in', 'it', 'and', 'or', 'what', 'who', 'where', 'when', 'why', 'how', 'are', 'this', 'that', 'for', 'on', 'to', 'from']);
        const filteredWords = words.map(word => word.replace(/[?,."';:!]/g, '').toLowerCase()).filter(word => word.length > 2 && !commonWords.has(word) && word !== '');
        for (let i = filteredWords.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [filteredWords[i], filteredWords[j]] = [filteredWords[j], filteredWords[i]]; }
        const peekWords = filteredWords.slice(0, 4);

        if (peekWords.length > 0) {
             seerPeekWords.innerHTML = ''; peekWords.forEach(word => { const span = document.createElement('span'); span.textContent = word; seerPeekWords.appendChild(span); });
        } else { seerPeekWords.textContent = "(Vision too blurry!)"; }
        seerPeekModal.style.display = 'flex';
        seerAcceptBtn.focus();
    }
    function handleSeerAccept() {
        if (!seerPeekTargetChest) { console.error("Seer Accept Error"); closeSeerPeekModal(); cancelSeerPeekMode(); return; }
        const chestToOpen = seerPeekTargetChest;
        closeSeerPeekModal(); cancelSeerPeekMode();
        console.log("Seer accepted, triggering open for:", chestToOpen);
        handleChestClick({ currentTarget: chestToOpen });
    }
    function handleSeerReject() {
        console.log("Seer rejected, cancelling Seer Peek Mode.");
        cancelSeerPeekMode();
        if (mainGameArea) mainGameArea.focus();
    }
    function closeSeerPeekModal() {
         if (seerPeekModal) seerPeekModal.style.display = 'none';
         if (seerPeekWords) seerPeekWords.textContent = 'Loading words...';
    }

    // Goblet Functions (Added checks)
    function handleSacrificialGoblet() {
        if (isFrogChoosing) return;
        if (isSeerPeeking) cancelSeerPeekMode();
        if (players.length < 2) { showInfoModal("Not Enough Players", "Needs two+ players."); return; }
        const currentPlayerName = players[currentPlayerIndex]?.name || 'Adventurer';
        showInfoModal("Sacrificial Goblet", `${currentPlayerName}, you drink... lose 100 points! Choose victim...`, () => {
            modifyPlayerScore(currentPlayerIndex, -100);
            prepareAndShowPlayerSelectModal();
        });
    }
    function prepareAndShowPlayerSelectModal() {
        if (!playerSelectList || !playerSelectError || !playerSelectModal) {
            console.error("Cannot prepare player select modal: Elements missing."); return;
        }
        playerSelectList.innerHTML = ''; playerSelectError.style.display = 'none';
        let potentialVictims = 0;
        players.forEach((player, index) => {
            if (index !== currentPlayerIndex) {
                const playerButton = document.createElement('button');
                playerButton.textContent = player.name; playerButton.dataset.targetIndex = index;
                playerSelectList.appendChild(playerButton); potentialVictims++;
            }
        });
        if (potentialVictims > 0) playerSelectModal.style.display = 'flex';
        else { console.error("Error: No victims found."); showInfoModal("Error", "Could not find victim!"); }
    }
    function handleGobletTargetSelect(event) {
        if (event.target.tagName === 'BUTTON' && event.target.closest('#player-select-list')) {
            const targetIndex = parseInt(event.target.dataset.targetIndex);
            if (!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < players.length) {
                if (targetIndex === currentPlayerIndex) { showError("Cannot choose yourself!", playerSelectError); return; }
                const targetPlayerName = players[targetIndex]?.name || 'Selected Player';
                closePlayerSelectModal();
                showInfoModal("Curse Strikes!", `${targetPlayerName} feels a chill... loses 100 points.`, () => {
                    modifyPlayerScore(targetIndex, -100);
                });
            } else { console.error("Invalid target index:", event.target.dataset.targetIndex); showError("Invalid player.", playerSelectError); }
        }
    }
    function closePlayerSelectModal() {
        if (playerSelectModal) playerSelectModal.style.display = 'none';
        if (playerSelectList) playerSelectList.innerHTML = '';
        if (playerSelectError) playerSelectError.style.display = 'none';
     }

    // --- Generic Info Modal Functions (Added checks) ---
    function showInfoModal(title = "Notification", message, callback = null) {
        if (!infoModal || !infoModalTitle || !infoModalText || !infoModalOkBtn) {
            console.error("Cannot show info modal: Elements missing.", {title, message}); return;
        }
        infoModalTitle.textContent = title;
        infoModalText.textContent = message;
        infoModalCallback = callback;
        infoModal.style.display = 'flex';
        infoModalOkBtn.focus();
    }
    function closeInfoModal() {
        if(infoModal) infoModal.style.display = 'none';
        if (typeof infoModalCallback === 'function') { infoModalCallback(); }
        infoModalCallback = null;
        if(infoModalTitle) infoModalTitle.textContent = "";
        if(infoModalText) infoModalText.textContent = "";
    }

    // --- Initial Setup Listeners (Added checks) ---
    if (submitPlayerCountBtn) submitPlayerCountBtn.addEventListener('click', handlePlayerCountSubmit); else console.warn("Listener not added: Submit Player Count Btn missing.");
    if (startGameBtn) startGameBtn.addEventListener('click', handleStartGame); else console.warn("Listener not added: Start Game Btn missing.");
    if (playerCountInput) playerCountInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); handlePlayerCountSubmit(); } }); else console.warn("Listener not added: Player Count Input missing.");
    if (playerNameInputsContainer) playerNameInputsContainer.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
             e.preventDefault();
             const inputs = Array.from(playerNameInputsContainer.querySelectorAll('input'));
             const currentIndex = inputs.indexOf(e.target);
             if (currentIndex === inputs.length - 1) { handleStartGame(); }
             else if (currentIndex !== -1 && currentIndex + 1 < inputs.length) { inputs[currentIndex + 1].focus(); }
        }
    }); else console.warn("Listener not added: Player Name Inputs Container missing.");

    // Start Setup
    showSetupStep('count');
    if (playerCountInput) playerCountInput.focus();

}); // End DOMContentLoaded