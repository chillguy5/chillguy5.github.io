kaboom()

// Laad alle beschikbare personages
const characters = [
    { name: "bean", sprite: "/sprites/bean.png" },
    { name: "gijs", sprite: "/sprites/gijsgame.png" },
    { name: "samuel", sprite: "/sprites/samuelgame.png" },
    { name: "arda", sprite: "/sprites/ardagame.png" },
    { name: "chillguy", sprite: "/sprites/chillguygame.png" },
    { name: "mango", sprite: "/sprites/mangogame.webp" },
    { name: "johnpork", sprite: "/sprites/johnporkgame.png" },
    { name: "pessi", sprite: "/sprites/pessigame.png" }
]

// Laad alle sprites
characters.forEach(char => loadSprite(char.name, char.sprite))

loadSound("score", "/examples/sounds/score.mp3")
loadSound("wooosh", "/examples/sounds/wooosh.mp3")
loadSound("hit", "/examples/sounds/hit.mp3")

// Zet standaardpersonage als er geen keuze is opgeslagen
let selectedCharacter = localStorage.getItem("selectedCharacter") || "bean";

// definieer zwaartekracht
setGravity(3200)

scene("characterSelect", () => {
    add([text("Kies een personage"), pos(width() / 2, 50), anchor("center"), scale(2)])

    characters.forEach((char, index) => {
        add([
            sprite(char.name),
            pos(100 + index * 100, height() / 2),
            scale(0.5),
            area(),
            anchor("center"),
            {
                name: char.name
            }
        ]).onClick(() => {
            selectedCharacter = char.name;
            localStorage.setItem("selectedCharacter", selectedCharacter);
            go("game");
        });
    });
});

scene("game", () => {
    const PIPE_OPEN = 240
    const PIPE_MIN = 60
    const JUMP_FORCE = 800
    const SPEED = 320
    const CEILING = -60

    // Voeg speler toe met het geselecteerde personage
    const player = add([
        sprite(selectedCharacter),
        pos(width() / 4, 0),
        area(),
        body(),
    ])

    player.onUpdate(() => {
        if (player.pos.y >= height() || player.pos.y <= CEILING) {
            go("lose", score)
        }
    })

    function jump() {
        player.jump(JUMP_FORCE)
        play("wooosh")
    }

    onKeyPress("space", jump)
    onGamepadButtonPress("south", jump)
    onClick(jump)

    function spawnPipe() {
        const h1 = rand(PIPE_MIN, height() - PIPE_MIN - PIPE_OPEN)
        const h2 = height() - h1 - PIPE_OPEN

        add([
            pos(width(), 0),
            rect(64, h1),
            color(0, 127, 255),
            outline(4),
            area(),
            move(LEFT, SPEED),
            offscreen({ destroy: true }),
            "pipe",
        ])

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
        ])
    }

    player.onCollide("pipe", () => {
        go("lose", score)
        play("hit")
        addKaboom(player.pos)
    })

    onUpdate("pipe", (p) => {
        if (p.pos.x + p.width <= player.pos.x && p.passed === false) {
            addScore()
            p.passed = true
        }
    })

    loop(1, spawnPipe)

    let score = 0
    const scoreLabel = add([
        text(score),
        anchor("center"),
        pos(width() / 2, 80),
        fixed(),
        z(100),
    ])

    function addScore() {
        score++
        scoreLabel.text = score
        play("score")
    }
})

scene("lose", (score) => {
    add([sprite(selectedCharacter), pos(width() / 2, height() / 2 - 108), scale(3), anchor("center")])
    add([text(score), pos(width() / 2, height() / 2 + 108), scale(3), anchor("center")])
    add([text("Druk op SPATIE om opnieuw te beginnen"), pos(width() / 2, height() - 100), scale(1.5), anchor("center")])

    onKeyPress("space", () => go("game"))
    onClick(() => go("game"))
})

go("characterSelect")
