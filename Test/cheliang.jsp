<%@ page contentType="text/html;charset=UTF-8" %>
  <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
    <%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
      <%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
        <%@ taglib prefix="st" uri="http://www.springframework.org/tags" %>
          <%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
            <c:set var="ctx" value="${pageContext.request.contextPath}" />
            <!DOCTYPE html>
            <%
	String path = request.getContextPath();
%>
              <html>

              <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <title>预约提油</title>
                <!--框架必需start-->


                <script type="text/javascript" src="../../js/libs/js/jquery.js"></script>

                <!--框架必需end-->
                <script type="text/javascript" src="../../js/environment.js"></script>
                <script type="text/javascript" src="../../js/utils.js"></script>

                <!-- 日期选择框start -->
                <script type="text/javascript" src="<%=path%>/js/libs/js/form/datePicker/WdatePicker.js"></script>
                <!-- 日期选择框end -->

                <script type="text/javascript" src="../../js/layer/layer.js"></script>
                <script type="text/javascript" src="../../js/comm/cusLayer.js"></script>
                <script type="text/javascript" src="../../jsp/bil/date.js"></script>
                <link rel="stylesheet" type="text/css" href="<%=path%>/css/common/global.css">
                <link rel="stylesheet" type="text/css" href="<%=path%>/css/common/common.css">
                <link rel="stylesheet" type="text/css" href="<%=path%>/css/common/table.css">
                <link rel="stylesheet" type="text/css" href="<%=path%>/css/oil/all_oil.css">
                <!-- <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
