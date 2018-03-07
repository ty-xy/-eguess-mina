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
        API.ajax(`/user/${userid}`, '', function (userres) {
            //这里既可以获取模拟的res
            console.log(userres.data.topicId)
            const topic = userres.data.topicId;
            const arr =[];
            console.log(topic,topic.length)
            if(topic&&topic.length>0){
                topic.forEach((item)=>{
                    API.ajax(`/topic/${item}`, '', function (res) {
                        //这里既可以获取模拟的res
                        console.log(res)
                        arr.push(res.data)
                        that.setData({
                            list: arr,
                            condition:true
                        })
                        console.log(that.data.list)
                    }); 
                    console.log(item)
                })
            }else{
                that.setData({
                    condition:fasle
                })
            }
            console.log(that.data.condition)
        });
       
    }
})