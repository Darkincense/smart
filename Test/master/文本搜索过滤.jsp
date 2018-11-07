<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String pageId=request.getParameter("pageId")==null?"":request.getParameter("pageId");
	String level=request.getParameter("level")==null?"":request.getParameter("level");
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
  <title></title>
<link rel="stylesheet" type="text/css" href="<%=path%>/epui/jquery-easyui-1.5/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=path%>/epui/jquery-easyui-1.5/themes/icon.css">
<link href="<%=path%>/epui/new/css/style.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/epui/js/jquery.js"></script>
<script type="text/javascript" src="<%=path%>/epui/jquery-easyui-1.5/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=path%>/epui/jquery-easyui-1.5/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=path%>/epui/js/angular-1.3.0.js"></script>

<script type="text/javascript" src="<%=path %>/epui/js/framework.js"></script>
<link href="<%=path %>/epui/css/import_basic2.css" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" type="text/css" id="skin" prePath="<%=path %>/"/>
<link rel="stylesheet" type="text/css" id="customSkin"/>
<script src="<%=path %>/epui/js/form/form.js" type="text/javascript"></script>
<script src="<%=path %>/epui/js/comm/utils.js" type="text/javascript"></script>
<script src="<%=path %>/epui/js/comm/cru.js" type="text/javascript"></script>
	
<!--树组件start -->
<script type="text/javascript" src="<%=path%>/epui/js/tree/ztree/ztree.js"></script>
<link href="<%=path%>/epui/js/tree/ztree/ztree.css" rel="stylesheet" type="text/css"/>
<!--树组件end -->

<!-- 表单验证 -->
<link href="<%=path%>/epui/js/jquery-validation/validate.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/epui/js/jquery-validation/jquery.validate.js"></script>
<script type="text/javascript" src="<%=path%>/epui/js/jquery-validation/localization/messages_zh.js"></script>

<!--上传控件 -->
<link href="<%=path%>/epui/upload/uploadfile.css" rel="stylesheet">
<script src="<%=path%>/epui/upload/jquery.uploadfile.js"></script>
<script src="<%=path%>/epui/js/comm/upload.js"></script>

<!--弹框 -->
<link href="<%=path%>/epui/new/css/dialog.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/epui/new/js/dialog.js"></script>

<script src="<%=path%>/epui/js/comm/common.js"></script>

<link href="<%=path%>/epui/js/select2/css/select2.css" rel="stylesheet" type="text/css"/>
<script type="text/javascript" src="<%=path%>/epui/js/select2/js/select2.full.js"></script>
<script type="text/javascript" src="<%=path%>/epui/js/select2/js/select2.min.js"></script>
<script type="text/javascript" src="<%=path%>/epui/js/select2/js/i18n/zh-CN.js"></script>
<script type="text/javascript" src="<%=path%>/pageoffice.js" id="po_js_main"></script>
<script src="<%=path%>/epui/js/comm/echo.js"></script>
<style type="text/css">
.selectbox{
	display:none
}
.selBtn{
	display:none
}
.i-small {
	display: block;
	width: 16px;
	height: 16px;
}

.i-add {
	background: url(../../epui/new/images/icon_add_hover.png) no-repeat;
}

.i-edit2 {
	background: url(../../epui/new/images/icon_edit_hover.png) no-repeat;
}

.i-insert {
	background: url(../../epui/new/images/icon_insert.png) no-repeat;
	background-size: 18px 18px;
}

.i-insert2 {
	background: url(../../epui/new/images/icon_insert2.png) no-repeat;
	background-size: 14px 14px;
}

.i-delete {
	background: url(../../epui/new/images/icon_close.png) no-repeat;
	background-size: 14px 14px;
}

.panel .panel-header {
	background: #369be1 !important;
	background-color: #369be1 !important;
	color: #fff !important;
	height: 20px;
	line-height: 20px;
}

.panel-title {
	color: #fff !important;
	line-height: 20px !important;
}

.panel-tool a {
	opacity: 1 !important;
	filter: alpha(opacity = 100) !important;
	margin-right: 6px !important;
}

.panel-icon,.panel-tool {
	height: 26px !important;
}

.panel-tool a:hover {
	background-color: transparent !important;
}

#myform2 {
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
	margin-left: auto;
	margin-right: auto;
}

.i-normal {
	display: block;
	width: 24px;
	height: 24px;
}

