const API = require('../../utils/api.js')
const app = getApp();
const size = 5;
let page = 1;
const loadMore = function(that, option){
    // API.ajax('/answer', { topicid: option.id,  }, function (res) {
    //     console.log('answer', res)
    //     //这里既可以获取模拟的res
    //     if (res.statusCode === 200) {
    //         that.setData({
    //             list: res.data,
    //             userid: app.globalData.userid,
    //         })
    //     }
    // });
    that.setData({
        isLoading: true,
        noMore: false,
    })
    API.ajax('/answer', { limit: page * size, topicid: option.id, userid: '5aa369c76b05d06032f381c5' }, function (res) {
        //这里既可以获取模拟的res
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
    // 点赞
    handlelike(e) {
        const { message } = e.currentTarget.dataset;
        const userid = app.globalData.userid;
        const that = this;
        
        const { option } = this.data;
        const likes = message.like;
        let method = 'post';
        let likeId = '';
        for (let i = 0; i < likes.length; i++) {
            if (message.id === likes[i].answerid) {
                method = 'delete';
                likeId = likes[i].id;
                break;
            }
        }
        if (method === 'post') {
            API.ajax('/like', JSON.stringify({ userid: '5a9a46834aff491a7530becd', answerid: message.id, user: '5a9a46834aff491a7530becd', answer: message.id }), function (res) {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    loadMore(that, option)
                    that.show('点赞成功', 'dianzan1', '#FFD62D');
                } else {
                    that.show('点赞失败', 'cuowu', '#F45353');
                }
            }, method);
        } else {
            API.ajax(`/like/${likeId}`, '', function (res) {
                console.log('res', res)
                if (res.statusCode === 200) {
                    loadMore(that, option)
                    that.show('点赞已取消', 'dianzan', '#666');
                } else {
                    that.show('操作失败', 'cuowu', '#F45353');
                }
            }, method);
        }
        
    },
    // 收藏
    handleMark(e) {
        const { message } = e.currentTarget.dataset;
        const userid = app.globalData.userid;
        const that = this;
        const { option } = this.data;
        const likes = message.like;
        let method = 'post';
        let likeId = '';
        for (let i = 0; i < likes.length; i++) {
            if (message.id === likes[i].answerid) {
                method = 'delete';
                likeId = likes[i].id;
                break;
            }
        }
        if (method === 'post') {
            API.ajax('/like', JSON.stringify({ userid: '5a9a46834aff491a7530becd', answerid: message.id, user: '5a9a46834aff491a7530becd', answer: message.id }), function (res) {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    loadMore(that, option)
                    that.show('点赞成功', 'dianzan1', '#FFD62D');
                } else {
                    that.show('点赞失败', 'cuowu', '#F45353');
                }
            }, method);
        } else {
            API.ajax(`/like/${likeId}`, '', function (res) {
                console.log('res', res)
                if (res.statusCode === 200) {
                    loadMore(that, option)
                    that.show('点赞已取消', 'dianzan', '#666');
                } else {
                    that.show('操作失败', 'cuowu', '#F45353');
                }
            }, method);
        }
    },
    //页面滑动到底部
    bindDownLoad() {   
        const that = this;
        loadMore(that, this.data.option);
        console.log("lower");
    },
})
  