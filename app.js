//app.js

const APP_ID ='wx9e3ef944fc45397f';//输入小程序appid  
const APP_SECRET ='251df6805548256e564f66a4063a916f';//输入小程序app_secret  
var OPEN_ID=''//储存获取到openid  
var SESSION_KEY=''//储存获取到session_key
const API= require("utils/api.js")

App({
    data:{
      userInfo:''
    },
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        var that=this;  
        // 登录
        wx.login({
            success: res => {
                console.log('login', res);
                   
        // 获取用户信息
                wx.getSetting({
                    success: res => {
                        if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                        wx.getUserInfo({
                            success: res => {
                                // 可以将 res 发送给后台解码出 unionId
                                // UPNrb/+climLJBbA6PyzwQ==
                                that.globalData.userInfo = res.userInfo
                                console.log(res,"")
                                // this.setData({
                                //     userInfo:res.userInfo
                                // })
                                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                // 所以此处加入 callback 以防止这种情况
                                if (this.userInfoReadyCallback) {
                                    this.userInfoReadyCallback(res)
                                }
                            }
                        })
                        }
                    }
                })
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({  
                    //获取openid接口  
                  url: 'https://api.weixin.qq.com/sns/jscode2session',  
                  data:{  
                    appid:APP_ID,  
                    secret:APP_SECRET,  
                    js_code:res.code,  
                    grant_type:'authorization_code'  
                  },
                  method:'GET', 
                  success:function(res){  
                    console.log(res.data)  
                    OPEN_ID = res.data.openid;//获取到的openid
                    that.globalData.openid= res.data.openid; 
                    SESSION_KEY = res.data.session_key;//获取到session_key  
                    console.log(OPEN_ID.length)  
                    console.log(SESSION_KEY.length) 
                    API.ajax('/user', '', function (res) {
                        //这里既可以获取模拟的res
                        console.log(res,res.data)
                        res.data.map((item)=>{
                            if(!item.userInfo){
                                console.log(that.data.userInfo, that.globalData)
                                API.ajax('/user',json.stringy(that.globalData),function(res){
                                     console.log(res)
                                },'post')
                            }
                        })
                    });
                  }
                })
             
            }
        })
     
    },
    globalData: {
        userInfo: null,
        openid:null,
    }
})