.btn {
	width: auto;
	display: inline-block;
	cursor: pointer;
	height: 32px;
	line-height: 32px;
	color: #fff;
	padding: 0 20px;
	background: #369ce4;
	border-radius: 3px;
	-webkit-border-radius: 3px;
	font-size: 14px;
}

.btn-large {
	padding: 0 20px;
}

.btn-yellow {
	background: #fddbc3;
	border: 1px solid #ec7421;
	color: #ec7421;
}

.btn-yellow:hover {
	background: #ec7421;
	color: #fff;
	text-decoration: none;
}
/*table style*/
.comm-table {
	border: 1px solid #ccc;
	line-height: 32px;
	height: 100%;
}

.comm-table thead tr th {
	background: #f2f2f2;
}

.comm-table tr th,.comm-table tr td {
	border-left: 1px solid #ccc;
	border-bottom: 1px solid #ccc;
	padding: 3px;
	text-align: center;
}

.comm-table tr:nth-child(even) td {
	background: #fafafa;
}

.margin-t-l {
	margin-top: 15px;
}

.margin-l {
	margin-left: 0px;
}

.margin-b {
	margin-bottom: 0px;
}

.margin-t {
	margin-top: 0px;
}

.margin-b-s {
	margin-bottom: 8px;
}

.margin-t-s {
	margin-top: 8px;
}

.ta-large {
	padding: 5px;
	margin-left: 0px;
}

#setting {
	margin: 0 auto;
}

.input-large {
	width: 286px;
	height: 30px;
	line-height: 30px;
	padding-left: 5px;
}

.btn-blue {
	background: #c4e0f3;
	border: 1px solid #369ce4;
	color: #369ce4;
}

.inline-block {
	display: inline-block;
}

.input-w {
	width: 180px;
}

#submit {
	width: auto !important;
}

#file {
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0;
	-ms-filter: 'alpha(opacity=0)';
}

#target {
	position: relative;
}

#target:hover {
	text-decoration: none;
	color: #fff;
}

