- 模块模式（工作常用）
````js
  var Order = {
      init: function () {
        var y = this;
        y.getOrderList();
      },
      getOrderList() {
        var y = this;
        // request
        //response
        ResponseCallback = y.getOrderListCallback.bind(this);
      },
      getOrderListCallback: function (data) {
        // ...    
      },
      loadMoreOrder: function () {

      },
      bind: function () {

      }

    }
````

- 单例模式
- https://juejin.im/post/5920fe8844d904006cc24e1f
- 模块模式
- 观察者模式