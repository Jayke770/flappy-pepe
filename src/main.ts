import kaboom from "kaboom"
let score = 0
const game = kaboom({
	global: false,
	canvas: document.querySelector("#flapepe"),
})
game.loadSprite("pepe", "sprites/pepe.png")
game.loadSprite("bg", "sprites/bg3.png")
game.loadSprite("pipe", "sprites/pipe.png")

//sound
game.loadSound("point", "sounds/point.mp3")
game.loadSound("jump", "sounds/jump.mp3")
game.loadSound("die", "sounds/die.mp3")
game.loadSound("hit", "sounds/hit.mp3")
game.scene("game", () => {
	const PIPE_GAP = 200
	game.add([
		game.sprite("bg", { width: game.width(), height: game.height() })
	])
	const pepe = game.add(
		[
			game.sprite("pepe"),
			game.pos(50, 40),
			game.scale(0.1),
			game.area(),
			game.body(),
			"pepe"
		]
	)
	game.onKeyPress("space", () => {
		pepe.jump(400)
		game.play("jump")
	})
	game?.onMousePress(() => {
		pepe.jump(400)
		game.play("jump")
	})
	game?.onTouchStart(() => {
		pepe.jump(400)
		game.play("jump")
	})
	const makePipe = () => {
		const offset = game.rand(-60, 60)
		game.add(
			[
				game.sprite("pipe"),
				game.pos(game.width(), (game.height() / 2) + offset + PIPE_GAP / 2),
				"pipe",
				game.area(),
				game.scale(2.5),
				{ passed: false }
			]
		)
		game.add([
			game.sprite("pipe", { flipY: true }),
			game.pos(game.width(), (game.height() / 2) + offset - PIPE_GAP / 2),
			game.origin("botleft"),
			"pipe",
			game.area(),
			game.scale(2.5),
		])
	}
	game.onUpdate("pipe", (pipe) => {
		pipe.move(-200, 0)
		if (pipe.passed === false && pipe.pos.x < pepe.pos.x) {
			if (game.height() > pepe.pos.y) {
				pipe.passed = true
				score += 1
				scoreText.text = score.toString()
				game.play("point")
			}
		}
	})
	game.onUpdate("pepe", () => {
		if (pepe.pos.y > game.height()) {
			game.play("hit")
			setTimeout(() => game.play("die"), 100)
			game.go('onboard')
			score = 0
		}
	})
	game.loop(1.5, () => makePipe())
	pepe.onCollide("pipe", () => {
		game.play("hit")
		setTimeout(() => game.play("die"), 100)
		game.go("onboard")
		score = 0
	})
	const scoreText = game.add([
		game.text(score.toString(), { size: 50 }),
		game.z(50)
	])
})
game.scene("onboard", () => {
	game.add([
		game.sprite("bg", { width: game.width(), height: game.height() })
	])
	game.add([
		game.text("Flapepe", { size: 40 }),
		game.pos(game.width() / 2, game.height() / 2),
		game.origin("center")
	])
	const playBtn = game.add([
		game.text("Play", { size: 40 }),
		game.pos(game.width() / 2, (game.height() / 2) + 100),
		game.origin("center"),
		game.color(42, 254, 48),
		game.scale(1),
		game.area({ cursor: 'pointer' }),
		game?.onTouchStart(() => game.go("game")),
		game?.onClick(() => game.go("game"))
	])
	playBtn.onClick(() => {
		game.go("game")
	})
})
game.go("onboard")