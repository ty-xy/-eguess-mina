const API_HOST = "https://xxx.com/xxx";
const debugs = false;//切换数据入口
const Mock = require('mock.js')
const config = require('./config');

const apis = {
    '/topic': {
        'success': true,
        'data|10': [{
            'id|+1': 1,
            // 'comment': '@cparagraph(1, 2)',
            'status|1': [true, false],
            'title': '@cparagraph(1, 3)',
            'message': '@integer(100,2000)',//现价，单位：分  
            'read': '@integer(100,3000)'
        }]  
    },
    '/topic/12': {
        'success': true,
        'data|3': [
            {
                'id|+1': 1,
                'nameId': '@string("lower", 5, 10)',
                'name': '@cname()',
                'comment': '@cparagraph(1, 2)',
                'like|1': [false, true],
                'linkNum|1-200': 30,
                'read|1': [false, true],
                'readNum|3-200': 10,
                'time|1': '@now()',
                'message|8-200': 8,
                'avatar': '@image(80*80)',
                'from|1': [1, 2, 3, '']
            }
        ]
    },
    '/ranklist':{
        'success': true,
        'data|10': [
            {
            'id|+1': 1,
            'status|1': [true, false],
            'image': '@image(200x200)',
            'name': '@cname()',//现价，单位：分  
            'like': '@increment(100,3000)',
            'read': '@increment(100,3000)'
        }]  
    },
    '/friendRanklist':{
        'success': true,
        'data|10': [{
            'id|+1': 1,
            'status|1': [true, false],
            'image': '@image(100x100)',
            'name': '@cname()',//现价，单位：分  
            'read': '@increment(2000,3000)'
        }]  
    },
    '/message': {
        'success': true,
        'data|10': [{
            'id|+1': 1,
            'comment': '@cparagraph(1, 2)',
            'avatar': '@image(100x100)',
            'name': '@cname()',//现价，单位：分  
            'title': '@cparagraph(1, 3)',
            'time|1': '@now()',
        }]  
    }
};
function ajax(url = '/', data = '', fn, method = "get", header = {}) {
    if (!debugs) {
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
