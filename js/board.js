// js/board.js
import * as DOM from './domElements.js';
import * as state from './state.js';
import * as config from './config.js';
import { showQuestion } from './modals/questionModal.js';
import { showSeerPeekModalContent } from './modals/seerModal.js';
import { showInfoModal } from './modals/infoModal.js';
import { removeFrogChestVisuals } from './features/frog.js'; // Import frog visual reset

export function createBoard() {
    if (!DOM.questionsGrid || !DOM.categoriesContainer) {
        console.error("Cannot create board: Grid or Categories container missing.");
        return;
    }
    DOM.questionsGrid.innerHTML = '';
    DOM.categoriesContainer.innerHTML = '';

    const numCategories = config.gameData.length; // This will now be 6
    // --- UPDATE GRID TO 6 COLUMNS ---
    DOM.questionsGrid.style.gridTemplateColumns = `repeat(${numCategories}, 1fr)`; // Uses numCategories (now 6)
    DOM.categoriesContainer.style.gridTemplateColumns = `repeat(${numCategories}, 1fr)`; // Uses numCategories (now 6)
    // --- END UPDATE ---

    config.gameData.forEach((category, categoryIndex) => {
        const categoryHeader = document.createElement('div');
        categoryHeader.classList.add('category-header');
        categoryHeader.textContent = category.name;
        DOM.categoriesContainer.appendChild(categoryHeader);

        const column = document.createElement('div');
        column.classList.add('category-column');

        // --- Point Calculation uses new baseScoreIncrement from config ---
        const baseValue = config.baseScoreIncrement; // This is now 200

        // This loop now runs 5 times for each category
        category.questions.forEach((questionData, questionIndex) => {
            const chestWrapper = document.createElement('div');
            chestWrapper.classList.add('chest');
            chestWrapper.dataset.categoryIndex = categoryIndex;
            chestWrapper.dataset.questionIndex = questionIndex;
            // Points will be 200, 400, 600, 800, 1000
            const points = (questionIndex + 1) * baseValue;
            chestWrapper.dataset.points = points;

            const chestImg = document.createElement('img');
            chestImg.src = 'images/treasure_chest.png';
            chestImg.alt = `Chest ${categoryIndex}-${questionIndex} (${points} points)`;
            chestWrapper.appendChild(chestImg);

            const pointsSpan = document.createElement('span');
            pointsSpan.classList.add('chest-points');
            pointsSpan.textContent = points;
            chestWrapper.appendChild(pointsSpan);

            chestWrapper.addEventListener('click', handleChestClick);
            column.appendChild(chestWrapper);
        });
        DOM.questionsGrid.appendChild(column);
    });
}

export function handleChestClick(event) {
    const chest = event.currentTarget; // The chest div that was clicked

    // --- Seer Peek Handling ---
    if (state.isSeerPeeking) {
        // Ignore if chest is opened or not marked as available for peeking
        if (!chest || chest.classList.contains('opened') || !chest.classList.contains('seer-peek-available')) {
            return;
        }
        state.setSeerPeekTargetChest(chest); // Store the target chest in state
        const catIndexPeek = parseInt(chest.dataset.categoryIndex);
        const qIndexPeek = parseInt(chest.dataset.questionIndex);

        // Safely access question data using optional chaining
        const questionText = config.gameData[catIndexPeek]?.questions[qIndexPeek]?.q;

        if (questionText) {
            showSeerPeekModalContent(questionText); // Show the peek modal
        } else {
            console.error("Seer Peek Error: Could not find question data for chest:", chest.dataset);
            showInfoModal("Seer Error", "The Seer gets confused trying to peek at this chest...");
            // Consider cancelling seer mode here if data is bad? Or let user try another.
        }
        return; // Stop further processing for normal click
    }

    // --- Normal Chest Click Handling ---
    // Ignore if Frog is choosing, chest is invalid, or already opened
    if (state.isFrogChoosing || !chest || chest.classList.contains('opened')) {
        return;
    }

    // Mark as opened visually and logically
    chest.classList.add('opened');
    const chestImg = chest.querySelector('img');
    if (chestImg) chestImg.src = 'images/treasure_chest_open.png'; // Change image
    chest.classList.remove('seer-peek-available'); // Remove peek availability if it had it

    // Determine points and multiplier for this question
    const basePoints = parseInt(chest.dataset.points) || state.scoreIncrement; // Fallback to default increment
    const multiplier = state.getChestMultiplier(chest); // Get multiplier from state map
    state.setCurrentQuestionParams(basePoints, multiplier); // Store these globally for score buttons

    // If it had a multiplier, log it and remove it from state and visuals
    if (multiplier > 1) {
        console.log(`Opening chest with Frog multiplier: ${multiplier}x`);
        state.deleteChestMultiplier(chest); // Remove from state map
        removeFrogChestVisuals(chest); // Remove highlight and text
    } else {
        console.log("Opening standard chest.");
    }

    // Get question data
    const catIndex = parseInt(chest.dataset.categoryIndex);
    const qIndex = parseInt(chest.dataset.questionIndex);

    const questionData = config.gameData[catIndex]?.questions[qIndex];

    if (questionData) {
        const totalPoints = basePoints * multiplier;
        // Show the question modal using the dedicated function
        showQuestion(questionData.q, questionData.a, totalPoints);
    } else {
        console.error("Error: Could not find question data for chest:", `Cat ${catIndex}, Q ${qIndex}`);
        showInfoModal("Game Error", "Could not load question data for this chest. Oops!");
        // Revert visual state? Or leave opened but un-askable? Reverting might be better.
        chest.classList.remove('opened');
        if (chestImg) chestImg.src = 'images/treasure_chest.png';
        state.resetCurrentQuestionParams(); // Reset points/multiplier if question failed
    }
}