使用《Javascript高级程序设计》的章节目录对[front-end-interview-handbook](https://github.com/yangshun/front-end-interview-handbook/blob/master/Translations/Chinese/questions/javascript-questions.md)项目的javascript问题进行了系统的划分整理,试着回答，日后可以考虑做扩展。

## 第3章 基本概念
### `null`、`undefined`和未声明变量之间有什么区别？如何检查判断这些状态值？
当没有使用var,let,const等申明变量，就为一个变量进行赋值，该变量就是未声明的变量。未声明的变量会当做在全局作用域下定义的变量。在严格模式下，给未声明的变量进行赋值，会抛出ReferenceError错误。和使用全局变量一样，应尽量避免使用.

````js
  "use strict"
    function foo() {
      x = 1; // 在严格模式下，抛出 ReferenceError:x is not defined 错误
    }

    foo();
    console.log(x); // 1
````
当一个变量已经被声明，却没有进行赋值操作，该变量值为undefined。如果一个函数的执行结果被赋值给一个变量，但是却没有任何返回值，那么该变量的值为undefined。要检查它，需要使用严格相等或是typeof，它会返回undefined字符串。但是不要使用非严格相等来检查，因为如果变量的值为null，使用非严格相等也会返回true；
````js
var foo;
console.log(foo); // undefined
console.log(foo === undefined); // true
console.log(typeof foo === 'undefined'); // true

console.log(foo == null); // true. 错误，不要使用非严格相等！

function bar() {}
var baz = bar();
console.log(baz); // undefined
````
null只能显式的被赋值给变量，表示空值。要检查判断null的值，也要使用严格相等来判断。在这里不能使用非严格相等来判断，因为如果变量值为undefined，使用非严格相等也返回true;

````js
var foo = null;
console.log(foo === null); // true

console.log(foo == undefined); // true. 错误，不要使用非严格相等！
````

不要使用未声明的变量，定义暂时没有值的变量，使用null来为它们赋值。

### `==`和`===`的区别是什么？

`==`是抽象相等运算符，而`===`是严格相等运算符。

`==`运算符是在进行必要的类型转换后，再比较。`===`运算符不会进行类型转换，所以如果两个值不是相同的类型，会直接返回false。使用==时，可能发生一些特别的事情，例如：
````js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
````

建议是从不使用==运算符，除了方便与null或undefined比较时，a == null如果a为null或undefined将返回true。

````js
var a = null;
console.log(a == null); // true
console.log(a == undefined); // true
````

### 使用`let`、`var`和`const`创建变量有什么区别？

用var声明的变量的作用域是它当前的执行上下文，它可以是嵌套的函数，也可以是声明在任何函数外的变量。let和const是块级作用域，意味着它们只能在最近的一组花括号（function、if-else 代码块或 for 循环中）中访问。var可以变量声明提升，let和const不会进行变量声明提升。

````js
function foo() {
  // 所有变量在函数中都可访问
  var bar = 'bar';
  let baz = 'baz';
  const qux = 'qux';

  console.log(bar); // bar
  console.log(baz); // baz
  console.log(qux); // qux
}

console.log(bar); // ReferenceError: bar is not defined
console.log(baz); // ReferenceError: baz is not defined
console.log(qux); // ReferenceError: qux is not defined
````

````js
if (true) {
  var bar = 'bar';
  let baz = 'baz';
  const qux = 'qux';
}

// 用 var 声明的变量在函数作用域上都可访问
console.log(bar); // bar
// let 和 const 定义的变量在它们被定义的语句块之外不可访问
console.log(baz); // ReferenceError: baz is not defined
console.log(qux); // ReferenceError: qux is not defined
````

var会使变量提升，这意味着变量可以在声明之前使用。let和const不会使变量提升，提前使用会报错。

````js
console.log(foo); // undefined

var foo = 'foo';

console.log(baz); // ReferenceError: can't access lexical declaration 'baz' before initialization

let baz = 'baz';

console.log(bar); // ReferenceError: can't access lexical declaration 'bar' before initialization

const bar = 'bar';
````
用var重复声明不会报错，但let和const会。

````js
var foo = 'foo';
var foo = 'bar';
console.log(foo); // "bar"

let baz = 'baz';
let baz = 'qux'; // Uncaught SyntaxError: Identifier 'baz' has already been declared
````

let和const的区别在于：let允许多次赋值，而const只允许一次。
````js
// 这样不会报错。
let foo = 'foo';
foo = 'bar';

// 这样会报错。
const baz = 'baz';
baz = 'qux';
````
### 为什么不要使用全局作用域？
每个脚本都可以访问全局作用域，如果人人都使用全局命名空间来定义自己的变量，肯定会发生冲突。使用模块模式（IIFE）将变量封装在本地命名空间中。
### 什么是"use strict";？使用它有什么优缺点？

'use strict' 是用于对整个脚本或单个函数启用严格模式的语句。严格模式是可选择的一个限制 JavaScript 的变体一种方式 。

优点：

- 无法再意外创建全局变量。
- 会使引起静默失败（silently fail，即：不报错也没有任何效果）的赋值操抛出异常。
- 试图删除不可删除的属性时会抛出异常（之前这种操作不会产生任何效果）。
- 要求函数的参数名唯一。
- 全局作用域下，this的值为undefined。
- 捕获了一些常见的编码错误，并抛出异常。
- 禁用令人困惑或欠佳的功能。

缺点：

- 缺失许多开发人员已经习惯的功能。
- 无法访问function.caller和function.arguments。
- 以不同严格模式编写的脚本合并后可能导致问题。

#### 参考
- http://2ality.com/2011/10/strict-mode-hatred.html
- http://lucybain.com/blog/2014/js-use-strict/



## 第4章 变量，作用域和内存问题
### 请解释变量提升（hosting）

变量提升（hoisting）是用于解释代码中变量声明行为的术语。在js代码执行的时候，会把使用`var` 定义的还有`function a(){}`声明式函数提升到前面，然后依次根据代码的执行顺序，函数声明后全局范围作用域内可以调用使用，而变量声明需要等到赋值完毕才会有值。



## 第5章 引用类型
### 请说明`.forEach`循环和`.map()`循环的主要区别，它们分别在什么情况下使用？

forEach没有返回值，不改变原数组；
map方法返回更改后的原数组
### 宿主对象（host objects）和原生对象（native objects）的区别是什么？

范围不同，宿主对象是有宿主提供的对象，理解为js的运行环境衍生出来的对象，如浏览器的window对象，Bom及Dom对象

原生对象是js语法里面涵盖的对象，Object、Function、Array、String、Boolean、Number、Date、RegExp、Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError、Global


## 第6章 面向对象的程序设计

### 请解释原型继承（prototypal inheritance）的工作原理

在function,Object,Array，String等的数据类型上有一些功能型的原型方法，当这些功能型的方法不是必须的，而且如果每new一个对象上都会绑定这些方法从而引发内存的消耗，这时候我们把方法定义到原型上面，透过原型链来进行访问使用，在这些定义的原型方法上面，我们都保持着同一个指针时的调用路径，不会再开辟内存。

![image](https://xiaoyueyue165.github.io/static/blog/prototype.png)

## 第7章 函数表达式

### 请简述`JavaScript`中的`this`

- [Javascript中的this指向](https://github.com/xiaoyueyue165/blog/issues/18)

### 什么是闭包（closure），为什么使用闭包？

闭包是函数和声明该函数的词法环境的组合。可以使在内部定义的函数方法使用父函数中的声明的变量继续操作。

##### 为什么使用闭包？

用闭包模拟私有方法，使用闭包来定义公共函数，并令其可以访问私有函数和变量，也称为 模块模式;

#####  参考
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures

### 匿名函数的典型应用场景是什么?

匿名函数用作立即执行函数

匿名函数可以用于函数式编程或 Lodash（类似于回调函数）。
````js
const arr = [1, 2, 3];
const double = arr.map(function(el) {
  return el * 2;
});
console.log(double); // [2, 4, 6]
````
### 你如何组织自己的代码？使用模块模式（module pattern）还是经典继承（classical inheritance）？

[js的继承模式](https://github.com/xiaoyueyue165/blog/issues/17),经典继承大概是构造函数继承

使用模块模式，如下：

````js
 var application = function () {

      //private variables and functions
      var components = new Array();

      //initialization
      components.push(new BaseComponent());

      //create a local copy of application
      var app = new BaseComponent();

      //public interface
      app.getComponentCount = function () {
        return components.length;
      };

      app.registerComponent = function (component) {
        if (typeof component == "object") {
          components.push(component);
        }
      };

      //return it
      return app;
    }();

````

### 下列语句有什么区别：`function Person(){}`、`var person = Person()`和`var person = new Person()`？

`var person = Person()`是把函数当做普通函数来调用

`var person = new Person()`使用new操作符，创建Person对象的实例，该实例继承自Person.prototype。另外一种方式是使用Object.create，例如：Object.create(Person.prototype)`。
````js
function Person(name) {
  this.name = name;
}

var person = Person('John');
console.log(person); // undefined
console.log(person.name); // Uncaught TypeError: Cannot read property 'name' of undefined

var person = new Person('John');
console.log(person); // Person { name: "John" }
console.log(person.name); // "john"
````
### `.call`和`.apply`有什么区别？
 
.call和.apply都用于调用函数，第一个参数将用作函数内 this 的值。然而，.call接受逗号分隔的参数作为后面的参数，而.apply接受一个参数数组作为后面的参数。

一个简单的记忆方法是，从call中的 C 联想到逗号分隔（comma-separated），从apply中的 A 联想到数组（array）。

````js
function add(a, b) {
  return a + b;
}

console.log(add.call(null, 1, 2)); // 3
console.log(add.apply(null, [1, 2])); // 3
````
###  请说明`Function.prototype.bind`的用法


bind()方法创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。

````js
 var module = {
      x: 42,
      getX: function () {
        return this.x;
      }
    }

    var retrieveX = module.getX;
    console.log(retrieveX()); // 获取全局范围的变量
    // expected output: undefined

    var boundGetX = retrieveX.bind(module);
    console.log(boundGetX());
    // expected output: 42
````

##### 参考
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
###  请解释同步和异步函数之间的区别

同步函数按照流程堵塞执行

异步函数通常接收回调函数作为参数，在异步调用函数之后立即执行下一行，不堵塞执行，此时将异步调用的函数放入到事件队列里面，等到事件队列里面空闲的时候就以放入堆栈执行。

###  请解释`function foo() {}`和`var foo = function() {}`之间`foo`的用法上的区别。

- [函数声明与函数表达式的区别](https://github.com/xiaoyueyue165/blog/issues/10)


## 第10章 DOM


### “attribute” 和 “property” 之间有什么区别？
````js
const input = document.querySelector('input');
console.log(input.getAttribute('value')); // Hello
console.log(input.value); // Hello
````
但是在文本框中键入“ World!”后:
````js
console.log(input.getAttribute('value')); // Hello
console.log(input.value); // Hello World!
````
##### 参考
- https://stackoverflow.com/questions/6003819/what-is-the-difference-between-properties-and-attributes-in-html


### document 中的`load`事件和`DOMContentLoaded`事件之间的区别是什么？
当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded事件被触发，而无需等待样式表、图像和子框架的完成加载。

window的load事件仅在 DOM 和所有相关资源全部完成加载后才会触发。

##### 参考
- https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
- https://developer.mozilla.org/en-US/docs/Web/Events/load

### 为什么要使用`load`事件？这个事件有什么缺点吗？你知道一些代替方案吗，为什么使用它们？
在文档装载完成后会触发load事件。此时，在文档中的所有对象都在 DOM 中，所有图像、脚本、链接和子框架都完成了加载。

DOM 事件DOMContentLoaded将在页面的 DOM 构建完成后触发，但不要等待其他资源完成加载。如果在初始化之前不需要装入整个页面，这个事件是使用首选。

## 第13章 事件

### 请解释事件委托（event delegation）

为父元素设置监听器，当子元素触发时，事件会冒泡到父元素上，监听器就会触发。好处：
- 内存占用减少，因为只需要一个父元素的事件处理程序，而不必为每个后代都添加事件处理程序。
- 无需从已删除的元素中解绑处理程序，也无需将处理程序绑定到新元素上。

### 请描述事件冒泡

当一个事件在 DOM 元素上触发时，如果有事件监听器，它将尝试处理该事件，然后事件冒泡到其父级元素，并发生同样的事情。最后直到事件到达祖先元素。事件冒泡是实现事件委托的原理（event delegation）。

### 什么是事件循环？调用堆栈和任务队列之间有什么区别？

事件循环是一个单线程循环，用于监视调用堆栈并检查是否有工作即将在任务队列中完成。如果调用堆栈为空并且任务队列中有回调函数，则将回调函数出队并推送到调用堆栈中执行。

##### 参考
- https://2014.jsconf.eu/speakers/philip-roberts-what-the-heck-is-the-event-loop-anyway.html
- http://theproactiveprogrammer.com/javascript/the-javascript-event-loop-a-stack-and-a-queue/

## 第21章 Ajax与Comet

### 请解释关于 JavaScript 的同源策略
同源策略可防止 JavaScript 发起跨域请求。源被定义为 URI、主机名和端口号的组合。此策略可防止页面上的恶意脚本通过该页面的文档对象模型，访问另一个网页上的敏感数据。
#### 参考
- https://en.wikipedia.org/wiki/Same-origin_policy
### 请尽可能详细地解释 Ajax
### 使用Ajax的优缺点分别是什么？
### 请说明 JSONP 的工作原理，它为什么不是真正的 Ajax？
JSONP 通过<script>标签发送跨域请求，通常使用callback查询参数，例如：https://example.com?callback=printData。 然后服务器将数据包装在一个名为printData的函数中并将其返回给客户端。
````js
<!-- https://mydomain.com -->
<script>
function printData(data) {
  console.log(`My name is ${data.name}!`);
}
</script>

<script src="https://example.com?callback=printData"></script>
````
````js
//数据加载自 https://example.com?callback=printData
printData({ name: 'Yang Shun' });
````
现如今，[跨来源资源共享（CORS）](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) 是推荐的主流方式，JSONP 已被视为一种比较 hack 的方式。

## 第22章 高级技巧
* 请解释可变对象和不可变对象之间的区别
* 你能举出一个柯里化函数（curry function）的例子吗？它有哪些好处？
* 高阶函数（higher-order）的定义是什么？

## ES6

###  `Promise`代替回调函数有什么优缺点？
  优点：
- 避免可读性极差的回调地狱。
- 使用.then()编写的顺序异步代码，既简单又易读。
- 使用Promise.all()编写并行异步代码变得很容易。

缺点：

- 轻微地增加了代码的复杂度（这点存在争议）。
- 在不支持 ES2015 的旧版浏览器中，需要引入 polyfill 才能使用。

### ES6 的类和 ES5 的构造函数有什么区别？
###  你能给出一个使用箭头函数的例子吗，箭头函数与其他函数有什么不同？
### 在构造函数中使用箭头函数有什么好处？
###  请给出一个解构（destructuring）对象或数组的例子。
###  ES6 的模板字符串为生成字符串提供了很大的灵活性，你可以举个例子吗
### 使用扩展运算符（spread）的好处是什么，它与使用剩余参数语句（rest）有什么区别？


## 扩展性问题

### 说说你对 AMD 和 CommonJS 的了解。
### 为什么扩展 JavaScript 内置对象是不好的做法？
### 请解释单页应用是什么，如何使其对SEO友好。
### 你使用什么语句遍历对象的属性和数组的元素？
对象：

for循环：`for (var property in obj) { console.log(property); }`。但是，这还会遍历到它的继承属性，在使用之前，你需要加入`obj.hasOwnProperty(property)`检查。

Object.keys()：`Object.keys(obj).forEach(function (property) { ... })`。Object.keys()方法会返回一个由一个给定对象的自身可枚举属性组成的数组。

数组:`for (let i = 0; i < arr.length; i++)`
### 如何在文件之间共用代码？
### 什么情况下会用到静态类成员？
