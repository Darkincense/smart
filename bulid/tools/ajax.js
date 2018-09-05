/**
 * CTRL+ALT+D => document this
 * AJAX GET
 * @param {*} url
 * @param {*} Func
 */
function getData(url, Func) {
  $.ajax({
    url: url,
    type: 'GET',
    cache: false,
    dataType: 'json',
    success: function (data) {
      Func(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('ajax(' + url + ')[' + jqXHR.status + ']' + jqXHR.statusText);
      console.error(jqXHR.responseText);
      console.error('[' + textStatus + ']' + errorThrown);
    }
  });
}

function loadData(url, param, Func) {
  $.ajax({
    url: url,
    type: 'POST',
    data: param,
    dataType: 'json',
    cache: false,
    contentType: 'application/json; charset=UTF-8',
    success: function (data) {
      Func(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('ajax(' + url + ')[' + jqXHR.status + ']' + jqXHR.statusText);
      console.error(jqXHR.responseText);
      console.error('[' + textStatus + ']' + errorThrown);
    }
  });
}
//AJAX POST 
function loadData2(url, param, Func) {
  $.ajax({
    url: url,
    type: 'POST',
    cache: false,
    data: param,
    dataType: 'json',
    success: function (data) {
      Func(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('ajax(' + url + ')[' + jqXHR.status + ']' + jqXHR.statusText);
      console.error(jqXHR.responseText);
      console.error('[' + textStatus + ']' + errorThrown);
    }
  });
}
// ajax submit form
function submitForm(url, param, Func, checkElement) {
  var processing = $(checkElement).hasClass('X');
  var rtoken = $('#rtoken').val();
  // 页面存在rtoken添加在提交的参数内
  if (rtoken != undefined && rtoken != null && rtoken != '') {
    var obj = $.evalJSON(param);
    obj.rtoken = rtoken;
    param = $.toJSON(obj);
  }
  if (!processing) {
    $(checkElement).addClass('X');
    $.ajax({
      url: url,
      type: 'POST',
      data: param,
      cache: false,
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      success: function (data) {
        $(checkElement).removeClass('X');
        Func(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $(checkElement).removeClass('X');
        console.error('ajax(' + url + ')[' + jqXHR.status + ']' + jqXHR.statusText);
        console.error(jqXHR.responseText);
        console.error('[' + textStatus + ']' + errorThrown);
      }
    });
  } else {
    console.log('处理中请勿重复点击！');
  }
}

//AJAX sync POST
function syncLoadData(url, param, Func) {
  $.ajax({
    url: url,
    type: 'POST',
    data: param,
    dataType: 'json',
    async: false,
    contentType: 'application/json; charset=UTF-8',
    success: function (data) {
      Func(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('ajax(' + url + ')[' + jqXHR.status + ']' + jqXHR.statusText);
      console.error(jqXHR.responseText);
      console.error('[' + textStatus + ']' + errorThrown);
    }
  });
}
/**
 * @param  {setting}
 */
function ajax(setting) {
  //设置参数的初始值
  var opts = {
    method: (setting.method || "GET").toUpperCase(), //请求方式
    url: setting.url || "", // 请求地址
    async: setting.async || true, // 是否异步
    dataType: setting.dataType || "json", // 解析方式
    data: setting.data || "", // 参数
    success: setting.success || function () {}, // 请求成功回调
    error: setting.error || function () {} // 请求失败回调
  };

  // 参数格式化
  function params_format(obj) {
    var str = "";
    for (var i in obj) {
      str += i + "=" + obj[i] + "&";
    }
    return str
      .split("")
      .slice(0, -1)
      .join("");
  }

  // 创建ajax对象
  var xhr = new XMLHttpRequest();

  // 连接服务器open(方法GET/POST，请求地址， 异步传输)
  if (opts.method == "GET") {
    xhr.open(
      opts.method,
      opts.url + "?" + params_format(opts.data),
      opts.async
    );
    xhr.send();
  } else {
    xhr.open(opts.method, opts.url, opts.async);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(opts.data);
  }

  /*
   ** 每当readyState改变时，就会触发onreadystatechange事件
   ** readyState属性存储有XMLHttpRequest的状态信息
   ** 0 ：请求未初始化
   ** 1 ：服务器连接已建立
   ** 2 ：请求已接受
   ** 3 : 请求处理中
   ** 4 ：请求已完成，且相应就绪
   */
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
      switch (opts.dataType) {
        case "json":
          var json = JSON.parse(xhr.responseText);
          opts.success(json);
          break;
        case "xml":
          opts.success(xhr.responseXML);
          break;
        default:
          opts.success(xhr.responseText);
          break;
      }
    }
  };

  xhr.onerror = function (err) {
    opts.error(err);
  };
}

function myJsonp(url, data, callback) {

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

/**
 * @param  {url}
 * @param  {setting}
 * @return {Promise}
 */
function fetch(url, setting) {
  //设置参数的初始值
  let opts = {
    method: (setting.method || "GET").toUpperCase(), //请求方式
    headers: setting.headers || {}, // 请求头设置
    credentials: setting.credentials || true, // 设置cookie是否一起发送
    body: setting.body || {},
    mode: setting.mode || "no-cors", // 可以设置 cors, no-cors, same-origin
    redirect: setting.redirect || "follow", // follow, error, manual
    cache: setting.cache || "default" // 设置 cache 模式 (default, reload, no-cache)
  };
  let dataType = setting.dataType || "json", // 解析方式
    data = setting.data || ""; // 参数

  // 参数格式化
  function params_format(obj) {
    var str = "";
    for (var i in obj) {
      str += `${i}=${obj[i]}&`;
    }
    return str
      .split("")
      .slice(0, -1)
      .join("");
  }

  if (opts.method === "GET") {
    url = url + (data ? `?${params_format(data)}` : "");
  } else {
    setting.body = data || {};
  }

  return new Promise((resolve, reject) => {
    fetch(url, opts)
      .then(async res => {
        let data =
          dataType === "text" ?
          await res.text():
            dataType === "blob" ? await res.blob(): await res.json();
        resolve(data);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// 获取地址栏request中的参数
function GetQueryString(name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function getQuery(name, url) {
  //参数：变量名，url为空则表从当前页面的url中取
  var u = arguments[1] || window.location.search,
    reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
    r = u.substr(u.indexOf("\?") + 1).match(reg);
  return r !== null ? r[2] : "";
}
//设置url参数
//setUrlPrmt({'a':1,'b':2})
//a=1&b=2
function setUrlPrmt(obj) {
  let _rs = [];
  for (let p in obj) {
    if (obj[p] != null && obj[p] != '') {
      _rs.push(p + '=' + obj[p])
    }
  }
  return _rs.join('&');
}

/**
 *
 * @desc   url参数转对象
 * @param  {String} url  default: window.location.href
 * @return {Object}
 */
function parseQueryString(url) {
  url = url == null ? window.location.href : url;

  var search = url.substring(url.lastIndexOf("?") + 1);

  if (!search) {
    return {};
  }

  return;
  JSON.parse(
    '{"' +
    decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') +
    '"}'
  );
}

/**
 *
 * @desc   参数对象序列化
 * @param  {Object} obj
 * @return {String}
 */

//eg: qsStringify({name: 'xiaoyueyue',age: '24', a: ['b', 'c', 'd']})
//        =>   name=xiaoyueyue&age=24&a[0]=b&a[1]=c&a[2]=d
function qsStringify(obj) {
  var pairs = [];
  for (var key in obj) {
    var value = obj[key];
    if (typeof (value) === 'function') {
      continue;
    }
    if (value instanceof Array) {
      for (var i = 0; i < value.length; ++i) {
        pairs.push((key + "[" + i + "]") + "=" + value[i]);
      }
      continue;
    }
    pairs.push(key + "=" + obj[key]);
  }
  return pairs.join("&");
}

// form表单数据序列化 传入form id ,返回序列化json字符串
function formser(form) {
  var form = document.getElementById(form);
  var arr = {};
  for (var i = 0; i < form.elements.length; i++) {
    var feled = form.elements[i];
    switch (feled.type) {
      case undefined:
      case "button":
      case "file":
      case "reset":
      case "submit":
        break;
      case "checkbox":
      case "radio":
        if (!feled.checked) {
          break;
        }
      default:
        if (arr[feled.name]) {
          arr[feled.name] = arr[feled.name] + "," + feled.value;
        } else {
          arr[feled.name] = feled.value;
        }
    }
  }
  return qsStringify(arr);
}

// form表单序列化
function serialize(form) {
  var parts = [],
    field = null,
    i,
    len,
    j,
    optLen,
    option,
    optValue;

  for (i = 0, len = form.elements.length; i < len; i++) {
    field = form.elements[i];

    switch (field.type) {
      case "select-one":
      case "select-multiple":

        if (field.name.length) {
          for (j = 0, optLen = field.options.length; j < optLen; j++) {
            option = field.options[j];
            if (option.selected) {
              optValue = "";
              if (option.hasAttribute) {
                optValue = (option.hasAttribute("value") ? option.value : option.text);
              } else {
                optValue = (option.attributes["value"].specified ? option.value : option.text);
              }
              parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
            }
          }
        }
        break;

      case undefined: //fieldset
      case "file": //file input
      case "submit": //submit button
      case "reset": //reset button
      case "button": //custom button
        break;

      case "radio": //radio button
      case "checkbox": //checkbox
        if (!field.checked) {
          break;
        }
        /* falls through */

      default:
        //don't include form fields without names
        if (field.name.length) {
          parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
        }
    }
  }
  return parts.join("&");
}