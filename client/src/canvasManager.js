// global PIXI
var mustache = require('mustache')
var template = require('./template')

function CanvasManager () {
  var self = this
  if (!(self instanceof CanvasManager)) new CanvasManager()

  self.renderer = null
  self.stage = null
  self.buttonContainer = null
  self.barContainer = null
  self.chipContainer = null
  self.cardContainer = null
  self.messageContainer = null

  self.background = null
  self.cardTextures = []
}

CanvasManager.prototype.init = function () {
  var self = this

  // create canvas
  self.renderer = PIXI.autoDetectRenderer(1000, 800, {transparent: true})
  document.body.appendChild(self.renderer.view)

  // create background
  self.stage = new PIXI.Container()
  self.background = PIXI.Sprite.fromImage('./../image/table.png')
  self.stage.addChild(self.background)

  // create status bar
  self.barContainer = new PIXI.Container()
  self.bar = PIXI.Sprite.fromImage('./../image/bar.jpg')
  self.shadow = PIXI.Sprite.fromImage('./../image/shadow.png')
  self.barContainer.x = 0
  self.barContainer.y = 700
  self.barContainer.addChild(self.bar)
  self.barContainer.addChild(self.shadow)
  self.stage.addChild(self.barContainer)

  // slice card image
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
  var chips = document.getElementsByClassName('chipContainer')
  chips[0].addEventListener('click', function () {
    console.log('hahahahaha')
  })
}

CanvasManager.prototype.onAssetsLoaded = function () {
  var self = this
  // slice card image and save as texture
  for (var i = 1; i <= 52; i++) {
    self.cardTextures.push(PIXI.Texture.fromFrame('card' + i + '.png'))
  }

  /*
  나중에 container는 각 플레이어에 맞게 구성 될 것이고 위치도 player에 따라 지정 될 것이다
   */

  self.cardContainer = new PIXI.Container()
  self.cardContainer.x = 500
  self.cardContainer.y = 400

  self.stage.addChild(self.cardContainer)

  self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addValueSumView(19, self.cardContainer)

  self.cardContainer = new PIXI.Container()
  self.cardContainer.x = 300
  self.cardContainer.y = 360

  self.stage.addChild(self.cardContainer)

  self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addCard({suit: 0, value: 1}, self.cardContainer)
  //self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addValueSumView(19, self.cardContainer)

  self.cardContainer = new PIXI.Container()
  self.cardContainer.x = 110
  self.cardContainer.y = 280

  self.stage.addChild(self.cardContainer)

  self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addCard({suit: 0, value: 1}, self.cardContainer)
  //self.addCard({suit: 0, value: 1}, self.cardContainer)
  //self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addValueSumView(19, self.cardContainer)

  self.cardContainer = new PIXI.Container()
  self.cardContainer.x = 700
  self.cardContainer.y = 360

  self.stage.addChild(self.cardContainer)

  self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addCard({suit: 0, value: 1}, self.cardContainer)
  //self.addCard({suit: 0, value: 1}, self.cardContainer)
  //self.addCard({suit: 0, value: 1}, self.cardContainer)
  //self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addValueSumView(19, self.cardContainer)

  self.cardContainer = new PIXI.Container()
  self.cardContainer.x = 890
  self.cardContainer.y = 280

  self.stage.addChild(self.cardContainer)

  self.addCard({suit: 0, value: 1}, self.cardContainer)
  //self.addCard({suit: 0, value: 1}, self.cardContainer)
  //self.addCard({suit: 0, value: 1}, self.cardContainer)
  //self.addCard({suit: 0, value: 1}, self.cardContainer)
  //self.addCard({suit: 0, value: 1}, self.cardContainer)
  self.addValueSumView(19, self.cardContainer)

  self.drawBetMoney(100)
  self.drawBalMoney(1000)
  self.addMessageView("WIN")
}

/**
 *
 * @param card // suit  0 ~ 3 , value  1 ~ 13
 * @param container // card image container for each player
 */
CanvasManager.prototype.addCard = function (card, container) {
  var self = this

  var suit = card.suit
  var value = card.value
  var index = suit * 13 + value

  var sprite = PIXI.Sprite.from(self.cardTextures[index])
  sprite.anchor.set(0.5)
  sprite.x = 30 * container.children.length
  sprite.y = 0
  sprite.scale.set(0.8)

  // 으허 container에 anchor가 안먹어서 내가 직접 밀어줘야하다니....
  container.x = container.x - 12

  container.addChild(sprite)
}

CanvasManager.prototype.drawBetMoney = function (money) {
  var self = this

  var graphics = new PIXI.Graphics()
  // draw a rounded rectangle
  graphics.lineStyle(2, 0xb5beb4, 1)
  graphics.beginFill(0x1C281A, 1)
  graphics.drawRoundedRect(10, 10, 200, 80, 15)
  graphics.endFill()

  var text = new PIXI.Text('BET : $' + money, {
    font: '30px Snippet',
    fill: 'white',
    align: 'center'
  })

  text.anchor.set(0.5, 0.5)
  text.position.set(110, 50)
  self.barContainer.addChild(graphics)
  self.barContainer.addChild(text)
}

CanvasManager.prototype.drawBalMoney = function (money) {
  var self = this

  var graphics = new PIXI.Graphics()
  // draw a rounded rectangle
  graphics.lineStyle(2, 0xb5beb4, 1)
  graphics.beginFill(0x1C281A, 1)
  graphics.drawRoundedRect(790, 10, 200, 80, 15)
  graphics.endFill()

  var text = new PIXI.Text('BAL : $' + money, {
    font: '30px Snippet',
    fill: 'white',
    align: 'center'
  })

  text.anchor.set(0.5, 0.5)
  text.position.set(890, 50)
  self.barContainer.addChild(graphics)
  self.barContainer.addChild(text)
}

CanvasManager.prototype.addMessageView = function (message) {
  var self = this

  self.messageContainer = new PIXI.Container()

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

  self.messageContainer.addChild(graphics)
  self.messageContainer.addChild(text)
  self.messageContainer.x = 350
  self.messageContainer.y = 180

  self.stage.addChild(self.messageContainer)
  /*
  setTimeout(function () {
    messageContainer.destroy(true)
    self.renderer.render(self.stage)
  },2000)
  */
}

CanvasManager.prototype.addValueSumView = function (sum, container) {
  var self = this

  var graphics = new PIXI.Graphics()
  // draw a rounded rectangle
  graphics.beginFill(0x000000, 0.7)
  graphics.drawRoundedRect(-40, -70, 50, 50, 15)
  graphics.endFill()

  var text = new PIXI.Text(sum, {
    font: '30px Snippet',
    fill: 'white',
    align: 'center'
  })

  text.anchor.set(0.5, 0.5)
  text.position.set(-15, -45)
  container.addChild(graphics)
  container.addChild(text)
}

CanvasManager.prototype.renderLoop = function () {
  var self = this
  self.renderer.render(self.stage)
}

module.exports = CanvasManager