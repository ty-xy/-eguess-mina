let API_HOST = "https://xxx.com/xxx";
let DEBUG = true;//切换数据入口
var Mock = require('mock.js')

const apis = {
    '/topic': {
        'success': true,
        'data|10': [{
            'id|+1': 1,
            'status|1': [true, false],
            'title': '@cparagraph(1, 20)',
            'message': '@integer(100,2000)',//现价，单位：分  
            'read': '@integer(100,3000)'
        }]  
    },
    '/ranklist':{
        'success': true,
        'data|10': [{
            'id|+1': 1,
            'status|1': [true, false],
            'image': '@image(200x200)',
            'name': '@cname()',//现价，单位：分  
            'read': '@increment(100,3000)'
        }]  
    }
};
function ajax(url = '/', data = '', fn, method = "get", header = {}) {
    if (!DEBUG) {
        wx.request({
            url: config.API_HOST + url + data,
            method: method ? method : 'get',
            data: {},
            header: header ? header : { "Content-Type": "application/json" },
            success: function (res) {
                fn(res);
            }
        });
    } else {
        const url_data = apis[url];
        fn(Mock.mock(url_data));
    }
}
module.exports = {
    ajax: ajax
}
