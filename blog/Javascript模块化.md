## 1.ES5的模块化

[segmentfault 我的提问:如何更好的组织代码？](https://segmentfault.com/q/1010000014261919)

自问自答，已初步解决（项目不支持es6语法）

### 未修改
```js
 
    // 当所有组件准备好后执行内部回调方法
    appcan.ready(function () {
            if (true) {
                // 下拉添加数据逻辑
                addData();
            }
            queryCusBasOrg();
        });

        //  获取公司列表
        function queryCusBasOrg() {
            // callback:showCompanyCallback
        }

        // 获取公司列表回调
        function showCompanyCallback(data) {
            queryBills(linkId);
        }

        // 获取订单数据
        function queryBills(linkId) {
        }

        // 获取订单数据回调
        function showBillsCallback(data) {
        }

        // 城市名称改变
        function changeCompany() {
            queryBills(linkId)
        }

        // 下拉刷新添加数据
        function addData() {
        }

        // 下拉刷新添加数据回调
        function addDataCallback(data) {
        }

        // 打开详情页
        function openDetail(id) {
        }
```
### 修改后
```js
        appcan.ready(function () {
            Orders.addData();
            Orders.init();
        });
        var Orders = {
            options: function () {
                var yue = this,
                return yue;
            },
            init: function () {
                this.queryCusBasOrg();
                this.options().bind();
            },

            bind: function () {
                // 城市名称改变
                changeCompany;
                // 打开详情页
                openDetail;
            },

            // 获取公司列表
            queryCusBasOrg: function () {
                var yue = this;
                var func = yue.showCompanyCallback.bind(yue);

                ajaxPostQuery(URL + "/app/cus/queryCusBasOrg", "", func, "text");

            },
            showCompanyCallback: function (data) {
                Orders.queryBills(linkId);
            },
            // 获取订单数据
            queryBills: function (linkId) {
                var yue = this;
                var func = yue.showBillsCallback.bind(yue);
                ajaxPostQuery(URL + "/app/cus/queryCusPayMoney", paramJsonStr, func, "text");
            },
            showBillsCallback: function (data) {
            },
            // 下拉刷新添加数据
            addData: function () {
            },
            addDataCallback: function (data) {
            }

        }
```

### 小改进
````js
    var Order = {
      data: function () {
        return {
          ele: "content"
        }
      },
      init: function () {
        var y = this;
        var btn = document.createElement("button");
        btn.innerHTML = "点击";
        document.getElementById(y.data().ele).appendChild(btn);
      }
    }

    Order.init();
````
### 使用原型
````js
var Module = function() {
  this.init();
};

// 初始化
Module.prototype.init = function() {
  this.fetchData(function() {
    // do something
  });
};

// 绑定事件
Module.prototype.bindEvent = function() {
  // ...
};

// 获取数据
Module.prototype.fetchData = function(cb) {
  var self = this;
  ajax({}).then(function(data) {
    self.renderData(data);
  }).catch(function() {
    self._fetchDataFailed();
  }).fin(function() {
    cb && cb();
  });
};

// 渲染数据
Module.prototype.renderData = function(data) {
  data = this._resolveData(data);
  // ...
  this.bindEvent();
};

// 处理数据
Module.prototype._resolveData = function() {
  // ...
};

// 加载失败
Module.prototype._fetchDataFailed = function() {
  // ...
};
````
### 栗子
````html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    li {
      margin: 16px 0;
    }
  </style>
</head>
<div id="example"></div>
<body>
</body>
<script src="https://cdn.bootcss.com/axios/0.18.0/axios.js"></script>
<script>

  var Module = function () {
    this.init();
  };

  // 初始化
  Module.prototype.init = function () {
    this.fetchData(function () {
      // do something
    });
  };

  // 绑定事件
  Module.prototype.bindEvent = function () {

  };

  // 获取数据
  Module.prototype.fetchData = function (cb) {
    var y = this;
    axios.get('https://api.github.com/search/repositories?q=javascript&sort=stars')
    .then(response => {
      y._resolveData(response.data);
    }).catch(error => {
      y._fetchDataFailed(error);
    })
  };

  // 渲染数据
  Module.prototype.renderData = function (data) {

    var repos = data.items;
    var repoList = repos.map(function (repo, index) {
      return (
        "<li><a href='+ repo.html_url+'>" + repo.name + "</a> " + repo.stargazers_count +
 ' stars' + "<br />" + repo.description + "</li>"
      );
    }).join('');

    var html = "<ul><h1>Most Popular JavaScript Projects in Github</h1>" + repoList + "</ul>";
    document.querySelector("#example").innerHTML = html;
  };

  // 处理数据
  Module.prototype._resolveData = function (response) {
    var y = this, data = null;
    if (typeof response == 'string') {
      data = JSON.parse(response);
    } else if (typeof response == 'object') {
      y.renderData(response);
      return;
    } else {
      y._fetchDataFailed("获取response数据不符合规范...");
    }
    y.renderData(data);
  };

  // 加载失败
  Module.prototype._fetchDataFailed = function (error) {
    document.querySelector("#example").innerHTML = error;
  };

  var test = new Module();
</script>
</html>
````