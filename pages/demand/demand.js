// pages/back/back.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    phone: '',
    demand: '',
    id: ''
  },
  phoneChange(e){
    this.data.phone = e.detail.detail.value
  },
  addressChange(e){
    this.data.address = e.detail.detail.value

  },

  async onLoad() {
    let rid = wx.getStorageSync('rid')
    if (rid) {
      let result = await util.sendGet('ronghui/' + rid)
      if (result) {
        this.setData({
          address: result.data.address,
          phone: result.data.phone,
          demand: result.data.demand
        })
      }
    }
  },
  demandChange(e) {
    this.data.demand = e.detail.detail.value
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  async saveInfo() {
    if (util.checkRules.phone(this.data.phone)) {
      let data = {
        address: this.data.address,
        phone: this.data.phone,
        demand: this.data.demand
      }
      if (!wx.getStorageSync('rid')) {
        let result = await util.sendPost('ronghui/', data)
        util.showMessage.successMessage("保存成功")
        wx.setStorageSync('rid', result.data.id)
      } else {
        data.id = wx.getStorageSync('rid')
        await util.sendPost('ronghui/', data, 'PUT')
        util.showMessage.successMessage("修改成功")
      }


    } else {
      util.showMessage.warningMessage("联系电话不正确")
    }
  },
  async deleteInfo() {

    let rid = wx.getStorageSync('rid')
    if (rid) {

     await  util.sendDelete('ronghui/' + rid)
     wx.removeStorageSync('rid')
     util.showMessage.successMessage("删除成功")
     this.setData({
       address:'',
       phone:'',
       demand:''
     })
  
    }


  }
})