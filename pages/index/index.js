// index.js
// 获取应用实例
const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    readOnly: false,
    userName: '',
    idCard: '',
    phone: '',
    gender: '男',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    array: ['美国', '中国', '巴西', '日本']
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    let appId = decodeURIComponent(options.appId);
    if (appId == 'undefined' || !appId)
      appId = 'xilvcun'
    wx.setStorageSync('appId', appId)
    this.showUserInfo()

  },
  onShow() {},
  async showUserInfo() {
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      const userId = wx.getStorageSync('userId');
      if (userId) {
        util.sendGet('user/' + userId).then(data => {
          if (data.data && data.data.userName) {
            this.setData({
              userName: data.data.userName,
              idCard: data.data.idCard,
              phone: data.data.mobilePhone,
              gender: data.data.realGender,
              readOnly: true
            })
            wx.setStorageSync('userInfo', JSON.stringify(data.data))
          }

        })
      }
    } else {
      userInfo = JSON.parse(userInfo)
      this.setData({
        userName: userInfo.userName,
        idCard: userInfo.idCard,
        gender: userInfo.realGender,
        phone: userInfo.mobilePhone,
        readOnly: true
      })
    }



  },
  getUserInfo(e) {
    let _this = this;
    wx.login({
      success: function (res_login) {
        if (res_login.code) {
          wx.getUserInfo({
            success: async function (res) {
              console.log(res)
              var jsonData = {
                code: res_login.code,
                encryptedData: res.encryptedData,
                iv: res.iv
              };
              let result = await util.sendPost('wechat/user', jsonData)
              wx.setStorageSync('accessToken', result.data.token)
              wx.setStorageSync('userId', result.data.userId)
              _this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
              })
              _this.showUserInfo()

            }
          })

        }
      }
    })

  },
  async saveInfo() {
    if (!util.checkRules.name(this.data.userName)) {
      util.showMessage.warningMessage("姓名不正确，请重新输入")
      return
    }

    if (!util.checkRules.idCard(this.data.idCard)) {
      util.showMessage.warningMessage("身份证号不正确，请重新输入")
      return
    }
    if (!util.checkRules.phone(this.data.phone)) {
      util.showMessage.warningMessage("手机号码不正确，请重新输入")
      return
    }
    let userInfo = {
      userName: this.data.userName,
      idCard: this.data.idCard,
      mobilePhone: this.data.phone,
      realGender: this.data.gender,
      userId: wx.getStorageSync("userId")
    }
    const result = await util.sendPost('user/', userInfo, 'PUT')
    if (result) {
      util.showMessage.successMessage("提交成功")
      this.setData({
        readOnly: true
      })
    }
  },
  radioChange(e) {
    let {
      key
    } = e.detail
    this.data.gender = key
  }
})