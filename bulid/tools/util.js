/**
 * 判断数据类型
 *
 * @param {*} a
 * @returns
 */
function getType(a) {
  var typeArray = Object.prototype.toString.call(a).split(" ");
  return typeArray[1].slice(0, -1);
}

/**
 * 判断变量是否为空
 * @param val
 * @returns {boolean}
 */
function isempty(val) {
  return (val == null || val == '' || val == undefined || typeof (val) == typeof (undefined));
}

/**
 * 按数量分割字符串
 *
 * @param {*} word
 * @param {*} num 按多少个字符分割
 * @returns array
 */
function splitWords(word, num) {
  let slices = [];
  const chars = word.split('');
  while (chars.length > 0) {
    slices = slices.concat(chars.splice(0, num).join(''));
  }
  return slices;
}

/**
 * 四舍五入 格式化数字
 *
 * @param {*} number 8440.55
 * @param {*} fractionDigits 1 小数位数
 * @returns 8440.6
 */
function toFixed(number, fractionDigits) {
  var times = Math.pow(10, fractionDigits);
  var roundNum = Math.round(number * times) / times;
  return roundNum.toFixed(fractionDigits);
}
/**
 * 把当前的数字格式化为指定小数位数的金额
 * @param {*} s 价格数字
 * @param {*} n 小数点后位数
 * @returns
 */
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

/**
 * 还原价格
 * @param {*} s 上面方法过滤后的结果
 * @returns
 */
function rmoney(s) {
  return parseFloat(s.replace(/[^\d\.-]/g, ""));
}

/**
 * 防抖 一定时间内连续调用只允许执行一次
 *
 * @param {*} func 
 * @param {*} wait 等待时间
 * @param {*} immediate 传 true，首次调用即立即执行
 * @returns
 */
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var canApply = !timeout;
      timeout = setTimeout(function () {
        timeout = null; // 在 wait 时间后防抖函数才可以再次被触发
      }, wait)
      if (canApply) func.apply(context, args) // 第一次 !undefined 执行
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait);
    }

  }
}
/**
 * 只允许执行一次的 once 方法
 * @param {*} fn
 * @returns
 */
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