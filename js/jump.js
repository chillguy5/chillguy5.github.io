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
});

let selectedCharacter = localStorage.getItem("selectedCharacter") || "images/characters/timgame.png";
loadSprite("player", selectedCharacter);
loadSprite("background", "images/overig/school.jpg"); // Laad de achtergrondafbeelding

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
        { name: "images/characters/timgame.png", x: 80, y: 40, scale: 0.5 },
        { name: "images/characters/gijsgame.png", x: 80, y: 40, scale: 0.5 },
        { name: "images/characters/samuelgame.png", x: 80, y: 40, scale: 0.5 },
        { name: "images/characters/ardagame.png", x: 80, y: 40, scale: 0.5 },
        { name: "images/characters/amirgame.png", x: 80, y: 40, scale: 0.65 },
        { name: "images/characters/bashargame.png", x: 80, y: 40, scale: 0.5 },
        { name: "images/characters/69game.png", x: 80, y: 40, scale: 0.55 },
        { name: "images/characters/chillguygame1.png", x: 80, y: 40, scale: 0.25 },
        { name: "images/characters/mangogame1.webp", x: 80, y: 40, scale: 0.1 },
        { name: "images/characters/johnporkgame1.png", x: 80, y: 40, scale: 0.15 },
        { name: "images/characters/pessigame1.png", x: 80, y: 40, scale: 0.20 },
        { name: "images/characters/goldgame.png", x: 80, y: 40, scale: 0.2 },
        { name: "images/italian/bever-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/boneca-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/brr_brr-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/cappacuno-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/chimpanzini-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/frulli-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/koe-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/krokodil-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/liri_lara-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/tralaleo-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/trippi-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/trulimero-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/tung_tung_tung-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/un_din_din_dun-removebg-preview.png", x: 80, y: 40, scale: 0.3 },
        { name: "images/italian/Working_on_it-removebg-preview.png", x: 80, y: 40, scale: 0.3 }
    ];
    
// Verkrijg de naam van het geselecteerde karakter uit localStorage
let selectedCharacterName = localStorage.getItem("selectedCharacter") || "images/characters/timgame.png";

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
        outline(2),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(47, 133, 176),
    ]);

function jump() {
    if (player.isGrounded()) {
        player.jump(JUMP_FORCE);
        canDoubleJump = 2; // Hiermee kunnen we nog twee keer springen
    } else if (canDoubleJump > 0) {
        player.jump(JUMP_FORCE * (canDoubleJump === 2 ? 0.8 : 0.7)); 
        canDoubleJump--;
    }
}

    onKeyPress("space", jump);
    onClick(jump);

    loadSprite("tree", "images/overig/lennon.png"); // Zorg ervoor dat "boom.png" in je project staat

    function spawnTree() {
        add([
            sprite("tree"), // Gebruik de geladen sprite
            area(), 
            pos(width(), height() - FLOOR_HEIGHT), 
            anchor("botleft"),
            scale(0.25), // Pas de grootte aan zodat de boom goed past
            move(LEFT, SPEED),
            offscreen({ destroy: true }),
            "tree",
            { passed: false },
        ]);

        wait(rand(0.65, 1.25), spawnTree);
    }

    spawnTree();

    let score = 0;
    const scoreLabel = add([text("Score: " + score), pos(1332, 24)]);

    onUpdate(() => {
        get("tree").forEach((tree) => {
            if (!tree.passed && player.pos.x > tree.pos.x + tree.width / 2) { 
                tree.passed = true;
                score++;
                scoreLabel.text = "Score: " + score;
            }
        });
    });

    player.onCollide("tree", () => {
        loadSound("gameover", "sound/Voicy_bomboclart.mp3");
        play("gameover");
    
        let earnedCoins = score * 10; // Score x 10 voor coins
        coins += earnedCoins; // Voeg de verdiende coins toe
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
    let earnedCoins = score * 10; // Bereken de verdiende coins opnieuw
    add([text("Score: " + score, { size: 30 }), pos(width() / 2, height() / 2 - 250), scale(2), anchor("center")]);
    add([text("Highscore: " + highscore, { size: 20 }), pos(width() / 2, height() / 2), scale(2), anchor("center")]);
    add([text("Coins Earned: " + earnedCoins, { size: 20 }), pos(width() / 2, height() / 2 + 50), scale(2), anchor("center")]);
    add([text("Total Coins: " + coins, { size: 20 }), pos(width() / 2, height() / 2 + 100), scale(2), anchor("center")]);

    addButton("Restart", vec2(width() / 2, height() / 2 + 200), () => go("game"));
});

scene("mainMenu", () => {
    add([text("Welcome to Chill Guy Jumper."), pos(width() / 2, height() / 4), anchor("center"), scale(2), color(248, 248, 215)]);
    add([text("Highscore: " + highscore), pos(width() / 2, height() / 2 - 95), scale(2), anchor("center"), color(248, 248, 215)]);
    add([text("Tripple jump is enabled."), pos(width() / 2, height() / 2 + 200), anchor("center"), scale(1), color(248, 248, 215)]);
    addButton("Start Game", vec2(width() / 2, height() / 2), () => go("game"));
});

go("mainMenu");
