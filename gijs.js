kaboom({
	background: [74, 48, 82],
})

const objs = {
	"Samuel": "Chillsamuelgame.png",
	"Arda": "chillardagame.png",
	"Gijs": "chillgijsgame.png",
	"Tim": "chilltimgame.png",
	"Samuel": "Chillsamuelgame.png",
	"Arda": "chillardagame.png",
	"Gijs": "chillgijsgame.png",
	"Tim": "chilltimgame.png",
}

for (const [key, file] of Object.entries(objs)) {
	loadSprite(key, `/sprites/${file}`)
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
	const OBJ_HEALTH = 4

	const bossName = choose(Object.keys(objs))

	let insaneMode = false

	const music = play("OtherworldlyFoe")

	volume(0.5)

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

	function spawnTrash() {
		const name = choose(Object.keys(objs).filter(n => n != bossName))
		add([
			sprite(name),
			area(),
			pos(rand(0, width()), 0),
			health(OBJ_HEALTH),
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
		scale(3),
		anchor("top"),
		"enemy",
		{ dir: 1 },
	])

	boss.onDeath(() => {
		music.stop()
		go("win", { time: timer.time, boss: bossName })
	})

	spawnTrash()
})

go("battle")
