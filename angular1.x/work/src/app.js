var allapp = angular.module('allapp', [
  'app',
  'thingsboard'
]);

var app = angular.module('app', [
  'app.router',
  'app.service',
])

app.config(function($httpProvider) {
  var token = localStorage.getItem("jwt_token");
  $httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + token.slice(1, token.length - 1);
})
