function defaultValue() {
  return function (input) {
    if (!input) {
      return '----';
    }
  }
}

angular
  .module('myApp')
  .filter('defaultValue', defaultValue)