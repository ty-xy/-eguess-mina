const API = require('../../utils/api.js')

Page({
    data: {
        list: [],
        item: {}
    },
    onShareAppMessage(res) {
        const { id, status, title, readNum, messageNum } = this.data.item;
        const t = encodeURIComponent(title);
        return {
            title: '一起来竞猜吧',
            url: `/pages/detail/detail?id=${id}&title=${encodeURIComponent(title)}&status=${status}&readNum=${readNum}&messageNum=${messageNum}`
        };
    },
    onLoad(option) {
        wx.setNavigationBarTitle({
            title: '答题详情'
        })
        const that = this;
        API.ajax(`/topic/${option.id}`, '', function (res) {
            //这里既可以获取模拟的res
            if (res.statusCode === 200) {
                // const list = res.data.filter((item) => item.from === '');
                option.title = decodeURIComponent(option.title);
                console.log('detail', res.data);
                const list = res.data.answers.filter((item) => (!item.messageId));
                that.setData({
                    list,
                    item: res.data,
                })
            }
        });
    },
  })
  