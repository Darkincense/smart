// pages/iThink/iThink.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "默认",
    isActive: "0",
    isEdit: false,
    keyWord: "",
    currentTargetIndex: "",
    isShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  setActive: function(e) {
    console.log(e);
    // 获取当前点击的index
    let index = e.target.dataset.index;
    // 设置对应class
    if (index === undefined) {
      index = e.currentTarget.dataset.index;
    }
    this.setData({
      isActive: index
    })
  },
  deleteFn: function(e) {
    console.log("删除文本");
    this.setData({
      keyWord: ""
    })
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
    })
  },
  finishiInput: function(e) {
    console.log("完成输入")
  },
  searchText: function(e) {
    console.log(e.currentTarget.dataset.text);
  },
  askQ: function() {
    wx.navigateTo({
      url: '../forYouAnswer_askQ/forYouAnswer_askQ'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})