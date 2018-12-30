const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function sendRequest(path, data, callback) {
  wx.request({
    url: path,
    data: data,
    header: {
      'content-type': 'application/json'
    },
    method: "POST",
    success: callback,
    fail: (res) => {
      console.log(res)
    }
  })
}

function promiseRequest(url, data = {}) {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      success: (res) => {
        if (res.statusCode == 200) {
          resolve(res);
        } else {
          reject(res.errMsg);
        }

      },
      fail: (err) => {
        reject(err)
        console.log("failed")
      }
    })
  });
}

const Storage = {
  setItem: function(key, obj) {
    wx.setStorage({
      key: key,
      data: obj
    })
  },
  getItem: function(key) {
    return wx.getStorageSync(key);
  },
  removeItem: function(key) {
    wx.removeStorage({
      key: key
    })
  }
}

module.exports = {
  formatTime: formatTime,
  sendRequest,sendRequest,
  Storage: Storage
}