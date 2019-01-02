// pages/whereCanSearch/whereCanSearch.js

// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var util = require('../../utils/util.js');
var Storage = require("../../utils/storage.js");
var appInstance = getApp();

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'T4NBZ-CRBCX-QSJ4Q-Z6NAY-CMT4Q-VWFTW' // 必填
});
Page({
  data: {
    isEdit: false,
    isReInput: false,
    keyWord: "",
    keywords: [],
    markers: [],
    searchData: [],
    distanceArr: [],
    default_longitude: 113.3245211, // 经度
    default_latitude: 23.10229, // 纬度
    now_longitude: Storage.getItem("now_longitude") || "",
    now_latitude: Storage.getItem("now_latitude") || "",
    mapHeight: "986rpx",
    scaleNum: 18, // 缩放比例 [5,18],
    location: appInstance.globalData.defaultCity || "北京"
  },
  xuanZhong: function(e) {
    console.log("选中");
    this.setData({
      isEdit: true
    })
  },
  chooseTextInput: function(e) {
    console.log(e.detail.value);
    this.setData({
      keyWord: e.detail.value
    });
    // 关键词输入提示
    qqmapsdk.getSuggestion({
      keyword: e.detail.value,
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });

  },
  finishiInput: function(e) {
    console.log("完成输入")
  },
  deleteFn: function(e) {
    this.setData({
      keyWord: ""
    })
  },
  // 事件触发，调用接口
  nearby_search: function() {
    var _this = this;
    // var latitude = Storage.getItem("now_latitude")
    qqmapsdk.search({
      keyword: _this.data.keyWord, //搜索关键词
      location: _this.data.now_latitude + "," + _this.data.now_longitude,
      success: function(res) { //搜索成功后的回调
        var mks = [],
          distanceArr = [];
        _this.setData({
          searchData: res.data
        })
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: "../../assets/map_location.png", //图标路径
            width: 20,
            height: 20
          });
          distanceArr.push({
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
          })
        };

        // 计算距离
        _this.calculateDistance(distanceArr);
        // console.log(mks);
        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: mks,
          mapHeight: "400rpx"
        })

        // var newData = (wx.getStorageSync('keywords') || []).push(_this.data.keyWord);
        // console.log(newData);
        // _this.setData({
        //   keywords: newData
        // })

        _this.setData({
          keywords: (wx.getStorageSync('keywords') || []).map(key => {
            return util.formatTime(new Date(key))
          })
        })

        console.log(_this.data)


      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },
  getCityList: function() {
    qqmapsdk.getCityList({
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });
    wx.navigateTo({
      url: '../switchcity/switchcity'
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(e) {
    var that = this;
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap');
    if (!Storage.getItem("now_latitude") || !Storage.getItem("now_longitude")) {
      this.getCenterLocation();
    }

  },
  // 获取当前位置
  getCenterLocation() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy

        console.log(longitude, latitude);
        that.setData({
          now_latitude: latitude,
          now_longitude: longitude
        })

        Storage.setItem("now_latitude", latitude);
        Storage.setItem("now_longitude", longitude);

      }
    })
  },
  // 计算当前位置到目标点距离
  calculateDistance: function(data) {
    var _this = this;
    console.log(_this.data)
    var latitude = _this.data.now_latitude || Storage.getItem("now_latitude");
    var longitude = _this.data.now_longitude || Storage.getItem("now_longitude");
    qqmapsdk.calculateDistance({
      from: latitude + "," + longitude,
      to: data,
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        var source = _this.data.searchData;
        var distanceArr = res.result.elements;
        source.forEach((v, index) => {
          v.distance = util.parseDistance(distanceArr[index].distance);
        })
        _this.setData({
          searchData: source
        })
      }
    })
  },
  // 移动位置
  moveToLocation: function() {
    this.mapCtx.moveToLocation()
  },
  navigation: function(e) {
    var target = e.currentTarget.dataset;
    wx.openLocation({
      latitude: target.lat,
      longitude: target.lng,
      scale: 18,
      name: target.name,
      address: target.address
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var location = appInstance.globalData.defaultCity;
    if (location !== undefined) {
      this.setData({
        location: location
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})