(function (root, factory, plug) {
  return factory(root.jQuery, plug);
})(window, function ($, plug) {

  var defaultOptions = {
    trigger: "change",
    automatic: false
  }

  Number.isInteger = Number.isInteger || function (value) {
    return typeof value === "number" &&
      isFinite(value) &&
      Math.floor(value) === value;
  };

  var utils = {
    toArray: function (obj) {
      return Array.from ? Array.from(obj) : Array.prototype.slice.call(obj);
    }
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
    integer: function () {
      return Number.isInteger(Number(this.val()));
    },
    greaterthan: function () {
      return Number(this.val()) > Number(this.data('bv-greaterthan'))
    },
    lessthan: function () {
      return Number(this.val()) < Number(this.data('bv-lessthan'))
    }
  }

  $.fn[plug] = function (options) {
    $.extend(this, defaultOptions, options)
    var $fileds = this.find('input').not('[type=button],[type=reset],[type=submit]');

    $fileds.on(this.trigger, function () {
      var $current = $(this); // 被验证的目标对象
      //清除默认
      $current.removeClass('error');
      $current.next().remove();
      var result = true; // 验证结果默认通过
      $.each(__RULES, function (rule, validator) {
        if ($current.data('bv-' + rule)) {
          console.log($current.attr('name') + '需要验证' + rule + '规则');
          result = validator.call($current);
          if (!result) {
            //  console.log(rule+'验证失败','原因是'+$current.data('bv-'+rule+'-message'))
            $current.after('<p>' + $current.data('bv-' + rule + '-message') + '</p>');
            $current.addClass('error');
          }
          return result;
        }
      })
    })

    //重置表单
    $(this.el).on('reset', function (event) {
      alert('重置表单')
      var arr = utils.toArray($fileds);
      for (var i = 0; i < arr.length; i++) {
        var v = arr[i];
        $(v).next().remove();
        $(v).removeClass('error');

      }
    })

    $(this.el).on('submit', function (event) {
      event.preventDefault();
      for (var i = 0; i < $fileds.length; i++) {
        var $item = $($fileds[i]);
        $item.next().remove();
        var result = true;
        $.each(__RULES, function (rule, validator) {
          if ($item.data('bv-' + rule)) {
            console.log($item.attr('name') + '需要验证' + rule + '规则');
            result = validator.call($item);
            if (!result) {
              //  console.log(rule+'验证失败','原因是'+$current.data('bv-'+rule+'-message'))
              $item.after('<p>' + $item.data('bv-' + rule + '-message') + '</p>');
              $item.addClass('error');
              return false;
            }
            return result;
          }
        })
      }
    })


  }
}, 'bootstrapValidator')