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
let highscores = localStorage.getItem("highscores") ? parseFloat(localStorage.getItem("highscores")) : Infinity;

scene("start", () => {
    add([text("Jump Game"), pos(width() / 2, height() / 4), anchor("center"), scale(2)]);
    addButton("Start Game", vec2(width() / 2, height() / 2), () => go("battle"));
    addButton("Main Menu", vec2(width() / 2, height() / 2 + 100), () => go("mainMenu"));
});

const objs = {
	"Samuel": "images/characters/samuelgame.png",
	"Arda": "images/characters/ardagame.png",
	"Gijs": "images/characters/gijsgame.png",
	"Tim": "images/characters/timgame.png",
}

const scales = {
    "Samuel": 0.45,
    "Arda": 0.45,
    "Gijs": 0.45,
    "Tim": 0.45,
};

for (const [key, file] of Object.entries(objs)) {
	loadSprite(key, file)
}

let selectedCharacter = localStorage.getItem("selectedCharacter") || "images/characters/timgame.png";
loadSprite("player", selectedCharacter);
loadSound("hit", "sound/hit.mp3")
loadSound("shoot", "sound/shot.mp3")
loadSound("explode", "sound/Voicy_bomboclart.mp3")
loadSound("OtherworldlyFoe", "sound/kaboomguardian.mp3")
loadSound("explode2", "sound/retroexp.mp3")

