const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let highscores = [];

app.post("/submit-score", (req, res) => {
  const { username, score } = req.body;

  if (!username || typeof score !== "number") {
    return res.status(400).json({ error: "Ongeldige invoer" });
  }

  const existingPlayer = highscores.find((player) => player.username === username);
  if (existingPlayer) {
    if (score > existingPlayer.score) {
      existingPlayer.score = score;
    }
  } else {
    highscores.push({ username, score });
  }

  highscores.sort((a, b) => b.score - a.score);
  res.json({ message: "Score opgeslagen!" });
});

app.get("/highscores", (req, res) => {
  res.json(highscores);
});

app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
