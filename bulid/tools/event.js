var util = {
  addEvent: function (a, b, c, d) {
    a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent("on" + b, c)
  },
  // removeEvent(objOverLay, 'click', eMsgClose)
  removeEvent: function (a, b, c, d) {
    a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent("on" + b, c)
  },
  //阻止事件冒泡 
  stopPropagation: function (event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true; //IE阻止事件冒泡，true代表阻止 
    }
  },
  //阻止事件默认行为 
  preventDefault: function (event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false; //IE阻止事件冒泡，false代表阻止 
    }
  },
  //获得事件元素 
  //event.target--非IE 
  //event.srcElement--IE 
  getTarget: function (event) {
    return event.target || event.srcElement;
  },
  // 回车事件
  listenEnter: function (func) {
    document.onkeydown = function (event) {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 13) { // enter 键
        func();
      }
    };

  },
  listenKeys: function (number, func) {
    var obj = {
      "38": "上",
      "40": "下"
    }
    document.addEventListener('keydown', function (event) {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      console.log(e.keyCode);

      if (e && e.keyCode == number) {
        func();
      }
    })

  }
}