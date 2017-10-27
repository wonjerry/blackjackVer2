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

  // 일단 '나'와 '딜러'의 card 데이터들은 따로 관리하는데 나중에 더 나은 방식을 찾아봐야겠다
  self.myCardContainer = null
  self.myValueSumText = null
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
  // create game state view
  self.initGamestateView('Betting.....')

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
  self.addCardArea(/*player data*/)
}

CanvasManager.prototype.initButtonAndChips = function () {
  var self = this

  // 이건 아직 애매하다
  self.buttonContainer = document.createElement('div')
  self.buttonContainer.setAttribute('class', 'buttonContainer')
  self.buttonContainer.innerHTML = mustache.render(template['buttons'], {})
  document.body.appendChild(self.buttonContainer)

  var buttons = document.getElementsByClassName('gameButton')
  for (var i = 0, len = buttons.length; i < len; i++) {
    buttons[i].addEventListener('click', function (e) {
      console.log(e.target.id)
    })
  }

  self.chipContainer = document.createElement('div')
  self.chipContainer.setAttribute('class', 'chipContainer')
  self.chipContainer.innerHTML = mustache.render(template['chips'], {})
  document.body.appendChild(self.chipContainer)

  var chips = document.getElementsByClassName('pokerchip')
  chips[0].addEventListener('click', function () {
    console.log('10')
  })

  chips[1].addEventListener('click', function () {
    console.log('25')
  })

  chips[2].addEventListener('click', function () {
    console.log('50')
  })
  console.log(self.buttonContainer.children)
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

CanvasManager.prototype.initGamestateView = function (message) {
  var self = this

  var messageContainer = new PIXI.Container()

  var graphics = new PIXI.Graphics()
  graphics.lineStyle(2, 0xb5beb4, 1)
  graphics.beginFill(0x1C281A, 1)
  graphics.drawRoundedRect(0, 0, 200, 100, 15)
  graphics.endFill()
// create some white text using the Snippet webfont
  self.gameStateText = new PIXI.Text(message, {
    font: '30px Snippet',
    fill: 'white',
    align: 'center'
  })

  self.gameStateText.anchor.set(0.5, 0.5)
  self.gameStateText.position.set(100, 50)

  messageContainer.addChild(graphics)
  messageContainer.addChild(self.gameStateText)
  messageContainer.x = 10
  messageContainer.y = 10

  self.stage.addChild(messageContainer)
}

// 요건 플레이어 들어올 때 마다 하나씩 만들던가 해야겠다
// betting state일 때 player 순회하면서 만들면 될듯
/**
 *
 * @param playerData : self or not, value sum, cards
 */
CanvasManager.prototype.addCardArea = function (playerData) {
  var self = this

  var container = new PIXI.Container()
  container.x = 480
  container.y = 200

  self.cardContainers.push(container)

  var valuesumContainer = new PIXI.Container()
  var graphics = new PIXI.Graphics()
  // draw a rounded rectangle
  graphics.beginFill(0x000000, 0.7)
  graphics.drawRoundedRect(-40, -70, 50, 50, 15)
  graphics.endFill()

  var text = new PIXI.Text('10', {
    font: '30px Snippet',
    fill: 'white',
    align: 'center'
  })

  text.anchor.set(0.5, 0.5)
  text.position.set(-15, -45)
  valuesumContainer.addChild(graphics)
  valuesumContainer.addChild(text)
  container.addChild(valuesumContainer)

  var cardContainer = new PIXI.Container()
  cardContainer.x = -12
  cardContainer.y = 0

  container.addChild(cardContainer)

  //cardContainer.addChild(graphics)
  //cardContainer.addChild(text)
  // 나중에 player id를 key 값으로 넣어서 배열로 관리할 것 이다
  self.valueSumTexts.push(text)
  self.stage.addChild(container)

  self.addCard({suit: 0, value: 1}, cardContainer)
  self.addCard({suit: 0, value: 1}, cardContainer)
  self.addCard({suit: 0, value: 1}, cardContainer)
  self.addCard({suit: 0, value: 1}, cardContainer)
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
  sprite.x = 30 * (container.children.length + 1)
  sprite.y = 0
  sprite.scale.set(0.8)

  // 으허 container에 anchor가 안먹어서 내가 직접 밀어줘야하다니....
  container.parent.x -= 12

  container.addChild(sprite)
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

CanvasManager.prototype.updateValueSum = function (id, sum) {
  var self = this
  self.valueSumTexts[id].text = sum
}

CanvasManager.prototype.renderLoop = function () {
  var self = this
  self.renderer.render(self.stage)
}

module.exports = CanvasManager