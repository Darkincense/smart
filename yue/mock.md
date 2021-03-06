# Mock

## 模拟测试

- [mockapi](https://www.mockapi.io/projects)
- [json-server](https://github.com/typicode/json-server)
- [yapi](https://github.com/YMFE/yapi)
- [easyapi](https://www.easyapi.com/info/doc)
- https://www.easy-mock.com/
- https://github.com/nuysoft/Mock
- [jsonplaceholder](https://github.com/typicode/jsonplaceholder) A simple online fake REST API server https://jsonplaceholder.typicode.com

## 公共 API

```js
// github
$.getJSON(
  "https://api.github.com/search/repositories?q=javascript&sort=stars",
  function(data) {}
);
// cnode
$.getJSON("https://cnodejs.org/api/v1/topics", function(data) {
  console.log(data);
});
// 豆瓣电影
$.get(
  "https://api.douban.com/v2/movie/in_theaters",
  function(data) {
    console.log(data);
  },
  "jsonp"
);
```

## Show-mycode

- https://www.netlify.com
- [codesandbox](https://codesandbox.io/u/xiaoyueyue165) - vue && react Test 仓库，借助官方脚手架构建
- [todomvc-demos template 分支存放的静态模板](https://github.com/xiaoyueyue165/todomvc-demos/tree/template)
