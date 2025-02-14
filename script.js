const API_URL = "http://localhost:5000";


localStorage.setItem("highscore", highscore);
submitScore(highscore); // Stuur de highscore naar de server
let username = localStorage.getItem("username");

document.addEventListener("DOMContentLoaded", () => {
    if (username) {
        document.getElementById("usernameInput").style.display = "none";
        document.getElementById("welcomeMessage").innerText = `Welkom, ${username}!`;
        document.getElementById("welcomeMessage").style.display = "block";
    }
    fetchHighscores();
});

function submitUsername() {
    const input = document.getElementById("username").value.trim();
    if (input) {
        localStorage.setItem("username", input);
        username = input;
        document.getElementById("usernameInput").style.display = "none";
        document.getElementById("welcomeMessage").innerText = `Welkom, ${username}!`;
        document.getElementById("welcomeMessage").style.display = "block";
        submitScore(0);  // Stuur een initiële score van 0
    }
}

async function submitScore(score) {
    if (!username) return;
    
    try {
        await fetch(`${API_URL}/submit-score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, score }),
        });
        fetchHighscores();
    } catch (error) {
        console.error("Fout bij het opslaan van de score:", error);
    }
}

async function fetchHighscores() {
    try {
        const response = await fetch(`${API_URL}/highscores`);
        const highscores = await response.json();
        const highscoreDiv = document.getElementById("highscores");
        highscoreDiv.innerHTML = ""; // Leeg de lijst

        highscores.forEach(player => {
            const div = document.createElement("div");
            div.className = "score-item";
            div.innerHTML = `<span>${player.username}</span> <span><strong>${player.score}</strong></span>`;
            highscoreDiv.appendChild(div);
        });
    } catch (error) {
        console.error("Fout bij het ophalen van highscores:", error);
    }
}

