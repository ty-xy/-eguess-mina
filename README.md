### 小程序相关的文档或者参考我们放到这个文档中：


#### 小程序参考文章：
    官方API： https://mp.weixin.qq.com/debug/wxadoc/dev/api/
    微信小程序入门： https://github.com/ikcamp/wechat-xcx-tutorial
    微信小程序组件： http://leanote.com/blog/post/5a5dad39ab64412da30022e6


#### 第一阶段： 
    前台： UI界面， 目前无需使用UI库。
    icon:    iconfont。
    后台： 设计数据库（MongoDB）表结构，用 Mock 伪造数据, 参考http://mockjs.com/examples.html
#### 第二阶段：
    前台：接数据。
    后台： koa2，参考如下：
    https://github.com/chenshenhai/koa2-note，
    https://github.com/ikcamp/koa2-tutorial ，
    https://github.com/lybenson/bilibili-vue，



---


### 搭建 mock 数据

#### 下载mock.js

    在GitHub下载mock文件： https://github.com/nuysoft/Mock ，保存在项目`/utils`目录下；然后创建api文件，用来定义不通接口,详j见`api.js`.
```
    const Mock = require('mock.js');
    Mock.mock({...}); // 生成模拟的数据
    
```


