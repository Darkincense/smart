
var CURRENT_PAGE = 1;
var CURRENT_DATA = null;
var SHENGYU_DATA = null;
var DATA = null;

var loadMore = {
  init: function (options) {
    var y = this;
    var defaultOptions = {
      limit: 10,
      CURRENT_PAGE: 1,
      MAX_PAGE: null
    }
    y.options = _extend(defaultOptions, options);
    if (y.checkOptions()) {
      y.checkOptions().appendById(y.options.ele).bind();
      var splitNum = y.options.limit;
      DATA = y.options.data;
      SHENGYU_DATA = DATA.slice(splitNum);
    }

  },
  checkOptions: function () {
    if (!this.options.hasOwnProperty("ele")) {
      throw new Error("element is required");
    }
    if (!this.options.hasOwnProperty('data') || !this.options.data.length) {
      throw new Error('传入的分页数据不是数组格式');
    }
    if (!this.options.hasOwnProperty('totalNum')) {
      throw new Error('分页器的总页数必须指定')
    }
    if (!this.options.hasOwnProperty('clickFn') || !typeof (this.options.clickFn) === 'function') {
      throw new Error('请为分页器指定点击回调函数')
    }

    MAX_PAGE = Math.ceil(this.options.totalNum / Number(this.options.limit));
    this.options.MAX_PAGE = MAX_PAGE;

    if (CURRENT_PAGE === MAX_PAGE) {
      console.log('分页器完成工作任务，消失...')
      return null;
    }
    return this;
  },
  makeBtnLayout: function () {
    var box = document.createElement("div");
    box.id = "loadMore";
    box.className = "text-center";
    box.innerHTML = '<ul class="pager">'
      + '<li id="btn-load-more" class="">'
      + '<a href="javascript:;">点击载入更多</a></li>'

      + '<li id="btn-loading" class="hidden">'
      + '<a href="javascript:;">'
      + '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> 载入中</a> </li>'
      + '</ul>';

    return box;
  },
  appendById: function (id) {
    var y = this;
    var box = y.makeBtnLayout();
    document.getElementById(id).appendChild(box);
    return y;
  },
  bind: function () {
    var y = this;
    var loadMore = document.getElementById("btn-load-more");
    var loading = document.getElementById("btn-loading");

    loadMore.onclick = function () {

      this.classList.add("hidden");
      loading.classList.remove("hidden");
      CURRENT_PAGE++;

      console.log('CURRENT_PAGE :' + CURRENT_PAGE)

      if (!y.options.frontendPager) {
        y.options.clickFn.call(null, CURRENT_PAGE, y.options.MAX_PAGE, y.options.totalNum)

      } else {
        // 前端分页

        if (SHENGYU_DATA.length > 0 && CURRENT_PAGE - 1 < MAX_PAGE) {

          CURRENT_DATA = SHENGYU_DATA.splice(0, y.options.limit);
          y.options.clickFn.call(null, CURRENT_PAGE, CURRENT_DATA, y.options.MAX_PAGE, y.options.totalNum)

          if (CURRENT_PAGE === MAX_PAGE) {
            document.getElementById('loadMore').remove();
            console.log('分页完毕');
            return;
          }
          y.loadingGoOn();

        }
      }
    }

  },
  loadingGoOn: function () {
    var loading = document.getElementById("btn-loading");
    var loadMore = document.getElementById("btn-load-more");
    setTimeout(function () {
      loading.classList.add("hidden");
      loadMore.classList.remove("hidden");
    }, 1000);
  }
}