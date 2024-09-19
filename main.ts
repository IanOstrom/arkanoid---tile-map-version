namespace SpriteKind {
    export const Ball = SpriteKind.create()
}
function advanceLevel () {
    tiles.setCurrentTilemap(levelMaps[level])
    level += 1
    game.splash("Level " + level)
    spawnBall()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Ball, function (sprite, otherSprite) {
    bounceBall(otherSprite)
    otherSprite.y = sprite.top - 1
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    advanceLevel()
})
function spawnBall () {
    ball = sprites.create(img`
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        `, SpriteKind.Ball)
    ball.setPosition(73, 58)
    ball.setVelocity(ballSpeed, ballSpeed)
    ball.setBounceOnWall(true)
}
function bounceBall (ball: Sprite) {
    ballVx = randint(ballSpeed / 3, ballSpeed)
    ballVy = ball.vy * -1
    if (ball.vx < 0) {
        ballVx = ballVx * -1
    }
    ball.setVelocity(ballVx, ballVy)
}
scene.onOverlapTile(SpriteKind.Ball, assets.tile`myTile1`, function (sprite, location) {
    bounceBall(sprite)
    pause(100)
    tiles.setTileAt(location, assets.tile`myTile0`)
    info.changeScoreBy(1)
})
function spawnPaddle () {
    paddle = sprites.create(img`
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        `, SpriteKind.Player)
    paddle.setPosition(80, 107)
    controller.moveSprite(paddle, paddleSpeed, 0)
    paddle.setStayInScreen(true)
}
scene.onOverlapTile(SpriteKind.Ball, assets.tile`myTile0`, function (sprite, location) {
    tiles.setTileAt(location, assets.tile`transparency16`)
    bounceBall(sprite)
    info.changeScoreBy(1)
})
let paddle: Sprite = null
let ballVy = 0
let ballVx = 0
let ball: Sprite = null
let paddleSpeed = 0
let ballSpeed = 0
let level = 0
let levelMaps: tiles.TileMapData[] = []
levelMaps = [tilemap`level2`, tilemap`level0`, tilemap`level9`]
level = 0
ballSpeed = 100
paddleSpeed = 150
info.setScore(0)
advanceLevel()
spawnPaddle()
