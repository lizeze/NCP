 let appUrl = function (appId) {


   switch (appId) {

     default:
       return 'https://xx996.cn/xilvcun/api/'
   }
 }

 const formatTime = date => {
   const year = date.getFullYear()
   const month = date.getMonth() + 1
   const day = date.getDate()
   const hour = date.getHours()
   const minute = date.getMinutes()
   const second = date.getSeconds()

   return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
 }

 const formatNumber = n => {
   n = n.toString()
   return n[1] ? n : `0${n}`
 }

 const checkRules = {
   phone: function (value) {
     if (!(/^1[34578]\d{9}$/.test(value)))

       return false;
     else
       return true;
   },
   name: function (value) {
     if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(value)))
       return false;
     else
       return true;
   },
   idCard: function (value) {
     if (!(/(\d{15}$)|(^\d{18}$)|(\d{17}(\d|X|x)$)/.test(value)))
       return false;
     else
       return true;
   }
 }
 let showMessage = {

   successMessage: function (content) {
     wx.lin.showMessage({
       type: 'success',
       content: content
     })
   },
   warningMessage: function (content) {
     wx.lin.showMessage({
       type: 'warning',
       content: content
     })
   },
   errorMessage: function (content) {
     wx.lin.showMessage({
       type: 'error',
       content: content
     })
   }
 }

 let sendPost = function (url, data,type) {
   return new Promise((resovle, reject) => {
     wx.request({
       url: appUrl() + url,
       data: data,
       method: type||'POST',
       header: {
         "appId": wx.getStorageSync('appId'),
         "accessToken": wx.getStorageSync("accessToken"),
         "userId": wx.getStorageSync("userId"),
       },
       complete: function (data) {
         if (data.statusCode !== 200) {
           showMessage.errorMessage(data.data || '请求失败')
           reject()

         } else
           resovle(data)
       }

     })
   })


 }
 let sendGet = function (url) {
  return new Promise((resovle, reject) => {
    wx.request({
      url: appUrl() + url,
      method: 'GET',
      header: {
        "appId": wx.getStorageSync('appId'),
        "accessToken": wx.getStorageSync("accessToken"),
        "userId": wx.getStorageSync("userId"),
      },
      complete: function (data) {
        if (data.statusCode !== 200) {
          showMessage.errorMessage(data.data || '请求失败')
          reject()

        } else
          resovle(data)
      }

    })
  })


}
 module.exports = {
   formatTime,
   checkRules,
   sendPost,
   sendGet,
   showMessage
 }