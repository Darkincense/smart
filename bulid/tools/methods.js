window.onerror = function (
  errMsg,
  scriptURI,
  lineNumber,
  columnNumber,
  errorObj
) {
  setTimeout(function () {
    var rst = {
      "错误信息：": errMsg,
      "出错文件：": scriptURI,
      "出错行号：": lineNumber,
      "出错列号：": columnNumber,
      "错误详情：": errorObj
    };

    alert(JSON.stringify(rst, null, 10));
  });
};
// 判断是否是整数，兼容ie
Number.isInteger = Number.isInteger || function (value) {
  return typeof value === "number" &&
    isFinite(value) &&
    Math.floor(value) === value;
};

var util = {

  isObject: function (data) {
    return Object.prototype.toString.call(data) === '[object Object]';
  },

  // 对象合并 exrtend(true);深拷贝 依赖 isObject
  extend: function (deep) {
    var sources = typeof deep === 'boolean' && deep ? Array.prototype.slice.call(arguments, 1) : Array.prototype.slice.call(
      arguments);
    var i = 0,
      obj = {};
    for (; i < sources.length; i++) {
      if (!this.isObject(sources[i])) {
        console.error("Function[extend] parmas must be Object")
        return false;
      }
      for (var key in sources[i]) {
        if (deep === true && this.isObject(sources[i][key]) && obj[key]) {
          obj[key] = extend(deep, obj[key], sources[i][key]);
          continue;
        }
        if (sources[i].hasOwnProperty(key)) {
          obj[key] = sources[i][key]
        }

      }
    }
    return obj;
  },
  // 判断数据类型
  getType: function (a) {
    var typeArray = Object.prototype.toString.call(a).split(" ");
    return typeArray[1].slice(0, -1);
  },

  isEmpty: function (str, callback) {
    if (str == "" || str == null || typeof (str) == "undefined") {
      callback();
    }
  },

  isNumber: function (obj) {
    return Object.prototype.toString.call(obj) === "[object Number]";
  },

  // 判断是否是有效的正整数
  isDigit: function (value) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(value) == null || value == "") {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 判断变量是否为空
   * @param val
   * @returns {boolean}
   */
  isempty: function (val) {
    return (val == null || val == '' || val == undefined || typeof (val) == typeof (undefined));
  },

  // 四舍五入 格式化数字
  // toFix(8440.55,1) => 8440.6
  toFixed: function (number, fractionDigits) {
    var times = Math.pow(10, fractionDigits);
    var roundNum = Math.round(number * times) / times;
    return roundNum.toFixed(fractionDigits);
  },

}

/**
 *
 * 在wrapdom范围内使用data key赋值（支持特殊标识符）
 * @param {dom} wrapDom 外包含dom元素
 * @param {obj} data 数据
 * @param {string} special 特殊标识符号
 */
function renderWithObj(wrapDom, data, special) {
  var $ = function (selector, el) {
    if (!el) {
      el = document;
    }
    return el.querySelector(selector);
  }
  for (var key in data) {
    var query = special ? special + '_' + key : key;
    var element = $('#' + query, wrapDom) || $('.' + query, wrapDom);
    if (element) {
      element.value = data[key];
    } else {
      console.error('没有 ' + query + ' 的匹配项')
    }
  }
}

function splitWords(word, num) {
  let slices = [];
  const chars = word.split('');
  while (chars.length > 0) {
    slices = slices.concat(chars.splice(0, num).join(''));
  }
  return slices;
}


//传递一个范围，返回该范围的随机数
function getRand(min, max) {
  if (max < min) {
    var n = max;
    max = min;
    min = n;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 前补0  prefixInteger(3,3) => 003
function prefixInteger(num, length) {
  return (num / Math.pow(10, length)).toFixed(length).substr(2);
}

function fmoney(s, n) {
  //s:传入的float数字 ，n:希望返回小数点几位
  var n = n > 0 && n <= 20 ? n : 2,
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "",
    l = s.split(".")[0].split("").reverse(),
    r = s.split(".")[1],
    t = "";
  for (i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;
}

function rmoney(s) {
  return parseFloat(s.replace(/[^\d\.-]/g, ""));
}


/**
 *
 * 金额转大写显示 Chinese character amount
 * @param {number} money 
 * @returns {string}大写的金额 
 */
function convertCurrency(money) {
  //汉字的数字
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  //基本单位
  var cnIntRadice = new Array('', '拾', '佰', '仟');
  //对应整数部分扩展单位
  var cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  var cnDecUnits = new Array('角', '分', '毫', '厘');
  //整数金额时后面跟的字符
  var cnInteger = '整';
  //整型完以后的单位
  var cnIntLast = '元';
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = '';
  //分离金额后用的数组，预定义
  var parts;
  if (money == '') {
    return '';
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    var decLen = decimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
}
/**
 *
 * @desc 判断浏览器是否支持webP格式图片
 * @return {Boolean}
 */
function isSupportWebP() {
  return (!![].map &&
    document
    .createElement("canvas")
    .toDataURL("image/webp")
    .indexOf("data:image/webp") == 0
  );
}


// var url = 'http://xiaoyueyue.org';
function timestamp(url) {
  //  var getTimestamp=Math.random();
  var getTimestamp = new Date().getTime();
  if (url.indexOf("?") > -1) {
    url = url + "&timestamp=" + getTimestamp;
  } else {
    url = url + "?timestamp=" + getTimestamp;
  }
  return url;
}
// var newUrl = timestamp(url);
// window.location.href = newUrl
//根据名称获取页面中chechbox或者radio标签选中项的值，以逗号分割，组成一个字符串返回。
function getSelIds(inputName) {
  var checkboxes = document.getElementsByName(inputName);
  var ids = "";
  for (var i = 0; i < checkboxes.length; i++) {
    var chx = checkboxes[i];
    if (chx.checked) {
      if (ids != "") ids += ",";
      ids += chx.value;
    }
  }
  return ids;
}



// 超过范围的值只取最大范围
function rangval(val, min, max) {
  try {
    if (val > parseInt(max)) {
      val = max;
    } else if (val < parseInt(min)) {
      val = min;
    }
  } catch (e) {
    console.log(e.message);
  }
  return val;
}

//定时跳转
function jump(count, target) {
  window.setTimeout(function () {
    count--;
    if (count > 0) {
      jump(count, target);
    } else {
      location.href = target;
    }
  }, 1000);
}


// 防抖（Debouncing/Debounce）
// debounce 的关注点是空闲的间隔时间,强制函数在某段时间内只执行一次。

// 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行

function debounce(fn, delay) {
  var timer;
  return function () {
    var context = this;
    var args = arguments;
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}
// 节流（Throttling/Throttle）
// throttle 的关注点是连续的执行间隔时间,强制函数以固定的速率执行。

// 频率控制 返回函数连续调用时，action 执行频率限定为 次 / delay
function throttle(func, wait) {
  var timeout, previous;
  return function () {
    context = this;
    args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context.args);
      }, wait);
    }
  }
}

// 只执行一次的once方法 once(function(){})
function once(fn) {
  return function () {
    if (typeof fn === "function") {
      var ret = fn.apply(this, arguments);
      fn = null;
      return ret;
    } else {
      throw new TypeError('Expected a function')
    }
  }
}