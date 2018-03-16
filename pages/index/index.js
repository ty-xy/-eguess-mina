//index.js
//获取应用实例
import API from '../../utils/api.js';
import format from '../../utils/util';
const app = getApp()
const size = 5;
let page = 1;
const APP_ID ='wx9e3ef944fc45397f';//输入小程序appid  
const APP_SECRET ='251df6805548256e564f66a4063a916f';//输入小程序app_secret 

const loadMore = function(that){
    that.setData({
        isLoading: true,
        noMore: false,
    })
    API.ajax('/topic', { limit: page * size, sort: { createdAt: 0 } }, function (res) {
        //这里既可以获取模拟的res
        if (res.statusCode === 200) {
            if (res.data.length === that.data.list.length) {
                that.setData({
                    list: res.data,
                    isLoading: false,
                    noMore: true,
                })
            } else {
                page++;
                that.setData({
                    list: res.data,
                    noMore: false,
                    isLoading: false,
                })
            }
        }
    });
};
const findElem = (arrayToSearch, attr, val) => {
    for (let i = 0;i < arrayToSearch.length; i++){
        if(arrayToSearch[i][attr] === val){
            return i;
        }
    }
    return -1;
};

const totalTime = 15 * 60 * 1000;


Page({
    data: {
        motto: 'tao',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        list: [],
        isStop: true,
        noMore: false,
        isLoading: true,
        timer: '00: 00',
    },
    onShareAppMessage: function (res) {
        const { userId } = app.globalData;
        return {
            title: '自定义转发标题',
            path: `/pages/index/friend?=${userId}`,
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
        const { friend = '5aa36f1cf449007d37514e8a' } = option;
        const { userId } = app.globalData;
        app.globalData.hh = 'ppppp';
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
        const that = this;
        wx.getSystemInfo({
            success: function (res) {
              that.setData({
                    viewHeight: res.windowHeight,
              })
            }
        })
        wx.request({  
            //获取openid接口  
            url: 'https://api.weixin.qq.com/sns/jscode2session',  
            data:{  
                appid: APP_ID,  
                secret: APP_SECRET,  
                js_code: app.globalData.code,  
                grant_type:'authorization_code'  
            },
            method:'GET', 
            success: function(appid){  
                const OPEN_ID = appid.data.openid;//获取到的openid
                app.globalData.openid = appid.data.openid; 
                const SESSION_KEY = appid.data.session_key;//获取到session_key  
                const userInfos= {
                    openid: OPEN_ID,
                    ...app.globalData.userInfo,
                }
                API.ajax('/wxuserinfo', (userInfos), function (userRes) {
                    app.globalData.userId = userRes.data;
                    if (friend) {
                        const putData = {
                            username:`zg-ty@1${Math.ceil(Math.random()*10000)}3.com`,
                            email:`zg-ty@1${Math.ceil(Math.random()*10000)}3.com`,
                        }
                        API.ajax(`/user/${userRes.data}`, '', function(res){
                            const { beFriends = [] } = res.data;
                            const isHas = findElem(beFriends, 'id', friend);
                            if (isHas === -1) {
                                beFriends.push(friend);
                                putData.beFriends = beFriends;
                                API.ajax(`/user/${userRes.data}`, JSON.stringify(putData), function(res){}, 'put');
                            }
                        });
                    }
                })
            
            }
        }) 
        // 获取首页数据
        loadMore(that);
        // const tim = format.countdown(this, totalTime)
        // format.countdown(this, totalTime);
        
    },
    getUserInfo: function(e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });  
    },
    getPhoneNumber: function(e) {      
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
    // 阅读量记录
    handleClick(e) {
        const { msg } = e.currentTarget.dataset;
        const that = this;
        const readNum = msg.readNum + 1;
        API.ajax(`/topic/${msg.id}`, JSON.stringify({ ...msg, readNum }), function (res) {
            //这里既可以获取模拟的res
            if (res.statusCode === 200) {
                wx.navigateTo({
                    url: `/pages/detail/detail?id=${msg.id}&title=${msg.title}&status=${msg.status}&readNum=${readNum}&messageNum=${(msg.toAnswer && msg.toAnswer.length) || 0}`,
                })
                API.ajax('/topic', { limit: page * size, sort: { createdAt: 0 } }, function (res) {
                    //这里既可以获取模拟的res
                    if (res.statusCode === 200) {
                        that.setData({
                            list: res.data
                        })
                    }
                });
            }
        }, 'PUT');
    },
       //页面滑动到底部
    bindDownLoad() {   
        const that = this;
        loadMore(that);
    },

})
