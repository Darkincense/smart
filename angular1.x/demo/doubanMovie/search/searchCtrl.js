angular.module('myApp.searchCtrlModule',[])

	.controller('searchCtrl',['$scope','$routeParams','myService','$location',function($scope,$routeParams,myService,$location){

		var keyword = $routeParams.keyword;
		var page = Number($routeParams.page);
		var count = 10;
		var start = page*count-10;
		var totalPage = 0;

		myService.myJsonp('https://api.douban.com/v2/movie/search',{
			q:keyword,
			start:start,
			count:count
		},function(res){

			$scope.result = res;

			totalPage = Math.ceil(res.total/count);

			$scope.$apply();

		})


		$scope.changePage = function(type){

			if(type == 'up'){
				
				page = page - 1;

				if(page < 1){

					page = 1;

				}

				// 上一页
			}else if(type == 'down'){
				
				// 下一页
				page = page + 1;

				if(page > totalPage){

					page = totalPage;

				}
				
			}

			$location.path("/search/" + keyword + '/' + page);

		}

	}])