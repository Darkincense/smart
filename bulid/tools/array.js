var util = {

  isArray: function (o) {
    return Object.prototype.toString.call(o) == "[object Array]";
  },

  arrayIndex: function (element, array) {
    var index = array.indexOf(element);
    return index;
  },
  isLength: function (value) {
    var MAX_SAFE_INTEGER = 9007199254740991;
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  },
  isArrayLike: function (value) {
    return value != null && typeof value != 'function' && this.isLength(value.length);
  },
  each: function (obj, callback) {
    var length, i = 0;

    if (this.isArrayLike(obj)) {
      length = obj.length;
      for (; i < length; i++) {
        if (callback.call(obj[i], i, obj[i]) === false) {
          break;
        }
      }
    } else {
      for (i in obj) {
        if (callback.call(obj[i], i, obj[i]) === false) {
          break;
        }
      }
    }

    return obj;
  },
  // 将一组类数组转换为数组
  toArray: function (obj) {
    return Array.from ? Array.from(obj) : Array.prototype.slice.call(obj);
  },

  in_array: function (needle, haystack) {
    if (typeof needle == 'string' || typeof needle == 'number') {
      for (var i in haystack) {
        if (haystack[i] == needle) {
          return true;
        }
      }
    }
    return false;
  },

  isContains: function (arr, current) {
    if (Array.prototype.includes) {
      return arr.includes(current);
    }
    for (i = 0; i < arr.length && arr[i] != current; i++);
    return !(i == arr.length);
  },

  // 数组最大值，最小值
  maxArr: function (arr) {
    return Math.max.apply(null, arr);
  },

  minArr: function (arr) {
    return Math.min.apply(null, arr);
  },

  //去除数组中假值元素，比如undefined,null,0,"",NaN都是假值
  compact: function (arr) {
    var index = -1,
      resIndex = -1,
      result = [],
      len = arr ?
      arr.length :
      0;
    while (++index < len) {
      var value = arr[index];
      if (value) {
        result[++resIndex] = value;
      }
    }
    return result;
  },
  // 从数组中随机取出一个
  randomOne: function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
};


// 给数组创建一个随机项
var items = [12, 548, 'a', 2, 5478, 'foo', 8852, , 'Doe', 2145, 119];
var randomItem = items[Math.floor(Math.random() * items.length)];

// 打乱数字数组的顺序
var numbers = [12, 548, 'a', 2, 5478, 'foo', 8852, , 'Doe', 2145, 119];
numbers.sort(function () {
  return Math.random() - 0.5;
});

// 数组追加
Array.prototype.push.apply(array1, array2);

//数组原型扩展remove方法
Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
//兼容IE8
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (elt /*, from*/ ) {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0) ?
      Math.ceil(from) :
      Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++) {
      if (from in this && this[from] === elt)
        return from;
    }
    return -1;
  };
}

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
// 判断数组里是否有某个元素

Array.prototype.isContains = function (e) {
  if (Array.prototype.includes) {
    return Array.prototype.includes(e);
  }
  for (i = 0; i < this.length && this[i] != e; i++);
  return !(i == this.length);
}



// 得到n1-n2下标的数组
//getArrayNum([0,1,2,3,4,5,6,7,8,9],5,9)
//[5, 6, 7, 8, 9]

//getArrayNum([0,1,2,3,4,5,6,7,8,9],2) 不传第二个参数,默认返回从n1到数组结束的元素
//[2, 3, 4, 5, 6, 7, 8, 9]
function getArrayNum(arr, n1, n2) {
  var arr1 = [],
    len = n2 || arr.length - 1;
  for (var i = n1; i <= len; i++) {
    arr1.push(arr[i])
  }
  return arr1;
}



// 去除重复的数据
function dedupe(client, hasher) {
  hasher = hasher || JSON.stringify;

  var clone = [],
    lookup = {};

  for (var i = 0; i < client.length; i++) {
    var elem = client[i], //数组元素
      hashed = hasher(elem); //键



    if (!lookup[hashed]) { //对象中没有键
      clone.push(elem); //放到新数组
      lookup[hashed] = true; //标识符
    }
  }

  return clone;
}

// dedupe.test.js
/* var a=  [1,2,3,2];
var b = dedupe(a);
console.log(b)

var aaa = [{a: 2, b: 1}, {a: 1, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}]
var bbb = dedupe(aaa, value => value.a)  //只看元素的a键的值是否存在
console.log(bbb) */



// 筛选数组
//删除值为'val'的数组元素
//removeArrayForValue(['test','test1','test2','test','aaa'],'test','%')
//["aaa"]   带有'test'的都删除

//removeArrayForValue(['test','test1','test2','test','aaa'],'test')
//["test1", "test2", "aaa"]  //数组元素的值全等于'test'才被删除
function removeArrayForValue(arr, val, type) {
  return arr.filter(function (item) {
    return type ? item.indexOf(val) === -1 : item !== val;
  });
}