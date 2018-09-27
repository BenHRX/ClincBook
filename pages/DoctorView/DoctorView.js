// pages/DoctorView/DoctorView.js
var global_data = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverDataArray: [],
    click_id: -1,
    Doctor: -1,
    BookingShow: false,
    ChosenDate: "",
    ChosenDepartment: "",
    ChosenHospital: "",
    ChosenCity: "",
    SearchDoctor: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    var searchDr = options.search;
    var tmpFlag = false;
    if (searchDr === 'search_doctor') {
      tmpFlag = true;
    }
    this.setData({
      ChosenDate: options.date,
      ChosenDepartment: options.department,
      ChosenHospital: options.hospital,
      ChosenCity: options.city,
      SearchDoctor: tmpFlag,
    })
    if (!tmpFlag) {
      this.onLoadDrDetail();
    } else {
      this.onLoadPositionDr();
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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

  //获得服务器的数据
  onLoadDrDetail: function() {
    var that = this;
    wx.request({
      url: global_data.g_base_api_url + 'user_controller/get_user_info',
      data: {
        'date': this.data.ChosenDate,
        'department': this.data.ChosenDepartment,
        'hospital': this.data.ChosenHospital,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        that.processDoctorData(res);
      }
    });
  },
  processDoctorData: function(res) {
    console.log(res.data);
    // var serverData = [{
    //   'Photo': "../../image/TestUsing/HeadPhoto1.png",
    //   'name': "张三",
    //   'Mark': "特约医生",
    //   'Department': "儿科,儿童保健科",
    //   "Major": "腹泻,咳嗽,发热盗汗,肚子胀痛,肠胃不适,发冷",
    //   "Career": "原国家测试医院测试科测试主治医生编号001\n国家一级医生\n收费: 350元/次",
    //   "TimeSlot": "8:30,9:30,10:30,11:30",
    // },
    // {
    //   'Photo': "../../image/TestUsing/HeadPhoto2.png",
    //   'name': "李四",
    //   'Mark': "专科医生",
    //   'Department': "儿科",
    //   "Major": "腹泻,咳嗽,发热盗汗,肚子胀痛,肠胃不适,发冷,感冒,厌食,大便干硬,易累",
    //   "Career": "原国家测试医院测试科测试主治医生编号002\n国家特级医生\n收费: 450元/次",
    //   "TimeSlot": "8:30,9:30,10:30,14:30,15:30,16:30",
    // },
    // ];
    // console.log(serverData);
    var tmpData = Array();
    var tmpFullData = Array();
    var duty_time = [];
    for (var e in res.data) {
      if (res.data[e]['status'] != 1) {
        duty_time = null;
      } else {
        // Very dirty
        if (res.data[e]['period1'] != "0") {
          duty_time.push("9:00");
        }
        if (res.data[e]['period2'] != "0") {
          duty_time.push("10:00");
        }
        if (res.data[e]['period3'] != "0") {
          duty_time.push("11:00");
        }
        if (res.data[e]['period4'] != "0") {
          duty_time.push("14:00");
        }
        if (res.data[e]['period5'] != "0") {
          duty_time.push("15:00");
        }
        if (res.data[e]['period6'] != "0") {
          duty_time.push("16:00");
        }
      }
      tmpFullData[e] = {
        'user_id': res.data[e]['userId'],
        'Photo': global_data.g_base_image_url + res.data[e]['photo_path'],
        'name': res.data[e]['name'],
        'Mark': "特约医生",
        'Department': res.data[e]['department'],
        "Major": res.data[e]['major'].split(","),
        "Career": res.data[e]['description'],
        // "TimeSlot": serverData[e]['TimeSlot'].split(","),
        "TimeSlot": duty_time,
      };
      duty_time = [];
    }

    this.setData({
      serverDataArray: tmpFullData,
    });
  },
  
  // Directly click the search panel, return the doctor in this city. 
  onLoadPositionDr: function() {
    var that = this;
    wx.request({
      url: global_data.g_base_api_url + 'user_controller/get_user_by_city',
      data: {
        'city_name': this.data.ChosenCity,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        that.processPositionDoctorData(res);
      }
    })
  },
  processPositionDoctorData: function(res){
    console.log(res.data);
    var tmpData = Array();
    var tmpFullData = Array();
    for (var e in res.data) {
      tmpFullData[e] = {
        'user_id': res.data[e]['userId'],
        'Photo': global_data.g_base_image_url + res.data[e]['photo_path'],
        'name': res.data[e]['real_name'],
        'Mark': "特约医生",
        'Department': res.data[e]['department'],
        "Major": res.data[e]['major'].split(","),
        "Career": res.data[e]['doctor_summary'],
        "TimeSlot": null,
      };
    }

    this.setData({
      serverDataArray: tmpFullData,
    });
  },

  // Click the time slot
  onClickBookTime: function(event) {
    var dr_name = event.currentTarget.dataset.drname;
    var dr_index = event.currentTarget.dataset.dr;
    var dr_id = event.currentTarget.dataset.id;
    console.log(dr_name + dr_id + dr_index);
    this.setData({
      click_id: dr_id,
      Doctor: dr_index,
      // BookingShow: true,
    });
    var that = this;
    wx.showModal({
      title: '确认订单',
      content: "请核对是否提交以下订单 [医生名称]: " + dr_name + " [预约时间]: " + this.data.ChosenDate + " " + this.data.serverDataArray[dr_index]['TimeSlot'][dr_id] + " [预约科室]: " + this.data.ChosenDepartment,
      success: function(res) {
        if (res.confirm) {
          console.log("用户点击确定");
        } else {
          console.log("用户点击取消");
          that.setData({
            click_id: -1,
            Doctor: -1,
          });
        }
      },
    })
  },

  onClickDoctor: function(event) {
    var dr_id = event.currentTarget.dataset.dr_index;
    var doctor_detail = this.data.serverDataArray[dr_id];
    console.log(doctor_detail);
    wx.navigateTo({
      url: '../DoctorDetail/DoctorDetail?doctor=' + doctor_detail['name'] + "&department=" + doctor_detail['Department'] + "&photo=" + doctor_detail['Photo'] + "&userid=" + doctor_detail['user_id'],
    });
  }
})