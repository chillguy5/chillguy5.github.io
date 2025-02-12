kaboom({
	background: [74, 48, 82],
})

const objs = {
	"Samuel": "samuelgame.png",
	"Arda": "ardagame.png",
	"Gijs": "gijsgame.png",
	"Tim": "timgame.png",
	"Samuel": "samuelgame.png",
	"Arda": "ardagame.png",
	"Gijs": "gijsgame.png",
	"Tim": "timgame.png",
}

for (const [key, file] of Object.entries(objs)) {
	loadSprite(key, file)
}

let selectedCharacter = localStorage.getItem("selectedCharacter") || "timgame.png";
loadSprite("player", selectedCharacter);
loadSound("hit", "hit.mp3")
loadSound("shoot", "shot.mp3")
loadSound("explode", "Voicy_bomboclart.mp3")
loadSound("OtherworldlyFoe", "kaboomguardian.mp3")
loadSound("explode2", "retroexp.mp3")

scene("battle", () => {
	const BULLET_SPEED = 1200
	const TRASH_SPEED = 200
	const BOSS_SPEED = 100
	const PLAYER_SPEED = 500
	const BOSS_HEALTH = 250
	const OBJ_HEALTH = 8

	const bossName = choose(Object.keys(objs))

	let insaneMode = false

	const music = play("OtherworldlyFoe", { volume: 1, loop: true })

	add([text("KILL", { size: 160 }), pos(width() / 2, height() / 2), anchor("center"), lifespan(1), fixed()])
	add([text("THE", { size: 80 }), pos(width() / 2, height() / 2 + 80), anchor("center"), lifespan(2), fixed()])
	add([text(bossName.toUpperCase(), { size: 120 }), pos(width() / 2, height() / 2 + 160), anchor("center"), lifespan(4), fixed()])

	const sky = add([rect(width(), height()), color(0, 0, 0), opacity(0)])

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

	const player = add([sprite("player"), area(), scale(0.45), pos(width() / 2, height() - 90), anchor("center"), "player"])

	onKeyDown("left", () => {
		player.move(-PLAYER_SPEED, 0)
		if (player.pos.x < 0) player.pos.x = width()
	})

	onKeyDown("right", () => {
		player.move(PLAYER_SPEED, 0)
		if (player.pos.x > width()) player.pos.x = 0
	})

	onKeyPress("up", () => {
		insaneMode = true
		music.speed = 2
	})

	onKeyRelease("up", () => {
		insaneMode = false
		music.speed = 1
	})

function spawnBullet(p) {
    add([rect(12, 48), area(), pos(p.sub(0, 20)), anchor("center"), color(127, 127, 255), outline(4), move(UP, BULLET_SPEED), offscreen({ destroy: true }), "bullet"])
    play("shoot", { volume: 0.3, detune: rand(-1200, 1200) })
}


	onKeyPress("space", () => {
		spawnBullet(player.pos.sub(16, 0))
		spawnBullet(player.pos.add(16, 0))
	})

	function spawnTrash() {
		const name = choose(Object.keys(objs).filter(n => n != bossName))
		const trash = add([sprite(name), area(), scale(0.3), pos(rand(0, width()), 0), health(3), anchor("bot"), "trash", "enemy", { speed: rand(TRASH_SPEED * 0.5, TRASH_SPEED * 1.5) }])
		wait(insaneMode ? 0.1 : 0.3, spawnTrash)
	}

	onUpdate("trash", (t) => {
		t.move(0, t.speed * (insaneMode ? 5 : 1))
		if (t.pos.y - t.height > height()) destroy(t)
	})

	onCollide("bullet", "trash", (b, t) => {
		destroy(b)
		play("hit")
		t.hurt(1)
		t.hurt(insaneMode ? 2 : 1)
		if (t.hp() <= 0) {
			destroy(t)
			addKaboom(t.pos)
			play("explode2")
		}
	})

	onCollide("player", "trash", (p, t) => {
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

	const boss = add([sprite(bossName), area(), scale(0.5), pos(width() / 2, 40), health(BOSS_HEALTH), anchor("top"), "boss", { dir: 1 }])

	boss.onUpdate(() => {
		boss.move(boss.dir * (insaneMode ? BOSS_SPEED * 4 : BOSS_SPEED), 0)
		if (boss.pos.x < 0 || boss.pos.x > width()) {
			boss.dir *= -1
		}
	})

	const healthbar = add([rect(width(), 24), pos(0, 0), color(107, 201, 108), fixed(), { max: BOSS_HEALTH, set(hp) { this.width = width() * hp / this.max } }])

	onCollide("bullet", "boss", (b, e) => {
		destroy(b)
		play("hit")
		e.hurt(insaneMode ? 2 : 1)
		healthbar.set(e.hp())
		if (e.hp() <= 0) {
			go("win")
		}
	})

	scene("win", () => {
		add([text("YOU WIN!", { size: 48 }), pos(width() / 2, height() / 2), anchor("center")])
		add([text("Press R to Restart", { size: 24 }), pos(width() / 2, height() / 2 + 40), anchor("center")])
		add([text("Press M for Main Menu", { size: 24 }), pos(width() / 2, height() / 2 + 80), anchor("center")])

		onKeyPress("r", () => go("battle"))
		onKeyPress("m", () => window.location.href = "index.html")
	})

	scene("lose", () => {
		add([text("YOU LOSE!", { size: 48 }), pos(width() / 2, height() / 2), anchor("center")])
		add([text("Press R to Restart", { size: 24 }), pos(width() / 2, height() / 2 + 40), anchor("center")])
		add([text("Press M for Main Menu", { size: 24 }), pos(width() / 2, height() / 2 + 80), anchor("center")])

		onKeyPress("r", () => go("battle"))
		onKeyPress("m", () => window.location.href = "index.html")
	})

	spawnTrash()
})

go("battle")
