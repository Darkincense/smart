angular.module('myApp.coming_soonCtrlModule', [])

	.controller('coming_soonCtrl', ['$scope', '$location', '$routeParams', 'myService', function ($scope, $location, $routeParams, myService) {

		// 获取数据
		/*$http({
			method:'get',
			url:'js/in_theaters.json'
		}).then(function(res){
			// 将数据展示到页面中
			console.log(res.data)
			$scope.result = res.data;

		})*/

		var page = Number($routeParams.page);
		var count = 10;
		var start = page * count - 10;
		var totalPage = 0;

		// 1 0 9
		// 2 10 19
		// 3 20 29


		myService.myJsonp("https://api.douban.com/v2/movie/coming_soon", {
			start: start,
			count: count
		}, function (res) {
			console.log(res)

			$scope.result = res;

			totalPage = Math.ceil(res.total / count);

			$scope.$apply();

		})

		$scope.changePage = function (type) {

			if (type == 'up') {

				page = page - 1;

				if (page < 1) {

					page = 1;

				}

				// 上一页
			} else if (type == 'down') {

				// 下一页
				page = page + 1;

				if (page > totalPage) {

					page = totalPage;

				}

			}

			$location.path("/coming_soon/" + page);

		}


	}])