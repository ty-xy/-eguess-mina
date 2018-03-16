const API = require('../../utils/api.js')
const app = getApp()

Page({
    data:{
        list: []
    },
    onLoad:function(options){
        // 生命周期函数--监听页面加载
        const that = this;
        // 使用 Mock
        API.ajax('/message', '', function (res) {
            //这里既可以获取模拟的res
            that.setData({
                list: res.data
            })
        });
    },
    onReady:function(){
        // 生命周期函数--监听页面初次渲染完成
    },
    onShow:function(){
        // 生命周期函数--监听页面显示
    },
    onHide:function(){
        // 生命周期函数--监听页面隐藏
    },
    onUnload:function(){
        // 生命周期函数--监听页面卸载
    },
    onPullDownRefresh: function() {
        // 页面相关事件处理函数--监听用户下拉动作
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
    },
    // onShareAppMessage: function() {
    //     // 用户点击右上角分享
    //     return {
    //       title: 'title', // 分享标题
    //       desc: 'desc', // 分享描述
    //       path: 'path' // 分享路径
    //     }
    // }
})