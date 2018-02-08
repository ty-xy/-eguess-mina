

Page({
    data: {
        list: [],
        item: {},
        m2m: {},
    },
    onShareAppMessage(res) {},
    onLoad(option) {
        wx.setNavigationBarTitle({
            title: '答题'
        })
        console.log('answer', option)
        this.setData({
            item: option,
        })
    },
    bindFormSubmit(e) {
        console.log('bindFormSubmit', e.detail.value.textarea);
        wx.navigateBack();
    }
})