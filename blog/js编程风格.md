框架能够让我们跑的更快，但只有了解原生的 JS 才能让我们走的更远。

## 1.单一`var`

这条规则的意思是，把函数内部的所有变量，放到顶部声明。比如：

```js
//示例
function A() {
  var a = 1,
    b = 2,
    c = a + b;
}
```

优点：

- 便于查找函数内部使用的局部变量
- 防止变量未定义时就被使用
- 防止变量声明提升后引发的误解

关于第三点，这里举个例子说明：

```js
var x = 1;

(function() {
  console.log(x); //第一处输出 ，注意结果
  var x = 2;
  console.log(x); //第二处输出 2，没问题
})();
```

从代码上看，第二处输出肯定没问题，可能会有人认为第一处输出的是 1，因为此时在函数内部还没声明变量 x，根据作用域链，向外层查找的话，x 值为 1。但是实际输出的值应该是 undefined，因为 js 允许在函数任何地方声明变量，并且无论在哪里声明都等同于在顶部声明，这就是声明提升。所以上面的代码相当于:

```js
  var x = 1;

  (function () {
    var x;
    console.log(x);//此时已声明 未赋值
    x = 2;          //赋值
    console.log(x);
  })();
}
```

为了避免可能出现的问题，不如把变量声明都放在代码块的头部。

> 注意：所有变量声明都放在函数的头部;所有函数都在使用之前定义。

## 2.全局变量大写

Javascript 最大的语法缺点，可能就是全局变量对于任何一个代码块，都是可读可写。这对代码的模块化和重复使用，非常不利。

避免使用全局变量；如果不得不使用，用大写字母表示变量名，比如**UPPER_CASE**。

## 3.严格相等

Javascript 有两个表示"相等"的运算符："相等"（==）和"严格相等"（===），使用`==`有可能促使类型转换，建议主加`===`。

```js
1 == "1"; // true
1 == [1]; // true
1 == true; // true
0 == ""; // true
0 == "0"; // true
0 == false; // true
```

你有什么理由不用我？

```js
console.log("" === ""); // true
```

## 4.for 循环缓存 length

使用 for 循环时，缓存长度值通常用使用 for 循环遍历数组时，会采用以下写法：

```js
for (var i = 0; i < arr.length; i++) {
  // 具体操作
}
```

这段代码存在的问题在于，在循环的每个迭代步骤，都必须访问一次 arr 的长度。如果 arr 是静态数值还好，但是我们在使用 js 时可能会碰到 arr 是 dom 元素对象，由于 dom 对象载页面下是活动的查询，这个长度查询就相当耗时，//用 len 缓存长度值

```js
for (var i = 0, len = arr.length; i < len; i++) {
  // 具体操作
}
```

按照上面的代码，我们在第一次获取长度值时就缓存这个长度值，就可以避免上述问题。

## 5.模块化

拒绝全局 function 到底，引入模块模式

```js
var s = 20;
function test(s) {}
function go() {
  test(s);
  $.ajax({});
}
$("#test").click(function() {
  go();
});
```

#### base module

```js
var index = {
  init() {},
  datas() {},
  bind() {
    var y = this;
    y.btn = $("#test");
  },
  render() {
    var y = this;
    $.proxy(y.btn, "click", func, this);
  },
  func() {}
};
index.init();
module.exports = index;
```

## 6.优化 if...else 嵌套

### 三元

```js
if (foo) bar(); else baz(); ==> foo?bar():baz();
if (!foo) bar(); else baz(); ==> foo?baz():bar();
if (foo) return bar(); else return baz(); ==> return foo?bar():baz();

```

### && 和 ||

```js
if (foo) bar(); ==> foo&&bar();
if (!foo) bar(); ==> foo||bar();
```

#### 参考

- [Javascript 编程风格](http://www.ruanyifeng.com/blog/2012/04/javascript_programming_style.html)
- [js 代码常见技巧总结](https://zhuanlan.zhihu.com/p/38066626)
- [看看这些被同事喷的 JS 代码风格你写过多少](https://github.com/jackiewillen/blog/issues/14）
