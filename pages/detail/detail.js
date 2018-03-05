const API = require('../../utils/api.js')
const app = getApp();

Page({
    data: {
        list: [],
        item: {},
        openid: '',
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
                    openid: app.globalData.openid,
                })
            }
        });
    },
    // 点赞
    handlelike(e) {
        console.log('data', this.data);
        const { message } = e.currentTarget.dataset;
        const openid = app.globalData.openid;
        const likeArr = message.likeArr || [];
        let isLike = false;
        if (likeArr.indexOf(openid) === -1) {
            likeArr.push(openid);
            isLike = true;
        } else {
            likeArr.splice(likeArr.indexOf(openid), 1);
        }
        const that = this;
        const { option } = this.data;
        API.ajax(`/message/${message.id}`, JSON.stringify({ likeArr }), function (res) {
            if (res.statusCode == 200) {
                API.ajax(`/topic/${option.id}`, '', function (res) {
                    //这里既可以获取模拟的res
                    if (res.statusCode === 200) {
                        // const list = res.data.filter((item) => item.from === '');
                        option.title = decodeURIComponent(option.title);
                        const list = res.data.answers.filter((item) => (!item.messageId));
                        that.setData({
                            list,
                            item: res.data,
                            option,
                        })
                    }
                });
                if (isLike) {
                    that.show('点赞成功', 'dianzan1', '#FFD62D');
                } else {
                    that.show('取消点赞', 'dianzan', '#666');
                }
            } else {
                that.show('点赞失败', 'cuowu', '#F45353');
            }
        }, 'PUT');
    },
    // 收藏
    handleMark(e) {
        const { message } = e.currentTarget.dataset;
        console.log('handleMark', message, this.data);
        const openid = app.globalData.openid;
        const bookMarks = message.bookMarks || [];
        let isLike = false;
        if (bookMarks.indexOf(openid) === -1) {
            bookMarks.push(openid);
            isLike = true;
        } else {
            bookMarks.splice(bookMarks.indexOf(openid), 1);
        }
        const that = this;
        const { option } = this.data;
        API.ajax(`/message/${message.id}`, JSON.stringify({ bookMarks }), function (res) {
            if (res.statusCode == 200) {
                API.ajax(`/topic/${option.id}`, '', function (res) {
                    //这里既可以获取模拟的res
                    if (res.statusCode === 200) {
                        // const list = res.data.filter((item) => item.from === '');
                        option.title = decodeURIComponent(option.title);
                        const list = res.data.answers.filter((item) => (!item.messageId));
                        const resList = [];
                        list.forEach((item) => {
                            if (item.bookMarks.indexOf(app.globalData.openid) > -1) {
                                item.isBookMark = true;
                            }
                            resList.push(item);
                        });
                        that.setData({
                            list: resList,
                            item: res.data,
                            option,
                        })
                    }
                });
                if (isLike) {
                    that.show('收藏成功', 'shoucang', '#FFD62D');
                } else {
                    that.show('取消收藏', 'shoucang1', '#666');
                }
            } else {
                that.show('收藏失败', 'cuowu', '#F45353');
            }
        }, 'PUT');
    }
})
  