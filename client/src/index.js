var Canvas = require('./canvasManager')

var view = new Canvas()

view.init()

// set main loop method
function animate () {
  view.renderLoop()
  window.requestAnimationFrame(animate)
}
window.requestAnimationFrame(animate)