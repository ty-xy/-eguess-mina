
const API = require('../../utils/api.js')
const app = getApp()

Page({
    data: {
        list: [],
        item: {},
        m2m: {},
    },
    onShareAppMessage(res) {},
    onLoad(option) {
        wx.setNavigationBarTitle({
            title: '答题'
        })
        this.setData({
            item: option,
            userInfo: app.globalData.userInfo,
        })
    },
    bindFormSubmit(e) {
        const { avatarUrl, gender } = this.data.userInfo;
        const newMsg = {
            body: e.detail.value.textarea,
            topic: this.data.item.topicid,
        };
        const that = this;
        API.ajax('/answer', JSON.stringify(newMsg), function (res) {
            if (res.statusCode === 200 || res.statusCode === 201) {
                API.ajax('/answer', { topicid: that.data.item.topicid }, function (result) {
                    //这里既可以获取模拟的res
                    if (result.statusCode === 200) {
                        wx.showToast({
                            title: '抢答成功',
                            icon: 'success',
                            duration: 1500
                        })
                        const pages = getCurrentPages();
                        const currPage = pages[pages.length - 1];   //当前页面
                        const prevPage = pages[pages.length - 2];  //上一个页面
                        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
                        prevPage.setData({
                            list: result.data,
                        })
                        setTimeout(function(){
                            wx.navigateBack();
                        }, 1500)
                    }
                });
            }
        }, 'POST');
        
    }
})


