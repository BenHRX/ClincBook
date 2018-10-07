// pages/wxUserOrder/wxUserOrder.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'private_user_info',
      success: function(res) {
        that.setData({
          'user_name': res.data.user_name,
          'id_card_number': res.data.ID_num,
          'phone_number': res.data.phone_num,
          'address': (null === res.data.user_address) ? '暂无信息' : res.data.user_address,
        });
      },
    });

    wx.getStorage({
      key: 'order_submit_data',
      success: function(res) {
        if (res.data.order_gen === true) {
          wx.showModal({
            title: '确认提交以下订单：',
            content: '医生姓名:' + res.data.doctor_name + '， 医院: ' + res.data.hospital + '， 部门: ' + res.data.department + '， 日期 : ' + res.data.book_date + '， 时间: ' + res.data.book_time,
            success: function(res) {
              console.log(res);
              if (res.confirm !== true) {
                wx.setStorage({
                  key: 'order_submit_data',
                  data: {
                    'order_gen': false,
                    'doctor_id': '',
                    'doctor_name': '',
                    'hospital': '',
                    'department': '',
                    'book_date': '',
                    'book_time': '',
                    'order_time': '',
                  },
                });
              } else {
                // Submit the data to the server.
                that.submitOrderToServer();
              }
            }
          });
        }
      },
    });
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

  },

  /* 
    Handle the data to server.
    The input parameter should be placed in the storage.
  */
  submitOrderToServer: function() {
    var that = this;
    var order_detail = wx.getStorageSync('order_submit_data');
    console.log(order_detail);
    wx.request({
      url: app.globalData.g_base_api_url + 'order_controller/add_order',
      data: {
        'wx_id': app.globalData.openid,
        'doctor_id': order_detail.doctor_id,
        'hospital': order_detail.hospital,
        'department': order_detail.department,
        'book_date': order_detail.book_date,
        'book_time': order_detail.book_time,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: res => {
        that.processOrderResponseData(res, 'success');
      },
      fail: res => {
        that.processOrderResponseData(res, 'fail');
      },
      complete: res => {
        wx.setStorageSync(
          'order_submit_data',
          {
            'order_gen': false,
            'doctor_id': '',
            'doctor_name': '',
            'hospital': '',
            'department': '',
            'book_date': '',
            'book_time': '',
            'order_time': '',
          },
        );
      }
    });
  },

  processOrderResponseData: function(res, status){
    console.log(res.data);
    console.log(status);
    if (status == 'success'){
      wx.showToast({
        title: '订单提交成功',
      });
    }
    else{
      wx.showToast({
        title: '订单提交失败',
      });
    }
  }

})