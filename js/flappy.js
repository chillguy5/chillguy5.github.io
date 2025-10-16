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
let highscoref = parseInt(localStorage.getItem("highscoref")) || 0;

scene("start", () => {
    add([text("Jump Game"), pos(width() / 2, height() / 4), anchor("center"), scale(2)]);
    addButton("Start Game", vec2(width() / 2, height() / 2), () => go("game"));
});



loadSound("score", "sound/score.mp3")
loadSound("wooosh", "sound/wooosh.mp3")
loadSound("hit", "sound/hit.mp3")

// define gravity
setGravity(3200)

scene("game", () => {

	const PIPE_OPEN = 250
	const PIPE_MIN = 100
	const JUMP_FORCE = 800
	const SPEED = 320
	const CEILING = -60

    const players = [
        { name: "images/characters/timgame.png", scale: 0.3 },
        { name: "images/characters/gijsgame.png", scale: 0.25 },
        { name: "images/characters/samuelgame.png", scale: 0.25 },
        { name: "images/characters/ardagame.png", scale: 0.3 },
		{ name: "images/characters/amirgame.png", scale: 0.45 },
		{ name: "images/characters/bashargame.png", scale: 0.3 },
		{ name: "images/characters/69game.png", scale: 0.35 },
        { name: "images/characters/chillguygame1.png", scale: 0.125 },
        { name: "images/characters/mangogame1.webp", scale: 0.1 },
        { name: "images/characters/johnporkgame1.png",scale: 0.085 },
        { name: "images/characters/pessigame1.png", scale: 0.115 },
		{ name: "images/characters/goldgame.png", scale: 0.15 },
		{ name: "images/italian/bever-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/boneca-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/brr_brr-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/cappacuno-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/chimpanzini-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/frulli-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/koe-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/krokodil-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/liri_lara-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/tralaleo-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/trippi-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/trulimero-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/tung_tung_tung-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/un_din_din_dun-removebg-preview.png", scale: 0.15 },
        { name: "images/italian/Working_on_it-removebg-preview.png", scale: 0.15 },
		{ name: "images/characters/kelly.png", scale: 0.4 }
    ];

	// Verkrijg de naam van het geselecteerde karakter uit localStorage
let selectedCharacterName = localStorage.getItem("selectedCharacter") || "images/characters/timgame.png";

// Zoek het bijbehorende karakter in de players array
let playerData = players.find(p => p.name === selectedCharacterName);

// Laad de sprite en gebruik de bijbehorende schaal
loadSprite("player", selectedCharacterName);

	let selectedCharacter = localStorage.getItem("selectedCharacter") || "images/characters/timgame.png";
	loadSprite("player", selectedCharacter);

	// a game object consists of a list of components and tags
	const bean = add([
		// sprite() means it's drawn with a sprite of name "bean" (defined above in 'loadSprite')
		sprite("player"),
		// give it a position
		pos(width() / 4, 0),
		// give it a collider
		area(),
		// body component enables it to fall and jump in a gravity world
		body(),
        scale(playerData.scale)
	])

	// check for fall death
	bean.onUpdate(() => {
		if (bean.pos.y >= height() || bean.pos.y <= CEILING) {
			// switch to "lose" scene
			go("lose", score)
		}
	})

	// jump
	onKeyPress("space", () => {
		bean.jump(JUMP_FORCE)
		play("wooosh")
	})

	onGamepadButtonPress("south", () => {
		bean.jump(JUMP_FORCE)
		play("wooosh")
	})

	// mobile
	onClick(() => {
		bean.jump(JUMP_FORCE)
		play("wooosh")
	})

	function spawnPipe() {

		// calculate pipe positions
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
			// give it tags to easier define behaviors see below
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
			// give it tags to easier define behaviors see below
			"pipe",
			// raw obj just assigns every field to the game obj
			{ passed: false },
		])

	}

	let score = 0;
	let coins = parseInt(localStorage.getItem("coins")) || 0; // Haal de huidige waarde van coins op
	
	// Score label toevoegen
	let scoreLabel = add([
		text("Score: 0"),
		pos(1332, 12),
		fixed(),  // Zorg ervoor dat het label vast blijft op de positie
		{
			value: 0,
			update() {
				this.text = "Score: " + score;
			}
		}
	]);
	
	onUpdate(() => {
		get("pipe").forEach(p => {
			if (p.pos.x + p.width <= bean.pos.x && p.passed === false) {
				score++;
				p.passed = true;
				scoreLabel.text = "Score: " + score;
			}
		});
	});
	
	
	bean.onCollide("pipe", () => {
		play("hit");
		addKaboom(bean.pos);
	
		// Update de highscore als nodig
		if (score > highscoref) {
			highscoref = score;
			localStorage.setItem("highscoref", highscoref);
		}
	
		// Coins exact gelijkstellen aan score * 10 en optellen bij bestaande coins
		coins += score * 25000;
		localStorage.setItem("coins", coins);
	
		go("lose", score);
	});
	
	
	
	
	

	// spawn a pipe every 1 sec
	loop(1.2, () => {
		spawnPipe()
	})

})

	scene("lose", (score) => {
		add([sprite("player"), pos(width() / 2, height() / 2 - 128), scale(0.3), anchor("center")]);
		add([text("Score: " + score, { size: 30 }), pos(width() / 2, height() / 2 - 250), scale(2), anchor("center")]);
		add([text("Highscore: " + highscoref, { size: 20 }), pos(width() / 2, height() / 2), scale(2), anchor("center")]);
		
		coins = parseInt(localStorage.getItem("coins")) || 0;
		localStorage.setItem("coins", coins);
		add([text("Total Coins: " + coins, { size: 20 }), pos(width() / 2, height() / 2 + 50), scale(2), anchor("center")]);

	
		addButton("Restart", vec2(width() / 2, height() / 2 + 200), () => go("game"));
	});

scene("mainMenu", () => {
    add([text("Welcome to Chill Guy Flappy."), pos(width() / 2, height() / 4), anchor("center"), scale(2), color(248, 248, 215)]);
    add([text("Highscore: " + highscoref), pos(width() / 2, height() / 2 - 95), scale(2), anchor("center"), color(248, 248, 215)]);
    addButton("Start Game", vec2(width() / 2, height() / 2), () => go("game"));
});

go("mainMenu");
