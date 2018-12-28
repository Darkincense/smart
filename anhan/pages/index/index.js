//index.js
//获取应用实例
const app = getApp();
const api = require("../../utils/api.js");
const adData = require("../../mock/ad.js");

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true, // 是否衔接滑动
    swiperCurrent: 0,
    bannerList: [], //轮播图
    mainAd: [], // 首页广告位地址
    productAd: "", //产品中心广告位
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  swiperChange: function(e) {
    // console.log(e)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  selectCarouselByIndex: function(e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  onLoad: function() {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });

  },
  // 获取广告数据
  getAdData: function() {
    var that = this;
    setTimeout(() => {
      const data = adData.response_data.lists;
      that.setData({
        bannerList: data.filter(item => item.type == 1),
        mainAd: data.filter(item => item.type == 2),
        productAd: data.filter(item => item.type == 3)
      })
    }, 500);

  },
  toForYouAnswer:function(){
    wx.navigateTo({ url: '../forYouAnswer/forYouAnswer' });
  },

  onLoad:function(option){
    console.log(option);
  },
  onReady: function() {
    this.getAdData();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    that.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})