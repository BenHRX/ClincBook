//app.js
App({
  onLaunch: function() {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 这部分可以立刻获得wx提供的临时code.
        // console.log(res);
        wx.request({
          url: that.globalData.g_weixin_api + '?appid=' + that.globalData.g_AppID + '&secret=' + that.globalData.g_AppSecret + '&js_code=' + res.code + '&grant_type=authorization_code',
          method: 'GET',
          success: res => {
            console.log(res);
            that.globalData.openid = res.data.openid;
            that.globalData.session_id = res.data.session_key;  // 不能随便存储
          },
        });
      }
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                // 这个的实现是在具体调用的函数那里.
                this.userInfoReadyCallback(res);
              }
            }
          })
        }
      }
    });
  },
  globalData: {
    g_base_url: "http://localhost/ControlSystem",
    g_base_api_url: "http://localhost/ControlSystem/index.php/",
    g_base_image_url: "http://localhost/ControlSystem/image/",
    g_weixin_api: "https://api.weixin.qq.com/sns/jscode2session",
    g_AppID: "wx772fd0aebed53d4f", // 这是微信开发的时候系统生成的
    g_AppSecret: "bb934a01f39f35afd4372eb8bb86906b",
    openid: "Waiting_Check_In_Server",
    session_id: "",
  },
})