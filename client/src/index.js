// global PIXI
var app = new PIXI.Application(1000, 550, null)
document.body.appendChild(app.view)

var background = PIXI.Sprite.fromImage('./../public/image/table.png')
app.stage.addChild(background)

PIXI.loader
  .add('spritesheet', './../public/image/cards2.json')
  .load(onAssetsLoaded)

function onAssetsLoaded () {

  var container = new PIXI.Container()

  app.stage.addChild(container)

  // create an array to store the textures
  var cards = []

  for (var i = 1; i <= 52; i++) {
    var texture = PIXI.Texture.fromFrame('card' + i + '.png')
    cards.push(texture)
  }

  var sprite = PIXI.Sprite.from(cards[12])
  sprite.anchor.set(0.5)
  sprite.x = 0
  sprite.y = 0
  //sprite.scale.set(1.5)
  container.addChild(sprite)

  var sprite = PIXI.Sprite.from(cards[29])
  sprite.anchor.set(0.5)
  sprite.x = 63
  sprite.y = 0
  //sprite.scale.set(1.5)
  container.addChild(sprite)

  // Center on the screen
  console.log(container.width)
  container.x = (app.renderer.width) / 2 - 25
  container.y = (app.renderer.height) * 3 / 4

}