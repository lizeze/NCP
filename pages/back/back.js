// pages/back/back.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '海珠区'],
    array:['是','否'],
    havaArray:['无','有'],
    haveCheck:0,
    customItem: '全部',
    returnDate:util.formatTime(),
    passingRisk:0
  },

 

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindHavePickerChange(e){
    this.setData({
      haveCheck: e.detail.value
    })

  },
  bindPickerChange(e){
    this.setData({
      passingRisk: e.detail.value
    })

  },
  bindTimeChange(e){

   this.setData({
    returnDate:e.detail.value
   })
  },
  change(e) {
    let items = this.data.items;
    items.forEach(item => {
      if(item.name == e.detail.key) {
        item.checked = e.detail.checked;
      }
    });
    this.setData({
      items: items
    });
  }
})