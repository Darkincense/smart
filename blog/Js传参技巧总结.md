## 1.隐式创建 html 标签

```js
<input type="hidden" name="tc_id" value="{{tc_id}}">
```

> 这种方法一般配合 ajax，上面的 value 使用了模板引擎

## 2.window['data']

```js
window["name"] = "the window object";
```

## 3.使用 localStorage，cookie 等存储

```js
window.localStorage.setItem("name", "xiaoyueyue");
window.localStorage.getItem("name");
```

> 特点

    1、localStorage 是持久存储，不主动删除 一直存在
       sessionStorage 是临时存储,关闭浏览器数据就没了
    2、localStorage 可以多窗口共享
       sessionStorage 不能多窗口共享数据


> 注意点:存储`object`类型数据

```js
var obj = {
  type: "name",
  text: "xiaoyueyue"
};

localStorage.setItem("data", JSON.stringify(obj));
console.log(JSON.parse(localStorage.getItem("data")));
```

## 4.获取地址栏方法

1. 自己封装的方法

```js
function parseParam(url) {
  var paramArr = decodeURI(url)
      .split("?")[1]
      .split("&"),
    obj = {};
  for (var i = 0; i < paramArr.length; i++) {
    var item = paramArr[i];
    if (item.indexOf("=") != -1) {
      var tmp = item.split("=");
      obj[tmp[0]] = tmp[1];
    } else {
      obj[item] = true;
    }
  }
  return obj;
}
```

2.正则表达式方法

```js
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
```

## 5.标签绑定函数传参

```html
<!--base-->
<button id="test1" onclick="alert(id)">test1</button>

<!--高级-->
<button
  id="test"
  name="123"
  yue="xiaoyueyue"
  friend="heizi"
  onclick="console.log(this.getAttribute('yue'),this.getAttribute('friend'))"
>
  test
</button>
```

### this 拓展

使用 this 传参，在使用 art-template 中琢磨出来的，再也不用只传递一个 id 拼接成好几个参数了！happy！

```js
var box = document.createElement("div");
box.innerHTML =
  "<button id='1' data-name='xiaoyueyue' data-age='25' data-friend='heizi' onclick='alertInfo(this.dataset)'>点击</button>";
document.body.appendChild(box);

// name,age,friend
function alertInfo(data) {
  alert(
    "大家好,我是" +
      data.name +
      ", 我今年" +
      data.age +
      "岁了，我的好朋友是" +
      data.friend +
      " !"
  );
}
```

> 这里需要注意一点：存储的 data—含有大写的单词 =》这里会统一转化为小写，比如：data-orderId = “2a34fb64a13211e8a0f00050568b2fdd”，在实际取值的时候为`this.dataset.orderid`;

### event

既然可以使用 this，那么在事件当中`event.target`方法也是可以的：

> 根据 class 获取当前的索引值，参数可以为 event 对象

```
  var getIndexByClass =  function (param) {
    var element = param.classname ? param : param.target;
    var className = element.classname;
    var domArr = Array.prototype.slice.call(document.querySelectorAll('.' + className));
    for (var index = 0; index < domArr.length; index++) {
      if (domArr[index] === element) {
        return index;
      }
    }
    return -1;
  },
```

## 6.HTML5 data-\* 自定义属性

```html
<button data-name="xiaoyueyue">点击</button>
```

```js
var btn = document.querySelector("button");
btn.onclick = function() {
  alert(this.dataset.name);
};
```

## 7.字符串传参

### 单个参数

```js
var name = "xiaoyueyue",
  age = 25;

var box = document.createElement("div");
box.innerHTML = "<button onclick=\"alertInfo('" + name + "')\">点击</button>";
document.body.appendChild(box);

// name, age
function alertInfo(name, age, home, friend) {
  alert("我是" + name);
}
```

### 多参传递

