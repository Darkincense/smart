jQuery.fn.extend({
  listerTreeRender: function () {
    this.each(function () {
      $(this).html(" ");
      new jQuery.ListerTree(this);
    });
  },
  listerTreeSelectValue: function (el) {
    //var dataStr=$(this).attr("data");
    //转为json
    var dataObj = $(this).data("data");
    var valueArr = el.split(",");
    if (dataObj["fromList"]) {
      for (var i = 0; i < valueArr.length; i++) {
        var delIdx = -1;
        $.each(dataObj["fromList"], function (idx, item) {
          if (item.id == valueArr[i]) {
            if (dataObj["toList"]) {
              //添加数据项
              dataObj.toList.push(dataObj.fromList[idx]);
              //记住索引
              delIdx = idx;
            }
          }
        })
        //删除数据
        //splice有3个参数，分别代表：从哪一行起，移除几项，添加的数据项
        if (delIdx != -1) {
          dataObj.fromList.splice(delIdx, 1);
        }

      }
    }
    //重新设置data属性
    //$(this).attr("data",JSON.stringify(dataObj));
    $(this).data("data", dataObj);
    //刷新双选器
    $(this).html("")
    new jQuery.ListerTree(this);
  },
  listerTreeUnSelectValue: function (el) {
    //var dataStr=$(this).attr("data");
    //转为json
    var dataObj = $(this).data("data");

    var valueArr = el.split(",");
    if (dataObj["toList"]) {
      for (var i = 0; i < valueArr.length; i++) {
        var delIdx = -1;
        $.each(dataObj["toList"], function (idx, item) {
          if (item.id == valueArr[i]) {
            if (dataObj["fromList"]) {
              //添加数据项
              dataObj.fromList.push(dataObj.toList[idx]);
              //记住索引
              delIdx = idx;
            }
          }
        })
        //删除数据
        //splice有3个参数，分别代表：从哪一行起，移除几项，添加的数据项
        if (delIdx != -1) {
          dataObj.toList.splice(delIdx, 1);
        }
      }
    }
    //重新设置data属性
    //$(this).attr("data",JSON.stringify(dataObj));
    $(this).data("data", dataObj);
    //刷新双选器
    $(this).html("")
    new jQuery.ListerTree(this);
  },
  listerTreeSetValue: function (el) {
    //var dataStr=$(this).attr("data");
    //转为json
    var dataObj = $(this).data("data");
    var valueArr = el.split(",");

    //先还原
    if (dataObj["toList"]) {
      var toListLength = dataObj["toList"].length;
      for (var i = 0; i < toListLength; i++) {
        $.each(dataObj["toList"], function (idx, item) {
          if (idx == i) {
            if (dataObj["fromList"]) {
              //添加数据项
              dataObj.fromList.push(dataObj.toList[idx]);
            }
          }
        })
      }
      //删除数据
      //splice有3个参数，分别代表：从哪一行起，移除几项，添加的数据项
      dataObj.toList.splice(0, toListLength);
    }
    //设置选中项
    if (dataObj["fromList"]) {
      for (var i = 0; i < valueArr.length; i++) {
        var delIdx = -1;
        $.each(dataObj["fromList"], function (idx, item) {
          if (item.id == valueArr[i]) {
            if (dataObj["toList"]) {
              //添加数据项
              dataObj.toList.push(dataObj.fromList[idx]);
              //记住索引
              delIdx = idx;
            }
          }
        })
        //删除数据
        //splice有3个参数，分别代表：从哪一行起，移除几项，添加的数据项
        if (delIdx != -1) {
          dataObj.fromList.splice(delIdx, 1);
        }
      }
    }
    //重新设置data属性
    //$(this).attr("data",JSON.stringify(dataObj));
    $(this).data("data", dataObj);
    //刷新双选器
    $(this).html("")
    new jQuery.ListerTree(this);
  },
  listerTreeAddItem: function (el) {
    this.each(function () {
      // var dataStr=$(this).attr("data");
      //转为json
      var dataObj = $(this).data("data");

      //添加数据项
      dataObj.fromList.push(el);
      //重新设置data属性
      //$(this).attr("data",JSON.stringify(dataObj));
      $(this).data("data", dataObj);
      //刷新
      $(this).html("")
      new jQuery.ListerTree(this);
    });
  },
  listerTreeRemoveItem: function (el) {
    this.each(function () {

      //var dataStr=$(this).attr("data");
      //转为json
      var dataObj = $(this).data("data");
      //获取要删除的索引
      var delIdx = -1;
      $.each(dataObj.fromList, function (idx, item) {
        if (item.id.toString() == el) {
          delIdx = idx;
        }
      })

      //删除项
      if (delIdx != -1) {
        dataObj.fromList.splice(delIdx, 1);
      }
      //重新设置data属性
      //$(this).attr("data",JSON.stringify(dataObj));
      $(this).data("data", dataObj);
      //刷新
      $(this).html("")
      new jQuery.ListerTree(this);
    });
  }
});

