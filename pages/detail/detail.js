const API = require('../../utils/api.js')
const app = getApp();

Page({
    data: {
        list: [],
        item: {},
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
        new app.MyToast();
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
                    option,
                })
            }
        });
    },
    handlelike(e) {
        console.log('handlelike', e);
        const { message } = e.currentTarget.dataset;
        const num = message.likeNum + 1;
        console.log('num', num);
        const that = this;
        const { option } = this.data;
        API.ajax(`/message/${message.id}`, JSON.stringify({ likeNum: num }), function (res) {
            if (res.statusCode == 200) {
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
                            option,
                        })
                    }
                });
                that.show('收藏成功', 'dianzan1', '#FFD62D');
            } else {
                that.show('收藏失败', 'cuowu', '#F45353');
            }
        }, 'PUT');
    }
})
  