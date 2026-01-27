// Selecting the button container element
const buttonContainer = document.querySelector('.button-container');

// Define paths for images and videos
const imageSrc = 'assets/img/icon/8.png'; // Icon image path
const bombSrc = 'assets/img/icon/9.png'; // Bomb image path

// Variables to track the bomb index and game state
let bombIndex;
let gameEnded = false;

// ===== BETTING SYSTEM =====
let coins = parseInt(localStorage.getItem('coins')) || 1000;
let currentBet = 0;
let gameActive = false;

const coinsEl = document.querySelector('.coins');      // <span class="coins"></span>
const betEl = document.querySelector('.current-bet'); // <span class="current-bet"></span>
const betInput = document.querySelector('#betAmount'); // <input id="betAmount">
const betBtn = document.querySelector('#placeBet');    // <button id="placeBet">

function updateUI() {
    coinsEl.textContent = coins;
    betEl.textContent = currentBet;
    localStorage.setItem('coins', coins);
}

betBtn.addEventListener('click', () => {
    const amount = parseInt(betInput.value);

    if (gameActive) return alert('Game already started');
    if (!amount || amount <= 0) return alert('Invalid bet');
    if (amount > coins) return alert('Not enough coins');

    currentBet = amount;
    coins -= amount;
    gameActive = true;
    updateUI();
});

button.addEventListener('click', () => {
    if (!gameActive || gameEnded) return;

    if (i === bombIndex) {
        revealBomb(button);
        loseGame();
    } else {
        revealImage(button);
        checkWin();
    }
});

    // Loop to create buttons
    for (let i = 0; i < 25; i++) {
        const button = document.createElement('div');
        button.classList.add('cell');
        button.classList.add('random-button'); // Apply random-button class
        button.dataset.index = i; // Set data-index attribute
        button.addEventListener('click', () => {
            if (gameEnded) return; // Prevent further clicks after game ends
            if (i === bombIndex) {
                revealBomb(button);
                gameOver();
            } else {
                revealImage(button);
                checkWin();
            }
        });
        buttonContainer.appendChild(button);
    }

// Function to reveal image on button click
function revealImage(button) {
    if (!button.classList.contains('clicked')) {
        const image = document.createElement('img');
        image.src = imageSrc;
        button.appendChild(image);
        setTimeout(() => { // Delay adding 'clicked' class to allow image insertion
            button.classList.add('clicked'); // Add the 'clicked' class to the button
        }, 10); // Adjust the delay as needed
    }
}

// Function to reveal bomb on button click
function revealBomb(button) {
    if (!button.classList.contains('clicked')) {
        const image = document.createElement('img');
        image.src = bombSrc;
        button.appendChild(image);
        button.classList.add('clicked');
    }
}

function loseGame() {
    gameEnded = true;
    gameActive = false;
    currentBet = 0;
    updateUI();

    const video = document.createElement('video');
    video.src = loseVideoSrc;
    video.autoplay = true;
    video.loop = true;
    video.classList.add('video-background');
    document.body.appendChild(video);

    createRestart(video);
}

function createRestart(video) {
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Restart Game';
    restartButton.classList.add('restart-button');

    restartButton.addEventListener('click', () => {
        resetGame();
        document.body.removeChild(video);
        restartButton.remove();
    });

    document.body.appendChild(restartButton);
}

function resetGame() {
    gameEnded = false;
    gameActive = false;
    currentBet = 0;
    buttonContainer.innerHTML = '';
    createButtons();
    updateUI();
}

function checkWin() {
    const clickedButtons = document.querySelectorAll('.clicked');

    if (clickedButtons.length === 24) {
        gameEnded = true;
        gameActive = false;

        const winAmount = currentBet * 2;
        coins += winAmount;
        currentBet = 0;
        updateUI();

        const video = document.createElement('video');
        video.src = winVideoSrc;
        video.autoplay = true;
        video.loop = true;
        video.classList.add('video-background');
        document.body.appendChild(video);

        createRestart(video);
    }
}

// Initialize the game
createButtons();