```js
var name = "xiaoyueyue",
  age = "25",
  home = "shanxi",
  friend = "heizi";

var params =
  "&quot;" +
  name +
  "&quot;,&quot;" +
  age +
  "&quot;,&quot;" +
  home +
  "&quot;,&quot;" +
  friend +
  "&quot;";
var box = document.createElement("div");
box.innerHTML = "<button onclick='alertInfo(" + params + ")'>点击</button>";
document.body.appendChild(box);

// name, age,home,friend
function alertInfo(name, age, home, friend) {
  alert("我是" + name + "," + "我今年" + age + "岁了！");
}
```

### 复杂传参

```js
var data = [
  {
    name: "xiaoyueyue",
    age: "25",
    home: "shanxi",
    friend: "heizi"
  }
];

var box = document.createElement("div");

for (var i = 0; i < data.length; i++) {
  box.innerHTML =
    "<button id='btn'  onclick='alertInfo(id,\"" +
    data[i].name +
    '","' +
    data[i].age +
    '","' +
    data[i].home +
    '","' +
    data[i].friend +
    "\")'>点击</button>";
}

document.body.appendChild(box);

function alertInfo(id, name, age, home, friend) {
  alert("我是" + name + "," + friend + "是我的好朋友");
}
```

## 8.arguments

`arguments`对象是所有（非箭头）函数中都可用的局部变量。你可以使用 arguments 对象在函数中引用函数的参数。它是一个类数组的对象。

```html
<button
  onclick="fenpei('f233c7a290ae11e8a0f00050568b2fdd','100','0号 车用柴油(Ⅴ)')"
>
  分配
</button>
```

```js
function fenpei() {
  var args = Array.prototype.slice.call(arguments);
  alert("我是" + args[2] + "油品，数量为 " + args[1] + " 吨， id为 " + args[0]);
}
```

## 9.form 表单

借助`form`表单，ajax 传递序列化参数

```js
// form表单序列化，摘自JS高程
function serialize(form) {
  var parts = [],
    field = null,
    i,
    len,
    j,
    optLen,
    option,
    optValue;

  for (i = 0, len = form.elements.length; i < len; i++) {
    field = form.elements[i];

    switch (field.type) {
      case "select-one":
      case "select-multiple":
        if (field.name.length) {
          for (j = 0, optLen = field.options.length; j < optLen; j++) {
            option = field.options[j];
            if (option.selected) {
              optValue = "";
              if (option.hasAttribute) {
                optValue = option.hasAttribute("value")
                  ? option.value
                  : option.text;
              } else {
                optValue = option.attributes["value"].specified
                  ? option.value
                  : option.text;
              }
              parts.push(
                encodeURIComponent(field.name) +
                  "=" +
                  encodeURIComponent(optValue)
              );
            }
          }
        }
        break;

      case undefined: //fieldset
      case "file": //file input
      case "submit": //submit button
      case "reset": //reset button
      case "button": //custom button
        break;

      case "radio": //radio button
      case "checkbox": //checkbox
        if (!field.checked) {
          break;
        }
      /* falls through */

      default:
        //don't include form fields without names
        if (field.name.length) {
          parts.push(
            encodeURIComponent(field.name) +
              "=" +
              encodeURIComponent(field.value)
          );
        }
    }
  }
  return parts.join("&");
}
```

栗子：

```html
<form id="formData">
  <div class="pop-info">
    <label for="ordersaleCode">订单编号：</label>
    <input
      type="text"
      id="ordersaleCode"
      name="ordersaleCode"
      placeholder="请输入订单编号"
    />
  </div>
  <div class="pop-info">
    <label for="extractType">配送方式：</label>
    <select id="extractType" name="extractType" class="mySelect">
      <option value="0" selected>配送</option>
      <option value="1">自提</option>
    </select>
  </div>
</form>
<button>获取参数</button>
```

```js
document.querySelector("button").onclick = function() {
  console.log("param: " + serialize(document.getElementById("formData"))); // param: ordersaleCode=&extractType=0
};
```
