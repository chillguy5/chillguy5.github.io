kaboom();

// Laad het gekozen personage uit localStorage, of gebruik "bean" als standaard
let selectedCharacter = localStorage.getItem("selectedCharacter") || "bean";

// Definieer alle beschikbare personages en hun sprites
const characters = {
    "bean": "bean.png",
    "gijs": "gijsgame.png",
    "samuel": "samuelgame.png",
    "arda": "ardagame.png",
    "chillguy": "chillguygame.png",
    "mango": "mangogame.webp",
    "johnpork": "johnporkgame.png",
    "pessi": "pessigame.png"
};

// Controleer of het geselecteerde personage bestaat, anders gebruik "bean"
if (!characters[selectedCharacter]) {
    console.warn(`Waarschuwing: ${selectedCharacter} niet gevonden, terug naar 'bean'.`);
    selectedCharacter = "bean";
}

// Laad alle sprites voordat het spel start
for (const [key, path] of Object.entries(characters)) {
    loadSprite(key, path);
}

// Geluiden laden
loadSound("score", "/examples/sounds/score.mp3");
loadSound("wooosh", "/examples/sounds/wooosh.mp3");
loadSound("hit", "/examples/sounds/hit.mp3");

setGravity(3200);

scene("game", () => {
    const PIPE_OPEN = 240;
    const PIPE_MIN = 60;
    const JUMP_FORCE = 800;
    const SPEED = 320;
    const CEILING = -60;

    // Voeg speler toe met het gekozen personage
    const bean = add([
        sprite(selectedCharacter), // Gebruik het geselecteerde personage
        pos(width() / 4, 0),
        area(),
        body(),
    ]);

    bean.onUpdate(() => {
        if (bean.pos.y >= height() || bean.pos.y <= CEILING) {
            go("lose", score);
        }
    });

    function jump() {
        bean.jump(JUMP_FORCE);
        play("wooosh");
    }

    onKeyPress("space", jump);
    onGamepadButtonPress("south", jump);
    onClick(jump);

    function spawnPipe() {
        const h1 = rand(PIPE_MIN, height() - PIPE_MIN - PIPE_OPEN);
        const h2 = height() - h1 - PIPE_OPEN;

        add([
            pos(width(), 0),
            rect(64, h1),
            color(0, 127, 255),
            outline(4),
            area(),
            move(LEFT, SPEED),
            offscreen({ destroy: true }),
            "pipe",
        ]);

        add([
            pos(width(), h1 + PIPE_OPEN),
            rect(64, h2),
            color(0, 127, 255),
            outline(4),
            area(),
            move(LEFT, SPEED),
            offscreen({ destroy: true }),
            "pipe",
            { passed: false },
        ]);
    }

    bean.onCollide("pipe", () => {
        go("lose", score);
        play("hit");
        addKaboom(bean.pos);
    });

    onUpdate("pipe", (p) => {
        if (p.pos.x + p.width <= bean.pos.x && p.passed === false) {
            addScore();
            p.passed = true;
        }
    });

    loop(1, spawnPipe);

    let score = 0;
    const scoreLabel = add([
        text(score),
        anchor("center"),
        pos(width() / 2, 80),
        fixed(),
        z(100),
    ]);

    function addScore() {
        score++;
        scoreLabel.text = score;
        play("score");
    }
});

scene("lose", (score) => {
    add([
        sprite(selectedCharacter), // Gebruik het gekozen personage
        pos(width() / 2, height() / 2 - 108),
        scale(3),
        anchor("center"),
    ]);

    add([
        text(score),
        pos(width() / 2, height() / 2 + 108),
        scale(3),
        anchor("center"),
    ]);

    add([
        text("Druk op SPATIE om opnieuw te beginnen"),
        pos(width() / 2, height() - 100),
        scale(1.5),
        anchor("center"),
    ]);

    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));
});

go("game");
