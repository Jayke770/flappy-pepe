import kaboom from "kaboom"
const game = kaboom({ global: false })
game.loadSprite("pepe", "sprites/pepe.png")
game.loadSprite("bg", "sprites/bg3.png")
game.loadSprite("pipe", "sprites/pipe.png")

//sound
game.loadSound("point", "sounds/point.mp3")
game.loadSound("jump", "sounds/jump.mp3")
game.scene("game", () => {
	const PIPE_GAP = 120
	let score = 0
	game.add([
		game.sprite("bg", { width: game.width(), height: game.height() })
	])
	const pepe = game.add(
		[
			game.sprite("pepe"),
			game.pos(50, 40),
			game.scale(0.06),
			game.area(),
			game.body()
		]
	)
	game.onKeyPress("space", () => {
		pepe.jump(400)
		game.play("jump")
	})
	game.onMousePress(() => {
		pepe.jump(400)
		game.play("jump")
	})
	const makePipe = () => {
		const offset = game.rand(-50, 50)
		game.add(
			[
				game.sprite("pipe"),
				game.pos(game.width(), game.height() / 2 + offset + PIPE_GAP / 2),
				"pipe",
				game.area(),
				{ passed: false }
			]
		)
		game.add([
			game.sprite("pipe", { flipY: true }),
			game.pos(game.width(), game.height() / 2 + offset - PIPE_GAP / 2),
			game.origin("botleft"),
			"pipe",
			game.area(),
		])
	}
	game.onUpdate("pipe", (pipe) => {
		pipe.move(-160, 0)
		if (pipe.passed === false && pipe.pos.x < pepe.pos.x) {
			pipe.passed = true
			score += 1
			game.play("point")
		}
	})
	game.loop(1.5, () => makePipe())
	pepe.onCollide("pipe", () => {
		game.go("onboard")
	})
})
game.scene("onboard", () => {
	game.add([
		game.sprite("bg", { width: game.width(), height: game.height() })
	])
	game.add([
		game.text("Flappy $PEPE"),
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
	])
	playBtn.onClick(() => {
		game.go("game")
	})
})
game.go("onboard")