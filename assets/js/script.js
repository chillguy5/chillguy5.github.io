// === GAME SETUP ===
const buttonContainer = document.querySelector('.button-container');
const imageSrc = 'assets/img/icon/8.png'; // Icon image path
const bombSrc = 'assets/img/icon/9.png'; // Bomb image path

let bombIndex;
let gameEnded = false;

// Coins setup
let coins = parseInt(localStorage.getItem("coins")) || 1000; // Start met 1000 coins als er nog niks is
updateCoinDisplay();

// Bet amount (inzet)
let currentBet = 0;

// === COINS DISPLAY ===
function updateCoinDisplay() {
    let display = document.querySelector('#coin-display');
    if (!display) {
        display = document.createElement('div');
        display.id = 'coin-display';
        display.style.fontSize = '20px';
        display.style.marginBottom = '10px';
        document.body.prepend(display);
    }
    display.innerText = `Coins: ${coins}`;
}

// === PLACE BET ===
function placeBet(amount) {
    if (gameEnded) return alert("De ronde is al bezig of afgelopen!");
    if (amount > coins) return alert("Je hebt niet genoeg coins!");
    currentBet = amount;
    alert(`Inzet geplaatst: ${currentBet} coins`);
}

// === CREATE BUTTONS ===
function createButtons() {
    bombIndex = Math.floor(Math.random() * 25);

    for (let i = 0; i < 25; i++) {
        const button = document.createElement('div');
        button.classList.add('cell', 'random-button');
        button.dataset.index = i;

        button.addEventListener('click', () => {
            if (gameEnded) return;

            if (i === bombIndex) {
                revealBomb(button);
                gameOver(false); // verloren
            } else {
                revealImage(button);
                checkWin();
            }
        });
        buttonContainer.appendChild(button);
    }
}

// === REVEAL IMAGE/BOMB ===
function revealImage(button) {
    if (!button.classList.contains('clicked')) {
        const image = document.createElement('img');
        image.src = imageSrc;
        button.appendChild(image);
        setTimeout(() => button.classList.add('clicked'), 10);
    }
}

function revealBomb(button) {
    if (!button.classList.contains('clicked')) {
        const image = document.createElement('img');
        image.src = bombSrc;
        button.appendChild(image);
        button.classList.add('clicked');
    }
}

// === GAME OVER ===
function gameOver(won) {
    gameEnded = true;

    // Update coins
    if (won) {
        coins += currentBet * 4; // win 4x inzet
        alert(`Gefeliciteerd! Je hebt ${currentBet * 4} coins gewonnen!`);
    } else {
        coins -= currentBet; // verlies inzet
        alert(`Helaas! Je hebt ${currentBet} coins verloren.`);
    }
    localStorage.setItem("coins", coins);
    updateCoinDisplay();

    // Reset bet
    currentBet = 0;

    // Add restart button
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Restart Game';
    restartButton.classList.add('restart-button');
    restartButton.addEventListener('click', resetGame);
    document.body.appendChild(restartButton);
}

// === CHECK WIN ===
function checkWin() {
    const clickedButtons = document.querySelectorAll('.clicked');
    if (clickedButtons.length === 24) { // 25 cells - 1 bomb
        gameOver(true); // gewonnen
    }
}

// === RESET GAME ===
function resetGame() {
    gameEnded = false;
    buttonContainer.innerHTML = '';
    createButtons();
    const restartButton = document.querySelector('.restart-button');
    if (restartButton) restartButton.remove();
}

// === INIT GAME ===
createButtons();

// === EXAMPLE OF HOW TO PLACE BET ===
// Je kunt dit koppelen aan een input/button in HTML
// Bijvoorbeeld: <button onclick="placeBet(100)">Bet 100 coins</button>
