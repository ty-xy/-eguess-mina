//index.js
//获取应用实例
const API = require('../../utils/api.js')
const app = getApp()
var initData = 'this is first line\nthis is second line'
var extraLine = [];
Page({
    data: {
        motto: 'tao',
        userInfo: {},
        text: initData,
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        list: [],
        isStop: true
    },
    onShareAppMessage: function (res) {},
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
        url: '../rank/rank'
        })
    },
    onLoad: function () {
        if (app.globalData.userInfo) {
        this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
        })
        } else if (this.data.canIUse){
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
            this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
            })
        }
        } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
            success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
            })
            }
        })
        }
        const that = this

        // 使用 Mock
        API.ajax('/topic', '', function (res) {
            //这里既可以获取模拟的res
            console.log(res)
            that.setData({
                list: res.data
            })
        });
        console.log(this.data.list)
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
        })
    },
    add:function(e){
        extraLine.push('other line')
        this.setData({
            text:initData + '\n' + extraLine.join('\n')
        })
    },
    remove:function(e){
        if(extraLine.length>0){
            extraLine.pop()
            extraLine.pop()
            this.setData({
            text: initData + '\n' + extraLine.join('\n')
            })
        }
    }
})
