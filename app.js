import { MyToast } from './components/my-toast/my-toast'

const API= require("utils/api.js")
const APP_ID ='wx9e3ef944fc45397f';//输入小程序appid  
const APP_SECRET ='251df6805548256e564f66a4063a916f';//输入小程序app_secret 


const findElem = (arrayToSearch, attr, val) => {
    for (let i = 0;i < arrayToSearch.length; i++){
        if(arrayToSearch[i][attr] === val){
            return i;
        }
    }
    return -1;
};


App({
    MyToast,
    onLaunch: function (option) {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        var that=this;  
        // 好友邀请
        const { friend } = option.query;
        // 登录
         wx.login({
            success: res => {
                // 获取用户信息
                that.globalData.code = res.code;
                wx.getSetting({
                    success: () => {
                        // if (!res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                            wx.getUserInfo({
                                success: result => {
                                    // 可以将 res 发送给后台解码出 unionId
                                    // UPNrb/+climLJBbA6PyzwQ==
                                    that.globalData.userInfo = result.userInfo
                                    const userinfo = result.userInfo
                                    // this.setData({
                                    //     userInfo:res.userInfo
                                    // })
                                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                    // 所以此处加入 callback 以防止这种情况
                                    wx.request({  
                                        //获取openid接口  
                                        url: 'https://api.weixin.qq.com/sns/jscode2session',  
                                        data:{  
                                            appid: APP_ID,  
                                            secret: APP_SECRET,  
                                            js_code: res.code,  
                                            grant_type: 'authorization_code'  
                                        },
                                        method:'GET', 
                                        success: function(appid){  
                                            const OPEN_ID = appid.data.openid;//获取到的openid
                                            that.globalData.openid = appid.data.openid; 
                                            const SESSION_KEY = appid.data.session_key; //获取到session_key  
                                            const userInfos= {
                                                openid: OPEN_ID,
                                                ...result.userInfo,
                                            }
                                            API.ajax('/wxuserinfo', (userInfos), function (userRes) {
                                                that.globalData.userId = userRes.data;
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
                                    if (this.userInfoReadyCallback) {
                                        this.userInfoReadyCallback(result)
                                    }
                                }
                            })
                        // }
                    }
                })
             
            }
        })
   
    },
    globalData: {
        userInfo: {},
    }
})