.btn-blue:hover {
	background: #369ce4;
	color: #fff;
	text-decoration: none;
}
.i-refresh {
    background: url(../../epui/new/images/sync.png) no-repeat -2px -2px;
	background-size: 20px 20px;
}
h3 {
    font-size: 18px;
    line-height: 25px;
}
.article-content h4 {
    font-size: 16px;
    line-height: 20px;
}
.article-content p {
    text-indent: 2em;
}
body {
    font-family: Microsoft Yahei,sans-serif;
    margin: 0 auto;
}
.panel .accordion-header-selected, .panel .accordion-header {
    background:#98cbea !important;
}
</style>
</head>
<body class="easyui-layout" ng-app="myApp" ng-controller="myController" id="myApp">
    <div data-options="region:'west',split:true,collapsible:false,tools:'#west-tools'" title="目录" style="width:200px;">
	    <input class="easyui-searchbox" data-options="prompt:'在当前文件查找',searcher:doSearch" id='searchName' style="width:95%"><br>
	    <div id="findButtons"></div>
	   	<ul id="org_tree" class="ztree"></ul>
    </div>
    <div region="center" title="文件内容">
     	<div class="easyui-panel" id="div1" title="" style="width:100%;height:100%;padding:0px 15px;">
			<!--以下为文件测试内容-->
			<div id="content" class="article-content">
			 <div ng-repeat='($index,row) in rows'>
				<center>
					<h3 ng-if="row.depth == 1" id="{{row.id}}">{{row.name}}</h3>
				</center>
				<h4 ng-if="row.depth > 1 && row.type == 'title'" id="{{row.id}}">{{row.name}}</h4>
				<center>
					<p style="text-align:center;">
						<li ng-repeat='($index2,image) in row.images'>
							<img alt="" src="<%=path%>/upload/uploadFiles/{{image.target}}"><br/>
							{{image.file_name}}
						</li>
					</p>
				</center>
				<p ng-if="row.depth > 1 && row.type == 'content'"  id="{{row.id}}">
					<!-- {{row | viewContent}} -->
					<p ng-bind-html="row | viewContent"></p>
				</p>
				</div>
			</div>
		</div>
	</div>
	<div region="east" title="文件属性" split="true" border="true" style="width:20%; height:100%; float:left;">
		<div class="easyui-accordion" style="width:100%;height:100%;">
	        <div title="管控信息" data-options="" style="overflow:auto;padding:10px;">
	            <div class="easyui-panel" data-options='fit:true,border:false'>
	            	<div>
						<table>
							<tr>
								<td id="collectionId" style="display: none">
									<a href="#" class="" onclick="insertFavorite()" style="margin-left: 30px;" >
									<b style="color: blue;font-size: 12px">收藏</b></a>
								</td>
								<td id="collectionId2" style="display: none">
									<b style="margin-left: 30px;color: blue;font-size: 12px">已收藏</b></a>
								</td>
								<!-- <td>
									<a href="#" class="" onclick="downloadWork()" style="margin-left: 30px;">
									<b style="color: blue">下载</b></a>
								</td> -->
							</tr>
						</table>
					</div>
					<table style="font-size: 12px">
						<tr>
							<td class="td-left1">发布单位：</td>
							<td class="td-right1"><span id='rel_unit_name'></span></td>
						</tr>	
						<tr>
							<td class="td-left1">发布时间：</td>
							<td class="td-right1"><span id='release_date'></span></td>
						</tr>	
						<tr>
							<td class="td-left1">手册名称：</td>
							<td class="td-right1"><span id='name'></span></td>
						</tr>	
						<tr>
							<td class="td-left1">手册字号：</td>
							<td class="td-right1"><span id='code'></span></td>
						</tr>	
						<tr>
							<td class="td-left1">归口部门：</td>
							<td class="td-right1"><span id='org_id_name'></span></td>
						</tr>	
						<tr>
							<td class="td-left1">参与部门：</td>
							<td class="td-right1"><span id='join_dept_name'></span></td>
						</tr>	
						<tr>
							<td class="td-left1">编制人：</td>
							<td class="td-right1"><span id='editor_name'></span></td>
						</tr>	
						<tr>
							<td class="td-left1">参与单位：</td>
							<td class="td-right1"><span id='join_unit_name'></span></td>
						</tr>	
						<tr>
							<td class="td-left1">是否公开：</td>
							<td class="td-right1"><span id='is_public'></span></td>
						</tr>	
						<tr>
							<td class="td-left1">文件归属：</td>
							<td class="td-right1"><span id='belong_to'></span></td>
						</tr>	
					</table>
					<!-- 上个版本 -->
					<div id="versionForm"></div>
	            </div>
	        </div>
	        <div title="附件" data-options="" style="overflow:auto;padding:10px;">
	            <div class="easyui-panel" data-options='fit:true,border:false'>
	            	<!-- 附件信息 -->
					<div id="attachesForm"></div>
	            </div>
	        </div>
	    </div>
    </div>
