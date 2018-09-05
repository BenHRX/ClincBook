var tmpDutyStatus = [0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 2, 1, 1];

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    console.log(row1);
    console.log(row2);
    console.log(row3);
    this.setData({
      index_array_row1: row1,
      index_array_row2: row2,
      index_array_row3: row3,
      _num: weekday,
      today_weekday: weekday,
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

  /* Handling while onload page load the duty arrange for this doctor */
  loadServerDutyData: function() {
    var getArray1 = this.data.index_array_row1;
    // var getArray2 = this.data.index_array_row2;
    // var getArray3 = this.data.index_array_row3;
    var startDate = getArray1[0];
    // var endDate = getArray3[getArray3.length-1];
    var tmpStatus = [];
    var setArray1 = [];
    var setArray2 = [];
    var setArray3 = [];
    // console.log("Start Date is " + startDate + " End Date is " + endDate);
    // simulate only
    for (var i in tmpDutyStatus) {
      if (i >= 0 && i < 7) {
        if (tmpDutyStatus[i] === 0) {
          tmpStatus = {
            "Display": "休诊",
            "Status": 0,
          };
        }
        if (tmpDutyStatus[i] === 1) {
          tmpStatus = {
            "Display": "出诊",
            "Status": 1,
          };
        }
        if (tmpDutyStatus[i] === 2) {
          tmpStatus = {
            "Display": "约满",
            "Status": 2,
          };
        }
        setArray1.push(tmpStatus);
      }

      if (i >= 7 && i < 14) {
        if (tmpDutyStatus[i] === 0) {
          tmpStatus = {
            "Display": "休诊",
            "Status": 0,
          };
        }
        if (tmpDutyStatus[i] === 1) {
          tmpStatus = {
            "Display": "出诊",
            "Status": 1,
          };
        }
        if (tmpDutyStatus[i] === 2) {
          tmpStatus = {
            "Display": "约满",
            "Status": 2,
          };
        }
        setArray2.push(tmpStatus);
      }

      if (i >= 14 && i < 21) {
        if (tmpDutyStatus[i] === 0) {
          tmpStatus = {
            "Display": "休诊",
            "Status": 0,
          };
        }
        if (tmpDutyStatus[i] === 1) {
          tmpStatus = {
            "Display": "出诊",
            "Status": 1,
          };
        }
        if (tmpDutyStatus[i] === 2) {
          tmpStatus = {
            "Display": "约满",
            "Status": 2,
          };
        }
        setArray3.push(tmpStatus);
      }
    }
    console.log(setArray1);
    console.log(setArray2);
    console.log(setArray3);

    // End
    this.setData({
      duty_array_row1: setArray1,
      duty_array_row2: setArray2,
      duty_array_row3: setArray3,
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
  // Simple submit booking
  onClickBtn: function(event) {
    if (event.currentTarget.dataset.num < this.data.today_weekday || event.currentTarget.dataset.num >= this.data.today_weekday + 14) {
      return;
    }
    if (event.currentTarget.dataset.duty !== 1) {
      return;
    }
    wx.showModal({
      title: '确认订单',
      content: '请确认是否提交以下订单:',
      success: function (res) {
        if (res.confirm) {
          console.log("用户点击确定");
        } else {
          console.log("用户点击取消");
        }
      }
    });
  }
})