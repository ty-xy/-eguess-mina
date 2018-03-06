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
    onShareAppMessage: function (res) {
        console.log('share', getCurrentPages()); 
        return {
            title: '自定义转发标题',
            path: '/pages/index/index?id=123',
            success: function(res) {
              // 转发成功
            },
            fail: function(res) {
              // 转发失败
            }
        };
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../rank/rank'
        })
    },
    onLoad: function (option) {
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
                    console.log('getUserInfo', res)
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
        const that = this

        // 获取首页数据
        API.ajax('/topic', '', function (res) {
            //这里既可以获取模拟的res
            if (res.statusCode === 200) {
                console.log('index', res.data);
                that.setData({
                    list: res.data
                })
            }
        });
    },
    getUserInfo: function(e) {
        console.log("getUserInfo", e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });  
    },
    getPhoneNumber: function(e) {   
        console.log(e.detail.errMsg)   
        console.log(e.detail.iv)   
        console.log(e.detail.encryptedData)   
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny'){  
            wx.showModal({  
                title: '提示',  
                showCancel: false,  
                content: '未授权',  
                success: function (res) { }  
            })  
        } else {  
            wx.showModal({  
                title: '提示',  
                showCancel: false,  
                content: '同意授权',  
                success: function (res) { }  
            })  
        }  
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
    },
    // 阅读量记录
    handleClick(e) {
        console.log('handleClick', e);
        const { msg } = e.currentTarget.dataset;
        const that = this;
        const readNum = msg.readNum + 1;
        API.ajax(`/topic/${msg.id}`, JSON.stringify({ ...msg, readNum }), function (res) {
            //这里既可以获取模拟的res
            if (res.statusCode === 200) {
                API.ajax('/topic', '', function (res) {
                    //这里既可以获取模拟的res
                    if (res.statusCode === 200) {
                        console.log('index', res.data);
                        that.setData({
                            list: res.data
                        })
                    }
                });
            }
        }, 'PUT');
        wx.navigateTo({
            url: `/pages/detail/detail?id=${msg.id}&title={msg.title}&status=${msg.status}&readNum=${msg.readNum}&messageNum={msg.messageNum}`,
        })
    }
})
