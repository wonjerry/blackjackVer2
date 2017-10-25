// global PIXI
var mustache = require('mustache')
var template = require('./template')

function CanvasManager () {
  var self = this
  if (!(self instanceof CanvasManager)) new CanvasManager()

  self.renderer = null
  self.stage = null
  self.buttonContainer = null
  self.chipContainer = null
  self.messageContainer = null

  self.cardTextures = []
  self.myCardContainer = null
  self.otherCardContainer = []

  // 다 제거하고 생성하지 않고 있는 객체의 속성 값을 바꿔주는 방식으로 rerendering 할 것 이다
  self.betMoneyText = null
  self.balMoneyText = null
  self.gameStateText = null
  self.playerStateText = null
  self.valueSumTexts = []
  self.cardContainers = []
}

CanvasManager.prototype.init = function () {
  var self = this

  // create canvas
  self.renderer = PIXI.autoDetectRenderer(1000, 800, {transparent: true})
  document.body.appendChild(self.renderer.view)

  // create background
  self.stage = new PIXI.Container()
  self.stage.addChild(PIXI.Sprite.fromImage('./../image/table.png'))

  // create initial bar
  self.initBar()
  // create initial button and chips
  self.initButtonAndChips()

  // slice card image
  PIXI.loader.add('spritesheet', './../image/cards2.json')
    .load(self.onAssetsLoaded.bind(self))
}

CanvasManager.prototype.onAssetsLoaded = function () {
  var self = this
  // slice card image and save as texture
  for (var i = 1; i <= 52; i++) {
    self.cardTextures.push(PIXI.Texture.fromFrame('card' + i + '.png'))
  }
  self.addCardArea('hi')
  self.addMessageView('WIN')
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

CanvasManager.prototype.initButtonAndChips = function () {
  var self = this

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

CanvasManager.prototype.initBar = function () {
  var self = this

  // create status bar
  var barContainer = new PIXI.Container()
  self.bar = PIXI.Sprite.fromImage('./../image/bar.jpg')
  self.shadow = PIXI.Sprite.fromImage('./../image/shadow.png')
  barContainer.x = 0
  barContainer.y = 700
  barContainer.addChild(self.bar)
  barContainer.addChild(self.shadow)

  var graphics = new PIXI.Graphics()
  graphics.lineStyle(2, 0xb5beb4, 1)
  graphics.beginFill(0x1C281A, 1)
  graphics.drawRoundedRect(10, 10, 200, 80, 15)
  graphics.endFill()

  // create bal money text
  graphics.lineStyle(2, 0xb5beb4, 1)
  graphics.beginFill(0x1C281A, 1)
  graphics.drawRoundedRect(790, 10, 200, 80, 15)
  graphics.endFill()

  // create bal money text
  graphics.lineStyle(2, 0xb5beb4, 1)
  graphics.beginFill(0x1C281A, 1)
  graphics.drawRoundedRect(410, 10, 200, 80, 15)
  graphics.endFill()

  self.betMoneyText = new PIXI.Text('BET : $' + 0, {
    font: '30px Snippet',
    fill: 'white',
    align: 'center'
  })
  self.betMoneyText.anchor.set(0.5, 0.5)
  self.betMoneyText.position.set(110, 50)

  self.balMoneyText = new PIXI.Text('BAL : $' + 1000, {
    font: '30px Snippet',
    fill: 'white',
    align: 'center'
  })

  self.balMoneyText.anchor.set(0.5, 0.5)
  self.balMoneyText.position.set(890, 50)

  self.playerStateText = new PIXI.Text('INIT', {
    font: '30px Snippet',
    fill: 'white',
    align: 'center'
  })

  self.playerStateText.anchor.set(0.5, 0.5)
  self.playerStateText.position.set(510, 50)

  barContainer.addChild(graphics)
  barContainer.addChild(self.betMoneyText)
  barContainer.addChild(self.balMoneyText)
  barContainer.addChild(self.playerStateText)
  self.stage.addChild(barContainer)
}

// 요건 플레이어 들어올 때 마다 하나씩 만들던가 해야겠다
// betting state일 때 player 순회하면서 만들면 될듯
CanvasManager.prototype.addCardArea = function (playerData) {
  var self = this

  var cardContainer = new PIXI.Container()
  cardContainer.x = 500
  cardContainer.y = 400
  // 나중에 해당 player가 접속했을 때 추가할 것 이다 첫화면에선 안보여줄꺼
  self.cardContainers.push(cardContainer)

  var graphics = new PIXI.Graphics()
  // draw a rounded rectangle
  graphics.beginFill(0x000000, 0.7)
  graphics.drawRoundedRect(-40, -70, 50, 50, 15)
  graphics.endFill()

  var text = new PIXI.Text(' ', {
    font: '30px Snippet',
    fill: 'white',
    align: 'center'
  })

  text.anchor.set(0.5, 0.5)
  text.position.set(-15, -45)
  cardContainer.addChild(graphics)
  cardContainer.addChild(text)
  // 나중에 player id를 key 값으로 넣어서 배열로 관리할 것 이다
  self.valueSumTexts.push(text)

  self.stage.addChild(cardContainer)
}
/**
 *
 * @param money : int value from server
 */
CanvasManager.prototype.updateBetMoney = function (money) {
  var self = this
  self.betMoneyText.text = 'BET : $' + money
}

CanvasManager.prototype.updateBalMoney = function (money) {
  var self = this
  self.balMoneyText.text = 'BAL : $' + money
}

CanvasManager.prototype.updatePlayerstate = function (state) {
  var self = this
  self.playerStateText.text = state
}

CanvasManager.prototype.updateGamestate = function (state) {
  var self = this
  self.gameStateText.text = state
}

CanvasManager.prototype.updateValueSum = function (id,sum) {
  var self = this
  self.valueSumTexts[id].text = sum
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