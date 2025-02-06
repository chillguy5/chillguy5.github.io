const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

// Initialize Kaboom with a background color
kaboom({
    background: [135, 62, 132]
});

// Function to create a button
function addButton(txt, p, f) {
    const btn = add([
        rect(240, 80, { radius: 8 }),
        pos(p),
        area(),
        scale(1),
        anchor("center"),
        outline(4),
    ]);

    btn.add([
        text(txt),
        anchor("center"),
        color(0, 0, 0),
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

// Start scene
scene("start", () => {
    add([text("Jump Game"), pos(width() / 2, height() / 4), anchor("center"), scale(2)]);
    addButton("Start Game", vec2(width() / 2, height() / 2), () => go("game"));
});

// Game scene
scene("game", () => {
    setBackground(141, 183, 255);
    setGravity(2400);

// load assets
loadSprite("bean", "chill_guy_png_transparent_by_unsermanemamamamaam_dir0jnr-fullview.png")

    const player = add([
        sprite("bean"),
        pos(80, 40),
        scale(0.1),
        area(),
        body(),
    ]);

    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(132, 101, 236),
    ]);

    function jump() {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }

    onKeyPress("space", jump);
    onClick(jump);

    function spawnTree() {
        add([
            rect(48, rand(32, 96)),
            area(),
            outline(4),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            color(238, 143, 203),
            move(LEFT, SPEED),
            offscreen({ destroy: true }),
            "tree",
        ]);
        wait(rand(0.5, 1.5), spawnTree);
    }

    spawnTree();

    let score = 0;
    const scoreLabel = add([text(score), pos(24, 24)]);

    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });

    player.onCollide("tree", () => {
		loadSound("gameover", "Voicy_bomboclart.mp3");
        go("lose", score);
        burp();
        addKaboom(player.pos);
    });
});

scene("lose", (score) => {
    add([sprite("bean"), pos(width() / 2, height() / 2 - 64), scale(0.5), anchor("center")]);
    add([text(score), pos(width() / 2, height() / 2 + 64), scale(2), anchor("center")]);
    addButton("Restart", vec2(width() / 2, height() / 2 + 128), () => go("game"));
});

// Start at the start screen
go("start");