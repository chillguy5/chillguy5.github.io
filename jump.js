const FLOOR_HEIGHT = 50; // Definieer de FLOOR_HEIGHT constante
const JUMP_FORCE = 1000;
const SPEED = 1000; // Definieer de snelheid van de bomen
let canDoubleJump = false; // Variabele om bij te houden of een dubbeljump mogelijk is

kaboom({
    background: [74, 16, 21],
});

function addButton(txt, p, f) {
    const btn = add([
        rect(240, 80, { radius: 8 }),
        pos(p),
        area(),
        scale(1),
        anchor("center"),
        outline(4),
        color(240, 170, 94)
    ]);

    btn.add([
        text(txt),
        anchor("center"),
        color(144, 13, 39),
    ]);

    btn.onHoverUpdate(() => {
        btn.scale = vec2(1.2);
        setCursor("pointer");
    });

    btn.onHoverEnd(() => {
        btn.scale = vec2(1);
    });

    btn.onClick(f);
    return btn;
}

let coins = parseInt(localStorage.getItem("coins")) || 0;
let highscore = parseInt(localStorage.getItem("highscore")) || 0;

scene("start", () => {
    add([text("Jump Game"), pos(width() / 2, height() / 4), anchor("center"), scale(2)]);
    addButton("Start Game", vec2(width() / 2, height() / 2), () => go("game"));
    addButton("Main Menu", vec2(width() / 2, height() / 2 + 100), () => go("mainMenu"));
});

let selectedCharacter = localStorage.getItem("selectedCharacter") || "timgame.png";
loadSprite("player", selectedCharacter);
loadSprite("background", "empty-school-corridor-interior-with-row-of-lockers-closed-door-to-classroom-horizontal-banner-cartoon-college-campus-hall-or-university-lobby-illustration-in-a-flat-style-vector.jpg"); // Laad de achtergrondafbeelding

scene("game", () => {
    setGravity(2400);

    // Voeg de achtergrond toe als een sprite
    const bg1 = add([
        sprite("background"),
        pos(0, 0),
        scale(width() / 266.67, height() / 200), // Pas aan op je canvas grootte
    ]);

    const bg2 = add([
        sprite("background"),
        pos(width(), 0),
        scale(width() / 266.67, height() / 200),
    ]);

    const bgSpeed = 2;

    onUpdate(() => {
        bg1.pos.x -= bgSpeed;
        bg2.pos.x -= bgSpeed;

        if (bg1.pos.x <= -width()) {
            bg1.pos.x = width();
        }
        if (bg2.pos.x <= -width()) {
            bg2.pos.x = width();
        }
    });

    const players = [
        { name: "timgame.png", x: 80, y: 40, scale: 0.5 },
        { name: "gijsgame.png", x: 80, y: 40, scale: 0.5 },
        { name: "samuelgame.png", x: 80, y: 40, scale: 0.5 },
        { name: "ardagame.png", x: 80, y: 40, scale: 0.5 },
        { name: "chillguygame.png", x: 80, y: 40, scale: 0.25 },
        { name: "mangogame.webp", x: 80, y: 40, scale: 0.1 },
        { name: "johnporkgame.png", x: 80, y: 40, scale: 0.15 },
        { name: "pessigame.png", x: 80, y: 40, scale: 0.20 }
    ];
    
// Verkrijg de naam van het geselecteerde karakter uit localStorage
let selectedCharacterName = localStorage.getItem("selectedCharacter") || "timgame.png";

// Zoek het bijbehorende karakter in de players array
let playerData = players.find(p => p.name === selectedCharacterName);

// Laad de sprite en gebruik de bijbehorende schaal
loadSprite("player", selectedCharacterName);

// Nu kunnen we de speler toevoegen met de juiste schaal
const player = add([
    sprite("player"),
    pos(playerData.x, playerData.y),
    scale(playerData.scale),
    area(),
    body(),
]);

    add([
        rect(width(), FLOOR_HEIGHT),
        outline(0),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(47, 133, 176),
    ]);

    function jump() {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
            canDoubleJump = true;
        } else if (canDoubleJump) {
            player.jump(JUMP_FORCE * 0.8);
            canDoubleJump = false;
        }
    }

    onKeyPress("space", jump);
    onClick(jump);

    loadSprite("tree", "pngtree-handdrawing-school-backpack-png-image_6136819.png"); // Zorg ervoor dat "boom.png" in je project staat

    function spawnTree() {
        add([
            sprite("tree"), // Gebruik de geladen sprite
            area(),
            pos(width(), height() - FLOOR_HEIGHT), 
            anchor("botleft"),
            scale(0.3), // Pas de grootte aan zodat de boom goed past
            move(LEFT, SPEED),
            offscreen({ destroy: true }),
            "tree",
            { passed: false },
        ]);
        wait(rand(0.45, 1.5), spawnTree);
    }

    spawnTree();

    let score = 0;
    const scoreLabel = add([text("Score: " + score), pos(24, 24)]);

    onUpdate(() => {
        get("tree").forEach((tree) => {
            if (player.pos.x > tree.pos.x + tree.width && !tree.passed) {
                tree.passed = true;
                score++;
                scoreLabel.text = "Score: " + score;
            }
        });
    });

    player.onCollide("tree", () => {
        loadSound("gameover", "Voicy_bomboclart.mp3");
        play("gameover");
        coins += score;
        localStorage.setItem("coins", coins);

        if (score > highscore) {
            highscore = score;
            localStorage.setItem("highscore", highscore);
        }

        go("lose", score);
        addKaboom(player.pos);
    });
});

scene("lose", (score) => {
    add([sprite("player"), pos(width() / 2, height() / 2 - 128), scale(0.3), anchor("center")]);
    add([text("Score: " + score), pos(width() / 2, height() / 2 - 250), scale(2), anchor("center")]);
    add([text("Highscore: " + highscore), pos(width() / 2, height() / 2), scale(2), anchor("center")]);
    add([text("Total Coins: " + coins), pos(width() / 2, height() / 2 + 100), scale(2), anchor("center")]);

    addButton("Restart", vec2(width() / 2, height() / 2 + 200), () => go("game"));
    addButton("Main Menu", vec2(width() / 2, height() / 2 + 300), () => {
        window.location.href = "index.html";
    });
});

scene("mainMenu", () => {
    add([text("Welcome to Chill Guy Jumper."), pos(width() / 2, height() / 4), anchor("center"), scale(2), color(248, 248, 215)]);
    add([text("Highscore: " + highscore), pos(width() / 2, height() / 2 - 95), scale(2), anchor("center"), color(248, 248, 215)]);
    addButton("Start Game", vec2(width() / 2, height() / 2), () => go("game"));
    addButton("Main Menu", vec2(width() / 2, height() / 2 + 100), () => {
        window.location.href = "index.html";
    });
});

go("mainMenu");