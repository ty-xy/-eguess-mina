let _compData = {
    '_toast_.isHide': false,// 控制组件显示隐藏
    '_toast_.content': '', // 显示的内容
    '_toast_.iconColor': ''
}
let myToast = {
    // toast显示的方法
    show: function(content, icon, iconColor) {
        let self = this;
        this.setData({ '_toast_.isHide': true, '_toast_.content': content, '_toast_.iconColor': iconColor, '_toast_.icon': icon});
        setTimeout(function(){
            self.setData({ '_toast_.isHide': false})
        }, 1000)
    }
}
function MyToast() {
    // 拿到当前页面对象
    let pages = getCurrentPages();
    let curPage = pages[pages.length - 1];
    this.__page = curPage;
    // 小程序最新版把原型链干掉了。。。换种写法
    Object.assign(curPage, myToast);
    // 附加到page上，方便访问
    curPage.myToast = this;
    // 把组件的数据合并到页面的data对象中
    curPage.setData(_compData);
    return this;
}
module.exports = {
    MyToast
}