(function (root, factory, plug) {
  return factory(root.jQuery, plug);
})(window, function ($, plug) {

  var defaultOptions = {
    trigger: "change"
  }
  $.fn[plug] = function (options) {
    $.extend(this, defaultOptions, options)
    var $fileds = this.find('input').not('[type=button],[type=reset],[type=submit]');
    $fileds.on(this.trigger, function () {
      console.log(this + "正在校验")
    })

  }
}, 'bootstrapValidator')