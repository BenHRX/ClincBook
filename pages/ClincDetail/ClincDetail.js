var globalData = getApp().globalData;

// pages/ClincDetail/ClincDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HospitalTitle: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      HospitalTitle: options.hospital,
    });
    this.LoadHospitalDetail();
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
  
  },

  // 加载相应信息
  LoadHospitalDetail: function() {
    var that = this;
    wx.request({
      url: globalData.g_base_api_url + 'hospital_controller/response_hospital_detail',
      data: {
        'hospital': this.data.HospitalTitle,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res){
        that.processHospitalDetailData(res);
      }
    })
  },
  processHospitalDetailData: function(res){
    var service_list = "";
    for (var idx in res.data.department){
      service_list = service_list + " " + res.data.department[idx].department;
    }
    var parseString;
    parseString = res.data.info[0].addition_info;
    console.log(res.data);
    var new_array = parseString.split(";");
    var phone_call = new_array[0].trim();
    var language = new_array[1].trim();
    var traffic = new_array[2].trim();
    console.log("The phone number is " + phone_call + " Support language is " + language + " The traffic is " + traffic + " The service is " + service_list.trim());
    this.setData(
      {
        "hospital_address": res.data.info[0].address,
        "hospital_phone": phone_call,
        "hospital_service" : service_list,
        "hospital_language" : language,
        "hospital_traffic" : traffic,
        "hospital_longtitude": res.data.info[0].longtitude,
        "hospital_latitude": res.data.info[0].latitude,
        "hospital_view": res.data.info[0].view_photo,
        "hospital_name": res.data.info[0].name,
        "hospital_photo": globalData.g_base_image_url + res.data.info[0].view_photo,
      }
    );
  },

  // 点击地址栏
  onClickAddress: function(event){
    wx.navigateTo({
      url: "../Map/MapController?longtitude=" + this.data.hospital_longtitude + "&latitude=" + this.data.hospital_latitude + "&name=" + this.data.hospital_name,
    })
  },

  // 点击电话栏
  onClickPhoneCall: function(event){
    wx.makePhoneCall({
      phoneNumber: this.data.hospital_phone,
    });
  }
})