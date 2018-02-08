
const API = require('../../utils/api.js')
const app = getApp()

Page({
  data: {
    userInfo: {},
    // text: initData,
    left:'rank-color',
    right:"",
    list: [],
    isStop: true,
    change:true,
    x: 0,
    y: 0
  },
  //事件处理函数
 
  onLoad: function () {
    
    const that = this

    // 使用 Mock
    API.ajax('/topic', '', function (res) {
        //这里既可以获取模拟的res
        console.log(res)
        that.setData({
            list: res.data
        })
    });
    console.log(this.data.list)
  },
  changeView(e){
     console.log(e.target.id)
     const that = this
     if(e.target.id==="qusetion"){
        that.setData({
            change:true,
            left:'rank-color',
            right:''
        })  
     }else{
        that.setData({
            change:false,
            left:'',
            right:'rank-color'
        })  
     }
   },
   tap: function(e) {
    this.setData({
      x: 30,
      y: 30
    });
  }
})
