const API = require('../../utils/api.js')

Page({
    data: {
        list: [],
        item: {},
        m2m: {},
    },
    onShareAppMessage: function (res) {},
    onLoad: function(option) {
        wx.setNavigationBarTitle({
            title: '答题详情'
        })
        const that = this;
        API.ajax('/topic/12', '', function (res) {
            //这里既可以获取模拟的res
            const m2m = res.data[0] || res.data.filter((item) => (item.id == option.id));
            const list =  res.data || res.data.filter((item) => (item.from == option.id));      
            console.log('m2m', m2m)
            that.setData({
                list,
                m2m,
                item: option,
            })
        });
    }
  })
  