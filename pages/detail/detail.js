const API = require('../../utils/api.js')
const app = getApp();
const size = 5;
let page = 1;
const loadMore = function(that, option){
    that.setData({
        isLoading: true,
        noMore: false,
    })
    API.ajax('/answer', { limit: page * size, search: { topic: option.id }, userid: '5a9a46834aff491a7530becd' }, function (res) {
        if (res.statusCode === 200) {
            if (res.data.length === that.data.list.length) {
                that.setData({
                    list: res.data,
                    userid: app.globalData.userid,
                    isLoading: false,
                    noMore: true,
                })
            } else {
                page++;
                that.setData({
                    list: res.data,
                    userid: app.globalData.userid,
                    noMore: false,
                    isLoading: false,
                })
            }
        }
    });
};

Page({
    data: {
        list: {},
        openid: '',
        viewHeight: '500px',
    },
    onShareAppMessage(res) {
        const { id, status, title, readNum, messageNum } = this.data.item;
        const t = encodeURIComponent(title);
        return {
            title: '一起来竞猜吧',
            url: `/pages/detail/detail?id=${id}&title=${encodeURIComponent(title)}&status=${status}&readNum=${readNum}&messageNum=${messageNum}`
        };
    },
    onLoad(option) {
        new app.MyToast();
        wx.setNavigationBarTitle({
            title: '答题详情'
        });
        this.setData({ option });
        const that = this;
        wx.getSystemInfo({
            success: function (res) {
              that.setData({
                    viewHeight: res.windowHeight,
              })
            }
        })
        loadMore(that, option);
        console.log('detail', option);
    },
    onShow() {
        loadMore(this, this.data.option);
    },
    // 点赞
    handlelike(e) {
        const { message } = e.currentTarget.dataset;
        const userid = app.globalData.userid || '5a9a46834aff491a7530becd';
        const that = this;
        const { option } = this.data;
        const { upVotes, upVote } = message;
        const resData = [];
        if (upVote) {
            for (let i = 0; i < upVotes.length; i++) {
                if (userid !== upVotes[i].id) {
                    resData.push(upVotes[i].id);
                }
            }
        } else {
            for (let i = 0; i < upVotes.length; i++) {
                resData.push(upVotes[i].id);
            }
            resData.push(userid);
        }
        API.ajax(`/answer/${message.id}`, JSON.stringify({ userid, upVote }), function (res) {
            if (res.statusCode == 200 || res.statusCode == 201) {
                console.log('answerres', res)
                loadMore(that, option)
                if (upVote) {
                    that.show('点赞已取消', 'dianzan', '#666');
                } else {
                    that.show('点赞成功', 'dianzan1', '#FFD62D');
                }
                
            } else {
                that.show('点赞失败', 'cuowu', '#F45353');
            }
        }, 'put');
        
    },
    // 收藏
    handleMark(e) {
        const { message } = e.currentTarget.dataset;
        const userid = app.globalData.userid || '5a9a46834aff491a7530becd';
        const that = this;
        const { option } = this.data;
        const { stars, isStar } = message;
        const resData = [];
        if (isStar) {
            for (let i = 0; i < stars.length; i++) {
                if (userid !== stars[i].id) {
                    resData.push(stars[i].id);
                }
            }
        } else {
            for (let i = 0; i < stars.length; i++) {
                resData.push(stars[i].id);
            }
            resData.push(userid);
        }
        API.ajax(`/answer/${option.id}`, JSON.stringify({ stars: resData }), function (res) {
            if (res.statusCode == 200 || res.statusCode == 201) {
                if (isStar) {
                    that.show('收藏已取消', 'shoucang', '#666');
                } else {
                    that.show('收藏成功', 'shoucang1', '#FFD62D');
                }
                loadMore(that, option)
            } else {
                that.show('收藏失败', 'cuowu', '#F45353');
            }
        }, 'put');
    },
    // 收藏话题
    handleMarkTopic(e) {
        const { message } = e.currentTarget.dataset;
        const userid = app.globalData.userid || '5a9a46834aff491a7530becd';
        const that = this;
        const { option } = this.data;
        const { stars, isStar } = message;
        const resData = [];
        if (isStar) {
            for (let i = 0; i < stars.length; i++) {
                if (userid !== stars[i].id) {
                    resData.push(stars[i].id);
                }
            }
        } else {
            for (let i = 0; i < stars.length; i++) {
                resData.push(stars[i].id);
            }
            resData.push(userid);
        }
        API.ajax(`/topic/${message.id}`, JSON.stringify({ stars: resData }), function (res) {
            if (res.statusCode == 200 || res.statusCode == 201) {
                if (isStar) {
                    that.show('收藏已取消', 'shoucang', '#666');
                } else {
                    that.show('收藏成功', 'shoucang1', '#FFD62D');
                }
                loadMore(that, option)
            } else {
                that.show('收藏失败', 'cuowu', '#F45353');
            }
        }, 'put');
    },
    //页面滑动到底部
    bindDownLoad() {   
        const that = this;
        loadMore(that, this.data.option);
        console.log("lower");
    },
})
  