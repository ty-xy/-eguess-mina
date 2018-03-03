const API = require('../../utils/api.js')
const app = getApp()

Page({
    data: {
        list: [],
        item: {},
        m2m: {},
        textarea: null,
    },
    onShareAppMessage: function (res) {},
    onLoad: function(option) {
        wx.setNavigationBarTitle({
            title: '答题详情'
        })
        this.setData({
            userInfo: app.globalData.userInfo,
        })
        console.log('答题详情', option);
        const that = this;
        API.ajax(`/topic/${option.topicId}`, '', function (res) {
            //这里既可以获取模拟的res
            if (res.statusCode === 200) {
                const list = res.data.answers.filter((item) => (item.messageId === option.id))
                that.setData({
                    list,
                    item: res.data,
                    m2m: option,
                })
            }
        });
    },
    bindFormSubmit: function(e) {
        const { avatarUrl, gender } = this.data.userInfo;
        const newMsg = {
            comment: e.detail.value,
            ...this.data.userInfo,
            topicInfo: this.data.m2m.topicId,
            messageId: this.data.m2m.id,
        };
        const that = this;
        API.ajax('/message', JSON.stringify(newMsg), function (res) {
            if (res.statusCode === 200 || res.statusCode === 201) {
                wx.showToast({
                    title: '评论成功',
                    icon: 'success',
                    duration: 1500
                })
                API.ajax(`/topic/${that.data.m2m.topicId}`, '', function (result) {
                    //这里既可以获取模拟的res
                    if (result.statusCode === 200) {
                        const list = result.data.answers.filter((item) => (item.messageId === that.data.m2m.id));
                        that.setData({
                            list,
                            item: result.data,
                            textarea: null,
                        })
                    }
                });
            }
        }, 'POST');
    },
    bindTextAreaChange: function (e) {
        const that = this;
        const textarea = e.detail.value;
        that.setData({ textarea });
    },
  })
  