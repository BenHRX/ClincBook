//获取应用实例
const app = getApp();

Page({
  data: {
    'Refresh_Manually': false,
    'NoNeedShow': false,
    'showPwdError': false,
  },

  onLoad: function(opt) {
    console.log(opt);
    var that = this;
    let option = opt.access_error;
    if (option === 'true') {
      this.setData({
        'showPwdError': true,
      });
    }
    let user_id = app.globalData.openid;
    console.log("User ID " + user_id);
    if (user_id !== 'Waiting_Check_In_Server') {
      wx.request({
        url: app.globalData.g_base_api_url + 'customer_controller/check_user_data',
        data: {
          'wxopenid': app.globalData.openid,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: res => {
          that.processUserAccessCheckingData(res);
        }
      });
    } else {
      this.setData({
        'Refresh_Manually': true,
      });
    }
  },

  onloadRefresh: function(event) {
    console.log('Request Refresh');
    let user_id = app.globalData.openid;
    var that = this;
    console.log("User ID" + user_id);
    if (user_id === 'Waiting_Check_In_Server') {
      return;
    } else {
      this.setData({
        'Refresh_Manually': false,
      });
      wx.request({
        url: app.globalData.g_base_api_url + 'customer_controller/check_user_data',
        data: {
          'wxopenid': app.globalData.openid,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: res => {
          that.processUserAccessCheckingData(res);
        }
      });
    }
  },

  processUserAccessCheckingData(res) {
    let response_code = res.data.response;
    var that = this;
    switch (response_code) {
      case '0000':
        let remember = wx.getStorageSync('Remember_Password');
        console.log(remember);
        if (remember) {
          let user_pwd = wx.getStorageSync('User_Store_Pwd');
          wx.showLoading({
            title: 'Verifying User Data',
          });
          this.setData({
            'NoNeedShow': true,
            'UserExisted': true,
          });
          wx.request({
            url: app.globalData.g_base_api_url + 'customer_controller/user_info_match',
            data: {
              'wxopenid': app.globalData.openid,
              'user_pwd': user_pwd,
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            success: res => {
              wx.hideLoading();
              that.processUserAccessInfo(res, remember, user_pwd);
            }
          });
        } else {
          this.setData({
            'UserExisted': true,
            'NoNeedShow': false,
          });
        }
        break;
      case '6666':
        this.setData({
          'UserExisted': false,
          'NoNeedShow': false,
        });
        let clear_parms = ['Remember_Password', 'User_Store_Pwd', 'private_user_info'];
        for (var i in clear_parms){
          wx.removeStorage({
            key: clear_parms[i],
          });
        }
        break;
      case '9999':
      default:
        break;
    }
  },

  userSubmit: function(event) {
    console.log(event);
    let remember = event.detail.value.remember;
    var that = this;
    if (this.data.UserExisted) {
      wx.request({
        url: app.globalData.g_base_api_url + 'customer_controller/user_info_match',
        data: {
          'wxopenid': app.globalData.openid,
          'user_pwd': event.detail.value.user_pwd,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: res => {
          // that.processUserAccessInfo(res, remember, event.detail.value.user_pwd);
          that.processUserAccessInfo(res, event.detail.value);
        }
      });
    } else {
      wx.request({
        url: app.globalData.g_base_api_url + 'customer_controller/add_user_data',
        data: {
          'wxopenid': app.globalData.openid,
          'user_name': event.detail.value.user_name,
          'user_pwd': event.detail.value.user_pwd,
          'ID_num': event.detail.value.ID_num,
          'phone_num': event.detail.value.phone_num,
          'user_address': event.detail.value.user_address,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: res => {
          // that.processUserAccessAdd(res, remember, evenet.detail.value);
          that.processUserAccessInfo(res, event.detail.value);
        }
      });
    }
  },

  // processUserAccessInfo: function(res, remember, pwd) {
  processUserAccessInfo: function(res, detail) {
    if (res.data.response === '0000') {
      if (detail.remember) {
        wx.setStorageSync('User_Store_Pwd', detail.user_pwd);
        wx.setStorage({
          key: 'Remember_Password',
          data: true,
        });
      }
      console.log(this.data.UserExisted);
      if (this.data.UserExisted) {
        wx.setStorage({
          key: 'private_user_info',
          data: {
            'user_name': res.data.Data[0].name,
            'ID_num': res.data.Data[0].id_card,
            'phone_num': res.data.Data[0].phone,
            'user_address': res.data.Data[0].address,
          },
        })
        // wx.redirectTo({ // wx.navigateto & wx.switchTab
        //   url: '/pages/wxUserOrder/wxUserOrder?user_name=' + res.data.Data[0].name,
        // });
        wx.switchTab({
          url: '/pages/wxUserOrder/wxUserOrder',
        });
      } else {
        wx.setStorage({
          key: 'private_user_info',
          data: {
            'user_name': detail.user_name,
            'ID_num': detail.ID_num,
            'phone_num': detail.phone_num,
            'user_address': detail.user_address,
          },
        })
        // wx.redirectTo({ // wx.navigateto & wx.switchTab
        //   url: '/pages/wxUserOrder/wxUserOrder?user_name=' + detail.user_name,
        // });
        wx.switchTab({
          url: '/pages/wxUserOrder/wxUserOrder',
        });
      }

    } else {
      wx.setStorage({
        key: 'Remember_Password',
        data: false,
      });
      wx.redirectTo({ // wx.navigateto & wx.switchTab
        url: 'wxUserLogin?access_error=true',
      })
    }
  },
})