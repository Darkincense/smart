// pages/iThink/iThink.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "默认",
    isFocus: false,
    context: "" // 提交的文本
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  focusFn: function() {
    this.setData({
      isFocus: true
    })
  },
  InputFn: function(e) {
    console.log(e.detail.value.length)
    if (e.detail.value.length === 0) {
      this.setData({
        isFocus: false
      })
    } else {
      this.setData({
        isFocus: true
      })
    }
    this.setData({
      context: e.detail.value
    })
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