scene("battle", () => {

	const BULLET_SPEED = 1200
	const TRASH_SPEED = 120
	const BOSS_SPEED = 100
	const PLAYER_SPEED = 500
	const STAR_SPEED = 120
	const BOSS_HEALTH = 850
	const OBJ_HEALTH = 4

    const bossName = choose(Object.keys(objs))

	let insaneMode = false



	const music = play("OtherworldlyFoe", { volume: 1, loop: true })

    function grow(rate) {
		return {
			update() {
				const n = rate * dt()
				this.scale.x += n
				this.scale.y += n
			},
		}
	}

	function late(t) {
		let timer = 0
		return {
			add() {
				this.hidden = true
			},
			update() {
				timer += dt()
				if (timer >= t) {
					this.hidden = false
				}
			},
		}
	}

    add([
		text("KILL", { size: 160 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(1),
		fixed(),
	])

	add([
		text("THE", { size: 80 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(2),
		late(1),
		fixed(),
	])

	add([
		text(bossName.toUpperCase(), { size: 120 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(4),
		late(2),
		fixed(),
	])

    const sky = add([
		rect(width(), height()),
		color(0, 0, 0),
		opacity(0),
	])

    sky.onUpdate(() => {
		if (insaneMode) {
			const t = time() * 10
			sky.color.r = wave(127, 255, t)
			sky.color.g = wave(127, 255, t + 1)
			sky.color.b = wave(127, 255, t + 2)
			sky.opacity = 1
		} else {
			sky.color = rgb(0, 0, 0)
			sky.opacity = 0
		}
	})

    const players = [
        { name: "images/characters/timgame.png", scale: 0.45 },
        { name: "images/characters/gijsgame.png", scale: 0.45 },
        { name: "images/characters/samuelgame.png", scale: 0.45 },
        { name: "images/characters/ardagame.png", scale: 0.45 },
		{ name: "images/characters/amirgame.png", scale: 0.5 },
        { name: "images/characters/bashargame.png", scale: 0.45 },
        { name: "images/characters/69game.png", scale: 0.45 },
        { name: "images/characters/chillguygame1.png", scale: 0.15 },
        { name: "images/characters/mangogame1.webp", scale: 0.1 },
        { name: "images/characters/johnporkgame1.png",scale: 0.15 },
        { name: "images/characters/pessigame1.png", scale: 0.15 }
        { name: "images/characters/goldgame.png", scale: 0.1 }
    ];

    let selectedCharacterName = localStorage.getItem("selectedCharacter") || "images/characters/timgame.png";
    let playerData = players.find(p => p.name.includes(selectedCharacterName)) || players[0]; 
    loadSprite("player", playerData.name);
    

const player = add([
    sprite("player"),
    area(),
    scale(playerData.scale), // Hier wordt de juiste schaal gebruikt
    pos(width() / 2, height() - 90),
    anchor("center"),
    "player"
]);

onKeyDown("left", () => {
    player.move(-PLAYER_SPEED, 0);
    if (player.pos.x < 0) player.pos.x = width();
});

onKeyDown("a", () => {
    player.move(-PLAYER_SPEED, 0);
    if (player.pos.x < 0) player.pos.x = width();
});

onKeyDown("right", () => {
    player.move(PLAYER_SPEED, 0);
    if (player.pos.x > width()) player.pos.x = 0;
});

onKeyDown("d", () => {
    player.move(PLAYER_SPEED, 0);
    if (player.pos.x > width()) player.pos.x = 0;
});

onKeyPress("up", () => {
    insaneMode = true;
    if (music) music.speed = 2;
});

onKeyPress("w", () => {
    insaneMode = true;
    if (music) music.speed = 2;
});

onKeyRelease("up", () => {
    insaneMode = false;
    if (music) music.speed = 1;
});

onKeyRelease("w", () => {
    insaneMode = false;
    if (music) music.speed = 1;
});

player.onCollide("enemy", (e) => {
    destroy(e)
    destroy(player)
    shake(120)
    play("explode")
    music.detune = -1200
    addExplode(center(), 12, 120, 30)
    wait(1, () => {
        music.paused = true
        go("lose")
    })
})

function addExplode(p, n, rad, size) {
    for (let i = 0; i < n; i++) {
        wait(rand(n * 0.1), () => {
            for (let i = 0; i < 2; i++) {
                add([
                    pos(p.add(rand(vec2(-rad), vec2(rad)))),
                    rect(4, 4),
                    scale(1 * size, 1 * size),
                    lifespan(0.1),
                    grow(rand(48, 72) * size),
                    anchor("center"),
                ])
            }
        })
    }
}

function addExplode2(p, n, rad, size) {
    for (let i = 0; i < n; i++) {
        wait(rand(n * 0.1), () => {
            for (let i = 0; i < 2; i++) {
                add([
                    pos(p.add(rand(vec2(-rad), vec2(rad)))),
                    rect(4, 4),
                    scale(1 * size, 1 * size),
                    lifespan(0.3),
                    grow(rand(48, 72) * size),
                    anchor("center"),
                ])
            }
        })
    }
}


function spawnBullet(p) {
    add([
        rect(12, 48),
        area(),
        pos(p),
        anchor("center"),
        color(127, 127, 255),
        outline(4),
        move(UP, BULLET_SPEED),
        offscreen({ destroy: true }),
        // strings here means a tag
        "bullet",
    ])
}

onUpdate("bullet", (b) => {
    if (insaneMode) {
        b.color = rand(rgb(0, 0, 0), rgb(255, 255, 255))
    }
})

onKeyPress("space", () => {
    spawnBullet(player.pos.sub(16, 0))
    spawnBullet(player.pos.add(16, 0))
    play("shoot", {
        volume: 0.3,
        detune: rand(-1200, 1200),
    })
})

function spawnTrash() {
    const name = choose(Object.keys(objs).filter(n => n !== bossName));
    add([
        sprite(name),
        area(),
        pos(rand(0, width()), 0),
        health(OBJ_HEALTH),
        scale(0.25),
        anchor("bot"),
        "trash",
        "enemy",
        { speed: rand(TRASH_SPEED * 0.5, TRASH_SPEED * 1.5) },
    ])
    wait(insaneMode ? 0.1 : 0.3, spawnTrash)
 }

 const boss = add([
    sprite(bossName),
    area(),
    pos(width() / 2, 40),
    health(BOSS_HEALTH),
    scale(0.45),
    anchor("top"),
    "boss",
    {
        dir: 1,
    },
])

on("death", "enemy", (e) => {
    destroy(e)
    shake(2)
    addKaboom(e.pos)
})

on("hurt", "enemy", (e) => {
    shake(1)
    play("hit", {
        detune: rand(-1200, 1200),
        speed: rand(0.2, 2),
    })
})

const timer = add([
    text(0),
    pos(12, 32),
    fixed(),
    { time: 0 },
]);

let score = 0;

timer.onUpdate(() => {
    timer.time += dt();
    timer.text = timer.time.toFixed(2); // Beperk tot 3 decimalen
    score = parseFloat(timer.time.toFixed(2));
});

onCollide("bullet", "boss", (b, e) => {
	destroy(b);
		play("hit");
		e.hurt(1);
		shake(1);
		healthbar.set(e.hp());
		e.hurt(insaneMode ? 10 : 1);
		addExplode(b.pos, 1, 24, 1);
		if (e.hp() <= 0) {
			addExplode2(center(), 12, 120, 30)
			coins += 1500; // Voeg 100 coins toe
			localStorage.setItem("coins", coins); // Sla de coins op in localStorage
			play("explode");
			wait(0.5, () => go("win"));
			play("explode");
		}
	});

onUpdate("trash", (t) => {
    t.move(0, t.speed * (insaneMode ? 5 : 1))
    if (t.pos.y - t.height > height()) {
        destroy(t)
    }
})

onCollide("bullet", "trash", (b, t) => {
    destroy(b)
    play("hit")
    t.hurt(0.5)
    t.hurt(insaneMode ? 10 : 1)
    shake(1)
    addExplode(b.pos, 1, 24, 1)
    if (t.hp() <= 0) {
        destroy(t)
        shake(2)
        addKaboom(t.pos)
        play("explode2")
    }
})

boss.onUpdate((p) => {
    boss.move(BOSS_SPEED * boss.dir * (insaneMode ? 3 : 1), 0)
    if (boss.dir === 1 && boss.pos.x >= width() - 20) {
        boss.dir = -1
    }
    if (boss.dir === -1 && boss.pos.x <= 20) {
        boss.dir = 1
    }
})

boss.onHurt(() => {
    healthbar.set(boss.hp())
})

boss.onDeath(() => {
    music.stop()
        go("win", { score: timer.time.toFixed(2) });
    })

const healthbar = add([
    rect(width(), 24),
    pos(0, 0),
    color(107, 201, 108),
    fixed(),
    {
        max: BOSS_HEALTH,
        set(hp) {
            this.width = width() * hp / this.max
            this.flash = true
        },
    },
])

healthbar.onUpdate(() => {
    if (healthbar.flash) {
        healthbar.color = rgb(255, 255, 255)
        healthbar.flash = false
    } else {
        healthbar.color = rgb(127, 255, 127)
    }
})

add([
    text("UP: insane mode", { width: width() / 2, size: 32 }),
    anchor("botleft"),
    pos(24, height() - 24),
])

spawnTrash()

})

scene("win", ({ score }) => {
    // Check of de huidige score beter is dan de highscore
    if (score < highscores) {
        highscores = score;
        localStorage.setItem("highscores", highscores);
    }

    add([text("YOU WIN! You get 100 coins.", { size: 30 }), pos(width() / 2, height() / 2 - 250), scale(2), anchor("center")]);
    add([sprite("player"), pos(width() / 2, height() / 2 - 128), scale(0.3), anchor("center")]);
    add([text(`Coins: ${coins}`, { size: 20 }), pos(width() / 2, height() / 2 + 100), scale(2), anchor("center")]);
    add([text(`Score: ${score} seconds`, { size: 20 }), pos(width() / 2, height() / 2), scale(2), anchor("center")]);
    add([text(`Highscore: ${highscores} seconds`, { size: 20 }), pos(width() / 2, height() / 2 + 50), scale(2), anchor("center")]);

    addButton("Restart", vec2(width() / 2, height() / 2 + 200), () => go("battle"));
    addButton("Main Menu", vec2(width() / 2, height() / 2 + 300), () => {
        window.location.href = "index.html";
    });
});

scene("lose", () => {
    add([text("YOU LOSE!", { size: 30 }), pos(width() / 2, height() / 2 - 250), scale(2), anchor("center")]);
    add([sprite("player"), pos(width() / 2, height() / 2 - 128), scale(0.3), anchor("center")]);
    add([text(`Highscore: ${highscores} seconds`, { size: 20 }), pos(width() / 2, height() / 2), scale(2), anchor("center")]);
    add([text(`Total Coins: ${coins}`, { size: 20 }), pos(width() / 2, height() / 2 + 50), scale(2), anchor("center")]);

    addButton("Restart", vec2(width() / 2, height() / 2 + 200), () => go("battle"));
    addButton("Main Menu", vec2(width() / 2, height() / 2 + 300),  () => {
        window.location.href = "index.html";
    });
});

scene("mainMenu", () => {
    add([text("Welcome to Chill Guy Shooter."), pos(width() / 2, height() / 4), anchor("center"), scale(2), color(248, 248, 215)]);
    add([text(`Highscore: ${highscores} seconds`), pos(width() / 2, height() / 2 - 95), scale(2), anchor("center"), color(248, 248, 215)]);
    addButton("Start Game", vec2(width() / 2, height() / 2), () => go("battle"));
    addButton("Main Menu", vec2(width() / 2, height() / 2 + 100), () => {
        window.location.href = "index.html";
    });
});

go("mainMenu");
