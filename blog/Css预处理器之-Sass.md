## 前言

css 预处理语言我选择用 sass，此篇记录 sass 的安装与用法。

sass 预处理语言 本来是有 xxx.sass(语法是通过缩进) 现在大家都用 xxx.scss(通过大括号)

前往: [sass 中文网](https://www.sass.hk/guide/)
github：[sass](https://github.com/sass/sass)

## 编译 Sass

sass 编译有很多种方式，如命令行编译模式、编译软件 koala、Grunt 打造前端自动化工作流 grunt-sass、Gulp 打造前端自动化工作流 gulp-ruby-sass，以及 webpack 的[sass-loader](https://github.com/webpack-contrib/sass-loader)。

### 命令行编译

安装 Ruby 环境，Sass 和 Compass 后的工作流:

```bash
//单文件转换命令
sass input.scss output.css

//单文件监听命令
sass --watch input.scss:output.css

//如果你有很多的sass文件的目录，你也可以告诉sass监听整个目录：
sass --watch app/sass:public/stylesheets
```

### 软件方式-Koala

koala 是一个前端预处理器语言图形编译工具，支持 Less、Sass、Compass、CoffeeScript，帮助 web 开发者更高效地使用它们进行开发。跨平台运行，完美兼容 windows、linux、mac。

免费可用：[下载地址](https://www.sass.hk/install/)

### vscode 插件 easysass

需要安装好 Ruby 环境,装好后在 ruby 的命令行输入 `gem install sass` 来安装 Sass，安装完成后启动 VSCode，在拓展商店里搜索“easy sass”，并安装，安装成功后重启 VSCode。

```json
/** Easy Sass 插件 **/
    "easysass.formats": [
        {
            "format": "compressed",  //  压缩(编译格式)
            "extension": ".css"
        }
    ],
    "easysass.targetDir": "./"  // 自定义css输出文件路径
```

### 编译格式

四种编译排版演示;

```css
//未编译样式
.box {
  width: 300px;
  height: 400px;
  &-title {
    height: 30px;
    line-height: 30px;
  }
}
```

nested 编译排版格式(嵌套)

```css
/*命令行内容*/
sass style.scss:style.css --style nested

/*编译过后样式*/
.box {
  width: 300px;
  height: 400px;
}
.box-title {
  height: 30px;
  line-height: 30px;
}
```

expanded 编译排版格式(扩展)

```css
/*命令行内容*/
sass style.scss:style.css --style expanded

/*编译过后样式*/
.box {
  width: 300px;
  height: 400px;
}
.box-title {
  height: 30px;
  line-height: 30px;
}
```

compact 编译排版格式(紧凑格式)

```css
/*命令行内容*/
sass style.scss:style.css --style compact

/*编译过后样式*/
.box {
  width: 300px;
  height: 400px;
}
.box-title {
  height: 30px;
  line-height: 30px;
}
```

compressed 编译排版格式(压缩格式)

```css
/*命令行内容*/
sass style.scss:style.css --style compressed

/*编译过后样式*/
.box {
  width: 300px;
  height: 400px;
}
.box-title {
  height: 30px;
  line-height: 30px;
}
```

## 基本语法

### 1.插入文件

@import 命令，用来插入外部文件。

```
　@import "path/filename.scss";
```

如果插入的是.css 文件，则等同于 css 的 import 命令。

```
　@import "foo.css";
```

### 2.变量

SASS 允许使用变量，所有变量以\$开头。

```
$blue : #1875e7;　

　　div {
　　　color : $blue;
　　}
```

如果变量需要镶嵌在字符串之中，就必须需要写在`#{}`之中。

```
$side : left;

　　.rounded {
　　　　border-#{$side}-radius: 5px;
　　}
```

### 3.计算功能

SASS 允许在代码中使用算式：

```
body {
　　　　margin: (14px/2);
　　　　top: 50px + 100px;
　　　　right: $var * 10%;
　　}
```

### 4.嵌套

SASS 允许选择器嵌套。比如，下面的 CSS 代码：

```
　// #content article h1 { color: #333 }
    // #content article p { margin-bottom: 4px }
    // #content aside { background-color: #EEE }
```

可以写成：

```
　　 #content {
      article {
        h1 {
          color:#333;
        }
        p {
          margin-bottom: 4px;
        }
      }
      aside{
        background-color: #eee;
      }
    }
```

1.属性也可以嵌套，比如 border-color 属性，可以写成：

```
p {
　    border: {
　           color: red;
　      　　　}
　      　}
```

> 注意，border 后面必须加上冒号。

2.父选择器的标识符，可以使用&引用父元素。比如 a:hover 伪类，可以写成：

```
 　a {
　      　　　&:hover { color: #ffb3ff; }
　      　}
```

3.子组合选择器 >(直接子元素选择器)

```
  // article > section { border: 1px solid #ccc }
         article{
           > section{
             border:1px solid #ccc;
           }
         }
```

4.群组选择器的嵌套

```
    // .container h1, .container h2, .container h3 { margin-bottom: 8px }
          .container{
            h1,h2,h3{
              margin-bottom:8px;
            }
          }
```

### 5.注释

SASS 共有两种注释风格。

标准的 CSS 注释 /_ comment _/ ，会保留到编译后的文件。

单行注释 // comment，只保留在 SASS 源文件中，编译后被省略。(静默注释)

在/\*后面加一个感叹号，表示这是"重要注释"。即使是压缩模式编译，也会保留这行注释，通常可以用于声明版权信息。

```
　/*!
　　　　重要注释！
　　*/
```

## 二.代码的重用

### 1.继承

SASS 允许一个选择器，继承另一个选择器。比如，现有 class1：

```
　.class1 {
　　　　border: 1px solid #ddd;
　　}
```

class2 要继承 class1，就要使用@extend 命令：

```
　　.class2 {
　　　　@extend .class1;
　　　　font-size:120%;
　　}
```

### 2.Mixin

Mixin 有点像 C 语言的宏（macro），是可以重用的代码块。

使用@mixin 命令，定义一个代码块。

```css
　　@mixin left {
　　　　float: left;
　　　　margin-left: 10px;
　　}

```

使用@include 命令，调用这个 mixin。

```
div {
　　　　@include left;
　　}

```

mixin 的强大之处，在于可以指定参数和缺省值。

```
　@mixin left($value: 10px) {
　　　　float: left;
　　　　margin-right: $value;
　　}
```

使用的时候，根据需要加入参数：

```
　div {
　　　　@include left(20px);
　　}

```

下面是一个 mixin 的实例，用来生成浏览器前缀.(设置了默认参数,可以更改)

```
　　@mixin rounded($vert, $horz, $radius: 10px) {
　　　　border-#{$vert}-#{$horz}-radius: $radius;
　　　　-moz-border-radius-#{$vert}#{$horz}: $radius;
　　　　-webkit-border-#{$vert}-#{$horz}-radius: $radius;
　　}

```

使用的时候，可以像下面这样调用：

```
　　#navbar li { @include rounded(top, left); }

　　#footer { @include rounded(top, left, 5px); }
```

### 3.颜色函数

SASS 提供了一些内置的颜色函数，以便生成系列颜色。

```
　　lighten(#cc3, 10%) // #d6d65c
　　darken(#cc3, 10%) // #a3a329
　　grayscale(#cc3) // #808080
　　complement(#cc3) // #33c
```

## 三.高级用法

### 1.条件语句

@if 可以用来判断：

```
　p {
　　　　@if 1 + 1 == 2 { border: 1px solid; }
　　　　@if 5 < 3 { border: 2px dotted; }
　　}
```

配套的还有@else 命令：

```
　@if lightness($color) > 30% {
　　　　background-color: #000;
　　} @else {
　　　　background-color: #fff;
　　}
```

### 2.循环语句

SASS 支持 for 循环：

```
　@for $i from 1 to 10 {
　　　　.border-#{$i} {
　　　　　　border: #{$i}px solid blue;
　　　　}
　　}
```

也支持 while 循环：

```
　$i: 6;

　　@while $i > 0 {
　　　　.item-#{$i} { width: 2em * $i; }
　　　　$i: $i - 2;
　　}
```

each 命令，作用与 for 类似：

```
　@each $member in a, b, c, d {
　　　　.#{$member} {
　　　　　　background-image: url("/image/#{$member}.jpg");
　　　　}
　　}
```

### 3.自定义函数

SASS 允许用户编写自己的函数。

```
@function double($n) {
　　　　@return $n * 2;
　　}

　　#sidebar {
　　　　width: double(5px);
　　}
```

#### 参考链接

- https://www.sass.hk/install/
- http://hyuhan.com/2016/09/07/compares-less-sass-and-stylus/
- https://blog.csdn.net/qq_35697034/article/details/78251173
