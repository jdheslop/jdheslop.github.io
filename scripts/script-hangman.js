document.addEventListener("DOMContentLoaded", () => {
    // Initialize variables
    let targetWord = '';
    let guessedLetters = [];
    let correctLetters = [];
    let incorrectLetters = [];
    let incorrectGuesses = 0;
    let maxIncorrectGuesses = 10;

    // Elements
    const startForm = document.getElementById('start-form');
    const gameArea = document.getElementById('game-area');
    const targetWordDisplay = document.getElementById('target-word-display');
    const infoContent = document.getElementById('info-text');
    const guessedLettersDisplay = document.getElementById('guessed-letters-display');
    const hangmanCanvas = document.getElementById('hangman-canvas');
    const guessLetterInput = document.getElementById('guess-letter');
    const letterInputDiv = document.getElementById('letter-input');
    const resetButton = document.getElementById('reset-button');
    const startFormError = document.getElementById('start-form-error');
    const solvePuzzleDiv = document.getElementById('solve-puzzle-div');
    const rulesOverlay = document.getElementById('rules-overlay');
    const closeRules = document.getElementById('close-rules');
    const letterInputError = document.querySelector('#letter-input-error');
    const solvePuzzleInput = document.getElementById('solve-puzzle-input');
    const targetWordInput = document.getElementById('target-word');
    const targetWordHeader = document.querySelector("#target-word-header")

    let langText = [];
    let englishText = [
        'Please enter the target word or phrase.',
        'Welcome to Hangman! Please guess your first letter.',
        'Please enter a valid letter.',
        'Congratulations! The letter',
        'is used',
        'times.',
        'Sorry, the letter',
        'has already been guessed.',
        'is not used.',
        'Congratulations! You have solved the puzzle.',
        'Sorry, but you have lost! The correct solution was',
        'Congratulations!',
        'is correct. You have solved the puzzle.',
        'Sorry,',
        'is not correct.',
        'Target Word',
        'Target Words',
    ];
    let germanText = [
        'Bitte gib das gesuchte Wort oder den gesuchten Satz ein.',
        'Willkommen bei Hangman! Bitte rate deinen ersten Buchstaben.',
        'Bitte gib einen gültigen Buchstaben ein.',
        'Glückwunsch! Der Buchstabe',
        'wird',
        'Mal verwendet.',
        'Sorry, der Buchstabe',
        'wurde bereits geraten.',
        'wird nicht verwendet.',
        'Glückwunsch! Du hast das Rätsel gelöst.',
        'Sorry, aber du hast verloren! Die richtige Lösung war',
        'Glückwunsch!',
        'ist korrekt. Du hast das Rätsel gelöst.',
        'Sorry,',
        'ist nicht korrekt.',
        'Gesuchtes Wort',
        'Gesuchte Wörter',
    ];

    // Call the function to set the langText based on the language
    setLangText();

    // Function to detect the language and set the langText
    function setLangText() {
        let htmlLang = document.documentElement.lang; // Get the language from <html lang="">
        
        if (htmlLang === 'de') {
            langText = germanText;
        } else {
            langText = englishText;
        }
    }

    // Function to handle Enter key press for different inputs
    function handleEnterKeyPress(event, callback) {
        if (event.key === "Enter") {
            event.preventDefault();
            callback();
        }
    }

    // Add event listeners for Enter key press on input fields
    targetWordInput.addEventListener("keypress", (event) => handleEnterKeyPress(event, startGame));
    guessLetterInput.addEventListener("keypress", (event) => handleEnterKeyPress(event, guessLetter));
    solvePuzzleInput.addEventListener("keypress", (event) => handleEnterKeyPress(event, solvePuzzle));

    // Start Game
    window.startGame = function () {
        targetWord = targetWordInput.value.toUpperCase();

        if (!targetWord) {
            startFormError.innerText = `${langText[0]}`;
            return;
        }

        startFormError.innerText = '';
        guessedLetters = [];
        correctLetters = [];
        incorrectLetters = [];
        incorrectGuesses = 0;
        updateTargetWordDisplay();
        infoContent.innerHTML = `${langText[1]}`;
        guessedLettersDisplay.innerHTML = '';
        clearHangmanDrawing();

        startForm.style.display = 'none';
        gameArea.style.display = 'grid';
        letterInputDiv.style.display = 'flex';
        resetButton.style.display = 'none';
        guessLetterInput.focus();
    };

    // Guess Letter
    window.guessLetter = function () {
        const letter = guessLetterInput.value.toUpperCase();
        if (!letter) {
            letterInputError.innerText = `${langText[2]}`;
            return;
        }

        letterInputError.innerText = '';
        guessedLetters.push(letter);
        guessLetterInput.value = '';
        guessLetterInput.focus();

        if (targetWord.includes(letter) && !correctLetters.includes(letter)) {
            updateTargetWordDisplay();
            correctLetters.push(letter);
            const occurrences = targetWord.split(letter).length - 1;
            infoContent.innerHTML = `${langText[3]} "${letter}" ${langText[4]} ${occurrences} ${langText[5]}`;
        } else {
            incorrectGuesses++;
            guessedLettersDisplay.innerHTML += `${letter} `;
            drawHangman(incorrectGuesses);
            if (correctLetters.includes(letter) || incorrectLetters.includes(letter)){
                infoContent.innerHTML = `${langText[6]} "${letter}" ${langText[7]}`;
            } else {
                infoContent.innerHTML = `${langText[6]} "${letter}" ${langText[8]}`;
                incorrectLetters.push(letter);
            }
        }

        if (isGameWon()) {
            infoContent.innerHTML = `${langText[9]}`;
            endGame();
        } else if (incorrectGuesses >= maxIncorrectGuesses) {
            infoContent.innerHTML = `${langText[10]} "${targetWord}".`;
            endGame();
        }
    };

    // Show Guess Letter
    window.showGuessLetter = function () {
        letterInputDiv.style.display = 'flex';
        solvePuzzleDiv.style.display = 'none';
        guessLetterInput.focus();
        solvePuzzleInput.value = '';
    };

    // Show Solve Puzzle
    window.showSolvePuzzle = function () {
        letterInputDiv.style.display = 'none';
        solvePuzzleDiv.style.display = 'flex';
        solvePuzzleInput.focus();
        guessLetterInput.value = '';
    };

    // Solve Puzzle
    window.solvePuzzle = function () {
        const playerGuess = solvePuzzleInput.value.toUpperCase();
        if (playerGuess === targetWord) {
            infoContent.innerHTML = `${langText[11]} "${targetWord}" ${langText[12]}`;
            endGame();
            solvePuzzleDiv.style.display = 'none';
            letterInputDiv.style.display = 'none';
            solvePuzzleInput.value = '';
        } else {
            infoContent.innerHTML = `${langText[13]} "${playerGuess}" ${langText[14]}`;
            incorrectGuesses++;
            drawHangman(incorrectGuesses);
            letterInputDiv.style.display = 'flex';
            solvePuzzleDiv.style.display = 'none';
            solvePuzzleInput.value = '';
            guessLetterInput.focus();
        }
    };

    // End Game
    function endGame() {
        letterInputDiv.style.display = 'none';
        resetButton.style.display = 'block';
        showAllLetters();
    }

    // Reset Game
    window.resetGame = function () {
        startForm.style.display = 'block';
        gameArea.style.display = 'none';
        targetWordDisplay.innerHTML = '';
        infoContent.innerHTML = '';
        guessedLettersDisplay.innerHTML = '';
        clearHangmanDrawing();
        targetWordInput.value = ''; // Clear the target word input
        targetWordInput.focus(); // Add focus to the target word input
    };

// Update target word display
function updateTargetWordDisplay() {

    // Remove beginning and trailing spaces from targetWord
    targetWord = targetWord.trim();

    if (targetWord.includes(' ')) {
        targetWordHeader.innerText = langText[16];
    } else {
        targetWordHeader.innerText = langText[15];
    }

    const display = targetWord.split(' ').map(word => {
        const letters = word.split('').map(letter => 
            guessedLetters.includes(letter) ? letter : '_'
        ).join(' ');
        return `<span class="nobreak">${letters}</span>`;
    }).join('&nbsp; &nbsp;');
    targetWordDisplay.innerHTML = display;
}

// Show all letters of the target word
function showAllLetters() {
    const display = targetWord.split(' ').map(word => {
        const letters = word.split('').join(' ');
        return `<span class="nobreak">${letters}</span>`;
    }).join('&nbsp; &nbsp;');
    targetWordDisplay.innerHTML = display;
}

    // Check if game is won
    function isGameWon() {
        return targetWord.split('').every(letter => letter === ' ' || guessedLetters.includes(letter));
    }

    // Clear hangman drawing
    function clearHangmanDrawing() {
        const ctx = hangmanCanvas.getContext('2d');
        ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
    }

    // Draw hangman parts based on the number of incorrect guesses
    function drawHangman(stage) {
        const ctx = hangmanCanvas.getContext('2d');
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;

        switch (stage) {
            case 1:
                ctx.beginPath();
                ctx.moveTo(50, 150);
                ctx.lineTo(150, 150);
                ctx.stroke();
                break;
            case 2:
                ctx.beginPath();
                ctx.moveTo(100, 150);
                ctx.lineTo(100, 50);
                ctx.stroke();
                break;
            case 3:
                ctx.beginPath();
                ctx.moveTo(100, 50);
                ctx.lineTo(150, 50);
                ctx.stroke();
                break;
            case 4:
                ctx.beginPath();
                ctx.moveTo(150, 50);
                ctx.lineTo(150, 70);
                ctx.stroke();
                break;
            case 5:
                ctx.beginPath();
                ctx.arc(150, 80, 10, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 6:
                ctx.beginPath();
                ctx.moveTo(150, 90);
                ctx.lineTo(150, 120);
                ctx.stroke();
                break;
            case 7:
                ctx.beginPath();
                ctx.moveTo(150, 100);
                ctx.lineTo(140, 110);
                ctx.stroke();
                break;
            case 8:
                ctx.beginPath();
                ctx.moveTo(150, 100);
                ctx.lineTo(160, 110);
                ctx.stroke();
                break;
            case 9:
                ctx.beginPath();
                ctx.moveTo(150, 120);
                ctx.lineTo(140, 130);
                ctx.stroke();
                break;
            case 10:
                ctx.beginPath();
                ctx.moveTo(150, 120);
                ctx.lineTo(160, 130);
                ctx.stroke();
                break;
        }
    }

    // Show rules overlay
    window.showRules = function () {
        rulesOverlay.style.display = 'flex';
    };

    // Close rules overlay
    closeRules.onclick = function () {
        rulesOverlay.style.display = 'none';
    };

    // Close rules overlay when clicking outside the content
    window.onclick = function (event) {
        if (event.target === rulesOverlay) {
            rulesOverlay.style.display = 'none';
        }
    };

    // Initial focus on target word input when the page loads
    targetWordInput.focus();
});
