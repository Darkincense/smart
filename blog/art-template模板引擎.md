## 开始

### 下载

```
npm install art-template --save
```

### 兼容性

ie8+ （IE8 需要引入补丁. [example](https://github.com/aui/art-template/blob/master/example/web-ie-compatible/index.html)）

- [官方文档](http://aui.github.io/art-template/docs/installation.html)

### API

#### template(filename, content)

基于模板名渲染模板

- 参数
  - {string} filename
  - {Object,string} content
- 返回值
  - if content is Object，render template and return string
  - if content is string，compile template and return function

```js
var html = template("/welcome.art", {
  value: "aui"
});
```

> 浏览器版本不能使用文件路径，filename 是模板的 id

#### template.compile(source, options);

编译模板并返回一个渲染功能

- Parameters：
  - {string} source
  - {Object} options
- Return：{function}

##### 例子

```
var render = template.compile('hi, <%=value%>.');
var html = render({value: 'aui'});
```

#### template.render(source, data, options);

渲染并返回渲染的结果

- Parameters：
  - {string} source
  - {Object} options
- Return：{string}

##### 例子

```js
var html = template.render("hi, <%=value%>.", { value: "aui" });
```

## 2.语法

### 1.表达式

{{}} 符号包裹起来的语句则为模板的逻辑表达式。

### 2.输出表达式

- 对内容编码输出： `{{content}}`
- 不编码输出： `{{#content}} {{@content}}`
- 编码可以防止数据中含有 HTML 字符串，避免引起 XSS 攻击。

### 3. 条件表达式

```js
 {{if admin}}
  <p>admin</p>
 {{else if code > 0}}
 <p>master</p>
 {{else}}
 <p>error!</p>
 {{/if}}
```

### 4.遍历表达式

**无论数组或者对象都可以用 each 进行遍历**。

- \$value 表示数组中的数据
- \$index 表示数组的索引

```
 {{each list as value index}}
  <li>{{index}}  {{value.user}}</li>
 {{/each}}
 亦可以被简写：
 {{each list}}
 <li>{{$index}}] {{$value.user}}</li>
 {{/each}}
```

### 5.过滤器

- template.defaults.imports

```js
template.defaults.imports.getAge = function(birth) {
  var birthYear = new Date(birth).getFullYear();
  var nowYear = new Date().getFullYear();
  return nowYear - birthYear;
};
```

然后在模板中可以直接使用这个 getAge 方法, 但是要注意写法

```html
<script id="tmpl" type="text/html">
  // 下面的写法，其实就是模板引擎中调用方法的写法
  // 相当于调用getAge这个方法，并把birthday作为参数传递给getAge， getAge(birthday)
  <div>{{birthday|getAge}}</div>
</script>
```

### 6.嵌入子模板

在当前模板下嵌入子模板。
{{include 'template_name'}}

> 子模板默认共享当前数据，亦可以指定数据：{{include 'template_name' news_list}}

```

 //主模板
 <script id="test" type="text/html">
 <h1>{{title}}</h1>
 {{include 'list'}}
 </script>

 //子模板
 <script id="list" type="text/html">
 <ul>
   {{each list as value i}}
   <li>索引 {{i + 1}} ：{{value}}</li>
   {{/each}}
 </ul>
 </script>


 <script>
 var data = {
   title: '嵌入子模板',
   list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
 };
 var html = template('test', data);
 </script>

```

## ES6 模板字符串

```js

    success: function(data) {
      if (data.code === 200) {
        var obj = data.result;
        var str = `
         <tr>
              <th>姓名:</th>
              <td>${obj.tc_name}</td>
              <th>职位:</th>
              <td colspan="3">讲师</td>
              <td rowspan="4" width="128">
                  <div class="avatar">
                      <img src="${obj.tc_avatar}" alt="">
                  </div>
              </td>
          </tr>
          <tr>
              <th>花名:</th>
              <td>${obj.tc_roster}</td>
              <th>出生日期:</th>
              <td colspan="3">${obj.tc_birthday}</td>
          </tr>
          <tr>
              <th>性别:</th>
              <td>${obj.tc_gender === "1" ? "女" : "男"}</td>
              <th>出生日期:</th>
              <td colspan="3">${obj.tc_join_date}</td>
          </tr>

          `;
        //把str插入到dom
        $("#modal-list").html(str);
      }
    }

```

> 在 ES6 的模板字符串中要使用`${}`表示插入的变量,其余的部分都与书写 html 没有什么不同,最后用``反引号包起来

### 嵌套深度总结

###### 数据栗子

```js
var data = {
  time: "2018-5-11",
  result: {
    teacher: [
      {
        tc_id: 2,
        tc_name: "李清照"
      },
      {
        tc_id: 9,
        tc_name: "令狐冲"
      }
    ],
    category: {
      top: [
        {
          cg_id: 1,
          cg_name: "前端开发"
        },
        {
          cg_id: 2,
          cg_name: "后端开发"
        },
        {
          cg_id: 3,
          cg_name: "数据库"
        }
      ]
    }
  }
};
```

使用`data`做模板数据源

- 第一层的数据 `{time}`
- `{{each result.teacher}}` `{{/each}}`

使用`data.result`做模板数据源

- `{{each teacher}}` `{{/each}}`
- `{{each category.top as item}}` `{{/each}}`

### 参考文章

- [JavaScript 模板引擎 Template.js 使用详解](http://www.jb51.net/article/100095.htm)
- [官方说明文档](https://aui.github.io/art-template/docs/)
