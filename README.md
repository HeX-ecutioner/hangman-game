# Hangman Game

A web-based Hangman game built with HTML, CSS, and JavaScript. The game dynamically updates the hangman image as the player makes incorrect guesses and provides hints for the word to help the player.

---

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Demo

![Hangman Game Screenshot](images/hangman.png)

You can run the game locally in your browser to play.

---

## Features

- Interactive hangman game with visual feedback
- Keyboard interface generated dynamically
- Tracks incorrect guesses (0–6)
- Provides hints using dictionary definitions
- Popup for win/lose with option to play again

---

## Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/hangman-game.git
```

2. Navigate to the project folder:

```bash
cd hangman-game
```

3. Open `index.html` in your favorite web browser.

---

## Usage

1. Start the game by opening `index.html`.
2. Use the on-screen keyboard or your physical keyboard to guess letters.
3. Incorrect guesses update the hangman image and counter.
4. Game ends when you either guess the word correctly or reach 6 incorrect guesses.
5. Click "Play Again" to restart the game.

---

## Project Structure

```
hangman-game/
│
├── images/          # Game images and icons
│   ├── 0.svg
│   ├── 1.svg
│   └── hangman.png
│
├── styles.css       # CSS styling for the game
├── script.js        # JavaScript logic for the game
└── index.html       # Main HTML file
```

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Optional: Dictionary API for hints

---

## Contributing

Contributions are welcome!  
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.