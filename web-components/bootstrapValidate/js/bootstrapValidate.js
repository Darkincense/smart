(function (root, factory, plug) {
  return factory(root.jQuery, plug);
})(window, function ($, plug) {

  var defaultOptions = {
    trigger: "change"
  }
  // 规则
  var __RULES = {
    required: function () {
      return this.val() !== '';
    },
    regexp: function () {
      return new RegExp(this.data('bv-regexp')).test(this.val());
    },
    email: function () {
      return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(this.val());
    },
    url: function () {
      return /^(https|http):\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(this.val());

    },
    integer:function(){
    return Number.isInteger(Number(this.val()));
    },
    greaterthan:function(){
      return Number(this.val())>Number(this.data('bv-greaterthan'))
    },
    lessthan:function(){
      return Number(this.val()) <Number(this.data('bv-lessthan'))
    }
  }
  
  $.fn[plug] = function (options) {
    $.extend(this, defaultOptions, options)
    var $fileds = this.find('input').not('[type=button],[type=reset],[type=submit]');
    $fileds.on(this.trigger, function () {
      var $current = $(this); // 被验证的目标对象
      $current.next().remove();
      var result = true; // 验证结果默认通过
      $.each(__RULES, function (rule, validator) {
        if ($current.data('bv-' + rule)) {
          console.log($current.attr('name') + '需要验证' + rule + '规则');
          result = validator.call($current);
          if (!result) {
            //  console.log(rule+'验证失败','原因是'+$current.data('bv-'+rule+'-message'))
            $current.after('<p>' + $current.data('bv-' + rule + '-message') + '</p>');
          }
          return result;
        }
      })
    })

  }
}, 'bootstrapValidator')