## Css 技巧

> 1. flex调整主轴多行排列高度不固定
  + 包裹块不使用固定高度，使用 `height:100%`,间距使用 margin 控制
````html
 <view class='leftAddress columnBetweenStart'>
                    <view class='upBox oneLineStart'>
                        <view class='name'>小明</view>
                        <view class='phoneNumber'>135 6787 5678</view>
                    </view>
                    <view class='bottomBox line-clamp2'>
                        北京市朝阳区 高碑店高碑店东*****小区28号楼3单元102室
                    </view>
 </view>
````
````css
.columnBetweenStart {
display:flex;
flex-direction:column;
justify-content:space-between;
align-items:flex-start;
}

````
- 2. flex 布局最后一行使用 `space-between`
  + 根据布局列数，多加 `n-2` 个空白与列等宽的盒子占宽
  + 父盒子使用after（适用于每行列数确定的场景）
  ````css
   ul::after {
      content: '';
      flex: auto;
    }
  ````


- 3. opacity 透明度继承问题
使用 background: rgba 的第四个参数设置透明程度
````css
.Mask {
  position: fixed;
  width: 750rpx;
  height: 100%;
  background: #000;
  opacity: 0.5;
  z-index: 999;
}
````

````css
.Mask {
  background: rgba(0, 0, 0, .5);
}
````

## 在线工具

* [base64 图片](http://tool.chinaz.com/tools/imgtobase)
* [HTML5 Please Use the new and shiny responsibly](http://html5please.com/)
* [兼容性速查](https://caniuse.com/)
* [在线配色选择器](http://www.peise.net/tools/web/)
* [CSS3动画编辑](https://www.w3cways.com/css3-animation-tool)

