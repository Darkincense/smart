function movieNav() {
  return {
    templateUrl: './component/movie/index.html',
    controller: 'MovieCtrl',
    controllerAs: 'movieNav'
  }
}

function goTop(myService) {
  return {
    template: '<div class="backtop" ng-style="backtop"ng-click="backtotop()" ng-transclude><img  ng-style="styles" src="./assets/backtop.png"></div>',
    transclude: true,
    link: function (scope, element, attributes) {
      if (attributes.goTop == "false") {
        element.css('display', 'none')
      } else {
        scope.backtop = {
          'background': 'transparent',
          'position': 'fixed',
          'right': '15px',
          'bottom': '68px',
          'width': '40px',
          'height': '40px',
          'border-radius': '20px'
        }
        scope.styles = {
          'width': '40px',
          'height': '40px',
          'src': 'https://xiaoyueyue165.github.io/static/resources/backtop.png',
        }
        scope.backtotop = function () {
          var target = 0;
          var leader = 0;
          var timer = null;
          var backtop = document.querySelector('.backtop');

          if (scroll().top > 200) {
            show(backtop)
          } else {
            hide(backtop)
          }
          leader = scroll().top;

          backtop.onclick = function () {
            clearInterval(timer);
            timer = setInterval(function () {
              //获取步长;
              var step = (target - leader) / 10;
              //二次处理
              step = step > 0 ? Math.ceil(step) : Math.floor(step);
              //赋值;
              leader = leader + step;
              window.scrollTo(0, leader);
              //清除定时器;
              if (leader === target) {
                clearInterval(timer);
              }
            }, 30);
          }


        }
        addEvent(window, 'scroll', throttle(scope.backtotop, '500'))

      }
    }
  }
}

angular
  .module('myApp')
  .directive('movieNav', movieNav)
  .directive('goTop', goTop)
