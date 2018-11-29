### 模拟测试

- [mockapi](https://www.mockapi.io/projects)
- [json-server](https://github.com/typicode/json-server)
- [yapi](https://github.com/YMFE/yapi)
- [easyapi](https://www.easyapi.com/info/doc)
- https://www.easy-mock.com/
- https://github.com/nuysoft/Mock


**公共API**
````js
// github
$.getJSON('https://api.github.com/search/repositories?q=javascript&sort=stars',function(data){})
// cnode
$.getJSON('https://cnodejs.org/api/v1/topics',function(data){console.log( data )})
// 豆瓣电影
$.get('https://api.douban.com/v2/movie/in_theaters',function(data){console.log( data )},'jsonp')
````
- [jsonplaceholder](https://github.com/typicode/jsonplaceholder) A simple online fake REST API server https://jsonplaceholder.typicode.com
**CDN**

```js
// animation.css
<link href="https://cdn.bootcss.com/animate.css/3.5.2/animate.css" rel="stylesheet">
// axios
<script src="https://cdn.bootcss.com/axios/0.18.0/axios.js"></script>
// bootstrap
<link href="https://cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.css" rel="stylesheet">
// jquery
<script src="https://cdn.bootcss.com/jquery/1.11.1/jquery.js"></script>
<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
```