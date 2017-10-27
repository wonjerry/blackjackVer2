(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  // 나중에 해당 player가 접속했을 때 추가할 것 이다 첫화면에선 안보여줄꺼
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
  console.log(container.parent.x)
  container.parent.x = container.parent.x - 12

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
},{"./template":3,"mustache":4}],2:[function(require,module,exports){
var Canvas = require('./canvasManager')

var view = new Canvas()

view.init()

// set main loop method
function animate () {
  view.renderLoop()
  window.requestAnimationFrame(animate)
}
window.requestAnimationFrame(animate)
},{"./canvasManager":1}],3:[function(require,module,exports){
var dict = []

dict['buttons'] =
  '<button type="button" class="gameButton" id = "Deal">DEAL</button>'+
  '<button type="button" class="gameButton" id = "Stand" style="display: inline-block">STAND</button>'+
  '<button type="button" class="gameButton" id = "Hit" style="display: none">HIT</button>'+
  '<button type="button" class="gameButton" id = "Split" style="display: none">SPLIT</button>'+
  '<button type="button" class="gameButton" id = "Double" style="display: none">DOUBLE DOWN</button>'
dict['play'] =
  '<button type="button" class="gameButton" style="display: none">STAND</button>'+
  '<button type="button" class="gameButton" style="display: none">HIT</button>'+
  '<button type="button" class="gameButton" style="display: none">SPLIT</button>'+
  '<button type="button" class="gameButton" style="display: none">DOUBLE DOWN</button>'

dict['chips'] =
  '<div class="pokerchip"> <div>10</div></div>' +
  '<div class="pokerchip red"><div>25</div></div>' +
  '<div class="pokerchip blue"><div>50</div></div>'

module.exports = dict
},{}],4:[function(require,module,exports){
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    global.Mustache = {};
    factory(global.Mustache); // script, wsh, asp
  }
}(this, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = hasProperty(value, names[index]);

            value = value[names[index++]];
          }
        } else {
          value = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function render (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '2.3.0';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function render (template, view, partials) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;
}));

},{}]},{},[2]);
