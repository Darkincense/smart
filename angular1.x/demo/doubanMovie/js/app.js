angular.module('myApp', [
	'ngRoute',
	'myApp.route', // 自定义路由l
 	'myApp.service',
	'myApp.in_theatersCtrlModule',
	'myApp.coming_soonCtrlModule',
	'myApp.top250CtrlModule',
	'myApp.searchCtrlModule',
])

	.controller('commonCtrl', ['$scope', '$location',function ($scope, $location) {

		// 代表当前 正在热映有选中效果
		$scope.currentClass = "in_theaters";

		$scope.search = function () {

			var keyword = $scope.search_text;

			alert(keyword)

			$location.path('/search/' + keyword + '/1');

		}

	}])




// 正在热映 GET https://api.douban.com/v2/movie/in_theaters




































