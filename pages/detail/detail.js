const API = require('../../utils/api.js')

Page({
    data: {
        list: [],
        item: {}
    },
    onLoad: function(option) {
        console.log('option', option)
        const that = this;
        API.ajax('/topic', '', function (res) {
            //这里既可以获取模拟的res
            console.log(res)
            that.setData({
                list: res.data,
                item: option,
            })
        });
    }
  })
  