
const API = require('../../utils/api.js')
const app = getApp()

let  initdata = function (that) {  
    let list = that.data.list  
    for (var i = 0; i < list.length; i++) {  
      list[i].txtStyle = 0 
    }  
    that.setData({ list: list })  
  } 


Page({
  data: {
    userInfo: {},
    // text: initData,
    left:'rank-color',
    right:"",
    list: [],
    commentList:[],
    showTopic:false,
    showComment:false,
    isStop: true,
    change:true,
    startX:"",
    delBtnWidth: 47,
    
  },
  //事件处理函数

  onLoad: function () {
    
    const that = this
    const userid = app.globalData.userId;
    console.log(userid)
    // 使用 Mock
    API.ajax('/topic', '', function (userres) {
        const topic = userres.data.stars;
        // console.log(userres.data.topic)
        // const answer = userres.data.comment;
        let isUserId = false;
        const arr = [];
        const next= [];
        if(topic&&topic.length !==0){
            topic.forEach((i)=>{
                 if(i.id===userid){
                     isUserId = true
                }
            })
        //     topic.forEach((i)=>{
        //         i.txtStyle="left:0px";
        //     })
        //       that.setData({
        //           list:topic,
        //           showTopic:true
        //       })
        // }else{
        //     // 假如没有数据的处理逻辑
        //     that.setData({
        //         showTopic:false
        //     })
            // console.log(that.data.showTopic)
        }
        if(isUserId){
            console.log()
        }
        if(answer&&answer.length !==0){
            answer.forEach((item)=>{
                API.ajax(`/message/${item}`,'',function(commentres){
                      console.log("321213",commentres)
                      next.push(commentres.data)
                      next.forEach((i)=>{
                        i.txtStyle="left:0px";
                        })
                      that.setData({
                        commentList: next,
                        showComment:true
                    })
                })
            })
        }else{
            that.setData({
                showComment:false
            })
            console.log(that.data.showTopic)
        }
    })
    
  },
  changeView(e){
    //  console.log(e.target.id)
     const that = this
     if(e.target.id==="qusetion"){
        this.data.commentList.forEach((i)=>{
            i.txtStyle="left:0px";
        })
        that.setData({
            change:true,
            left:'rank-color',
            right:'',
            commentList:that.data.commentList
        })  
     }else{
        this.data.list.forEach((i)=>{
            i.txtStyle="left:0px";
        })
        that.setData({
            change:false,
            left:'',
            right:'rank-color',
            list:that.data.list
        })  
     }
   },
drawStart (e){  
    if (e.touches.length == 1) {  
        this.setData({  
            //设置触摸起始点水平方向位置  
            startX: e.touches[0].clientX  
        });
    }
 },  
 drawEnd (e){  
    const that = this;
   if(e.changedTouches.length===1){
        var endX = e.changedTouches[0].clientX;
        var disX = this.data.startX-endX;
        var delBtnWidth = this.data.delBtnWidth;
        var txtStyle = disX > delBtnWidth/2?"left:-"+delBtnWidth+"px":"left:0px";
        const index=e.currentTarget.dataset.index
        if(this.data.change===true){
            console.log(that.data.list[index],txtStyle)
            that.data.list[index].txtStyle=txtStyle;
            that.data.commentList.txtStyle=0;
            that.setData({
                list:that.data.list,
                commentList:that.data.commentList
            })
        }else{
            that.data.commentList[index].txtStyle=txtStyle;
            that.data.list.txtStyle=0
            that.setData({
                commentList:that.data.commentList,
                list:that.data.list
            })
        }
   }

 },  
 drawMove (e){  
    let that = this
    initdata(that) 
    if(e.touches.length == 1){
        const moveX = e.touches[0].clientX;  
        const disX = this.data.startX - moveX;
        const delBtnWidth = this.data.delBtnWidth; 
        let txtStyle;
        if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
            txtStyle = "left:0px";  
            // console.log("不做任何操作")
          } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
            // 
            // txtStyle = "left:-" + disX+ "px";  
            // console.log("移动拉",disX)
            if (disX >= delBtnWidth) {  
              //控制手指移动距离最大值为删除按钮的宽度  
              txtStyle = "left:-" + delBtnWidth + "px";  
            }  else{
                txtStyle = "left:-" + disX+ "px";
            }
          }  
          const index=e.currentTarget.dataset.index
          that.data.list[index].txtStyle=txtStyle;
          that.setData({
            list:that.data.list
        })
    }
 
 },  
   //获取元素自适应后的实际宽度 
 getEleWidth: function (w) {  
    var real = 0;  
    try {  
      var res = wx.getSystemInfoSync().windowWidth;  
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应  
      // console.log(scale);  
      real = Math.floor(res / scale);  
      return real;  
    } catch (e) {  
      return false;  
      // Do something when catch error  
    }  
  },  
  initEleWidth: function () {  
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);  
    this.setData({  
      delBtnWidth: delBtnWidth  
    });  
  }, 
 //删除item  
 delItem(e){  
    let dataId = e.currentTarget.dataset.id;  
    const userid = app.globalData.userId;
   console.log("删除"+dataId);  
   var cardTeams = this.data.list;  
   var newCardTeams = []; 
     
   for(var i in cardTeams){  
       var item = cardTeams[i];  
       if(item.id != dataId){  
         newCardTeams.push(item);  
       }  
   }  
   this.setData({  
       list:newCardTeams  
    });  
    API.ajax(`/user/${userid}`, '', function (userres) {
        const topic = userres.data.collection;
        if(topic&&topic.length !==0){
           const tIndex=topic.indexOf(dataId)
           topic.splice(tIndex,1)
           const topicdata={
              collection:topic,
              username:userres.data.username,
              email:userres.data.email
           } 
           API.ajax(`/user/${userid}`,JSON.stringify(topicdata),function(gres){
                 console.log(gres)
           },'put')
        }
    })

 }, 
   tap: function(e) {
    this.setData({
      x: 30,
      y: 30
    });
  }
})
