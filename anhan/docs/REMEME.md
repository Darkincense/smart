## 微信小程序

- [文档](https://developers.weixin.qq.com/miniprogram/dev/devtools)
- [UI-蓝湖-安翰磁控](https://lanhuapp.com/)

## 原理

## 说明
- app.json
  + 根目录下的 app.json  配置 [参考](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html)
  + 决定页面文件的路径、窗口表现、设置网络超时时间、设置多 tab 等。
- 逻辑层 [参考](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html)

## 生态圈
- wepy
- mpvue

## 工作计划

- 首页 index  swiper 胃镜专线 名医访谈，胃你简答各四条数据展示 ok
  + 胃镜产品详情 product_detail 
- 胃你解答 forYouAnswer ok
  + 我要提问 forYouAnswer_askQ ok
- 名医访谈 doctorTalk
  + 详情 doctorTalk_detail 视频播放
- 哪里能查 whereCanSearch 腾讯地图 ok
- 媒体报道 mediaCoverage
  + 报道详情 mediaCoverage_detail 主渲染
- 循证研究 inquiryResearch
  + 详情 inquiryResearch_detail pdf预览？下载？ 主渲染
- 我想 iThink 手机号授权获取？


## 事件
- 绑定事件 [参考](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html)
`<view id="tapTest" data-hi="WeChat" bindtap="tapName">Click me!</view>`
`bindchange`
- 使用
````js
Page({
  tapName(event) {
    console.log(event)
  }
})
````

## 待做
- appid
## Userful Links
- [快速了解小程序](http://ssh.today/blog/hello-min-app)
- [从零开始一个微信小程序版知乎](https://juejin.im/post/5a61b6a1518825732739af03)
- [首个微信小程序开发教程！](https://juejin.im/entry/57e34d6bd2030900691e9ad7)