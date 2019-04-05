## 前言

移动端rem适配方案记录


### 问题：为什么是clientWidth/640?为什么要乘以100？
````js
 const oHtml = document.documentElement;
 const width = oHtml.clientWidth;
 if (width < 500) { // 移动设备
    oHtml.style.fontSize = width / 640 * 100 + "px";
 }
````

答：

1. 是因为这里是作为一个基础数值，换个方向去想，这里先不乘以100以免产生误解。

例如：设计稿宽度是640px，有一个元素设计稿上的宽度是50px，设备物理宽度是320px,那么我们在页面上应该设置宽度为 width:50rem，相当于宽度是：50*（320/640）=25px；这里能正确算出在320px的设备上刚好占一半,其实可以想象为 rem=（320/640）。

2. 一般浏览器的最小字体是`12px`，如果html的font-size=（320/640）px，相当于font-size=0.5px，那么这个数值就小于12px，会造成一些计算的错误，和一些奇怪的问题，`*100`后，font-size是50px，就可以解决这种字体小于12px的问题。

3. 为了计算方便我们后面把比率乘以了100，（320/640）*100，那么相对应这个元素在设置数值的时候就需要除以100了（50/100）,这样可以保证最后出来的数值不变.

##  栗子

设计稿是640px，有一个红色盒子宽高都是320px，里面的文字是32px，那么下面是这个例子的代码。
````html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1, minimum-scale=1">
  <script type="text/javascript">
    const oHtml = document.documentElement;
    const width = oHtml.clientWidth;
    oHtml.style.fontSize = width / 640 * 100 + "px";
  </script>
</head>

<body style="margin: 0 ;padding: 0;font-size: 0.32rem">
  <div style="width: 3.2rem;height: 3.2rem ;background: red">
    <span>xiaoyueyue</span>
  </div>
</body>

</html>
````

使用下面的方法在非移动设备适配更好一些，可以将html的根元素设置为`100px`:

````html
<!DOCTYPE html>
<html lang="en" style="font-size: 100px;">

<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1, minimum-scale=1">
  <script type="text/javascript">
    const oHtml = document.documentElement;
    const width = oHtml.clientWidth;
    if (width < 500) {
      oHtml.style.fontSize = width / 640 * 100 + "px";
    }

  </script>
</head>

<body style="margin: 0 ;padding: 0;">
  <div style="font-size:0.32rem;width: 3.2rem;height: 3.2rem ;background:green;color:#fff">
    <span>xiaoyueyue</span>
  </div>


</body>

</html>
````

## 工具函数
- [src rem计算适配](https://github.com/xiaoyueyue165/src/blob/master/js.md)
````js
(function(doc, win){
  var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function(){
          var clientWidth = docEl.clientWidth;
          if(!clientWidth) return;
          docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
      };

  if(!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
````

#### 参考
- [一步步教你使用rem适配不同屏幕的移动设备](https://www.cnblogs.com/dannyxie/p/6640903.html)
- [移动端适配：font-size设置的思考](https://www.cnblogs.com/axl234/p/5156956.html)