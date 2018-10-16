$(document).ready(function() {
//绑定元素点击事件
$(".menu-list ul li").click(function() {
	//判断对象是显示还是隐藏
	if($(this).children(".menu3").is(":hidden")){
		//表示隐藏
		if(!$(this).children(".menu3").is(":animated")) {
			$(this).children(".i-down").css({'transform':'rotate(180deg)'}); 
			//如果当前没有进行动画，则添加新动画
			$(this).children(".menu3").animate({
					height: 'show'
				}, 300)
				//siblings遍历menu3的元素
				.end().siblings().find(".menu3").hide(300);
		}
	} else {
		//表示显示
		if(!$(this).children(".menu3").is(":animated")) {
			$(this).children(".i-down").css({'transform':'rotate(360deg)'});  
			$(this).children(".menu3").animate({
					height: 'hide'
				}, 300)
				.end().siblings().find(".menu3").hide(300);
		}
	}
});

//阻止事件冒泡，子元素不再继承父元素的点击事件
$('.menu3').click(function(e){
	e.stopPropagation();
});

$(".menu3 dd").mouseover(function(){
	var temph2 = $(this).offset().top + 36;
	$(".sec-left-menu").css("top", temph2 +"px");
}); 

//点击子菜单为子菜单添加样式，并移除所有其他子菜单样式
$(".menu-list ul li .menu3 .menu-item").click(function() {
	//设置当前菜单为选中状态的样式，并移除同类同级别的其他元素的样式
	$(this).addClass("selected").siblings().removeClass("selected");
	//遍历获取所有父菜单元素
	  $(".menu3").each(function(){
	  		//判断当前的父菜单是否是隐藏状态
	  		if($(this).is(":hidden")){
	  			//如果是隐藏状态则移除其样式
	  			$(this).children(".menu-item").removeClass("selected");
		  		}
		  });
	});
	
$(function(){	
	//二级页面左侧导航切换
	$(".sec-menu3 li").click(function(){
		$(".sec-menu3 li.selected").removeClass("selected")
		$(this).addClass("selected");
	})	
})
});
