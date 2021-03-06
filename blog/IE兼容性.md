# IE 兼容性

> 仅考虑 ie8+

## 了解浏览器支持情况

- [caniuse.com](http://caniuse.com/)
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
- [Codrops CSS Reference](https://tympanus.net/codrops/css_reference/)
- [QuirksMode.org CSS](http://www.quirksmode.org/css/index.html)
- 了解浏览器市场份额
  - 日志分析
  - [百度统计](http://tongji.baidu.com/data/browser)、[NetMarketShare](https://www.netmarketshare.com/browser-market-share.aspx?qprid=2&qpcustomd=0)

## 兼容性写法

### 1. 条件注释法

判断 IE 浏览器的范围：

- `lt`: less than 是小于
- `lte`: less than or equal 是小于或等于
- `gt`：greater than 是高于
- `gte`: greater than or equal 高于或等于
- `!`: 是不等于,选择条件版本以外所有版本，无论高低

#### 例子

```html
<!--ie 8，9支持-->
<!--[if gte ie 8]>
  <link rel="stylesheet" type="text/css" href="./style.css" />
<![endif]-->
```

> 注:只能采用外链的样式书写 css 代码

### 2.行内后缀

| CSS style            | 针对的浏览器       |
| -------------------- | ------------------ |
| color:red\9;         | IE8-IE10           |
| color:red\0;         | IE8-IE10,Edge      |
| color:red\9\0;       | IE9/IE10           |
| color:red!important; | 所有浏览器除了 IE6 |

#### 例子

```css
#box {
  width: 100px;
  height: 100px;
  background-color: pink;
  background-color: purple\9\0;
  background-color: red !important;
}
```

> ie11 未测试，edge 使用 ie 模拟器测试，ie11 均未测试

## 3.选择器前缀

- 媒体查询

```css
@media \0screen {
  body {
    background: red;
  }
} /*IE8 专属*/

@media screen\0 {
  body {
    background: green;
  }
} /* IE8-IE10,Edge*/

@media screen {
  body {
    background-color: blue;
  }
} /* IE8-IE10,Edge，IE11*/

_::selection,
body {
  background-color: blue;
} /*IE9，IE10*/

@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  body {
    background: orange;
  }
} /*IE10,Edge*/

_:-ms-lang(x),
body {
  background-color: blue;
} /*IE10*/
```

##### 参考链接

- [IE10、IE11 和 Microsoft Edge 的 Hack](https://www.cnblogs.com/limeiky/p/6170738.html)

## 其他

### CSS3 选择器兼容性

- CSS3 中的大部分选择器，兼容性是 IE9+
- 例如 `:target :empty :nth-child :nth-of-type :checked :disabled` 无法在 IE6-8 用
- 移动端支持绝大多数 CSS3 选择器

### IE 差异

- 清除浮动
- 盒子模型
- 透明 `opacity` =》`filter: alpha(opacity=50)`
- `flex` IE10+

### IE8 支持

- `box-sizing`
- `outline`
- `background-position`

### IE8 不支持

- `border-radius`
- `box-shadow`
- `opacity`
- `background-size` 建议 IE8 及以下使用固定宽度布局

```css
/*使用固定宽高布局*/
.i-upload {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url("../imgs/icon_upload.png") no-repeat;
  background-position: -2000px -2000px\9;
  background-size: 16px 16px;
  filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../imgs/icon_upload.png',  sizingMethod='scale');
}
```

### IE9 不支持

- `transition` 与 `animation`

  - 可以接受的降级
  - 实在不能接收就用 JavaScript

### 控制 IE 模式(<=10)

- Doctype 有无控制是否进入怪异模式
- meta 标签控制进入哪种文档模式

```html
<!-- 使用IE7模式渲染 -->
<meta http-equiv="X-UA-Compatible" content="IE=7" />

<!-- 使用最新引擎 -->
<meta http-equiv="x-ua-compatible" content="IE=edge" />
```

## media query

- 基本的媒体（all/print/screen/speech）都支持
- [Respond](https://github.com/scottjehl/Respond) - A fast & lightweight polyfill for min/max-width CSS3 Media Queries (for IE 6-8, and more)
- 媒体特性（width/height/orientation...）IE9 及以上

## 语义化的 HTML5 标签

- ie8 不支持

```html
<style>
  article,
  main,
  nav,
  aside,
  section,
  header,
  footer,
  figure,
  figcaption {
    display: block;
  }
</style>

<!--[if lte IE 8]>
  <script src="html5shiv.js"></script>
<![endif]-->
```

## 浏览器前缀

- 浏览器厂商为了实验新特性，在属性名前加前缀
- Chrome/Safari/Opera: `-webkit-`
- Microsoft: `-ms-`
- Mozilla: `-moz-`

## 测试兼容性

- 虚拟机
- [BrowserStack](https://www.browserstack.com/)

## Polyfill

- 使用代码帮助浏览器实现它尚未支持的特性
- 使用（未来）标准写法
- CSS Polyfills
  - [selectivizr](http://selectivizr.com/)
  - [CSS3 PIE](http://css3pie.com/)
  - [box-sizing-polyfill](https://github.com/Schepp/box-sizing-polyfill)
  - [flexibility](https://github.com/jonathantneal/flexibility)
  - [cssSandpaper](https://github.com/zoltan-dulac/cssSandpaper)
  - [Respond](https://github.com/scottjehl/Respond)
