let selectedWord = "", blanks = [], incorrectGuesses = 0, hint = ""; // Global variables

function selectWord() { // Function to fetch a random word and its hint
    function fetchWordWithHint() { // Nested function to fetch a word and its definition from 2 different APIs
        return fetch("https://random-word-api.herokuapp.com/word")
            .then(response => response.json())
            .then(data => {
                const word = data[0].toUpperCase();
                return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
                    .then(response => response.json())
                    .then(dictionaryData => { // Check if definition exists and return it
                        if (dictionaryData[0] && dictionaryData[0].meanings[0] && dictionaryData[0].meanings[0].definitions[0]) {
                            const definition = dictionaryData[0].meanings[0].definitions[0].definition;
                            return { word, definition };
                        } else return { word, definition: null }; // Return null if no definition is available
                    });
            });
    }
    async function getValidWord() { // Nested async function to ensure a valid word with an available hint is fetched
        let result;
        do result = await fetchWordWithHint();
        while (!result.definition); // Continue until a valid definition is found

        selectedWord = result.word; hint = result.definition; // Update global variables with the fetched word and hint
        blanks = Array(selectedWord.length).fill('_'); // Initialize blanks array with underscores
        updateDisplay(); // Update the display after fetching the word and hint
    }
    getValidWord().catch(error => console.error('Error in selectWord:', error));
}

function updateDisplay() {
    document.getElementById('blanks').textContent = blanks.join(' '); // Show blanks for the word
    document.getElementById('hint').textContent = `Hint: ${hint}`; // Show hint
    document.getElementById('incorrectCount').textContent = `${incorrectGuesses}/6`; // Show number of incorrect guesses
    document.getElementById('hangmanImg').src = `images/${incorrectGuesses}.svg`; // Update the hanged man's image
    // Check if the user has won or lost and show appropriate result popup
    if (blanks.join('') === selectedWord) showResultPopup('win');
    else if (incorrectGuesses >= 6) showResultPopup('lose');
}

function guessLetter(letter) {
    if (selectedWord && !blanks.includes(letter)) { // Check if letter is already guessed
        const correctGuess = selectedWord.includes(letter); // Check if the letter is in the word
        if (correctGuess) { // Update blanks array with the correctly guessed letter
            selectedWord.split('').forEach((char, i) => {
                if (char === letter) blanks[i] = letter;
            });
        } else incorrectGuesses++; // Increment incorrect guesses count if the letter is wrong
        updateDisplay(); // Update the display after a guess
    }
}

function createKeyboard() { // Function to create and display the keyboard
    document.getElementById('keyboard').innerHTML = ''; // Clear existing keyboard
    ['A B C D E F G H I J', 'K L M N O P Q R S', 'T U V W X Y Z'].forEach(row => { // Create keyboard rows and buttons
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row'); // Add row styles from CSS stylesheet to the keyboard's rows
        row.split(' ').forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter; // Add letter from the array to the button
            button.addEventListener('click', () => {
                button.disabled = true; // Disable button after click
                button.style.backgroundColor = '#ccc'; // and grey it out
                guessLetter(letter); // Process the guessed letter
            }); rowDiv.appendChild(button); // Append the button to the selected row
        }); document.getElementById('keyboard').appendChild(rowDiv); // Add the selected row to the keyboard
    });
}

function showResultPopup(result) { // Function to show the result popup
    document.getElementById('resultGif').src = `images/${result}.gif`; // Show appropriate result GIF
    document.getElementById('resultText').textContent =
        (result === 'win') ? 'Congratulations! You won!' : `Game Over! The word was "${selectedWord}".`;
    document.getElementById('resultPopup').style.display = "flex"; // Display the result popup
}

document.getElementById('playAgain').addEventListener('click', () => { // Event listener that handles the "Play Again" button
    incorrectGuesses = 0; blanks = []; // Reset incorrect guesses and clear the array of blanks
    selectWord(); createKeyboard(); // Fetch a new word and create a new keyboard
    document.getElementById('resultPopup').style.display = "none"; // Hide result popup
});

document.addEventListener('DOMContentLoaded', () => { // Event listener to start the game when the document is loaded
    selectWord(); createKeyboard(); // Fetch a word and create keyboard at the start of the game
});