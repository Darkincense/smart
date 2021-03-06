# Javascript 设计模式

## 前言

当学习深入了解后，发现一些晦涩难懂的技巧与设计模式有关，记录学习日志。

## 模块模式

使用 `jquery` 的 **getJSON** 方法来获取 github repoList 数据列表，未加 loading ...

```html
<div id="root"></div>
```

```js
var Module = {
  init: function() {
    var y = this;
    y.id = "root";
    y.error = null;
    y.fetchOrderList(); // 若有可以扩展添加结束处理的逻辑
  },
  fetchOrderList: function() {
    var y = this;
    $.getJSON(
      "https://api.github.com/search/repositories?q=javascript&sort=stars"
    ).then(
      value => {
        y.render(value);
      },
      error => {
        y.error = error; // 错误标记
        y._fetchDataFailed(error);
      }
    );
  },
  render: function(data) {
    var y = this;
    let html;
    if (y.error === null) {
      html = this._resolveData(data);
    } else {
      html = data;
    }
    document.getElementById(y.id).innerHTML = html;
  },

  // 需要时格式化处理
  _resolveData: function(data) {
    var repos = data.items;
    var repoList = repos.map(function(repo, index) {
      return `<li> <a href=${
        repo.html_url
      }>${repo.name}</a> (${repo.stargazers_count} stars) <br /> ${repo.description}</li>`;
    });
    return `<main>
            <h1>Most Popular JavaScript Projects in Github</h1>
            <ol> ${repoList.join("")}</ol>
              </main> `;
  },
  // 错误处理
  _fetchDataFailed: function(error) {
    let errorHtml = `<span>Error: ${error.message}</span>`;
    this.render(errorHtml);
  }
};
Module.init();
```

## 发布订阅模式

异步处理逻辑的一种方式，需要做全局存储事件调控中心，在原生开发小程序中有应用，支持先订阅后发布，以及先发布后订阅

> 注意：使用完成后及时卸载

```js
var Event = (function() {
  var clientList = {},
    pub,
    sub,
    remove;

  var cached = {};

  sub = function(key, fn) {
    if (!clientList[key]) {
      clientList[key] = [];
    }
    // 使用缓存执行的订阅不用多次调用执行
    cached[key + "time"] == undefined ? clientList[key].push(fn) : "";
    if (cached[key] instanceof Array && cached[key].length > 0) {
      //说明有缓存的 可以执行
      fn.apply(null, cached[key]);
      cached[key + "time"] = 1;
    }
  };
  pub = function() {
    var key = Array.prototype.shift.call(arguments),
      fns = clientList[key];
    if (!fns || fns.length === 0) {
      //初始默认缓存
      cached[key] = Array.prototype.slice.call(arguments, 0);
      return false;
    }

    for (var i = 0, fn; (fn = fns[i++]); ) {
      // 再次发布更新缓存中的 data 参数
      cached[key + "time"] != undefined
        ? (cached[key] = Array.prototype.slice.call(arguments, 0))
        : "";
      fn.apply(this, arguments);
    }
  };
  remove = function(key, fn) {
    var fns = clientList[key];
    // 缓存订阅一并删除
    var cachedFn = cached[key];
    if (!fns && !cachedFn) {
      return false;
    }
    if (!fn) {
      fns && (fns.length = 0);
      cachedFn && (cachedFn.length = 0);
    } else {
      if (cachedFn) {
        for (var m = cachedFn.length - 1; m >= 0; m--) {
          var _fn_temp = cachedFn[m];
          if (_fn_temp === fn) {
            cachedFn.splice(m, 1);
          }
        }
      }
      for (var n = fns.length - 1; n >= 0; n--) {
        var _fn = fns[n];
        if (_fn === fn) {
          fns.splice(n, 1);
        }
      }
    }
  };
  return {
    pub: pub,
    sub: sub,
    remove: remove
  };
})();
```

## 装饰者模式

装饰者模式在现在的前端开发场景应用很广泛，如：

- **react** 的高阶函数
- **react-redux** 的 `connect` 方法
- **react-router** 的 `withouter`方法
- **antd** 的 `Form.create`方法
- **Taro** 编译小程序时 将 `getApp()`方法使用 `@withWeapp('Page') class _C extends Taro.Component {}`传入组件中
- 最后点出来 es6 好用的 `{ ...data}` 解构方法
- ...

```js
Function.prototype.before = function(beforefn) {
  var __self = this; // 保存原函数的引用
  return function() {
    // 返回包含了原函数和新函数的"代理"函数
    beforefn.apply(this, arguments); // 执行新函数，且保证 this 不被劫持，新函数接受的参数
    // 也会被原封不动地传入原函数，新函数在原函数之前执行
    return __self.apply(this, arguments); // 执行原函数并返回原函数的执行结果，
    // 并且保证 this 不被劫持
  };
};
Function.prototype.after = function(afterfn) {
  var __self = this;
  return function() {
    var ret = __self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
  };
};
```

- 实例存留，装饰者待深入源码研究学习，未完待续 ...

```js
let doSomething = function() {
  console.log(1);
};

doSomething = doSomething
  .before(() => {
    console.log(3);
  })
  .after(() => {
    console.log(2);
  });

doSomething(); // 输出 312
```
