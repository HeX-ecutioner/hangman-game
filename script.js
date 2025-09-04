let selectedWord = "", blanks = [], incorrectGuesses = 0, hint = "", nextWordData = null; // Global variables

function selectWord() {
    const NUM_CANDIDATES = 12;

    const hasDefinition = (d) =>
        d && d[0] && d[0].meanings && d[0].meanings[0] &&
        d[0].meanings[0].definitions && d[0].meanings[0].definitions[0] &&
        d[0].meanings[0].definitions[0].definition;

    const fetchCandidates = () =>
        fetch(`https://random-word-api.herokuapp.com/word?number=${NUM_CANDIDATES}`)
            .then(r => r.json())
            .then(arr => arr.map(w => w.toUpperCase()));

    const fetchDef = (word) =>
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(d => {
                if (!hasDefinition(d)) throw new Error('no-definition');
                return { word, definition: d[0].meanings[0].definitions[0].definition };
            });

    async function getWordAndHint() {
        try {
            const words = await fetchCandidates(), lookups = words.map(w => fetchDef(w));
            const { word, definition } = await Promise.any(lookups); // Pick the first word that returns a valid definition
            selectedWord = word;
            hint = definition;
            blanks = Array(selectedWord.length).fill('_'); // update ONLY after both are ready
            updateDisplay();
        } catch (e) {
            getWordAndHint(); // All candidates failed — try again
        }
    }
    getWordAndHint().catch(err => console.error('Error in selectWord:', err));
}

function updateDisplay() {
    document.getElementById('blanks').textContent = blanks.join(' ');
    document.getElementById('hint').textContent = `Hint: ${hint}`;
    document.getElementById('incorrectCount').textContent = `${incorrectGuesses}/6`;
    document.getElementById('hangmanImg').src = `images/${incorrectGuesses}.svg`;

    if (blanks.join('') === selectedWord) showResultPopup('win');
    else if (incorrectGuesses >= 6) showResultPopup('lose');
}

function guessLetter(letter) {
    if (selectedWord && !blanks.includes(letter)) {
        const correctGuess = selectedWord.includes(letter);
        if (correctGuess) {
            selectedWord.split('').forEach((char, i) => {
                if (char === letter) blanks[i] = letter;
            });
        } else incorrectGuesses++;
        updateDisplay();
    }
}

function createKeyboard() {
    document.getElementById('keyboard').innerHTML = '';
    ['A B C D E F G H I J', 'K L M N O P Q R S', 'T U V W X Y Z'].forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');
        row.split(' ').forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.addEventListener('click', () => {
                button.disabled = true;
                button.style.backgroundColor = '#ccc';
                guessLetter(letter);
            });
            rowDiv.appendChild(button);
        });
        document.getElementById('keyboard').appendChild(rowDiv);
    });
}

function showResultPopup(result) {
    document.getElementById('resultGif').src = `images/${result}.gif`;
    document.getElementById('resultText').textContent =
        (result === 'win') ? 'Congratulations! You won!' : `Game Over! The word was "${selectedWord}".`;
    document.getElementById('resultPopup').style.display = "flex";
}

document.getElementById('playAgain').addEventListener('click', () => {
    incorrectGuesses = 0;
    blanks = [];
    selectWord();
    createKeyboard();
    document.getElementById('resultPopup').style.display = "none";
});
document.addEventListener('DOMContentLoaded', () => {
    selectWord();
    createKeyboard();
});

const darkModeSwitch = document.getElementById('darkModeSwitch'), sliderIcon = darkModeSwitch.querySelector('.icon');
function setDarkMode(enabled, remember = true) {
    if (enabled) {
        document.body.classList.add('dark');
        sliderIcon.textContent = "☀️";
        darkModeSwitch.title = "Switch to Light Mode";
        if (remember) localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark');
        sliderIcon.textContent = "🌙";
        darkModeSwitch.title = "Switch to Dark Mode";
        if (remember) localStorage.setItem('darkMode', 'disabled');
    }
}

const savedPreference = localStorage.getItem('darkMode');
if (savedPreference) setDarkMode(savedPreference === 'enabled', false);
else { // No saved preference → follow system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark, false);
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('darkMode')) {
        setDarkMode(e.matches, false);
    }
});

darkModeSwitch.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    setDarkMode(isDark);
});