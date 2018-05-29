// Object 在obj中是否有key

function has(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
}
//此对象包含函数与对象
function isObject(obj) {

    var type = typeof (obj);
    return type === 'function' || type === 'object' && !!obj;

}

// 获取所有对象的键(属性名)放入到数组中

function keys(obj) {
    var nativeKeys = Object.keys;
    if (!isObject(obj))
        return [];
    if (nativeKeys) {
        return nativeKeys(obj)
    }
    var keys = [];
    for (var key in obj) {
        if (has(obj, key))
            keys.push(key);
    }
    return keys;

}

//  将一个对象的value放入到数组中

function values(obj) {
    var keys1 = keys(obj),
        length = keys1.length,
        values = Array(length);

    for (var i = 0; i < length; i++) {
        values[i] = obj[keys1[i]];
    }

    return values;

}
// 把一个对象转变为一个[key, value]形式的数组

function pairs(obj) {
    var keys2 = keys(obj);
    var length = keys2.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
        pairs = [
            keys2[i],
            obj[keys2[i]]
        ];
    }

    return pairs;
}

// obj转化为字符串 password=1&sid=1&username=12&
function signParam(obj) {
    var arr = [];
    for (key in obj) {
      arr.push(key);
    };
    arr.sort();
    var objSign = '';
    for (var i = 0; i < arr.length; i++) {
      i < arr.length - 1 ? objSign += arr[i] + '=' + obj[arr[i]] + '&' : objSign += arr[i] + '=' + obj[arr[i]];
    }
    return objSign;
  }
  // 对象深度克隆
  Object.prototype.clone = function () {
    var newObj = {};
    for (var i in this) {
        console.log("i = " + i)
        if (typeof(this[i]) == 'object'|| typeof(this[i]) == 'function') {
            newObj[i] = this[i].clone()
        } else {
            newObj[i] = this[i]
        }
    }
    return newObj
}

