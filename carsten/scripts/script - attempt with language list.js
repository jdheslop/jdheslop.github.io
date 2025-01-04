// Assisted by ChatGPT, an AI language model by OpenAI.

// Variables to track game state
let currentPlayer = 1;
let selectedShape = null;
let selectedShapeElement = null;
let selectedCell = null; // Used to track the selected cell
let turnCounter = 0;
const maxTurns = 16; // Total number of turns before tie condition
let gameOver = false; // Variable to track if the game is over

let langText = [];
let englishText = [
    "Player ${currentPlayer}:<br>Where on the board would you like to place this shape?",
    "Player ${currentPlayer}:<br>Are you finished?</button>",
    "Player ${currentPlayer} wins!<br><button id=\"play-again\">Play Again</button>",
    "Player ${currentPlayer}:<br>Please select your next shape.",
    "It's a tie!<br><button id=\"play-again\">Play Again</button>"
];
let germanText = [
    "Spieler ${currentPlayer}:<br>Wo möchtest Du diese Form auf dem Spielfeld platzieren?",
    "Spieler ${currentPlayer}:<br>Bist Du fertig?</button>",
    "Spieler ${currentPlayer} gewinnt!<br><button id=\"play-again\">Nochmal spielen</button>",
    "Spieler ${currentPlayer}:<br>Bitte wähle deine nächste Form aus.",
    "Es ist ein Unentschieden!<br><button id=\"play-again\">Nochmal spielen</button>"
];


// Function to initialize event listeners
function initializeListeners() {
    // Check if the overlay has been closed previously
    if (sessionStorage.getItem('overlayClosed') !== 'true') {
        document.getElementById('overlay').style.display = 'flex';
    } else {
        document.getElementById('overlay').style.display = 'none';
    }

    // Add click listeners to staging area cells
    document.querySelectorAll('.staging-cell').forEach(cell => {
        cell.addEventListener('click', selectShape);
    });

    // Add click listeners to playing field cells
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', placeShape);
    });

    // Add click listener to info icon
    document.getElementById('info-icon').addEventListener('click', showOverlay);

    // Add click listener to close overlay
    document.getElementById('close-overlay').addEventListener('click', closeOverlay);

    // Call the function to set the langText based on the language
    setLangText();
}

// Function to detect the language and set the langText
function setLangText() {
    let htmlLang = document.documentElement.lang; // Get the language from <html lang="">
    
    if (htmlLang === 'de') {
        langText = germanText;
    } else {
        langText = englishText;
    }
}

// Function to select a shape from the staging area
function selectShape(event) {
    if (gameOver) return; // Prevent shape selection if the game is over
    
    if (selectedShape) {
        // Remove shape from the cell in the playing field if exists
        const previouslyPlacedCell = document.querySelector('.selected-shape');
        if (previouslyPlacedCell) {
            previouslyPlacedCell.className = 'cell';
            previouslyPlacedCell.innerHTML = '';
        }

        // Return previously selected shape to staging area
        selectedShapeElement.classList.remove('selected');
        selectedShapeElement.style.visibility = 'visible';
    }

    // Mark the selected shape and update info window
    selectedShapeElement = event.target;
    selectedShape = selectedShapeElement.className.split(' ')[1];
    selectedShapeElement.classList.add('selected');
    
    // Clone the selected shape and display it in the info window
    const clonedShape = selectedShapeElement.cloneNode(true);
    clonedShape.classList.remove('selected');
    updateInfoWindow(`${langText[0]}`, clonedShape);

    selectedShapeElement.style.visibility = 'hidden';
}


// Function to place a shape on the playing field
function placeShape(event) {
    if (selectedShape) {
        // Find the previously selected cell and clear its contents
        const previouslySelectedCell = document.querySelector('.selected-shape');
        if (previouslySelectedCell) {
            previouslySelectedCell.className = 'cell';
            previouslySelectedCell.innerHTML = '';
        }

        // Clone the shape and place it in the selected cell
        event.target.className = `cell ${selectedShape}`;
        const clonedShape = selectedShapeElement.cloneNode(true);
        clonedShape.classList.remove('selected');
        clonedShape.style.visibility = 'visible';

        // Clear the cell's innerHTML and append the cloned shape
        event.target.innerHTML = '';
        event.target.appendChild(clonedShape);
        event.target.classList.add('selected-shape');

        // Add a highlight star to the center of the cell
        const highlightStar = document.createElement('div');
        highlightStar.className = 'highlightStar';
        event.target.appendChild(highlightStar);

        // Show confirm button
        updateInfoWindow(`${langText[1]}`); 

        // Add event listener to confirm button
        document.getElementById('confirm-placement').addEventListener('click', confirmPlacement);

        // Store the selected cell
        selectedCell = event.target; // Add this line
    }
}


