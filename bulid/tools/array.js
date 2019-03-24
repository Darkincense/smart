var util = {
  isArrayLike: function (value) {
    return value != null && typeof value != 'function' && this.isLength(value.length);
  },
  // 将一组类数组转换为数组
  toArray: function (obj) {
    return Array.from ? Array.from(obj) : Array.prototype.slice.call(obj);
  },
  isContains: function (arr, current) {
    if (Array.prototype.includes) {
      return arr.includes(current);
    }
    for (i = 0; i < arr.length && arr[i] != current; i++);
    return !(i == arr.length);
  },
  arrayIndex: function (element, array) {
    var index = array.indexOf(element);
    return index;
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

/**
 * 数组对象根据某一个相同的键去重
 *
 * @param {*} arr
 * @param {*} name 去除所有数组子项与此key值重复项
 * @returns
 */
function uniqueArrayObj(arr, name) {
  var hash = {};
  return arr.reduce(function (item, next) {
    hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
    return item;
  }, []);
}

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

/**
 * 为数组添加新的自定义键值以及过滤每个子项的方法
 *
 * @param {*} arr 
 * @param {*} obj { isShow:false,isStar:false}
 * @param {*} filterFn
 * @returns
 */
function addKey(arr, obj, filterFn) {
  var temp = arr.forEach((v, index, arr) => {
    typeof filterFn === 'function' ? filterFn(v, index) : '';
    for (var key in obj) {
      v[key] = obj[key]
    }
  })
  return temp;
}

/**
 *
 * 数组对象根据某属性排序
 * @param {*} props
 * @returns
 */
function sortBy(props) {
  return function (a, b) {
    return a[props] - b[props];
  }
}