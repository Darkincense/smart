'use strict';

// 惰性载入单例
// 有时候对于单例对象需要延迟创建，所以在单例中还存在一种延迟创建的形式，有人也称之为‘惰性创建’
var LazySingle = (function() {

  // 单例实例引用
  var _instance = null;

  // 单例
  function Single() {
    // 这里定义私有属性和方法
    return {
      publicMethod: function() {},
      publicProperty: '1.0'
    }
  }

  return function() {

    if (!_instance) {
      _instance = Single();
    }

    // 返回单例
    return _instance;
  }
})();


console.log( LazySingle().publicProperty ); // 1.0
console.log( LazySingle() === LazySingle() ); // true