// Function to confirm shape placement
function confirmPlacement() {
    // Remove selected shape from staging area
    selectedShapeElement.classList.remove('selected');

    // Remove highlight and star from the placed shape
    const placedShape = document.querySelector('.selected-shape');
    placedShape.classList.remove('selected-shape');
    const highlightStar = placedShape.querySelector('.highlightStar');
    if (highlightStar) {
        highlightStar.remove();
    }

    // Mark the cell as occupied by removing its event listener
    selectedCell.removeEventListener('click', placeShape); // Add this line

    // Check for win condition
    if (checkWinCondition()) {
        updateInfoWindow(`${langText[2]}`);
        document.getElementById('play-again').addEventListener('click', resetGame);
        gameOver = true; // Set gameOver to true
    } else {
        // Increment turn counter
        turnCounter++;

        // Check for tie condition
        if (turnCounter === maxTurns) {
            updateInfoWindow(`${langText[4]}`);
            document.getElementById('play-again').addEventListener('click', resetGame);
            gameOver = true; // Set gameOver to true
        } else {
            // Switch player
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateInfoWindow(`{langText[3]}`);
        }
    }

    // Reset selected shape variables
    selectedShape = null;
    selectedShapeElement = null;
    selectedCell = null; // Add this line to reset selectedCell
}

// Function to check win condition
function checkWinCondition() {
    // Retrieve the state of the playing field
    const cells = document.querySelectorAll('.cell');
    const grid = Array.from(cells).map(cell => cell.className.split(' ')[1] || '');

    // Define winning patterns
    const winningPatterns = [
        [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], // Rows
        [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], // Columns
        [0, 5, 10, 15], [3, 6, 9, 12] // Diagonals
    ];

    // Function to check if all elements in an array are the same or all different
    function allSameOrDifferent(arr) {
        const uniqueShapes = new Set(arr);
        return uniqueShapes.size === 1 || (uniqueShapes.size === arr.length && arr.length === 4);
    }

    // Check each winning pattern
    for (let pattern of winningPatterns) {
        const shapes = pattern.map(index => grid[index]);
        // Ensure all cells in the pattern are filled
        if (shapes.every(shape => shape !== '') && allSameOrDifferent(shapes)) {
            return true;
        }
    }

    return false;
}

// Function to reset the game
function resetGame() {
    // Reset game state and UI
    currentPlayer = 1;
    selectedShape = null;
    selectedShapeElement = null;
    selectedCell = null;
    gameOver = false;
    turnCounter = 0;

    document.querySelectorAll('.cell').forEach(cell => {
        cell.className = 'cell';
        cell.innerHTML = '';
        cell.addEventListener('click', placeShape); // Re-enable event listener
    });

    document.querySelectorAll('.staging-cell').forEach(cell => {
        cell.style.visibility = 'visible';
        cell.classList.remove('selected');
    });

    updateInfoWindow(`Welcome to Carsten's Cube!<br>Player 1, please select your first shape.`);
}


// Function to update the information window
function updateInfoWindow(content, shapeElement = null) {
    const infoText = document.getElementById('info-text');
    const gridContainer = document.querySelector("#info-text")
    infoText.innerHTML = ''; // Clear previous content
    gridContainer.style.gridTemplateColumns = "1fr"

    if (shapeElement) {
        shapeElement.style.display = 'inline-block';
        shapeElement.style.verticalAlign = 'middle'; // Align shape vertically centered
        infoText.appendChild(shapeElement);

        gridContainer.style.gridTemplateColumns = "1fr 3fr"
    }

    const textContainer = document.createElement('div');
    textContainer.style.display = 'inline-block';
    textContainer.style.verticalAlign = 'middle'; // Align text vertically centered
    textContainer.innerHTML = content;

    infoText.appendChild(textContainer);
}

// Function to show the rules overlay
function showOverlay() {
    document.getElementById('overlay').style.display = 'flex';
}

// Function to close the rules overlay
function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
    sessionStorage.setItem('overlayClosed', 'true'); // Save the state in session storage
}

// Initialize event listeners on page load
window.onload = initializeListeners;

