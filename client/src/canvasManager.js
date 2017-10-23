// global PIXI
var mustache = require('mustache')
var template = require('./template')

function CanvasManager () {
  var self = this
  if (!(self instanceof CanvasManager)) new CanvasManager()

  self.renderer = null
  self.background = null
  self.stage = null
  self.buttonContainer = null
  self.chipContainer = null
  self.cardTextures = []
  self.messages = []
  self.statusBar = null
}

CanvasManager.prototype.init = function () {
  var self = this

  self.renderer = PIXI.autoDetectRenderer(1000, 800, {transparent: true})
  document.body.appendChild(self.renderer.view)

  self.stage = new PIXI.Container()
  self.background = PIXI.Sprite.fromImage('./../image/table.png')

  self.stage.addChild(self.background)

  self.barContainer = new PIXI.Container()
  self.bar = PIXI.Sprite.fromImage('./../image/bar.jpg')
  self.barContainer.addChild(self.bar)

  self.shadow = PIXI.Sprite.fromImage('./../image/shadow.png')
  self.barContainer.x = 0
  self.barContainer.y = 700

  self.barContainer.addChild(self.shadow)
  self.stage.addChild(self.barContainer)

  /*
  var sprite = PIXI.Sprite.from(cards[12])
  sprite.anchor.set(0.5)
  sprite.x = 0
  sprite.y = 0
  //sprite.scale.set(1.5)
  container.addChild(sprite)
   */

  PIXI.loader.add('spritesheet', './../image/cards2.json')
    .load(self.onAssetsLoaded.bind(self))

  // 이건 아직 애매하다
  self.buttonContainer = document.createElement('div')
  self.buttonContainer.setAttribute('class', 'buttonContainer')
  self.buttonContainer.innerHTML = mustache.render(template['deal'], {})
  document.body.appendChild(self.buttonContainer)

  self.chipContainer = document.createElement('div')
  self.chipContainer.setAttribute('class', 'chipContainer')
  self.chipContainer.innerHTML = mustache.render(template['chips'], {})
  document.body.appendChild(self.chipContainer)

}

CanvasManager.prototype.onAssetsLoaded = function () {
  var self = this
  //sprite를 생성해서 각각에게 전해 줘야 함으로 texture만 생성 해 둔다
  for (var i = 1; i <= 52; i++) {
    self.cardTextures.push(PIXI.Texture.fromFrame('card' + i + '.png'))
  }

  self.drawUserMoney(100)
}

CanvasManager.prototype.addStatusInfo = function () {
  var self = this

}

CanvasManager.prototype.drawUserMoney = function (money) {
  var self = this

  var graphics = new PIXI.Graphics()
  // draw a rounded rectangle
  graphics.lineStyle(2, 0xb5beb4, 1)
  graphics.beginFill(0x1C281A, 1)
  graphics.drawRoundedRect(10, 10, 290, 80, 15)
  graphics.endFill()

  var text = new PIXI.Text('Your Money : $' + money, {
    font: '30px Snippet',
    fill: 'white',
    align: 'center'
  })

  text.anchor.set(0.5, 0.5)
  text.position.set(150, 50)
  self.barContainer.addChild(graphics)
  self.barContainer.addChild(text)
}

CanvasManager.prototype.addMessageView = function (x, y, message) {
  var self = this
  var messageContainer = new PIXI.Container()

  var graphics = new PIXI.Graphics()
  graphics.lineStyle(2, 0xb5beb4, 1)
  graphics.beginFill(0x1C281A, 1)
  graphics.drawRoundedRect(0, 0, 300, 100, 15)
  graphics.endFill()
// create some white text using the Snippet webfont
  var text = new PIXI.Text(message, {
    font: '30px Snippet',
    fill: 'white',
    align: 'center'
  })

  text.anchor.set(0.5, 0.5)
  text.position.set(150, 50)

  messageContainer.addChild(graphics)
  messageContainer.addChild(text)

  stage.addChild(messageContainer)
  // 나중에 제거를 위한 것이다
  self.messages.push(messageContainer)
  /*
  setTimeout(function () {
    messageContainer.destroy(true)
    self.renderer.render(self.stage)
  },2000)
  */
}

CanvasManager.prototype.addTransparentView = function (x, y, message) {
  var self = this

  var graphics = new PIXI.Graphics()
  // draw a rounded rectangle
  graphics.beginFill(0xFFFFFF, 0.25)
  //graphics.drawRoundedRect(10, 540, 280, 100, 15)
  graphics.drawRoundedRect(100, -50, 100, 100, 15)
  graphics.endFill()
}

CanvasManager.prototype.renderLoop = function () {
  var self = this
  self.renderer.render(self.stage)
}

module.exports = CanvasManager