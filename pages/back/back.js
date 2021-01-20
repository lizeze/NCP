// pages/back/back.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['请选择', '请选择', '请选择'],
    haveCheck: 0,
    customItem: '请选择',
    returnDate: util.formatTime(),
    passingRisk: 1,
    readOnly:false
  },

  async onLoad() {
    let data =  await util.sendGet('back/' + wx.getStorageSync('userId'))
    let regionArray = []
    regionArray.push(data.data.province) 
    regionArray.push(data.data.city)
     regionArray.push(data.data.county)
    if (data) {
       console.log(regionArray)
      this.setData({
        region: regionArray,
        haveCheck: data.data.haveCheck,
        returnDate:util.formatTime(data.data.returnDate),
        passingRisk: data.data.passingRisk,
        readOnly:true
      })
    }

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

  onChangeHavaCheck(e) {
    let isHava = e.detail.value
    this.setData({
      haveCheck: isHava ? 1 : 0
    })
  },
  onChangePassingRisk(e) {
    let isPassingRisk = e.detail.value
    this.setData({

      passingRisk: isPassingRisk ? 1 : 0
    })


  },
  bindTimeChange(e) {

    this.setData({
      returnDate: e.detail.value
    })
  },
  async saveInfo() {
    if (this.data.region.indexOf('请选择') != -1) {
      util.showMessage.warningMessage("请选择外出所在地，精确到区县")
      return
    }
    let data = {

      userId: wx.getStorageSync('userId'),
      province: this.data.region[0],
      city: this.data.region[1],
      county: this.data.region[2],
      haveCheck: this.data.haveCheck,
      returnDate: this.data.returnDate,
      passingRisk: this.data.passingRisk
    }
    let result = await util.sendPost('/back/', data)

    console.log(result)
  },
  change(e) {
    let items = this.data.items;
    items.forEach(item => {
      if (item.name == e.detail.key) {
        item.checked = e.detail.checked;
      }
    });
    this.setData({
      items: items
    });
  }
})