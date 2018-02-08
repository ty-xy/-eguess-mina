//logs.js
const util = require('../../utils/util.js')
const API = require('../../utils/api.js')
const app = getApp()

Page({
  data: {
    list: [],
    title:"切换好友榜",
    src: '../../images/world@2x.png',
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  onShareAppMessage: function (res) {},
  onLoad: function () {
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
    const that = this

    // 使用 Mock
    API.ajax('/ranklist', '', function (res) {
        //这里既可以获取模拟的res
        console.log(res)
        that.setData({
            list: res.data
        })
    });
    console.log(this.data.list)
    
  },
  changeRank:function(){
    if(this.data.title==="切换好友榜"){
       this.setData({
           title:"切换世界榜",
           src:'../../images/world@2x.png',
           })
       }else{
           this.setData({
               title:"切换好友榜",
               src:'../../images/friend@2x.png',
               })   
       }
       console.log(this.data.title)
   },
})
