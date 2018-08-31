angular.module('myApp.service', [])
  .service('myService', [function () {

    this.myJsonp = function (url, data, callback) {
      var fnName = 'myJsonp_' + Math.random().toString().replace('.', '');
      window[fnName] = callback;
      var querystring = '';
      for (var attr in data) {
        querystring += attr + '=' + data[attr] + '&';
      }
      var script = document.createElement('script');
      script.src = url + '?' + querystring + 'callback=' + fnName;
      script.onload = function () {
        document.body.removeChild(script);
      }
      document.body.appendChild(script);
    }
    this.scroll = function () {
      return {
        left: window.pageXOffset || document.documentElement.scrollLeft,
        top: window.pageYOffset || document.documentElement.scrollTop
      };
    }
    this.origin = '我是service模块,我发送消息给你,console面板还有数据...'
    this.consoleLog = function () {
      console.log('调用service模块的方法')
    }
  }])