const API = require('../../utils/api.js')
const app = getApp()
Page({
    data: {
       list:[],
       condition:false
    },
    onLoad(){
        const that = this;
        console.log("userId",app.globalData.userId)
        const userid = app.globalData.userId;
        //获得前端传过来的userid
        API.ajax('/answers',{userid}, function (userres) {
            //这里既可以获取模拟的res
            
            console.log(userres)
            if(userres.data !== ""){
                that.setData({
                    condition:true,
                    list:userres.data
                })  
            } else {
                that.setData({
                    condition:false
                })
            }
        });
    }
})