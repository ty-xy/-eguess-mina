const API = require('../../utils/api.js')
const app = getApp()

Page({
    data: {
        list: [],
        item: {},
        m2m: {},
        textarea: null,
    },
    onShareAppMessage: function (res) {},
    onLoad: function(option) {
        new app.MyToast();
        wx.setNavigationBarTitle({
            title: '答题详情'
        })
        this.setData({
            userInfo: app.globalData.userInfo,
        })
        console.log('答题详情', option);
        const that = this;
        option.likeArr = (option.likeArr && option.likeArr.split(',')) || [];
        option.bookMarks = (option.bookMarks && option.bookMarks.split(',')) || [];
        if (option.bookMarks.indexOf(app.globalData.openid) === -1) {
            option.isBookMark = false;
        } else {
            option.isBookMark = true;
        }
        if (option.likeArr.indexOf(app.globalData.openid) === -1) {
            option.isKikeArr = false;
        } else {
            option.isLikeArr = true;
        }
        API.ajax(`/topic/${option.topicId}`, '', function (res) {
            //这里既可以获取模拟的res
            if (res.statusCode === 200) {
                const list = res.data.answers.filter((item) => (item.messageId === option.id))
                that.setData({
                    list,
                    item: res.data,
                    m2m: option,
                })
            }
        });
    },
    bindFormSubmit: function(e) {
        const { avatarUrl, gender } = this.data.userInfo;
        const newMsg = {
            comment: e.detail.value,
            ...this.data.userInfo,
            topicInfo: this.data.m2m.topicId,
            messageId: this.data.m2m.id,
        };
        const that = this;
        API.ajax('/message', JSON.stringify(newMsg), function (res) {
            if (res.statusCode === 200 || res.statusCode === 201) {
                wx.showToast({
                    title: '评论成功',
                    icon: 'success',
                    duration: 1500
                })
                API.ajax(`/topic/${that.data.m2m.topicId}`, '', function (result) {
                    //这里既可以获取模拟的res
                    if (result.statusCode === 200) {
                        const list = result.data.answers.filter((item) => (item.messageId === that.data.m2m.id));
                        that.setData({
                            list,
                            item: result.data,
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
    handlelike(e) {
        const { m2m } = this.data;
        const openid = app.globalData.openid;
        const likeArr = m2m.likeArr || [];
        if (likeArr.indexOf(openid) === -1) {
            likeArr.push(openid);
        } else {
            likeArr.splice(likeArr.indexOf(openid), 1);
        }
        const that = this;
        const { option } = this.data;
        API.ajax(`/message/${m2m.id}`, JSON.stringify({ likeArr }), function (res) {
            if (res.statusCode == 200) {
                API.ajax(`/topic/${m2m.topicId}`, '', function (res) {
                    //这里既可以获取模拟的res
                    if (res.statusCode === 200) {
                        // const list = res.data.filter((item) => item.from === '');
                        m2m.title = decodeURIComponent(m2m.title);
                        const list = res.data.answers.filter((item) => (item.messageId === m2m.id));
                        m2m.isLikeArr = !m2m.isLikeArr;
                        if (m2m.isLikeArr) {
                            that.show('点赞成功', 'dianzan1', '#FFD62D');
                        } else {
                            that.show('取消点赞', 'dianzan', '#666');
                        }
                        that.setData({
                            list,
                            item: res.data,
                            m2m,
                        });
                        that.setPrevPage(res);
                    }
                });
            } else {
                that.show('点赞失败', 'cuowu', '#F45353');
            }
        }, 'PUT');
    },
    // 收藏
    handleMark(e) {
        const { m2m } = this.data;
        const openid = app.globalData.openid;
        const bookMarks = m2m.bookMarks || [];
        if (bookMarks.indexOf(openid) === -1) {
            bookMarks.push(openid);
        } else {
            bookMarks.splice(bookMarks.indexOf(openid), 1);
        }
        const that = this;
        API.ajax(`/message/${m2m.id}`, JSON.stringify({ bookMarks }), function (res) {
            if (res.statusCode == 200) {
                console.log('isLike', m2m.isBookMark);
                API.ajax(`/topic/${m2m.topicId}`, '', function (res) {
                    //这里既可以获取模拟的res
                    if (res.statusCode === 200) {
                        // const list = res.data.filter((item) => item.from === '');
                        m2m.title = decodeURIComponent(m2m.title);
                        const list = res.data.answers.filter((item) => (item.messageId === m2m.id));
                        m2m.isBookMark = !m2m.isBookMark;
                        if (m2m.isBookMark) {
                            that.show('收藏成功', 'shoucang', '#FFD62D');
                        } else {
                            that.show('取消收藏', 'shoucang1', '#666');
                        }
                        that.setData({
                            list,
                            item: res.data,
                            m2m,
                        });
                        that.setPrevPage(res);
                    }
                });
            } else {
                that.show('收藏失败', 'cuowu', '#F45353');
            }
        }, 'PUT');
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
  