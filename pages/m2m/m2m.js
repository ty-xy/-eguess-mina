const API = require('../../utils/api.js')
const app = getApp()
const userid = app.globalData.userid || '5a9a46834aff491a7530becd';

const getAnswer = (that, option) => {
    API.ajax(`/answer/${option.answerid}`, '', function (res) {
        //这里既可以获取模拟的res
        if (res.statusCode === 200) {
            const select = res.data;
            let _res = select.upVotes.filter((item) => (item.id === userid));
            let shoucang = select.stars.filter((item) => (item.id === userid));
            if (_res.length) {
                select.upVote = true;
            }
            if (shoucang.length) {
                select.isStar = true;
            }
            that.setData({
                select,
            })
        }
    });
}

Page({
    data: {
        list: [],
        item: {},
        m2m: {},
        textarea: null,
        select: {
            comments: [],
            stars: [],
            createdBy: {},
        },
    },
    onShareAppMessage: function (res) {},
    onLoad: function(option) {
        new app.MyToast();
        wx.setNavigationBarTitle({
            title: '答题详情'
        })
        // const userid = app.globalData.userid || '5a9a46834aff491a7530becd';
        this.setData({
            userInfo: app.globalData.userInfo,
            option,
        })
        console.log('答题详情', option);
        const that = this;
        API.ajax('/comment', { answerid: option.answerid }, function (res) {
            //这里既可以获取模拟的res
            if (res.statusCode === 200) {
                // const list = res.data.answers.filter((item) => (item.messageId === option.id))
                that.setData({
                    list: res.data,
                })
            }
        });
        getAnswer(this, option);
    },
    bindFormSubmit: function(e) {
        const { avatarUrl, gender } = this.data.userInfo;
        const { option } = this.data;
        const newMsg = {
            body: e.detail.value,
            answer: option.answerid,
            createdAt: app.globalData.userid,
        };
        const that = this;
        console.log('newMsg', newMsg)
        API.ajax('/comment', JSON.stringify(newMsg), function (res) {
            if (res.statusCode === 200 || res.statusCode === 201) {
                wx.showToast({
                    title: '评论成功',
                    icon: 'success',
                    duration: 1500
                })
                API.ajax('/comment', { answerid: option.answerid }, function (res) {
                    //这里既可以获取模拟的res
                    if (res.statusCode === 200) {
                        // const list = res.data.answers.filter((item) => (item.messageId === option.id))
                        that.setData({
                            list: res.data,
                            textarea: null,
                        })
                    }
                });
            }
        }, 'POST');
    },
    bindTextAreaChange: function (e) {
        const that = this;
        const textarea = e.detail.value;
        that.setData({ textarea });
    },
    // 点赞
    handlelike() {
        // const userid = app.globalData.userid || '5a9a46834aff491a7530becd';
        const that = this;
        const { option, select } = this.data;
        const { upVote, id } = select;
        const resData = [];
        if (upVote) {
            for (let i = 0; i < select.upVotes.length; i++) {
                if (userid !== select.upVotes[i].id) {
                    resData.push(select.upVotes[i].id);
                }
            }
        } else {
            for (let i = 0; i < select.upVotes.length; i++) {
                resData.push(select.upVotes[i].id);
            }
            resData.push(userid);
        }
        API.ajax(`/answer/${id}`, JSON.stringify({ upVotes: resData }), function (res) {
            if (res.statusCode == 200 || res.statusCode == 201) {
                if (upVote) {
                    that.show('点赞已取消', 'dianzan1', '#666');
                } else {
                    that.show('点赞成功', 'dianzan1', '#FFD62D');
                }
                getAnswer(that, option);
            } else {
                that.show('点赞失败', 'cuowu', '#F45353');
            }
        }, 'put');
    },
    // 收藏
    handleMark() {
        const that = this;
        const { option, select } = this.data;
        const { isStar, id } = select;
        const resData = [];
        if (isStar) {
            for (let i = 0; i < select.stars.length; i++) {
                if (userid !== select.stars[i].id) {
                    resData.push(select.stars[i].id);
                }
            }
        } else {
            for (let i = 0; i < select.stars.length; i++) {
                resData.push(select.stars[i].id);
            }
            resData.push(userid);
        }
        API.ajax(`/answer/${id}`, JSON.stringify({ stars: resData }), function (res) {
            if (res.statusCode == 200 || res.statusCode == 201) {
                if (isStar) {
                    that.show('收藏已取消', 'shoucang', '#666');
                } else {
                    that.show('收藏成功', 'shoucang', '#FFD62D');
                }
                getAnswer(that, option);
            } else {
                that.show('收藏失败', 'cuowu', '#F45353');
            }
        }, 'put');
    },
    setPrevPage(res) {
        const pages = getCurrentPages();
        const currPage = pages[pages.length - 1];   //当前页面
        const prevPage = pages[pages.length - 2];  //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        const resList = [];
        (res.data.answers || []).forEach((item) => {
            if ((item.bookMarks || []).indexOf(app.globalData.openid) > -1) {
                item.isBookMark = true;
            }
            if (item.likeArr.indexOf(app.globalData.openid) > -1) {
                item.isKikeArr = true;
            }
            resList.push(item);
        });
        prevPage.setData({
            list: resList,
            item: res.data,
        })
    }
  })
  