var listerTree_id = 1;
jQuery.ListerTree = function (obj) {
  //listerTree_id++;
  //创建隐藏域
  var $hidden = setupHidden();

  //获取是否禁用
  var enabled = true;
  if ($(obj).attr("disabled") != null) {
    if ($(obj).attr("disabled") == "false" || $(obj).attr("disabled") == false) {
      enabled = true;
    } else {
      enabled = false;
    }
  }

  //构建外观
  var outerDiv = $(obj);

  var leftCon = $('<ul class="ztree dbSelectionMode"></ul>');
  var rightCon = $('<ul class="ztree dbSelectionMode"></ul>');

  leftCon.attr("id", "listerTree" + listerTree_id + "_from");
  rightCon.attr("id", "listerTree" + listerTree_id + "_to");
  if ($(obj).attr("listerHeight")) {
    leftCon.height(Number($(obj).attr("listerHeight")));
    rightCon.height(Number($(obj).attr("listerHeight")));
  } else {
    leftCon.height(200);
    rightCon.height(200);
  }
  var $fromTitle = $('<div></div>');
  var $toTitle = $('<div></div>');
  if ($(obj).attr("fromTitle") != null) {
    $fromTitle.html($(obj).attr("fromTitle"));
  } else {
    $fromTitle.html("未选列表");
  }
  if ($(obj).attr("toTitle") != null) {
    $toTitle.html($(obj).attr("toTitle"));
  } else {
    $toTitle.html("已选列表");
  }

  var listDivA = $('<div></div>').append($fromTitle).append(leftCon);
  var listDivB = $('<div></div>').append($toTitle).append(rightCon);
  if ($(obj).attr("listerWidth")) {
    listDivA.width(Number($(obj).attr("listerWidth")));
    listDivB.width(Number($(obj).attr("listerWidth")));
  } else {
    listDivA.width(200);
    listDivB.width(200);
  }

  var btnCon = $('<div class="listBtn"></div>');
  var btn1 = $('<input type="button" value="全选&gt;&gt;" class="button"/>')
  btn1.bind("click", function () {
    selectAll()
  });
  btnCon.append(btn1);
  btnCon.append("<br/><br/>")
  var btn2 = $('<input type="button" value="&lt;&lt;还原" class="button">')
  btn2.bind("click", function () {
    cancelAll()
  });
  btnCon.append(btn2);
  var $table = $('<table cellspacing="0" cellpadding="0" style="border-style:none;"><tr><td class="ali01" style="border-style:none;padding:0;margin:0;"></td><td class="ali02" style="border-style:none;padding-left:5px;padding-right:5px;margin:0;"></td><td class="ali01" style="border-style:none;padding:0;margin:0;"></td></tr></table>')
  $table.find("td").eq(0).append(listDivA);
  $table.find("td").eq(1).append(btnCon);
  $table.find("td").eq(2).append(listDivB);
  $(outerDiv).append($table);
  $(outerDiv).width($table.width());
  //禁用
  if (enabled == false) {
    btn1.attr("disabled", "true");
    btn2.attr("disabled", "true");
    $(outerDiv).mask("组件被禁用", 0, false, "#ffffff");
  }
  //渲染按钮
  btn1.buttonInputRender();
  btn2.buttonInputRender();

  //添加隐藏域
  $(outerDiv).append($hidden);

  //用selectedValue标识是否初始时有选中项
  var selectedValue = "-1";
  if ($(obj).attr("selectedValue") != null) {
    selectedValue = $(obj).attr("selectedValue");
  }

  //获取参数
  var paramsStr = $(obj).attr("params");
  var paramsObj;
  if (paramsStr) {

    try {
      paramsObj = JSON.parse(paramsStr);
    } catch (e) {
      paramsObj = "";
      alert("树形双选器参数格式有误！（提示：json数据key与value必须以双引号包围）")
    }
  } else {
    paramsObj = "";
  }

  //获取数据
  var dataObj = "";
  var urlStr = $(obj).attr("url");
  var dataStr = $(obj).attr("data");
  var dataObj2 = $(obj).data("data");
  //优先使用data
  if (dataObj2) {
    dataObj = dataObj2;
    if (selectedValue == "-1") {
      createOptions(dataObj2);
    } else {
      createOptions(selectedValueHandler(dataObj2, selectedValue));
    }
  } else if (dataStr) {
    try {
      dataObj = JSON.parse(dataStr);
    } catch (e) {
      dataObj = "";
      alert("树形双选器参数格式有误！（提示：json数据key与value必须以双引号包围）")
    }
    if (selectedValue == "-1") {
      createOptions(dataObj);
    } else {
      createOptions(selectedValueHandler(dataObj, selectedValue));
    }
    $(obj).data("data", dataObj);
  } else if (urlStr) {
    $.ajax({
      url: $(obj).attr("url"),
      dataType: "json",
      data: paramsObj,
      error: function () {
        alert("树形双选器数据源出错，请检查url路径")
      },
      success: function (data) {
        dataObj = data;
        $(obj).data("data", data);
        if (selectedValue == "-1") {
          createOptions(data);
        } else {
          createOptions(selectedValueHandler(data, selectedValue));
        }
      }
    });
  }

  function selectedValueHandler(dataObj, el) {
    if (!dataObj)
      return;
    var valueArr = el.split(",");
    //先还原
    if (dataObj["toList"]) {
      var toListLength = dataObj["toList"].length;
      for (var i = 0; i < toListLength; i++) {
        $.each(dataObj["toList"], function (idx, item) {
          if (idx == i) {
            if (dataObj["fromList"]) {
              //添加数据项
              dataObj.fromList.push(dataObj.toList[idx]);
            }
          }
        })
      }
      //删除数据
      dataObj.toList.splice(0, toListLength);
    }
    //设置选中项
    if (dataObj["fromList"]) {
      for (var i = 0; i < valueArr.length; i++) {
        var delIdx = -1;
        $.each(dataObj["fromList"], function (idx, item) {
          if (item.id == valueArr[i]) {
            if (dataObj["toList"]) {
              //添加数据项
              dataObj.toList.push(dataObj.fromList[idx]);
              //记住索引
              delIdx = idx;
            }
          }
        })
        //删除数据
        if (delIdx != -1) {
          dataObj.fromList.splice(delIdx, 1);
        }
      }
    }
    return dataObj;
  }

  var fromSetting
  var toSetting

  function initSetting() {
    //双选树的左边树的设置 左侧的树内部不可拖拽，只能拖拽到右侧 
    fromSetting = {
      view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false
      },
      edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false,
        drag: {
          isCopy: false,
          prev: false,
          inner: false,
          next: false
        }
      },
      data: {
        simpleData: {
          enable: true
        }
      },
      callback: {
        beforeDrag: beforeDrag,
        beforeDrop: beforeDrop,
        onDrop: zTreeOnDrop
      }
    };
    //右侧的树内部不可拖拽，也不可拖拽到左侧
    toSetting = {
      edit: {
        enable: true,
        showRenameBtn: false,
        drag: {
          isCopy: false,
          prev: false,
          next: false
        }
      },
      data: {
        simpleData: {
          enable: true
        }
      },
      callback: {
        beforeDrag: beforeDrag,
        beforeDrop: beforeDrop,
        beforeRemove: beforeRemove

      }
    };
  }

  function initTreeData(dataObj) {
    if (!dataObj)
      return;
    if (dataObj["fromList"]) {
      $.fn.zTree.init(leftCon, fromSetting, dataObj["fromList"]);
    }
    if (dataObj["toList"]) {
      $.fn.zTree.init(rightCon, toSetting, dataObj["toList"]);
    }
    //给组件的relValue赋值
    $(obj).attr("relValue", getValue());
    //给隐藏域赋值
    $hidden.val(getValue());
  }

  function createOptions(dataObj) {
    if (!dataObj) {
      return;
    }
    initSetting();
    initTreeData(dataObj)
  }

  //创建隐藏域
  function setupHidden() {
    //创建hidden元素 id为num_input，class为selectbox
    var $input = $('<input type="hidden">');
    if ($(obj).attr("name") != null) {
      $input.attr("name", $(obj).attr("name"));
    }
    return $input;
  }
  //判断数据的drag和drop属性，设置是否可拖拽
  function beforeDrag(treeId, treeNodes) {
    for (var i = 0, l = treeNodes.length; i < l; i++) {
      if (treeNodes[i].drag == false || treeNodes[i].drag == "false") {
        return false;
      }
    }
    return true;
  }

  function beforeDrop(treeId, treeNodes, targetNode, moveType) {
    return targetNode ? targetNode.drop !== false : true;
  }

  function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
    //给组件的relValue赋值
    $(obj).attr("relValue", getValue());
    //给隐藏域赋值
    $hidden.val(getValue());
    $(obj).trigger("itemClick");
  };

  // 左侧添加到右侧
  function addHoverDom(treeId, treeNode) {
    var zTree1 = $.fn.zTree.getZTreeObj(leftCon.attr("id"));
    var zTree2 = $.fn.zTree.getZTreeObj(rightCon.attr("id"))

    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.oldParentId == null || treeNode.oldParentId == "null" || treeNode.drag == "false" || treeNode.drag == false || treeNode.editNameFlag || $("#addBtn_" + treeNode.id).length > 0) return;
    var addStr = "<button type='button' class='add' id='addBtn_" + treeNode.id +
      "' title='选中' onfocus='this.blur();'></button>";
    sObj.append(addStr);
    var btn = $("#addBtn_" + treeNode.id);
    if (btn) {
      btn.bind("click", function () {
        zTree1.removeNode(treeNode);
        zTree2.addNodes(null, {
          id: treeNode.id,
          parentId: treeNode.parentId,
          name: treeNode.name,
          drop: false,
          icon: treeNode.icon,
          oldParentId: treeNode.oldParentId
        });
        //给组件的relValue赋值
        $(obj).attr("relValue", getValue());
        //给隐藏域赋值
        $hidden.val(getValue());
        $(obj).trigger("itemClick");

        // 重置
        $.fn.zTree.init(leftCon, fromSetting, dataObj["fromList"]);
        $.fn.zTree.init(rightCon, toSetting, dataObj["toList"]);
        alert('重置')
        return false;
      });
    }
  }

  function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.id).unbind().remove();
  };


  //右侧移除项处理
  function beforeRemove(treeId, treeNode) {
    var zTree2 = $.fn.zTree.getZTreeObj(rightCon.attr("id"));
    //选中该节点
    zTree2.selectNode(treeNode);
    //top.Dialog.confirm("确认删除 节点 -- " + treeNode.name + " 吗？",function(){
    setTimeout(function () {
      //右侧移除该项
      zTree2.removeNode(treeNode);

      //通过该项的oldpid找到对应的左侧父节点
      var zTree1 = $.fn.zTree.getZTreeObj(leftCon.attr("id"))
      var oldPNode = zTree1.getNodeByParam("id", treeNode.oldParentId);

      //该父节点重新添加节点
      if (oldPNode) {
        zTree1.addNodes(oldPNode, {
          id: treeNode.id,
          parentId: oldPNode.id,
          name: treeNode.name,
          drop: false,
          icon: treeNode.icon,
          oldParentId: treeNode.oldParentId
        });
      }

      //给组件的relValue赋值
      $(obj).attr("relValue", getValue());
      //给隐藏域赋值
      $hidden.val(getValue())
      $(obj).trigger("itemClick");
    }, 100)
    //});
    return false;
  }

  function selectAll() {
    if (!dataObj)
      return;
    //先还原
    $.fn.zTree.init(leftCon, fromSetting, dataObj["fromList"]);
    $.fn.zTree.init(rightCon, toSetting, dataObj["toList"]);

    //右侧树添加全部有oldParentId的节点
    //左侧树移除全部有oldParentId的节点
    var zTree1 = $.fn.zTree.getZTreeObj(leftCon.attr("id"));
    var zTree2 = $.fn.zTree.getZTreeObj(rightCon.attr("id"));
    for (var i = 0; i < dataObj["fromList"].length; i++) {
      if (dataObj["fromList"][i].oldParentId) {
        if (dataObj["fromList"][i].drag != false && dataObj["fromList"][i].drag != "false") {
          var oldNode = zTree1.getNodeByParam("id", dataObj["fromList"][i].id);
          zTree1.removeNode(oldNode);
          zTree2.addNodes(null, dataObj["fromList"][i]);
        }
      }
    }

    //给组件的relValue赋值
    $(obj).attr("relValue", getValue());
    //给隐藏域赋值
    $hidden.val(getValue());
    $(obj).trigger("itemClick");
  }

  function cancelAll() {
    if (!dataObj)
      return;
    initTreeData(selectedValueHandler(dataObj, ""));
    $(obj).trigger("itemClick");
  }

  function getValue() {
    var zTree2 = $.fn.zTree.getZTreeObj(rightCon.attr("id"));
    if (!zTree2) {
      return;
    }
    var nodes = zTree2.getNodes();
    var value = "";
    for (var i = 0; i < nodes.length; i++) {
      value += "," + nodes[i].id;
    }
    if (value.length > 0) {
      value = value.substring(1);
    }
    return value;
  }

  return this;
};