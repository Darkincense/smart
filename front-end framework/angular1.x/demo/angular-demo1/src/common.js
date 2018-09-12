function log(){
  console.log('调用common.js函数')
}

function show(ele) {
  ele.style.display = "block";
}

//隐藏盒子
function hide(ele) {
  ele.style.display = "none";
}
function scroll() {
  return {
    left: window.pageXOffset || document.documentElement.scrollLeft,
    top: window.pageYOffset || document.documentElement.scrollTop
  };
}
function addEvent(a, b, c, d) {
  a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent("on" + b, c)
}

function throttle(func, wait) {
  var timeout, previous;
  return function () {
    context = this;
    args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context.args);
      }, wait);
    }
  }
}
