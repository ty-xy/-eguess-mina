const API = require('../../utils/api.js')

Page({
    data: {
        list: [],
        item: {}
    },
    onLoad: function(option) {
        const that = this;
        API.ajax('/topic/12', '', function (res) {
            //这里既可以获取模拟的res
            console.log('option', option, res.data.message, res.data)
            that.setData({
                list: res.data.message,
                item: res.data,
            })
        });
    }
  })
  