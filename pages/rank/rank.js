//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  onReady: function (e) {
    var context = wx.createCanvasContext('firstCanvas')
    context.setStrokeStyle("#00ff00")
    context.setLineWidth(5)
    context.beginPath()
    context.arc(110,110,100,0,0.5*Math.PI,true);
    context.stroke();
  }
})
