 //主导航栏效果

 window.onscroll = function () {
     var headTop = document.getElementById("headTop");
     var headCon = document.getElementById("headCon");
     var headNav = document.getElementById("headNav");
     if (scroll().top >= headTop.clientHeight + headCon.clientHeight) {
         headNav.className = "nav fixed";
         animate(headNav, {
             top: 0
         });
     } else {
         headNav.className = "nav";
         animate(headNav, {
             top: -40
         });
     }
 }