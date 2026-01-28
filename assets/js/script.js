// ================= ELEMENTS =================
const buttonContainer = document.querySelector('.button-container');

const imageSrc = 'assets/img/icon/8.png';
const bombSrc = 'assets/img/icon/9.png';

// ================= GAME STATE =================
let bombIndex;
let gameEnded = false;

// ================= BETTING SYSTEM =================
let coins = parseInt(localStorage.getItem('coins')) || 1000;
let currentBet = 0;
let gameActive = false;

const coinsEl = document.querySelector('.coins');
const betEl = document.querySelector('.current-bet');
const betInput = document.querySelector('#betAmount');
const betBtn = document.querySelector('#placeBet');

// ================= UI UPDATE =================
function updateUI() {
    if (coinsEl) coinsEl.textContent = coins;
    if (betEl) betEl.textContent = currentBet;
    localStorage.setItem('coins', coins);
}
updateUI();

// ================= PLACE BET =================
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

// ================= CREATE BUTTONS =================
function createButtons() {
    buttonContainer.innerHTML = '';
    bombIndex = Math.floor(Math.random() * 25);
    gameEnded = false;

    for (let i = 0; i < 25; i++) {
        const button = document.createElement('div');
        button.classList.add('cell', 'random-button');
        button.dataset.index = i;

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

        buttonContainer.appendChild(button);
    }
}

// ================= REVEAL SAFE =================
function revealImage(button) {
    if (button.classList.contains('clicked')) return;

    const image = document.createElement('img');
    image.src = imageSrc;
    button.appendChild(image);

    setTimeout(() => {
        button.classList.add('clicked');
    }, 10);
}

// ================= REVEAL BOMB =================
function revealBomb(button) {
    if (button.classList.contains('clicked')) return;

    const image = document.createElement('img');
    image.src = bombSrc;
    button.appendChild(image);
    button.classList.add('clicked');
}

// ================= LOSE GAME =================
function loseGame() {
    gameEnded = true;
    gameActive = false;
    currentBet = 0;
    updateUI();

    if (typeof loseVideoSrc !== 'undefined') {
        const video = document.createElement('video');
        video.src = loseVideoSrc;
        video.autoplay = true;
        video.loop = true;
        video.classList.add('video-background');
        document.body.appendChild(video);
        createRestart(video);
    } else {
        alert('💣 You lost');
    }
}

// ================= WIN CHECK =================
function checkWin() {
    const clickedButtons = document.querySelectorAll('.cell.clicked').length;

    if (clickedButtons === 24) {
        gameEnded = true;
        gameActive = false;

        const winAmount = currentBet * 2;
        coins += winAmount;
        currentBet = 0;
        updateUI();

        if (typeof winVideoSrc !== 'undefined') {
            const video = document.createElement('video');
            video.src = winVideoSrc;
            video.autoplay = true;
            video.loop = true;
            video.classList.add('video-background');
            document.body.appendChild(video);
            createRestart(video);
        } else {
            alert(`🎉 You won ${winAmount} coins`);
        }
    }
}

// ================= RESTART BUTTON =================
function createRestart(video) {
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Restart Game';
    restartButton.classList.add('restart-button');

    restartButton.addEventListener('click', () => {
        resetGame();
        if (video) video.remove();
        restartButton.remove();
    });

    document.body.appendChild(restartButton);
}

// ================= RESET GAME =================
function resetGame() {
    gameEnded = false;
    gameActive = false;
    currentBet = 0;
    buttonContainer.innerHTML = '';
    createButtons();
    updateUI();
}

// ================= INIT =================
createButtons();