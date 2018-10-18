angular.module('myApp.route', [])

	.config(['$routeProvider', function ($routeProvider) {

		$routeProvider
			.when('/in_theaters/:page', {
				templateUrl: 'in_theaters/in_theaters.html',
				controller: 'in_theatersCtrl'
			})
			.when('/coming_soon/:page', {
				templateUrl: 'coming_soon/coming_soon.html',
				controller: 'coming_soonCtrl'
			})
			.when('/top250/:page', {
				templateUrl: 'top250/top250.html',
				controller: 'top250Ctrl'
			})
			.when('/search/:keyword/:page', {
				templateUrl: 'search/search.html',
				controller: 'searchCtrl'
			})
			.otherwise('/in_theaters/1')

		/*
			$sceDelegateProvider

		// 设置当前网站访问url的白名单
		$sceDelegateProvider.resourceUrlWhitelist([
		   'self', // 当前网站
		   'https://api.douban.com/v2/movie/in_theaters'
		 ]);

		*/

	}])