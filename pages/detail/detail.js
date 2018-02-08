const API = require('../../utils/api.js')

Page({
    data: {
        list: [],
        item: {}
    },
    onShareAppMessage(res) {
        const { id, status, title, read, message } = this.data.item;
        const t = encodeURIComponent(title);
        console.log('t', t, title, res);
        return {
            title: '一起来竞猜吧',
            url: `/pages/detail/detail?id=${id}&title=${encodeURIComponent(title)}&status=${status}&read=${read}&message=${message}`
        };
    },
    onLoad(option) {
        wx.setNavigationBarTitle({
            title: '答题详情'
        })
        const that = this;
        API.ajax('/topic/12', '', function (res) {
            //这里既可以获取模拟的res
            if (res.success) {
                const list = res.data.filter((item) => item.from === '');
                option.title = decodeURIComponent(option.title);
                console.log('detail', option, list);
                that.setData({
                    list,
                    item: option,
                })
            }
        });
    }
  })
  