//logs.js
const util = require('../../utils/util.js')
const API = require('../../utils/api.js')
const app = getApp()

Page({
  data: {
    list: [],
    ownlist:[],
    frienlist:[],
    wordList:[],
    title:"切换好友榜",
    src: '../../images/world@2x.png',
  },
  canvasIdErrorCallback: function (e) {
    // console.error(e.detail.errMsg)
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
    const id = app.globalData.userId;
    // 使用 Mock
    const userId = app.globalData.userId
    
    API.ajax('/rank',"", function (res) {
        //这里既可以获取模拟的res
        console.log(res)
        that.setData({
            list:res.data,
            wordList:res.data
        })
        const lisy = []
        if(res&&res.data.length>0){
            res.data.forEach((item,index)=>{
                if(item.id===userId){
                    item.index = index+1
                    lisy.push(item)
                }
           })
           that.setData({
            ownlist:lisy,
            });
         }
       
    });
    API.ajax('/friend', { search: { id } }, function (res) {
        //这里既可以获取模拟的res
        console.log('res', res)
        if (res.statusCode === 200) {
            API.ajax('/answerRank', { allFriendIds: res.data.allFriendIds }, function (answers) {
                console.log('answers', answers)
            })
        }
    });
    // API.ajax('/friendRanklist', '', function (res) {
    //     //这里既可以获取模拟的res
    //     that.setData({
    //         friendlist: res.data
    //     })
    // });
  },
  changeRank(){
    const that = this
    if(this.data.title==="切换好友榜"){
          this.setData({
                title:"切换世界榜",
                src:'../../images/friend@2x.png',
                list:that.data.friendlist,
           })
       }else {
           this.setData({
               title:"切换好友榜",
               src:'../../images/world@2x.png',
               list:that.data.wordList
            })   
           
       }
   },
})
