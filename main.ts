namespace SpriteKind {
    export const Ball = SpriteKind.create()
    export const Detector = SpriteKind.create()
    export const Text = SpriteKind.create()
}
function advanceLevel () {
    if (level > lastLevel) {
        game.gameOver(true)
    } else {
        totalScoreNeeded += levelScoresNeeded[level]
        tiles.setCurrentTilemap(levelMaps[level])
        level += 1
        levelTextSprite.sayText("Level " + level, 2000, false)
        sprites.destroyAllSpritesOfKind(SpriteKind.Ball)
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        spawnPaddle()
        spawnBall()
    }
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    ball.setVelocity(ballSpeed, ballSpeed * -1)
    ballFrozen = false
})
function spawnDetector () {
    detector = sprites.create(img`
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        `, SpriteKind.Detector)
    detector.y = 120
}
function spawnBall () {
    ball = sprites.create(img`
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        `, SpriteKind.Ball)
    ball.setBounceOnWall(true)
    ball.setPosition(paddle.x, paddle.top - 2)
    ballFrozen = true
}
function bounceBall (ball: Sprite) {
    ballVx = randint(ballSpeed / 3, ballSpeed)
    ballVy = ball.vy * -1
    if (ball.vx < 0) {
        ballVx = ballVx * -1
    }
    ball.setVelocity(ballVx, ballVy)
}
scene.onOverlapTile(SpriteKind.Ball, assets.tile`myTile0`, function (sprite, location) {
    tiles.setTileAt(location, assets.tile`transparency16`)
    bounceBall(sprite)
    info.changeScoreBy(1)
})
scene.onOverlapTile(SpriteKind.Ball, assets.tile`myTile1`, function (sprite, location) {
    bounceBall(sprite)
    pause(100)
    tiles.setTileAt(location, assets.tile`myTile0`)
    info.changeScoreBy(1)
})
sprites.onOverlap(SpriteKind.Ball, SpriteKind.Detector, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    info.changeLifeBy(-1)
    spawnBall()
})
function spawnLevelTextSprite () {
    levelTextSprite = sprites.create(img`
        f 
        `, SpriteKind.Text)
    levelTextSprite.y += 20
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Ball, function (sprite, otherSprite) {
    bounceBall(otherSprite)
    otherSprite.y = sprite.top - 1
})
function spawnPaddle () {
    paddle = sprites.create(assets.image`giant paddle`, SpriteKind.Player)
    paddle.setPosition(80, 107)
    controller.moveSprite(paddle, paddleSpeed, 0)
    paddle.setStayInScreen(true)
}
let ballVy = 0
let ballVx = 0
let paddle: Sprite = null
let detector: Sprite = null
let ballFrozen = false
let ball: Sprite = null
let levelTextSprite: Sprite = null
let paddleSpeed = 0
let ballSpeed = 0
let lastLevel = 0
let level = 0
let levelScoresNeeded: number[] = []
let levelMaps: tiles.TileMapData[] = []
info.setScore(1)
levelMaps = [tilemap`level2`, tilemap`level0`, tilemap`level9`]
levelScoresNeeded = [20, 20, 15]
let totalScoreNeeded = 0
level = 0
lastLevel = levelScoresNeeded.length - 1
ballSpeed = 800
paddleSpeed = 150
spawnLevelTextSprite()
spawnDetector()
advanceLevel()
game.onUpdate(function () {
    if (info.score() >= totalScoreNeeded) {
        advanceLevel()
    }
    if (ballFrozen) {
        ball.x = paddle.x
    }
})
