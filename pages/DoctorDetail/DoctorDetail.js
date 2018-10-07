const util = require('../../utils/util.js');

// var tmpDutyStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var tmpDutyStatus = Array(21);

var global_data = getApp().globalData;

// pages/DoctorDetail/DoctorDetail.js
var weekViewIDs = ["week0", "week1", "week2"];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _num: -1,
    today_weekday: 0,
    index_array_row1: [],
    index_array_row2: [],
    index_array_row3: [],
    duty_array_row1: [],
    duty_array_row2: [],
    duty_array_row3: [],
    touch_x: -1,
    touching: false,
    currentWeekView: "week0",
    currentDisplayTab: "week0",
    animationData: "",
    showModalStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      doctor_name: options.doctor,
      doctor_department: options.department,
      doctor_photo: options.photo,
      doctor_id: options.userid,
      background_picture: global_data.g_base_image_url + "background/BackImage.png",
    });
    tmpDutyStatus.fill("0");
    this.formatCalendar();
    this.loadServerDutyData();
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
  // 日期计算
  formatCalendar: function() {
    var today = new Date(); // 当前日期
    var today_org = today.valueOf(); // 原始对象
    var weekday = today.getDay(); // 返回一周中的某一天(0 ~6)
    var row1 = [];
    var row2 = [];
    var row3 = [];
    // Today exist week.
    for (var i = 0; i <= weekday; i++) {
      row1[i] = this.calcDate(today_org, weekday - i, 'Deduce');
    }

    for (var i = weekday; i <= 6; i++) {
      row1[i] = this.calcDate(today_org, i - weekday, 'Increase');
    }
    // next week
    for (var i = 0; i <= 6; i++) {
      row2[i] = this.calcDate(today_org, (7 - weekday) + i, 'Increase');
    }
    // next next week
    for (var i = 0; i <= 6; i++) {
      row3[i] = this.calcDate(today_org, (14 - weekday) + i, 'Increase');
    }
    var startSeconds = this.calcFullFormatDate(today_org, weekday, 'Deduce');
    var endSeconds = this.calcFullFormatDate(today_org, (14 - weekday) + 6, 'Increase');
    console.log(row1);
    console.log(row2);
    console.log(row3);

    this.setData({
      index_array_row1: row1,
      index_array_row2: row2,
      index_array_row3: row3,
      _num: weekday,
      today_weekday: weekday,
      start_date: this.DateInFormat(startSeconds),
      end_date: this.DateInFormat(endSeconds),
    });
  },
  calcDate: function(today, days, flag) {
    if (flag == 'Deduce') {
      return (new Date(today - days * 24 * 60 * 60 * 1000).getDate())
    }
    if (flag == 'Increase') {
      return (new Date(today + days * 24 * 60 * 60 * 1000).getDate())
    }
  },
  calcFullFormatDate: function(today, days, flag) {
    if (flag == 'Deduce') {
      return (today - days * 24 * 60 * 60 * 1000);
    }
    if (flag == 'Increase') {
      return (today + days * 24 * 60 * 60 * 1000);
    }
  },
  DateInFormat: function(seconds) {
    return new Date(seconds).getFullYear() + "-" + util.formatNumber((new Date(seconds).getMonth() + 1)) + "-" + util.formatNumber(new Date(seconds).getDate());
  },

  /* Handling while onload page load the duty arrange for this doctor */
  loadServerDutyData: function() {
    var that = this;
    wx.request({
      url: global_data.g_base_api_url + 'user_controller/get_user_duty_by_period',
      data: {
        'doctor_name': this.data.doctor_name,
        'doctor_id': this.data.doctor_id,
        'start_date': this.data.start_date,
        'end_date': this.data.end_date,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        that.processDoctorPeriodDuty(res);
      }
    });
  },
  processDoctorPeriodDuty: function(res) {
    console.log(res.data);
    this.setData({
      doctor_summary: res.data[0].description,
      doctor_hospital: res.data[0].hospital,
      doctor_department: res.data[0].department,
      doctor_major: res.data[0].major.split(","),
    });

    var startSeconds = new Date(this.data.start_date).valueOf();
    var tmpDutyDate = [];
    var tmpDutyTimeSlot = Array(21);
    var tmpDefaultTimeSlot = {
      'p1': '0',
      'p2': '0',
      'p3': '0',
      'p4': '0',
      'p5': '0',
      'p6': '0',
    };
    tmpDutyTimeSlot.fill(tmpDefaultTimeSlot);

    for (var i in tmpDutyStatus) {
      tmpDutyDate.push(this.DateInFormat(this.calcFullFormatDate(startSeconds, i, 'Increase')));
    }
    console.log(tmpDutyDate);
    console.log(tmpDutyDate.indexOf("2018-10-1"));
    for (var j in res.data) {
      console.log(tmpDutyDate.indexOf(res.data[j].duty_date));
      if (-1 !== tmpDutyDate.indexOf(res.data[j].duty_date)) {
        var match_index = tmpDutyDate.indexOf(res.data[j].duty_date);
        tmpDutyStatus[match_index] = res.data[j].status;
        tmpDutyTimeSlot[match_index] = {
          '9:00': res.data[j].period1,
          '10:00': res.data[j].period2,
          '11:00': res.data[j].period3,
          '14:00': res.data[j].period4,
          '15:00': res.data[j].period5,
          '16:00': res.data[j].period6,
        }
      }
    }

    // var getArray1 = this.data.index_array_row1;
    // var getArray2 = this.data.index_array_row2;
    // var getArray3 = this.data.index_array_row3;
    // var startDate = getArray1[0];
    // var endDate = getArray3[getArray3.length-1];
    console.log(tmpDutyStatus);

    var tmpStatus = [];
    var setArray1 = [];
    var setArray2 = [];
    var setArray3 = [];
    // console.log("Start Date is " + startDate + " End Date is " + endDate);
    // simulate only
    for (var i in tmpDutyStatus) {
      if (tmpDutyStatus[i] === "0") {
        tmpStatus = {
          "Display": "休诊",
          "Status": 0,
        };
      }
      if (tmpDutyStatus[i] === "1") {
        tmpStatus = {
          "Display": "出诊",
          "Status": 1,
        };
      }
      if (tmpDutyStatus[i] === "2") {
        tmpStatus = {
          "Display": "约满",
          "Status": 2,
        };
      }

      if (i >= 0 && i < 7) {
        setArray1.push(tmpStatus);
      } else if (i >= 7 && i < 14) {
        setArray2.push(tmpStatus);
      } else if (i >= 14 && i < 21) {
        setArray3.push(tmpStatus);
      }
    }
    // console.log(setArray1);
    // console.log(setArray2);
    // console.log(setArray3);

    // End
    this.setData({
      duty_array_row1: setArray1,
      duty_array_row2: setArray2,
      duty_array_row3: setArray3,
      duty_array_timeSlot: tmpDutyTimeSlot,
    });
  },

  /*
    handle the logic for dragging the movable view 
  */
  touchStartPointX: function(e) {
    var x = e.changedTouches[0].pageX;
    this.setData({
      touch_x: x,
      touching: true,
    });
  },
  touchEndPointX: function(e) {
    console.log(e);
    var x = e.changedTouches[0].pageX;
    var x_distance = x - this.data.touch_x;
    var setView = this.data.currentWeekView;

    console.log(setView);
    console.log("This is the touch distance " + x_distance);

    if (x_distance > -100 && x_distance < 100) {
      setView = this.data.currentWeekView;
    }

    if (x_distance >= 100 && this.data.currentWeekView !== "week0") {
      // for (var i = 0; i < weekViewIDs.length; i++) {
      //   setView = weekViewIDs[i - 1];
      //   break;
      // }
      if (this.data.currentWeekView === "week1") {
        setView = "week0";
      }
      if (this.data.currentWeekView === "week2") {
        setView = "week1";
      }
    }

    if (x_distance <= -100 && this.data.currentWeekView !== "week2") {
      // for (var i = 0; i < weekViewIDs.length; i++) {
      //   setView = weekViewIDs[i + 1];
      //   break;
      // }
      if (this.data.currentWeekView === "week0") {
        setView = "week1";
      }
      if (this.data.currentWeekView === "week1") {
        setView = "week2";
      }
    }
    this.setData({
      // touch_x: -999,
      touching: false,
      currentWeekView: setView,
      // currentDisplayTab: this.data.currentWeekView,
      currentDisplayTab: setView,
      callback: function(res) {
        console.log("set Complete");
      }
    });
  },
  catchScrolling: function(e) {
    // console.log(e);
    // currently, no using this funcion, but the scrolling action still have some bug
  },

  /** into view action handle **/
  onTapIntoView: function(e) {
    console.log(e.currentTarget.dataset.into);
    var setView = e.currentTarget.dataset.into;
    this.setData({
      currentWeekView: setView,
      currentDisplayTab: setView,
    });
  },
  
  // booking arrangement choose
  onClickBtn: function(event) {
    console.log(event.currentTarget.dataset);
    if (event.currentTarget.dataset.num < this.data.today_weekday || event.currentTarget.dataset.num >= this.data.today_weekday + 14) {
      return;
    }
    if (event.currentTarget.dataset.duty !== 1) {
      return;
    }

    // Get today date and the click date.
    var interval = event.currentTarget.dataset.num - this.data.today_weekday;
    var curentClickDate = this.DateInFormat(this.calcFullFormatDate(new Date().valueOf(), interval, 'Increase'));
    console.log("Current Click Date :" + curentClickDate);
    this.setData({
      "curentClickDate": curentClickDate,
    });
    
    // Get the chosen date valid time.
    var time_slot = this.data.duty_array_timeSlot[event.currentTarget.dataset.num];
    var chosen_duty_arrangement = [];
    for (var key in time_slot) {
      if (time_slot[key] > 0) {
        chosen_duty_arrangement.push(key);
      }
    }
    this.setData({
      chosen_duty_arrangement: chosen_duty_arrangement,
      _num: event.currentTarget.dataset.num,
      clickTimeID: -1,
    });

    // 尝试弹出时间选择界面
    this.showModal();
  },

  onClickFlowPanelTime: function(event){
    this.setData({
      clickTimeID: event.currentTarget.dataset.idx,
    });
    let time_slot = event.currentTarget.dataset.value;
    // wx.redirectTo({
    //   url: '/pages/wxUserLogin/wxUserLogin',
    // });
    wx.setStorage({
      key: 'order_submit_data',
      data: {
        'order_gen': true,
        'doctor_id': this.data.doctor_id,
        'doctor_name' : this.data.doctor_name,
        'hospital': this.data.doctor_hospital,
        'department': this.data.doctor_department,
        'book_date': this.data.curentClickDate,
        'book_time': time_slot,
        'order_time': Date.now(),
      },
    });
    wx.reLaunch({
      url: '/pages/wxUserLogin/wxUserLogin',
    }); 
  },



  ///  animation section (refer to cnblog article) /// 
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
})