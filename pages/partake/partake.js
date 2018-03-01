const API = require('../../utils/api.js')
Page({
    data: {
       list:[],
    },
    onLoad(){
        const that = this
        API.ajax('/topic', '', function (res) {
            //这里既可以获取模拟的res
            console.log(res)
            that.setData({
                list: res.data
            })
        });
        console.log(this.data.list)
    }
   
})