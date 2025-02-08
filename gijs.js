kaboom({
	background: [74, 48, 82],
})

const objs = {
	"apple": "Chillsamuelgame.png",
	"lightening": "chillardagame.png",
	"coin": "chillgijsgame.png",
	"egg": "chilltimgame.png",
	"key": "Chillsamuelgame.png",
	"door": "chillardagame.png",
	"meat": "chillgijsgame.png",
	"mushroom": "chilltimgame.png",
}

for (const [key, file] of Object.entries(objs)) {
	loadSprite(key, file)
}

loadBean()
loadSound("hit", "/examples/sounds/hit.mp3")
loadSound("shoot", "/examples/sounds/shoot.mp3")
loadSound("explode", "Voicy_bomboclart.mp3")
loadSound("OtherworldlyFoe", "/examples/sounds/OtherworldlyFoe.mp3")

scene("battle", () => {
	const BULLET_SPEED = 1200
	const TRASH_SPEED = 120
	const BOSS_SPEED = 48
	const PLAYER_SPEED = 500
	const STAR_SPEED = 120
	const BOSS_HEALTH = 500
	const OBJ_HEALTH = 3

	const bossName = choose(Object.keys(objs))

	let insaneMode = false

	const music = play("OtherworldlyFoe")

	volume(0.5)

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
		fixed(),
	])

	add([
		text(bossName.toUpperCase(), { size: 120 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(4),
		fixed(),
	])

	const player = add([
		sprite("bean"),
		area(),
		pos(width() / 2, height() - 64),
		anchor("center"),
	])

	onKeyDown("left", () => {
		player.move(-PLAYER_SPEED, 0)
		if (player.pos.x < 0) {
			player.pos.x = width()
		}
	})

	onKeyDown("right", () => {
		player.move(PLAYER_SPEED, 0)
		if (player.pos.x > width()) {
			player.pos.x = 0
		}
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
		add([
			rect(12, 48),
			area(),
			pos(p),
			anchor("center"),
			color(127, 127, 255),
			outline(4),
			move(UP, BULLET_SPEED),
			offscreen({ destroy: true }),
			"bullet",
		])
		play("shoot", { volume: 0.3, detune: rand(-1200, 1200) })
	}

	onKeyPress("space", () => {
		spawnBullet(player.pos.sub(16, 0))
		spawnBullet(player.pos.add(16, 0))
	})

	function spawnTrash() {
		const name = choose(Object.keys(objs).filter(n => n != bossName))
		const trash = add([
			sprite(name),
			area(),
			scale(0.5),
			pos(rand(0, width()), 0),
			health(OBJ_HEALTH),
			anchor("bot"),
			"trash",
			"enemy",
			{ speed: rand(TRASH_SPEED * 0.5, TRASH_SPEED * 1.5) },
		])
		wait(insaneMode ? 0.1 : 0.3, spawnTrash)
	}

	onUpdate("trash", (t) => {
		t.move(0, t.speed * (insaneMode ? 5 : 1))
		if (t.pos.y - t.height > height()) {
			destroy(t)
		}
	})

	onCollide("bullet", "trash", (b, t) => {
		destroy(b)
		t.hurt(1)
		if (t.hp() <= 0) {
			destroy(t)
		}
	})

	onCollide("player", "trash", (p, t) => {
		destroy(p)
		destroy(t)
		play("explode")
		addKaboom(p.pos)
		wait(1, () => go("battle"))
	})

	const boss = add([
		sprite(bossName),
		area(),
		scale(1.5),
		pos(width() / 2, 40),
		health(BOSS_HEALTH),
		anchor("top"),
		"enemy",
		{ dir: 1 },
	])

	const healthbar = add([
		rect(width(), 24),
		pos(0, 0),
		color(107, 201, 108),
		fixed(),
		{ max: BOSS_HEALTH, set(hp) { this.width = width() * hp / this.max } },
	])

	onCollide("bullet", "enemy", (b, e) => {
		destroy(b)
		e.hurt(1)
		healthbar.set(e.hp())
		if (e.hp() <= 0) {
			go("win", { time: 0, boss: bossName })
		}
	})

	boss.onUpdate(() => {
		boss.move(BOSS_SPEED * boss.dir * (insaneMode ? 3 : 1), 0)
		if (boss.dir === 1 && boss.pos.x >= width() - 20) {
			boss.dir = -1
		}
		if (boss.dir === -1 && boss.pos.x <= 20) {
			boss.dir = 1
		}
	})

	spawnTrash()
})

go("battle")
