
function mainCtrl($http, $scope, $stateParams, myService) {
  $scope.github_url = 'https://github.com/xiaoyueyue165';
  $scope.msg = 'Welcome to My Angular.js App';
  $scope.slogan = '努力成为一个有价值的前端工程师';

  $scope.topicList = [];
  $http({
    url: 'https://cnodejs.org/api/v1/topics',
    method: 'GET', // 请求的方法
  }).then(function (response) {
    $scope.topicList = response.data.data;
  }, function (err) {
    console.log(err)
  })

  $scope.getTopic = function (page) {

  }
  $scope.option = {
    curr: 2,  //当前页数
    all: 5,  //总页数
    count: 10,  //最多显示的页数，默认为10

    //点击页数的回调函数，参数page为点击的页数
    click: function (page) {
      console.log(page);
    }
  }
}


function cnodeData($http, $scope, $stateParams) {
  console.log($stateParams.id)
  $http.get('https://cnodejs.org/api/v1/topic/' + $stateParams.id).then(function (response) {
    $scope.topic = response.data.data;
    $scope.author = response.data.data.author;
    $scope.articletitle = response.data.data.title;
    $scope.replies = response.data.data.replies;
    // console.log($scope.articletitle);
  }, function (err) { console.log(err) })
}

function MovieCtrl($scope, $location, myService) {

  // 代表当前 正在热映有选中效果
  $scope.currentClass = "in_theaters";
  var movieLink = $location.path();

  if (movieLink.indexOf('/movie') != -1) {

    $location.path("/in_theaters/" + 1);
  }

  $scope.search = function () {

    var keyword = $scope.search_text;
    $location.path('/search/' + keyword + '/1');

  }
}

function testCtrl($scope, myService) {
  log();
  myService.consoleLog();
  $scope.origin = myService.origin;
}

angular
  .module('myApp')
  .controller('mainCtrl', mainCtrl)
  .controller('cnodeData', cnodeData)
  .controller('MovieCtrl', MovieCtrl)
  .controller('testCtrl', testCtrl)