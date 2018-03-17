const API = require('../../utils/api.js')
const size = 5;
let page = 1;
const app = getApp()
const loadMore = function(that){
    that.setData({
        isLoading: true,
        noMore: false,
    }) 
    const userid = app.globalData.userId;
    API.ajax('/answers', { limit: page * size, sort: { createdAt: 0 },search: { createdBy:userid } }, function (res) {
        //这里既可以获取模拟的res
        console.log(res,res.data.length,that.data.list.length)
        if (res.statusCode === 200) {
            if (res.data.length === that.data.list.length) {
                that.setData({
                    list: res.data,
                    isLoading: false,
                    noMore: true,
                })
            } else {
                page++;
                that.setData({
                    list: res.data,
                    noMore: false,
                    isLoading: false,
                })
            }
        }
    });
};
Page({
    data: {
       list:[],
       condition:false,
       noMore: false,
       isLoading: true,
    },
    onLoad(){
        const that = this;
        const userid = app.globalData.userId;
        loadMore(that);
        //获得前端传过来的userid
        wx.getSystemInfo({
            success: function (res) {
              that.setData({
                    viewHeight: res.windowHeight,
              })
            }
        })
        API.ajax('/answers',{ limit: page * size, sort: { createdAt: 0 },search: { createdBy:userid } }, function (userres) {
            //这里既可以获取模拟的res
            if(userres.data !== ""){
                that.setData({
                 list : userres.data,
                 condition:true,
                })  
            } else {
                that.setData({
                 condition:false
                })
            }
        });
    },
    bindDownLoad() {   
        const that = this;
        loadMore(that);
    },
})