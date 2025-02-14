// Functie om de username in te stellen
function setUsername() {
    let username = document.getElementById('username').value.trim();

    if (username !== '') {
        // Zet de username in localStorage
        localStorage.setItem('username', username);

        // Verwijder de username invoer sectie en toon de highscore lijst
        document.querySelector('.username-form').style.display = 'none';

        // Voeg de highscore toe aan de lijst van scores
        displayHighScores();
    } else {
        alert('Voer een geldige username in.');
    }
}

// Functie om de highscorelijst te tonen
function displayHighScores() {
    // Verkrijg de highscore uit localStorage
    let highscore = localStorage.getItem('highscore');
    let username = localStorage.getItem('username');

    // Dit zou in een echte situatie van een server of database moeten komen
    let scores = [
        { username: 'Speler1', highscore: 150 },
        { username: 'Speler2', highscore: 200 },
        { username: 'Speler3', highscore: 180 }
    ];

    // Voeg de score van de huidige gebruiker toe
    if (username && highscore) {
        scores.push({ username: username, highscore: parseInt(highscore) });
    }

    // Sorteer de scores van hoog naar laag
    scores.sort((a, b) => b.highscore - a.highscore);

    // Vul de lijst van high scores in
    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = '';

    scores.forEach(score => {
        let li = document.createElement('li');
        li.textContent = `${score.username}: ${score.highscore}`;
        scoreList.appendChild(li);
    });
}

// Controleer of er al een username is opgeslagen
if (localStorage.getItem('username')) {
    document.querySelector('.username-form').style.display = 'none';
    displayHighScores();
}
