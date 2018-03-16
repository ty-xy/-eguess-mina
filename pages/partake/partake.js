const API = require('../../utils/api.js')
const app = getApp()
Page({
    data: {
       list:[],
       condition:false
    },
    onLoad(){
        const that = this;
        const userid = app.globalData.userId;
        API.ajax(`/user/${userid}`, '', function (userres) {
            //这里既可以获取模拟的res
            const topic = userres.data.topicId;
            const arr =[];
            if(topic&&topic.length>0){
                topic.forEach((item)=>{
                    API.ajax(`/topic/${item}`, '', function (res) {
                        //这里既可以获取模拟的res
                        arr.push(res.data)
                        that.setData({
                            list: arr,
                            condition:true
                        })
                    }); 
                })
            }else{
                that.setData({
                    condition:fasle
                })
            }
        });
       
    }
})