<script type="text/javascript" src="https://codeb.it/app/themes/codebit2/demo/edittable/jquery.edittable.min.js"></script>
<link rel="stylesheet" href="https://codeb.it/app/themes/codebit2/demo/edittable/jquery.edittable.min.css"> -->
                <script type="text/javascript" src="<%=path%>/js/codeb/jquery-latest.js"></script>
                <script type="text/javascript" src="<%=path%>/js/codeb/jquery.edittable.min.js"></script>
                <link rel="stylesheet" href="<%=path%>/js/codeb/jquery.edittable.min.css">
                <script type="text/javascript" src="<%=path%>/js/jquery.form.js"></script>

                <script type="text/javascript" src="../../js/chosen/js/chosen.jquery.min.js"></script>
                <script type="text/javascript" src="../../js/chosen/js/chosen.jquery.js"></script>
                <link rel="stylesheet" type="text/css" href="<%=path%>/js/chosen/css/chosen.min.css">
                <link rel="stylesheet" type="text/css" href="<%=path%>/js/chosen/css/chosen.css">
                <style type="text/css">
                  .basicTabProcess_top_right table {
                    border: none;
                    width: 700px;
                    background: transparent;
                  }

                  .basicTabProcess_top_right table tr td {
                    background: transparent;
                  }

                  .basicTabProcess_top_right table tr:hover {
                    background: none;
                  }

                  .textinput[disabled]:focus,
                  .textinput[disabled]:hover {
                    background: #eee;
                    border: 1px solid #ccc;
                  }
                </style>

                <script type="text/javascript">
                  var sendAmout;
                  var bookName;
                  var restName;
                  var depotId;
                  var date;
                  var datelayerindex;

                  /*    jQuery(function() {
                      $("#psframe").attr("src","/front/billSend/getSendBil?noticesubId="+$("#noticesubId").val()+"&stateAll=0&page=cus/cusSendList");              
                      });  */
                  var select1 =
                    '<select style="width:150px" id="cheliang"  class="cheliang-select" change()><option value="005B805A4C6E459ABA5E1012D8BE82F4">车牌号：自A-A0000，载重：20</option>'; <
                  c: forEach items = "${carList}"
                  var = "car" >
                  select1 += '<option value="${car.vehicleId}">车牌号：${car.vehicleCode}，载重：${car.vehicleLoad}</option>'; <
                  /c:forEach>
                  select1 += "</select>";
                  var select2 =
                    '<select id="siji" class="siji-select"><option value="0BDFD6309C4147C5804F476D3D8E3ECA">自提，驾驶证号：100000000000000000，电话：13500000000</option>'; <
                  c: forEach items = "${driverList}"
                  var = "driver" >
                  select2 +=
                    '<option value="${driver.driverId}">${driver.driverName}，驾驶证号：${driver.driverCode}，电话：${driver.driverMobile}</option>'; <
                  /c:forEach>
                  select2 += "</select>";

                  var select5 =
                    '<select id="yayunyuan" class="yayunyuan-select"><option value="373A5FB309674A439A754A741489ADF7">自提，从业证号：100000000000000000，电话：13500000000</option>'; <
                  c: forEach items = "${supercargoList}"
                  var = "supercargo" >
                  select5 +=
                    '<option value="${supercargo.driverId}">${supercargo.driverName}，从业证号：${supercargo.driverCode}，电话：${supercargo.driverMobile}</option>'; <
                  /c:forEach>
                  select5 += "</select>";

                  var select3 = '<select  style="width:150px" id="zitiDate" class="zitiDate-select">';
                  var date_02 = new Date();
                  date_02.setDate(new Date().getDate() + 1);
                  date_02 = date_02.format("yyyy-MM-dd");
                  for (i = 0; i < 15; i++) {
                    var date_01 = new Date();

                    date_01.setDate(new Date().getDate() + i);
                    date_01 = date_01.format("yyyy-MM-dd");
                    if (date_01 == date_02) {
                      select3 += '<option value="' + date_01 + '" selected="selected">${depot.deportName}' + date_01 +
                        '</option>';
                    } else {
                      select3 += '<option value="' + date_01 + '">${depot.deportName}' + date_01 + '</option>';
                    }
                  }

                  select3 += "</select>";

                  var select4 = '<select class="shiduan-select">';
                  select4 += '<option value="全天">全天</option>';
                  select4 += '<option value="上午">上午</option>';
                  select4 += '<option value="下午">下午</option>';
                  select4 += '<option value="夜间">夜间</option>';


                  select4 += "</select>";

                  function guanlianSiji(vehicleId) {
                    alert(vehicleId); <
                    c: forEach items = "${carList}"
                    var = "car" >
                    if (vehicleId == "${car.vehicleId}") {
                      var count1 = $("#siji").get(0).options.length;
                      for (var i = 0; i < count1; i++) {
                        if ($("#siji").get(0).options[i].value == "${car.driverId}") {
                          //$("#siji").get(0).options[i].selected = true;   
                          $(".siji-select").val("${car.driverId}");
                          $('.siji-select').trigger('chosen:updated');
                        }
                      }
                      var count2 = $("#yayunyuan").get(0).options.length;
                      for (var i = 0; i < count2; i++) {
                        if ($("#yayunyuan").get(0).options[i].value == "${car.suppercargoId}") {
                          $("#yayunyuan").get(0).options[i].selected = true;
                        }
                      }
                    } <
                    /c:forEach>
                  }



                  function loadChosen() {

                    $(".cheliang-select").chosen({
                      no_results_text: "没有找到结果！", //搜索无结果时显示的提示
                      search_contains: true, //关键字模糊搜索，设置为false，则只从开头开始匹配
                      allow_single_deselect: true, //是否允许取消选择
                      width: '170px',
                      max_selected_options: 6 //当select为多选时，最多选择个数
                    });
                    $(".siji-select").chosen({
                      no_results_text: "没有找到结果！", //搜索无结果时显示的提示
                      search_contains: true, //关键字模糊搜索，设置为false，则只从开头开始匹配
                      allow_single_deselect: true, //是否允许取消选择
                      width: '160px',
                      max_selected_options: 6 //当select为多选时，最多选择个数
                    });
                    $(".yayunyuan-select").chosen({
                      no_results_text: "没有找到结果！", //搜索无结果时显示的提示
                      search_contains: true, //关键字模糊搜索，设置为false，则只从开头开始匹配
                      allow_single_deselect: true, //是否允许取消选择
                      width: '160px',
                      max_selected_options: 6 //当select为多选时，最多选择个数
                    });
                    $(".zitiDate-select").chosen({
                      no_results_text: "没有找到结果！", //搜索无结果时显示的提示
                      search_contains: true, //关键字模糊搜索，设置为false，则只从开头开始匹配
                      allow_single_deselect: true, //是否允许取消选择
                      enable_split_word_search: false,
                      disable_search: true, //隐藏单选搜索框
                      //disable_search_threshold:100,//少于100个时隐藏搜索框
                      width: '120px',
                      max_selected_options: 6 //当select为多选时，最多选择个数
                    });
                    /* $(".shiduan-select").chosen({
	 	 	    no_results_text: "没有找到结果！",//搜索无结果时显示的提示
	 	 	    search_contains:true,   //关键字模糊搜索，设置为false，则只从开头开始匹配
	 	 	    allow_single_deselect:true, //是否允许取消选择
	 	 	    width:'80px',
	 	 	  	enable_split_word_search:false,
	 	 	  	disable_search_threshold:100,//少于100个时隐藏搜索框
	 	 	    max_selected_options:6  //当select为多选时，最多选择个数
	 	 	}); */
                  }

                  function insertSend() {

                    var tb = document.getElementById("noticeSub");
                    var rows = tb.rows;
                    var id_array = new Array();
                    for (var i = 1; i < rows.length; i++) {

                      var idstr = "";
                      var id = rows[i].id;
                      var expectNum = $("#expectNum_" + id).val();
                      var sendNum = $("#sendNum_" + id).val();
                      var chaifenNum = $("#sendNum2_" + id).val();
                      sendAmout = sendNum;

                      var ykdd = document.getElementById("ykdd").value;
                      if (ykdd != "0987654321") { //中油同盛的油罐车
                        if (sendAmout != "" && parseFloat(sendNum) <= 0) {
                          layer.alert($("#oilinfoName_" + id).val() + ',可预约数量不能为0或负数！', {
                            icon: 5
                          });
                          //alert($("#oilinfoName_"+id).val()+",计划数量大于可预约数量！");
                          return false;
                        }

                        if (sendAmout != "" && parseFloat(sendNum) * parseInt(chaifenNum) > parseFloat(expectNum)) {
                          layer.alert($("#oilinfoName_" + id).val() + ',计划数量大于可预约数量！', {
                            icon: 0
                          });
                          //alert($("#oilinfoName_"+id).val()+",计划数量大于可预约数量！");
                          return false;
                        }


                        var reg = new RegExp("^[0-9]*$");

                        if (sendAmout != "" && !reg.test(parseInt(sendAmout))) {
                          layer.alert('提油数量请输入数字！', {
                            icon: 0
                          });
                          return;
                        }
                      }

                      if (sendAmout != "") {
                        for (j = 0; j < parseInt(chaifenNum); j++) {
                          idstr = [id, $("#noticeCode_" + id).val(), $("#oilinfoId_" + id).val(), $("#oilinfoSpec_" +
                            id).val(), $("#oilNum_" + id).val(), $("#extractType_" + id).val(), $("#oilinfoName_" +
                            id).val(), parseFloat(sendNum), '', '', '', '', $("#ykid_" + id).val()]
                          id_array.push(idstr);
                        }
                      }
                    }

                    layer.open({
                      type: 1,
                      title: '提交确认',
                      shadeClose: false,
                      shade: 0.8,
                      area: ['1200px', '400px'],
                      content: '<div id="edittable2"></div><div style="text-align:center"><button id="submit" class="btn-large btn-submit" onclick="insertSend2();" type="button"><font color="blue">确定提交</font></button></div>'
                    });

                    edittable2 = $("#edittable2").editTable({
                      data: id_array,
                      field_templates: {
                        'text1': {
                          html: '<span></span>',
                          getValue: function (input) {
                            return $(input).html();
                          },
                          setValue: function (input, value) {
                            return $(input).html(value);
                          }
                        },
                        'textarea': {
                          html: '<textarea style="display:none"/>',
                          getValue: function (input) {
                            return $(input).val();
                          },
                          setValue: function (input, value) {
                            return $(input).text(value);
                          }
                        },
                        'textarea1': {
                          html: '<textarea style="width:100px"/>',
                          getValue: function (input) {
                            return $(input).val();
                          },
                          setValue: function (input, value) {
                            return $(input).text(value);
                          }
                        },
                        'select1': {
                          html: select1,
                          getValue: function (input) {
                            return $(input).val();
                          },
                          setValue: function (input, value) {
                            var select = $(input);
                            select.find('option').filter(function () {
                              return $(this).val() == value;
                            }).attr('selected', true);
                            return select;
                          }
                        },
                        'select2': {
                          html: select2,
                          getValue: function (input) {
                            return $(input).val();
                          },
                          setValue: function (input, value) {
                            var select = $(input);
                            select.find('option').filter(function () {
                              return $(this).val() == value;
                            }).attr('selected', true);
                            return select;
                          }
                        },
                        'select5': {
                          html: select5,
                          getValue: function (input) {
                            return $(input).val();
                          },
                          setValue: function (input, value) {
                            var select = $(input);
                            select.find('option').filter(function () {
                              return $(this).val() == value;
                            }).attr('selected', true);
                            return select;
                          }
                        },
                        'select3': {
                          html: select3,
                          getValue: function (input) {
                            return $(input).val();
                          },
                          setValue: function (input, value) {
                            var select = $(input);
                            select.find('option').filter(function () {
                              return $(this).val() == value;
                            }).attr('selected', true);
                            return select;
                          }
                        },
                        'select4': {
                          html: select4,
                          getValue: function (input) {
                            return $(input).val();
                          },
                          setValue: function (input, value) {
                            var select = $(input);
                            select.find('option').filter(function () {
                              return $(this).val() == value;
                            }).attr('selected', true);
                            return select;
                          }
                        },


                      },



                      row_template: ['textarea', 'text1', 'textarea', 'textarea', 'textarea', 'textarea', 'text1',
                        'text1', 'select1', 'select2', 'select5', 'select3', 'select4', 'textarea1', 'textarea'
                      ],
                      headerCols: [
                        '',
                        '付油通知单号',
                        '',
                        '',
                        '',
                        '',

                        '油品品号',
                        '申请数量',
                        '车船',
                        '司机',
                        '押运员',
                        '自提日期',
                        '自提时间',
                        '备注',
                        ''
                      ],
                      maxRows: 1000
                    });

                    // Example of jQuery UI datePicker
                    //$("#edittable2").on("focusin", "td:nth-child(1) input, td:nth-child(2) input", function(){
                    //   openDepot();
                    //});
                    loadChosen();

                    /* $(".cheliang-select").chosen().change(function(){
                        //alert(123);
                     }); */
                    $('.cheliang-select').on('change', function (e, params) {
                      //alert(params.selected);
                      $('.cheliang-select').e;
                      guanlianSiji(params.selected);
                    });
                  }

                  var edittable2;
                  var isSubmit = false;

                  function insertSend2() {
                    //$("#submit").attr("disabled","disabled");
                    //document.getElementById("submit").disabled=true;
                    if (isSubmit == false) {

                      try {
                        var id_array = new Array();

                        var data = edittable2.getData();

                        for (i = 0; i < data.length; i++) {
                          idstr = data[i][0] + "★" + data[i][2] + "★" +
                            data[i][3] + "★" +
                            data[i][4] + "★" +
                            data[i][5] + "★" +
                            data[i][6] + "★" + data[i][7] + "★" +
                            data[i][8] + "★" + data[i][9] + "★" + data[i][10] + "★" + data[i][11] +
                            "★" + data[i][12] + "★" + data[i][13] + "★" + data[i][14];
                          id_array.push(idstr);
                        }

                        var strtmp = id_array.join(','); //alert(strtmp);
                        //strtmp=encodeURIComponent(strtmp,"utf-8");

                        //提交配送申请
                        $.ajax({
                          type: "POST",
                          url: "${ctx}/front/billSend/addBillSend",
                          data: {
                            oils: strtmp
                          },
                          cache: false,
                          error: function () {},
                          success: function (data) {
                            layer.msg('自提申请提交成功!', {
                                icon: 1
                              },
                              function (index) {
                                layer.closeAll();
                                window.location.reload();
                                //window.close(-1);
                              }
                            );
                          }

                        });

                        /* $("#inputForm").attr("action","${ctx}/front/billSend/addBillSend?oils=" + strtmp);
		$('#inputForm').ajaxSubmit({
			//表单提交成功后的回调
			success : function(responseText, statusText,
					xhr, $form) {
				layer.msg('自提申请提交成功!', {icon: 1},
						 function(index){                                                
                                         layer.closeAll();   
                                         window.location.reload();     
						//window.close(-1);
					}
				);
			}
		}); */
                      } catch (e) {
                        alert(e.toString());
                      }

                      isSubmit = true;
                      return true;
                    } else {
                      return false;
                    }


                  }

                  function insertSend3() {
                    var carId = "";
                    var driverId = "";
                    var radios = document.getElementsByName("radioCar");
                    var tag = false;
                    for (var i = 0; i < radios.length; i++) {
                      if (radios.item(i).checked) {
                        carId = radios.item(i).value;
                        tag = true;
                        break;
                      }
                    }

                    if (!tag) {
                      layer.alert('必须选择自提车辆！', {
                        icon: 0
                      });
                      //alert("亲，必须选择自提车辆！");
                      return false;
                    }

                    radios = document.getElementsByName("radioDriver");
                    tag = false;
                    for (var i = 0; i < radios.length; i++) {
                      if (radios.item(i).checked) {
                        driverId = radios.item(i).value;
                        tag = true;
                        break;
                      }
                    }

                    if (!tag) {
                      layer.alert('必须选择司机信息！', {
                        icon: 0
                      });
                      //alert("亲，必须选择司机信息！");
                      return false;
                    }

                    var oilDepotId = $("#oilDepot").val();
                    var sendDate = $("#sendDate").val();
                    var sendTime = $("#sendTime").val();
                    alert(oilDepotId);
                    if (oilDepotId == "") {
                      //layer.alert('亲，必须选择提油地点！', {icon: 0});
                      //alert("亲，必须选择提油地点！");
                      //return false;
                      oilDepotId = "-1";
                    }


                    if (sendDate == "") {
                      //layer.alert('亲，必须选择提油时间！', {icon: 0});
                      //alert("亲，必须选择提油时间！");
                      //return false;
                      sendDate = "-1";
                    }

                    if (sendTime == "") {
                      //layer.alert('亲，必须选择提油时段！', {icon: 0});
                      //alert("亲，必须选择提油时段！");
                      //return false;
                      sendTime = "-1";
                    }

                    var tb = document.getElementById("noticeSub");
                    var rows = tb.rows;
                    var id_array = new Array();
                    for (var i = 1; i < rows.length; i++) {
                      var idstr = "";
                      var id = rows[i].id;
                      var expectNum = $("#expectNum_" + id).val();
                      var sendNum = $("#sendNum_" + id).val();
                      sendAmout = sendNum;

                      if (parseFloat(sendNum) <= 0) {
                        layer.alert($("#oilinfoName_" + id).val() + ',可预约数量不能为0或负数！', {
                          icon: 5
                        });
                        //alert($("#oilinfoName_"+id).val()+",计划数量大于可预约数量！");
                        return false;
                      }

                      if (parseFloat(sendNum) > parseFloat(expectNum)) {
                        layer.alert($("#oilinfoName_" + id).val() + ',每单数量*单数，不能大于可预约数量！', {
                          icon: 0
                        });
                        //alert($("#oilinfoName_"+id).val()+",计划数量大于可预约数量！");
                        return false;
                      }


                      var reg = new RegExp("^[0-9]*$");
                      if (sendAmout == "") {
                        layer.alert('请输入提油数量！', {
                          icon: 0
                        });
                        return;
                      }
                      if (!reg.test(parseInt(sendAmout))) {
                        layer.alert('提油数量请输入数字！', {
                          icon: 0
                        });
                        return;
                      }
                      idstr = id + "★" + $("#oilinfoId_" + id).val() + "★" +
                        $("#oilinfoSpec_" + id).val() + "★" +
                        $("#oilNum_" + id).val() + "★" +
                        $("#extractType_" + id).val() + "★" +
                        $("#oilinfoName_" + id).val() + "★" + sendNum + "★" +
                        carId + "★" + driverId + "★" + sendDate + "★" + sendTime +
                        "★" + oilDepotId;
                      id_array.push(idstr);
                    }

                    var strtmp = id_array.join(','); //将数组元素连接起来以构建一个字符串  

                    strtmp = encodeURIComponent(strtmp, "utf-8");

                    $("#submit").attr("disabled", "disabled");
                    $("#inputForm").attr("action", "${ctx}/front/billSend/addBillSend?oils=" + strtmp);
                    $('#inputForm').ajaxSubmit({
                      //表单提交成功后的回调
                      success: function (responseText, statusText,
                        xhr, $form) {
                        layer.msg('自提申请提交成功!该页面将自动关闭', {
                            icon: 1
                          },
                          function (index) {
                            /*  $("#psframe").attr("src","/front/billSend/getSendBil?noticesubId="+$("#noticesubId").val()+"&stateAll=0&page=cus/cusSendList");  */


                            //window.close(-1);
                          }
                        );
                      }
                    });
                  }

                  function returnUpPage() {
                    window.location.href = "../front/bill/getNotice?page=cusNotice";
                  }

                  function openDepot() {
                    depotId = $("#oilDepot").children('option:selected').val();

                    if (depotId == "") {
                      layer.msg("请先选择油库");
                      $("#sendDate").val("");
                      $("#sendTime").val("");
                    } else {

                      opDepot(depotId);
                    }
                  }

                  var index;

                  function opDepot(depotId) {
                    index = layer.open({
                      type: 2,
                      title: '油库时段指标',
                      shadeClose: false,
                      shade: 0.8,
                      area: ['500px', '480px'],
                      content: '../../jsp/bil/yuyuezhibiao.html?depotId=' + depotId //iframe的url
                    });
                  }

                  function getDate(day, time) {

                    $("#sendDate").val(day);
                    $("#sendTime").val(time);
                    date = day;
                    if (time == "8:00-10:00") {
                      bookName = "CLOCK_EIGHT_BOOK";
                      restName = "CLOCK_EIGHT_REST";
                    } else if (time == "10:00-12:00") {
                      bookName = "CLOCK_TEN_BOOK";
                      restName = "CLOCK_TEN_REST";
                    } else if (time == "12:00-14:00") {
                      bookName = "CLOCK_TW_BOOK";
                      restName = "CLOCK_TW_REST";
                    } else if (time == "14:00-16:00") {
                      bookName = "CLOCK_FT_BOOK";
                      restName = "CLOCK_FT_REST";
                    } else if (time == "16:00-18:00") {
                      bookName = "CLOCK_ST_BOOK";
                      restName = "CLOCK_ST_REST";
                    }
                  }

                  function cheliang() {
                    window.open(
                      "${ctx}/front/cus/cusListByVehicle.html?jumpTo=/front/myAccount/main.html&jump=/front/cus/cusListByVehicle.html"
                    );
                  }


                  var sID = "";

                  function dayin(id) {
                    sID = id;
                    var width = "300px";
                    var height = "450px";
                    var titleName = "验证码确认";
                    var url = "<%=path%>/jsp/bil/cus/validateCode.html";
                    publicFunTouming(width, height, titleName, url);
                  }

                  //第一个弹出层
                  function getNoPayorderType(num, code) {
                    //closeLayer();
                    if (num == "1") {
                      var nId = $("#noticesubId").val(); //document.getElementById("noticesubId").value();
                      //alert(nId);
                      //$("#inputForm").attr("action", "${ctx}/front/billSend/newPrintSend?noticesubId="+nId+"&sendId="+sID+"&code="+code);
                      //$("#inputForm").attr("target","_blank");
                      //$("#inputForm").submit();
                      window.location.href = ("${ctx}/front/billSend/newPrintSend?noticesubId=" + nId + "&sendId=" +
                        sID + "&code=" + code);
                    } else {
                      closeLayer();
                    }
                  }

                  function checkedRadio() {
                    //alert(1);
                    var radios = document.getElementsByName("radioCar");
                    var radioss = document.getElementsByName("radioDriver");
                    for (var i = 0; i < radios.length; i++) {
                      if (radios.item(i).checked) {
                        radioss.item(i).checked = true;
                        break;
                      }
                    }

                  }
                </script>
              </head>

              <body>

                <div class="wrapper padding-t-2x padding-b-2x">
                  <div class="full-content-wrapper">
                    <div class="content">
                      <form:form id="inputForm" modelAttribute="bilIntention" action="" method="post">
                        <table id="noticeSub" class="" cellspacing="0" cellpadding="0">
                          <caption>
                            <b>提油申请</b>
                          </caption>
                          <thead>
                            <tr>
                              <th>付油通知单号</th>
                              <th>油品品号</th>
                              <th>通知单量</th>
                              <th>可预约数量</th>
                              <th>每单数量</th>
                              <th>分单数</th>
                            </tr>
                          </thead>
                          <tbody>
                            <c:forEach items="${notincesubInfo}" var="notice">
                              <tr id="${notice.noticesubId}">
                                <td>
                                  ${notice.noticeCode}
                                  <input id="noticeCode_${notice.noticesubId}" type="hidden" value="${notice.noticeCode}" readonly/>
                                  <input id="ykid_${notice.noticesubId}" type="hidden" value="${notice.oildepotId}" readonly/>
                                </td>
                                <td>
                                  ${notice.oilinfoName}
                                  <input id="oilinfoId_${notice.noticesubId}" type="hidden" value="${notice.oilinfoId}" readonly/>
                                  <input id="oilinfoName_${notice.noticesubId}" type="hidden" value="${notice.oilinfoName}" readonly/>
                                  <input id="oilinfoSpec_${notice.noticesubId}" type="hidden" value="${notice.oilinfoSpec}" readonly/>
                                </td>
                                <td>
                                  <fmt:formatNumber type="number" value="${notice.oilNumber}" pattern="0.000" minFractionDigits="0"
                                  />
                                  <input id="oilNum_${notice.noticesubId}" type="hidden" value="${notice.oilNumber}" />
                                  <input id="bil_${notice.noticesubId}" type="hidden" value="${notice.noticesubId}" />
                                  <input id="noticesubId" type="hidden" value="${notice.noticesubId}" />
                                </td>
                                <td>
                                  <fmt:formatNumber type="number" value="${notice.oilNumber-notice.expectNum}" pattern="0.000" minFractionDigits="0" />
                                  <input id="expectNum_${notice.noticesubId}" type="hidden" value="<fmt:formatNumber type=" number " value="${notice.oilNumber-notice.expectNum}
                                    " pattern="0.000 " minFractionDigits="0 "/>" readonly/>
                                  <input id="extractType_${notice.noticesubId}" type="hidden" value="${notice.extractType}" readonly/>
                                </td>
                                <td>
                                  <input id="sendNum_${notice.noticesubId}" type="text" class="m-input" value="" style="width:50px" />
                                </td>
                                <td>
                                  <input id="sendNum2_${notice.noticesubId}" type="text" class="m-input" value="1" pattern="0" minFractionDigits="0" style="width:50px"
                                  />
                                </td>
                              </tr>
                              <input id="ykdd" type="hidden" value="${notice.ykdd}" readonly/>
                            </c:forEach>
                          </tbody>
                        </table>
                      </form:form>

                      <div style=" height: 50px; text-align: center">
                        <button id="submit" class="btn-large btn-submit" onclick="insertSend();" type="button">
                          <font color="blue" size="4">自提申请</font>
                        </button>
                        <button class="btn-large btn-back margin-l-2x" onclick="javascript:window.close();" type="button">
                          <font size="4">关闭</font>
                        </button>
                      </div>

                      <!-- <iframe id="psframe" src="/SHXSKH/front/billSend/getSendBil?noticesubId=&stateAll=0&page=cus/cusSendList"  frameborder="0" scrolling="auto"  width="100%" height="430px"></iframe> -->

                      <%-- <table id="sendCar" class="margin-t-2x" cellspacing="0" cellpadding="0" style=" display: none">
				<caption>提油车辆<span class="margin-l-2x w-text-font red-font"><a href="javascript:cheliang()" class="link">管理车辆司机</a></span></caption>
				<thead>
					<tr><th></th><th>车牌号</th><th>载重</th></tr>
				</thead>
				<tbody>
				<c:forEach items="${carList}" var="car">
					<tr id="${car.vehicleId}">
						<td>
							<input id="radio_${car.vehicleId}" type="radio"  name="radioCar" value="${car.vehicleId}" onclick="checkedRadio();"/>
						</td>
						<td>${car.vehicleCode}</td>
						<td>${car.vehicleLoad}</td>
					</tr>
				</c:forEach>
				</tbody>
			</table>
	
	
        <table id="sendDriver"  class="margin-t-2x" cellspacing="0" cellpadding="0" style=" display: none">
			<caption>提油司机</caption>
			<thead>
			 <tr><th></th><th>司机姓名</th><th>驾驶证号</th><th>联系电话</th><th>手机</th></tr>
			</thead>
			<tbody>
			<c:forEach items="${driverList}" var="driver">
				<tr id="${driver.driverId}">
					<td>
						<input id="radio_${driver.driverId}" type="radio" name="radioDriver" value="${driver.driverId}"/>
					</td>
					<td>${driver.driverName}</td>
					<td>${driver.driverCode}</td>
					<td>${driver.driverOfficephone}</td>
					<td>${driver.driverMobile}</td>
				</tr>
			</c:forEach>
			</tbody>
		</table>
		
		<div class="margin-t-2x clearfix"  style=" display: none">
			<p class="f-size-title">预约提油<span class="margin-l-2x w-text-font red-font">（*可选项。预约提油时间，可减少您的排队等候时间。如果您预约的油库不是您的提油油库，请联系客户经理换库）</span></p>
			<div class="clearfix">
				<div class="left ">
					<span class="f-size-title">选择油库</span>
					<select id="oilDepot" name="oilDpart"  onChange="openDepot()" style="width:150px;">
						<option value="">=== 请选择提油地点===</option>
						<c:forEach items="${depotList}" var="depot">
							<option value="${depot.oildepotId}">${depot.deportName}</option>
						</c:forEach>
					</select>
				</div>
				<div class="left margin-l-2x margin-t">
					<span class="f-size-title">选择时间</span>
					<input id="sendDate" name="sendDate" type="text" class="m-input text-left" readonly onclick="openDepot();"/>
					<input id="sendTime" name="sendTime" type="text" class="m-input text-left" readonly onclick="openDepot();"/>
				</div>
			</div>
		</div>
	
		<div class="margin-t-2x" style=" display: none">
			<p class="f-size-title">备注信息</p>
			<input type="text" id="remark" name="remark" class="m-input text-left" style="width: 500px;"/>
		</div> --%>

                    </div>
                  </div>
                </div>
              </body>

              </html>