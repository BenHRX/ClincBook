// pages/Map/MapController.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // markers: [{
    //   id: 1,
    //   latitude: 23.112248,
    //   longitude: 113.262228,
    //   name: 'xx医院'
    // }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData(
      {
        markers: [{
          id: 1,
          latitude: options.latitude,
          longitude: options.longtitude,
          name: options.name
        }],
        map_longtitude: options.longtitude,
        map_latitude: options.latitude,
        map_scale: 17,  // Temp setting
      },
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})