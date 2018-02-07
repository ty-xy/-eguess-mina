const API_HOST = "https://xxx.com/xxx";
const DEBUG = true;//切换数据入口
const Mock = require('mock.js')

const apis = {
    '/topic': {
        'success': true,
        'data|10': [{
            'id|+1': 1,
            'status|1': [true, false],
            'title': '@cparagraph(1, 3)',
            'message': '@integer(100,2000)',//现价，单位：分  
            'read': '@integer(100,3000)'
        }]  
    },
    '/topic/12': {
        'success': true,
        'data': {
            'id|+1': 1,
            'status|1': [true, false],
            'title': '@cparagraph(1, 3)',
            'read': '@integer(100,3000)',
            'message|10-20': [
                {
                    'nameId': '@string("lower", 5, 10)',
                    'name': '@cname()',
                    'comment': '@cparagraph(1, 2)',
                    'like|1': [false, true],
                    'time|1': '@now()',
                    'avatar': '@image(80*80)',
                    'message|5-10': [
                        {
                            'nameId': '@string("lower", 5, 10)',
                            'name': '@cname()',
                            'comment': '@cparagraph(1, 2)',
                            'like|1': [false, true],
                            'time|1': '@now()',
                            'avatar': '@image(80*80)',
                            'message': []
                        }
                    ]
                }
            ]
        }
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
