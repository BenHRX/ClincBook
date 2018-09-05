// pages/DoctorView/DoctorView.js
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
    if (searchDr === 'search_doctor'){
      tmpFlag = true;
    }
    this.setData({
      ChosenDate: options.date,
      ChosenDepartment: options.department,
      ChosenHospital: options.hospital,
      ChosenCity: options.city,
      SearchDoctor: tmpFlag,
    })
    this.onLoadDrDetail();
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

  //获得服务器的数据
  onLoadDrDetail: function() {
    var serverData = [{
        'Photo': "../../image/TestUsing/HeadPhoto1.png",
        'name': "张三",
        'Mark': "特约医生",
        'Department': "儿科,儿童保健科",
        "Major": "腹泻,咳嗽,发热盗汗,肚子胀痛,肠胃不适,发冷",
        "Career": "原国家测试医院测试科测试主治医生编号001\n国家一级医生\n收费: 350元/次",
        "TimeSlot": "8:30,9:30,10:30,11:30",
      },
      {
        'Photo': "../../image/TestUsing/HeadPhoto2.png",
        'name': "李四",
        'Mark': "专科医生",
        'Department': "儿科",
        "Major": "腹泻,咳嗽,发热盗汗,肚子胀痛,肠胃不适,发冷,感冒,厌食,大便干硬,易累",
        "Career": "原国家测试医院测试科测试主治医生编号002\n国家特级医生\n收费: 450元/次",
        "TimeSlot": "8:30,9:30,10:30,14:30,15:30,16:30",
      },
    ];
    // console.log(serverData);
    var tmpData = Array();
    var tmpFullData = Array();
    for (var e in serverData) {
      tmpFullData[e] = {
        'Photo': serverData[e]['Photo'],
        'name': serverData[e]['name'],
        'Mark': serverData[e]['Mark'],
        'Department': serverData[e]['Department'],
        "Major": serverData[e]['Major'].split(","),
        "Career": serverData[e]['Career'],
        "TimeSlot": serverData[e]['TimeSlot'].split(","),
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
      click_id : dr_id,
      Doctor: dr_index,
      // BookingShow: true,
    });
    var that = this;
    wx.showModal({
      title: '确认订单',
      content: "请核对是否提交以下订单 [医生名称]: " + dr_name + " [预约时间]: " + this.data.ChosenDate + " " + this.data.serverDataArray[dr_index]['TimeSlot'][dr_id] + " [预约科室]: " + this.data.ChosenDepartment,
      success: function(res){
        if(res.confirm){
          console.log("用户点击确定");
        }
        else{
          console.log("用户点击取消");
          that.setData({
            click_id: -1,
            Doctor: -1,
          });
        }
      },
    })
  },

  onClickDoctor: function(e){
    wx.navigateTo({
      url: '../DoctorDetail/DoctorDetail',
    });
  }
})