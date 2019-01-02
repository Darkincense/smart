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

function toFixed(number, fractionDigits) {
  var times = Math.pow(10, fractionDigits);
  var roundNum = Math.round(number * times) / times;
  return roundNum.toFixed(fractionDigits);
}

function parseDistance(number) {
  var distance = number / 1000;
  return toFixed(distance,1);
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

module.exports = {
  formatTime: formatTime,
  parseDistance: parseDistance
}