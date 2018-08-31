$(function() {
    //左侧导航切换
    $(".sidebar-menu li a").click(function() {
        $(".sidebar-menu li a.selected").removeClass("selected")
        $(this).addClass("selected");
    })
})


$(document).ready(function() {
    $('md-sidenav').css("display", "none");
})

var token ;
var news ;
var tsMenuList=0;
var newtsMenuList=[];//一级菜单

$(document).ready(function(){

	token = localStorage.getItem("jwt_token");
	if(token!=null){
		news = 'Bearer ' + token.slice(1, token.length - 1);
		queryMenu(news);
	}
});



$('ui-view').css('height', (window.innerHeight - 50) + 'px');
$('.content-wrapper').css('width', (window.innerWidth - 230) + 'px')
var togNum = 0;
$("body").on("click", "#togle", function() {
    togNum += 1;
    if (togNum % 2 == 0) {
        $("body").removeClass("sidebar-collapse");
        $('.content-wrapper').css('width', (window.innerWidth - 230) + 'px');
    } else {
        $("body").addClass("sidebar-collapse");
        $('.content-wrapper').css('width', (window.innerWidth - 50) + 'px');
    }

})


function queryMenu(){
  $.ajax({ 
      url: "/c10/api/initializtion/findUserGroup",
      async: false,
      type: "GET",
      headers: {
          Accept: "application/json; charset=utf-8",
          Authorization: "" + news
      },
      success:function(data){
          console.log(data);  
          tsMenuList=data.tsMenuList;     
          assemble(tsMenuList);//组装数据
      },error:function(data){
          
      }
      });        
  }