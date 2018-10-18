angular.module('myApp.Router', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/');
    $stateProvider
      .state('home',
        {
          url: '/',
          templateUrl: './component/home.html',
        }
      )
      .state('cnode', {
        url: '/cnode',
        templateUrl: './component/cnode/cnode.html'
      })
      .state('cnodeId', {
        url: '/cnode/{id}',
        templateUrl: './component/cnode/content.html'
      })
      .state('movie', {
        url: '/movie',
        templateUrl: './component/movie/index.html',
      })
      .state('aboutme', {
        url: '/aboutme',
        templateUrl: './component/aboutme.html',
      })
      .state('intheaters', {
        url: '/in_theaters/{page}',
        templateUrl: './component/movie/in_theaters/in_theaters.html',
      })
      .state('comingSoon', {
        url: '/coming_soon/{page}',
        templateUrl: './component/movie/coming_soon/coming_soon.html'
      })
      .state('top250', {
        url: '/top250/{page}',
        templateUrl: './component/movie/top250/top250.html'
      })
      .state('search', {
        url: '/search/{keyword}/{page}',
        templateUrl: './component/movie/search/search.html',
      })
      .state('ceshi',{
        url:'/test',
        templateUrl:'./component/test.html'
      })

    $urlRouterProvider.otherwise("/404");
  }])


