const API = require('../../utils/api.js')
const app = getApp()
Page({
    data: {
       list:[],
       condition:false
    },
    onLoad(){
        const that = this;
        console.log(app.globalData.userId)
        const userid = app.globalData.userId;
        API.ajax('/answer', '', function (userres) {
            //这里既可以获取模拟的res
            const arr =[];
            console.log(userres)
          if(userres.statusCode===200){
                let isAnswer = false;
                userres.data.forEach((resanswer)=>{
                    console.log(resanswer)
                    resanswer.stars.forEach((i)=>{
                        console.log(i.id)
                         if(i.id===app.globalData.userId){
                            isAnswer = true
                         }
                    })
                    // if(resanswer.stars.id===app.globalData.userId){
                    if(isAnswer){
                        arr.push(resanswer.topic)
                    }
                    //     isAnswer = true
                    //     arr.push(resanswer.stars)
                    // }
                    console.log(arr,isAnswer)
                })
                if(isAnswer){
                    that.setData({
                        list: arr,
                        condition:true
                        })  
                }else{
                    that.setData({
                        condition:false
                        })
                    }
            //   if(userres.user.id===app.globalData.userId){
            //     arr.push(userres.topic,)
            //     that.setData({
            //         list: arr,
            //         condition:true
            //     })
            //   }else{
            //     that.setData({
            //         condition:fasle
            //     })
            // }
          }
        });
    }
})