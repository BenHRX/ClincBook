var serverCities = ["深圳","北京","上海","广州"];

// pages/bookPage/ClinicBooking.js
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
    department_list: [],
    department_chose: "",
    department_idx: 0,
    HospitalData: [],
    CityChosen: "广州", // Default
    cityArray: ["广州"], // Default
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.displayDate();
    this.formatCalendar();
    this.loadServerCities();
    this.serviceLoad();
    this.loadHospitalData();
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

  // 用户点击日历
  onClickBtn: function(event) {
    var click_id = event.currentTarget.dataset.num;
    console.log("click id:" + click_id);
    console.log("weekday:" + this.data.today_weekday);
    if (click_id < this.data.today_weekday || click_id >= this.data.today_weekday + 14) {
      return;
    } else {
      var tmpArray = this.calcFullDate(click_id - this.data.today_weekday);
      // for(var i in tmpArray){
      //   console.log("The temp array " + i + " is " + tmpArray[i]);
      // }
      this.setData({
        _num: event.currentTarget.dataset.num,
        choseDate: tmpArray['year'] + "年" + tmpArray['month'] + "月" + tmpArray['day'] + "日",
      });
    }
  },

  // 日历头显示
  displayDate: function() {
    var date_data = new Date();
    var year = date_data.getFullYear();
    var month = date_data.getMonth() + 1;
    var day = date_data.getDate();
    var week_day = date_data.getDay();
    // console.log(year + " / " + month + " / " + day + " Week : " + week_day);
    this.setData({
      Date_string: year + "年" + this.setNumFormat(month) + "月" + this.setNumFormat(day) + "日",
      choseDate: year + "年" + this.setNumFormat(month) + "月" + this.setNumFormat(day) + "日",
      Week_Day: week_day,
    });
  },
  // 日期计算
  formatCalendar: function() {
    // 获得月份和日期年份, 闰年处理
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
  calcFullDate: function(days) { // 只是计算自增的
    var choseDate = new Date((new Date().valueOf()) + days * 24 * 60 * 60 * 1000);
    var choseDateArray = [];
    choseDateArray['day'] = this.setNumFormat(choseDate.getDate());
    choseDateArray['month'] = this.setNumFormat(choseDate.getMonth() + 1);
    choseDateArray['year'] = choseDate.getFullYear();
    return choseDateArray;
  },
  setNumFormat: function(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  },
  // 读取可用服务
  serviceLoad: function() {
    var services = ['内科及全科', '妇产科', '儿科', '儿童保健', '齿科', '齿科正畸', '眼科', '耳鼻喉科', '皮肤科', '营养科', '高端体检'];
    var tmp_list = [];
    var tmp_full_list = [];

    for (var c in services) {
      tmp_list.push(services[c]);
      if ((parseInt(c, 10) + 1) % 4 == 0) {
        tmp_full_list.push(tmp_list);
        tmp_list = [];
      }
    }
    tmp_full_list.push(tmp_list);
    tmp_list = [];
    for (var x in tmp_full_list) {
      console.log("List:" + tmp_full_list[x]);
    }
    this.setData({
      department_list: tmp_full_list,
      department_chose: services[0],
    });
  },
  // 对应department click
  onClickDepartment: function(event) {
    var data_click = event.currentTarget.dataset.click;
    var dep_idx = event.currentTarget.dataset.idx;
    console.log("Now click the value is " + data_click + " index " + dep_idx);
    this.setData({
      department_chose: data_click,
      department_idx: dep_idx,
    });
  },
  // 医院数据读取
  loadHospitalData: function() {
    var tmpServerData = [{
        "h_img": "../../image/TestUsing/TestView01.png",
        "h_Title": "广州医科大学附属第一医院",
        "h_Summary": "广州市沿江路151号(原市总工对面)\n电话：020-83062114",
      },
      {
        "h_img": "../../image/TestUsing/TestView02.png",
        "h_Title": "广州医科大学附属第二医院",
        "h_Summary": "广州市海珠区昌岗东路250号\n咨询电话：86-020-34152282",
      },
      {
        "h_img": "../../image/TestUsing/TestView03.png",
        "h_Title": "广州医科大学附属第三医院",
        "h_Summary": "广州市荔湾区多宝路63号\n邮编：510150",
      }
    ];
    this.setData({
      HospitalData: tmpServerData,
    });
  },
  onClickHospital: function(event){
    var click = event.currentTarget.dataset.idx;
    console.log("Click Hospital " + click);
    wx.navigateTo({
      url: '../DoctorView/DoctorView?hospital=' + this.data.HospitalData[click]['h_Title'] + "&department=" + this.data.department_chose + "&date=" + this.data.choseDate + "&city=" + this.data.CityChosen + "&search=0",
    });
  },
  onHosipitalPosition: function(event){
    var click = event.currentTarget.dataset.idx;
    console.log("Click Hospital position mark " + click);
    wx.navigateTo({
      url: '../ClincDetail/ClincDetail?hospital=' + this.data.HospitalData[click]['h_Title'],
    });
  },

  /* 显示目前选择的城市 */
  bindPickerChange: function(event){
    console.log(event);
    var chosenIndex = event.detail.value;
    console.log(this.data.cityArray[chosenIndex]);
    this.setData({
      CityChosen: this.data.cityArray[chosenIndex],
    });
  },

  /* 获得地区信息 */
  loadServerCities: function(){
    this.setData({
      cityArray: serverCities,
    });
  },
  onTapSearch: function(event){
    wx.navigateTo({
      url: "../DoctorView/DoctorView?hospital=Nil&department=Nil&date=Nil&city=" + this.data.CityChosen + "&search=search_doctor",
    });
  }
})