</body>
<script type="text/javascript">
	var setting = {
        async: {
            enable: true
        },
        callback: {
            onClick: onNodeClick
        }, view: {
            fontCss: getFontCss1
        }
    };
	
	function getFontCss1(treeId, node){
			 return (!!node.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
	}
	
	//点击节点显示新增/修改内容模块 
	function onNodeClick(event, treeId, treeNode){	
		window.location.hash = treeNode.id;
	}
	
	var id = getQueryString('root_id');
	var newId = getQueryString('new_id');
	var abolishId = getQueryString('abolish_id');
	var tagFlag = getQueryString('tagFlag');
	$(function(){
		loadTree(id);
		loadContent();
		
		//加载上一个版本信息
		loadHistory(abolishId);
	});

function loadTree(rootId){
	$.post("<%=path%>/ajaxJSONAction.srq?JCDP_SRV_NAME=SysManualSrv&JCDP_OP_NAME=queryTreeDatasByParentId", {id: rootId,tagFlag:tagFlag, new_id:newId},function (result, ts, xhr) {
        var ztree = $.fn.zTree.init($("#org_tree"), setting, result);
        //ztree.expandAll(true);
        //获取第一个节
        var node = ztree.transformToArray(ztree.getNodes())[0];
        selectedNode = node;
        if (node != null) {
            if (!node.open)
					ztree.expandAll(true);
        }
        
        //展示文件信息
        showInformation(result);
        var id = result[0].id;
        //初始化附件
    	initAttaches2_diag(null, 'sysManual-queryRecords', id, 'attach','SysManualSrv');
        
    }, "json");
}

function loadContent(){
    var scope = angular.element($('#myApp')).scope();
    $.post("<%=path%>/ajaxJSONAction.srq?JCDP_SRV_NAME=SysManualSrv&JCDP_OP_NAME=getSysManualByRootId", {root_id:id,tagFlag:tagFlag, new_id:newId},function (result, ts, xhr) {
    	scope.rows = result;
    	scope.$apply();
    }, "json");
}

var myApp = angular.module('myApp', []);
myApp.controller('myController', ['$scope', function($scope) {
	$scope.rows = [];
}]);

//自定义过滤器
myApp.filter("viewContent",['$sce',function($sce){
	return function(row){
		var content = row.content;
		var files = row.files;
		var newContent="";
		var i = 0;
		//判断content不为空
		if (content) {
			var i= 0 ;
			if (content.indexOf("《")>-1&&content.indexOf("》">-1)) {
				while(content.indexOf("《")>-1&&content.indexOf("》">-1)){
					if (content.substring(0,content.indexOf("《"))) {
						newContent += content.substring(0,content.indexOf("《"));
					}
					var name = content.substring(content.indexOf("《"),content.indexOf("》")+1);
					content = content.substring(content.indexOf("》")+1);
					newContent += '<a href="#" onclick="toViewNew(\''+files[i].file_id+'\')" style="color:blue;">'+name+'</a>';
					if (content.indexOf("《")>-1&&content.indexOf("》">-1)) {
						
					}else{
						newContent += content;
					}
					i++;
				}
			}else{
				newContent = content;
			}
			
		}
		return $sce.trustAsHtml(newContent);
	};
}]);
function showInformation(map){
	$("#name").html(map[0].name);
   	$("#code").html(map[0].code);
	$("#release_date").html(map[0].releaseDate);
   	
   	$("#join_dept_name").html(map[0].joinDeptName);
   	$("#join_unit_name").html(map[0].joinUnitName);
   	$("#rel_unit_name").html(map[0].relUnitName);
   	$("#editor_name").html(map[0].editorName);
	$("#org_id_name").html(map[0].orgIdName);
	
	if(map[0].isPublic == 1)
		$("#is_public").html("是");
	else
		$("#is_public").html("否");
	if(map[0].belongTo == 1)
		$("#belong_to").html("集团公司");
	else
		$("#belong_to").html("股份公司");
}

function loadHistory(abolishId){
	    var str = "";
		if(abolishId){
			$.post("<%=path%>/ajaxJSONAction.srq?JCDP_SRV_NAME=SysManualSrv&JCDP_OP_NAME=queryBeforeSysManual", {abolish_id: abolishId},function (result, ts, xhr) {
				var str="<table style='font-size: 12px'><tr><td class='td-left1'>上一个版本：</td>";
				if (result != null && result.length >0) {
					for ( var i = 0; i < result.length; i++) {
						var mList = result[i];
						str +="<td class='td-right1'><a href='#'class='link' onclick='viewBefore(\""+mList.id+"\",\""+mList.abolishId+"\",\""+mList.newId+"\")'><font color='blue'>"+mList.name+"</font></a></td>";
						str +="</tr><tr><td class='td-left1'></td>";
					}
				}
				str+="</table>";
				$("#versionForm").append(str);    
		    }, "json");
		} else{
			str = "<table style='font-size: 12px'><tr><td class='td-left1'>上一个版本：</td><td class='td-right1'>无</td></tr></table>";
			$("#versionForm").append(str);
		}
	}

function viewBefore(id,abolishId,newId){
	window.open(jsContextPath+"/rule/category/sys_manual_view.jsp?root_id="+id+"&abolish_id="+abolishId+"&tagFlag=tagFlag&new_id="+newId);
};

    var contentHtml = "";
    var matchStr = "";
    var matchLen = matchStr.length;
    var matchArr = [];
    var firstStart = 0;
    var str = "";
    var len = "";
    var lastStr = '';
    var count = 0;

    function isContains(str, substr) {
        return str.indexOf(substr) >= 0;
    }
    function removeAllClass(dom,classStr){
    	var target = $(dom).find('.'+classStr);
    	if(target.length>0){
    	$(target).each(function(index,element){
    		$(element).removeClass(classStr);
    	})
    	}
    	
    }

    function doSearch(searchText) {
    	removeAllClass("#content","yellowBg");
    	removeAllClass("#content","yellowCurrent");
    	
    	contentHtml = $('#content').html();
        var contentHtmlTemp = contentHtml.replace(/<\/?.+?>/g, "");
       //console.log(contentHtml);
       // console.log(contentHtmlTemp);
        contentHtml2 = contentHtmlTemp.replace(/ /g, "");//dds为得到后的内容
        
        if(searchText === 2){
        	$("#_easyui_textbox_input1")[0].value = '';
        	matchStr = "";
        }else {
        	 matchStr =$.trim($("#searchName").val());
        }
        if (matchStr == "") {// 增加一个判断--matchStr是否在contentHtml2内容中
            //$("#content").html(contentHtml);
            $("#findButtons").html("");
        } else if (!isContains(contentHtml2, matchStr)) {
            //$("#content").html(contentHtml);
            $("#findButtons").html("&nbsp;<span>未找到关键词</span>");
        } else {
            matchLen = matchStr.length;
            matchArr.length = 0;
            firstStart = 0;
            str = contentHtml;
            len = str.length;
            matchFn();
        }
    }


    function matchFn() {
        var index = str.indexOf(matchStr, firstStart);
        if (index >= 0) {
            var str2 = str.slice(firstStart, index);
            var str3 = str.slice(index + matchLen, len);
            lastStr = str3;
            matchArr.push(str2);
            firstStart = index + matchLen;
            matchFn();
        } else {
            if (matchArr.length >= 1) {
                matchArr.push(lastStr);
                var str4 = '';
                for (var i = 0; i < matchArr.length - 1; i++) {
                    //alert(str4);
                    if (i == 0)
                        str4 = str4 + matchArr[i] + "<span id='yellow_" + (i + 1) + "' class='yellowCurrent'>" + matchStr + "</span>";
                    else
                        str4 = str4 + matchArr[i] + "<span id='yellow_" + (i + 1) + "' class='yellowBg'>" + matchStr + "</span>";
                    count++;
                }
                str4 += lastStr;
                $("#content").html(str4);
                $("#findButtons").html("");
                $("#findButtons").append("<input type='button' value='上一个' onclick='toMove(-1)' /> <input type='button' value='下一个' onclick='toMove(1)' /><input type='button' style='margin-left:4px' value='取消' onclick='doSearch(2)' />");
                $("#findButtons").append("<br>&nbsp;<span>共找到" + (matchArr.length - 1) + "个</span>");
                window.location.hash = "#yellow_1";
            }
            return;
        }
    }

    function toMove(n) {
        var last = $("[id^='yellow_']").get().length;
        var curr = parseInt($(".yellowCurrent").attr("id").split("_")[1]);
        var temp = 0;
        if (curr + n > last)
            temp = 1;
        else if (curr + n < 1)
            temp = last;
        else
            temp = curr + n;
        //alert(curr);
        $(".yellowCurrent").toggleClass("yellowBg yellowCurrent");
        $("#yellow_" + temp).toggleClass("yellowBg yellowCurrent");
        window.location.hash = "#yellow_" + temp;
    }
    
    //收藏
function insertFavorite(){
	var type="2";
    var name=$("#name").html();
   	var params={type:type,file_name:name,file_id:id};
   	jcdpCallService('SysManualSrv','saveCollection',params,function(ret){
		$.DialogNew.Alert({Content:ret.returnMsg});
		var collectionId = document.getElementById("collectionId");
        collectionId.style.display = 'none';
		var collectionId2 = document.getElementById("collectionId2");
        collectionId2.style.display = 'block';
 	});
}
//查询是否已收藏
function queryFavorite(){
   var collectionId = document.getElementById("collectionId");
   var collectionId2 = document.getElementById("collectionId2");
   var params={file_id:id};
   $.post("<%=path%>/ajaxJSONAction.srq?JCDP_SRV_NAME=SysManualSrv&JCDP_OP_NAME=queryCollection",params, function(result, ts, xhr) {
			//alert(result.length);
			if (result != null && result.length > 0) {
				collectionId2.style.display = 'block';
				collectionId.style.display = 'none';

			} else {
				if (tagFlag == null) {
					collectionId.style.display = 'block';
				} else {
					collectionId.style.display = 'none';
				}
		}
	}, "json");
}
//查看
function toViewNew(catalogId){
	getFileInfo(catalogId, "R_CATALOG1");
}
</script>
</html>
