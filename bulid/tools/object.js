/**
 * Object 在obj中是否有key
 *
 * @param {*} obj
 * @param {*} key
 * @returns
 */
function has(obj, key) {
  return obj != null && hasOwnProperty.call(obj, key);
}
// 对象深度克隆，支持[]和{}
Object.prototype.clone = function() {
  var obj = this;
  if (typeof obj !== "object") return;
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === "object" ? obj[key].clone() : obj[key];
    }
  }
  return newObj;
};

/**
 * 获取所有对象的键放入到数组中
 *
 * @param {*} obj
 * @returns
 */
function keys(obj) {
  var nativeKeys = Object.keys;
  if (!isObject(obj)) return [];
  if (nativeKeys) {
    return nativeKeys(obj);
  }
  var keys = [];
  for (var key in obj) {
    if (has(obj, key)) keys.push(key);
  }
  return keys;
}

/**
 * 将一个对象的值放入到数组中
 *
 * @param {*} obj
 * @returns
 */
function values(obj) {
  var keys1 = keys(obj),
    length = keys1.length,
    values = Array(length);
  for (var i = 0; i < length; i++) {
    values[i] = obj[keys1[i]];
  }
  return values;
}

/**
 * 把一个对象转变为一个[key, value]形式的数组
 *
 * @param {*} obj
 * @returns
 */
function pairs(obj) {
  var keys2 = keys(obj);
  var length = keys2.length;
  var pairs = Array(length);
  for (var i = 0; i < length; i++) {
    pairs = [keys2[i], obj[keys2[i]]];
  }
  return pairs;
}

/**
 * 递归实现深拷贝
 *
 * @param {*} o
 * @returns
 */
function clone(o) {
  var temp = {};
  for (var k in o) {
    if (typeof o[k] == "object") {
      temp[k] = clone(o[k]);
    } else {
      temp[k] = o[k];
    }
  }
  return temp;
}
