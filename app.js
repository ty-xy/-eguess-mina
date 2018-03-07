//app.js

const APP_ID ='wx9e3ef944fc45397f';//输入小程序appid  
const APP_SECRET ='251df6805548256e564f66a4063a916f';//输入小程序app_secret  
let OPEN_ID=''//储存获取到openid  
let SESSION_KEY=''//储存获取到session_key
const API= require("utils/api.js")

App({
    data:{
        userInfo:{}
    },
    onLaunch:  function () {
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
                    success: () => {
                        // if (!res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                            wx.getUserInfo({
                                success: result => {
                                    // 可以将 res 发送给后台解码出 unionId
                                    // UPNrb/+climLJBbA6PyzwQ==
                                    that.globalData.userInfo = result.userInfo
                                    console.log("getSetting", result)
                                    // this.setData({
                                    //     userInfo:res.userInfo
                                    // })
                                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                    // 所以此处加入 callback 以防止这种情况
                                    
                                    if (this.userInfoReadyCallback) {
                                        this.userInfoReadyCallback(result)
                                    }
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
                                        success: function(appid){  
                                            console.log('appid', appid.data)  
                                            OPEN_ID = appid.data.openid;//获取到的openid
                                            that.globalData.openid= appid.data.openid; 
                                        
                                            SESSION_KEY = appid.data.session_key;//获取到session_key  
                                            // 发送 res.code 到后台换取 openId, sessionKey, unionId
                                            // API.ajax('/usermessage','',function(umres){
                                            //      console.log("/usermessage",umres.data)
                                            // })
                                            API.ajax('/user', '', function (userRes) {
                                                //这里既可以获取模拟的res
                                                console.log('API--openid', userRes,that.globalData.openid)
                                                const updateData = {
                                                    openid: that.globalData.openid,
                                                    ...that.globalData.userInfo,
                                                    username:that.globalData.openid,
                                                    email:`zg-ty@1${Math.ceil(Math.random()*10000)}3.com`,
                                                };
                                                let isOpenid = false;
                                                let itemId='';         
                                                userRes.data.forEach((item)=>{
                                                    if (item.openid === that.globalData.openid) {
                                                        isOpenid = true;
                                                        itemId = item.id;
                                                        that.globalData.userId= item.id; 
                                                    }
                                                })
                                                if(!isOpenid){
                                                    console.log(that.globalData)
                                                    API.ajax('/user',JSON.stringify(updateData),function(res){
                                                        console.log(res)
                                                        that.globalData.userId= res.data.id; 
                                                    },'post')
                                                } else {
                                                    API.ajax(`/user/${itemId}`,JSON.stringify(updateData),function(opres){
                                                        console.log('rtrt', opres)
                                                    },'PUT')
                                                }
                                            });
                                        
                                        }
                                    })  
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
        openid:null,
        userId:null,
    }
})