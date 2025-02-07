kaboom({
    background: [135, 62, 132],
});

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480; 

let selectedCharacter = localStorage.getItem("selectedCharacter") || "character1"; // Standaard "character1"

// Laad het geselecteerde personage als sprite
loadSprite(selectedCharacter, `images/${selectedCharacter}.png`);

scene("game", () => {
    setBackground(141, 183, 255);
    setGravity(2400);

    const player = add([
        sprite(selectedCharacter),
        pos(80, 40),
        scale(0.1),
        area(),
        body(),
    ]);

    // Toevoegen van obstakels (bomen)
    function spawnTree() {
        add([
            rect(48, rand(32, 96)), // Bomen kleiner maken
            area(),
            outline(4),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            color(238, 143, 203),
            move(LEFT, SPEED),
            offscreen({ destroy: true }),
            "tree",
            { passed: false },
        ]);
        wait(rand(0.5, 1.5), spawnTree);
    }

    spawnTree();

    // Score en spel logica
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

    // Jump-functie
    function jump() {
        if (player.isGrounded && player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }

    onKeyPress("space", jump);
    onClick(jump);

    player.onCollide("tree", () => {
        loadSound("gameover", "Voicy_bomboclart.mp3");
        play("gameover");
        let coins = parseInt(localStorage.getItem("coins")) || 0;
        coins += score; // Voeg score toe aan munten
        localStorage.setItem("coins", coins); // Sla de munten op
        go("lose", score);
        addKaboom(player.pos);
    });
});

scene("lose", (score) => {
    add([sprite(selectedCharacter), pos(width() / 2, height() / 2 - 128), scale(0.5), anchor("center")]);
    add([text("Score: " + score), pos(width() / 2, height() / 2), scale(2), anchor("center")]);
    add([text("Total Coins: " + (parseInt(localStorage.getItem("coins")) || 0)), pos(width() / 2, height() / 2 + 64), scale(2), anchor("center")]);

    addButton("Restart", vec2(width() / 2, height() / 2 + 128), () => go("game"));
    addButton("Main Menu", vec2(width() / 2, height() / 2 + 200), () => window.location.href = "index.html"); // Terug naar index.html
});

go("game");
