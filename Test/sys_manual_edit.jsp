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
<script type="text/javascript" src="<%=path%>/epui/js/jquery.js"></script>
<script type="text/javascript" src="<%=path%>/epui/jquery-easyui-1.5/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=path%>/epui/jquery-easyui-1.5/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=path%>/epui/js/angular-1.3.0.js"></script>

<script type="text/javascript" src="<%=path %>/epui/js/framework.js"></script>
<link href="<%=path %>/epui/css/import_basic.css" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" type="text/css" id="skin" prePath="<%=path %>/"/>
<link rel="stylesheet" type="text/css" id="customSkin"/>
<script src="<%=path %>/epui/js/form/validationRule.js" type="text/javascript"></script>
<script src="<%=path %>/epui/js/form/validation.js" type="text/javascript"></script>
<script src="<%=path %>/epui/js/form/form.js" type="text/javascript"></script>
<script src="<%=path %>/epui/js/comm/utils.js" type="text/javascript"></script>
<script src="<%=path %>/epui/js/comm/cru.js" type="text/javascript"></script>
	
<!--树组件start -->
<script type="text/javascript" src="<%=path%>/epui/js/tree/ztree/ztree.js"></script>
<link href="<%=path%>/epui/js/tree/ztree/ztree.css" rel="stylesheet" type="text/css"/>
<!--树组件end -->

<link href="<%=path%>/epui/js/select2/css/select2.css" rel="stylesheet" type="text/css"/>
<script type="text/javascript" src="<%=path%>/epui/js/select2/js/select2.full.js"></script>
<script type="text/javascript" src="<%=path%>/epui/js/select2/js/select2.min.js"></script>
<script type="text/javascript" src="<%=path%>/epui/js/select2/js/i18n/zh-CN.js"></script>

<script type="text/javascript" src="<%=path%>/epui/js/form/upload/fileUpload.js"></script>
<script type="text/javascript" src="<%=path%>/epui/js/form/upload/handlers.js"></script>
<style type="text/css">
	.selectbox{
		display:none
	}
	.selBtn{
		display:none
	}
</style>
</head>
<script type="text/javascript">
var upload = null;
var id = getQueryString('id');
var status = getQueryString('status');

var selectedNode;
var fileName = "管理制度";
getKeyword(['fileName'], ['glzd'], "${sessionScope['SYS_USER_TOKEN_ID'].orgCode}");

var setting = {
	async: {
		enable: true,
		autoParam: ["id=root_id"],
		dataType:"text",
		otherParam:[],
		type:"post",
		url:"<%=path%>/ajaxJSONAction.srq?JCDP_SRV_NAME=SysManualSrv&JCDP_OP_NAME=queryTreeDatasByParentId"
	},
	callback: {
		onClick: onNodeClick,
		onRemove: onRemove,
		beforeRemove: beforeRemove,
		onAsyncSuccess: onAsyncSuccess
	},view: {
        fontCss: getFontCss1
    }
};
function onAsyncSuccess(event, treeId, treeNode, msg) {
	var zTree = $.fn.zTree.getZTreeObj("org_tree");
	zTree.expandNode(treeNode, true, true);
} 

function getFontCss1(treeId, node){
   	return (!!node.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}

//点击节点显示新增/修改内容模块 
function onNodeClick(event, treeId, treeNode){	
   	selectedNode = treeNode;
   	$("#node_id").val(treeNode.id);
   	$('#buttonAdd').show();
  	$("#buttonRemove").hide();
   	//根节点不可编辑
    if(treeNode.depth == 1){
   		$('#buttonEdit').hide();
   	} else {
       	$('#buttonEdit').show();
	   	//叶子节点可删除
   		if(treeNode.isleaf == '1')
   			$("#buttonRemove").show();
	   	loadContent(treeNode);
    }
}

$(function() {
	//页面刚加载不显示模块 
	reload();
});

//加载节点内容
function loadContent(treeNode){
	var scope = angular.element($('#myApp')).scope();
	$.post("<%=path%>/ajaxJSONAction.srq?JCDP_SRV_NAME=SysManualSrv&JCDP_OP_NAME=queryContentsByNodeId",{node_id:treeNode.id},function(result,ts,xhr) {
		//获取到了值
		scope.contents = [];
		if(result.length > 0){
			//scope.contents = result;  
			$.each(result,function(i,n){
				var data = {name:n.name,sortno:n.sortno,content:n.content,id:n.id,files:[],btnValue:'关联'+fileName};
				var url = "<%=path%>/ajaxJSONAction.srq?JCDP_SRV_NAME=DictSrv&JCDP_OP_NAME=getProgramFile";
				scope.contents.push(data);
				scope.$apply();
				if(n.files.length > 0){
					$.each(n.files,function(j,m){
						var file_id = m.file_id;
						var file_name = m.name;
						var data1 = {fileid:file_id};
						scope.contents[i].files.push(data1);
						scope.$apply();
						initSelectSingle("#select_" + i + "_" + j,{id:file_id, text:file_name},url);
						//綁定事件
						scope.onchangeSelect("#select_",i,j); 
					});
				}
			});
		} else 
			scope.addContent();
		scope.$apply();
		togglePanel('div2', 'div1', null); 
	},"json");
}

function togglePanel(show, hide1, hide2){
	if(show != null)
		$("#" + show).panel('open');
	if(hide1 != null)
		$("#" + hide1).panel('close');
	if(hide2 != null)
		$("#" + hide2).panel('close');
}

//添加节点 
function add() {
	$('#div1').form('clear');
	$("#parent_id").val(selectedNode.id);
	$("#depth").val(parseInt(selectedNode.depth) + 1);
	$("#name").val("");
	$("#sortno").val("");
	
	//初始化上传
	destroyUpload2(upload);
	var attachId = $.fileUpload.generateCatalogId("<%=path%>/file/getCatalogId.srq");
	$("#attach_id").val(attachId);
	upload = initUpload(false, attachId, 'uploadBtn', 'uploadList', '*.jpg;*.png');
	
	togglePanel('div1', 'div2', null);
};

//点击修改按钮  获取节点信息 
function edit(){
	$('#div1').form('clear');
	$("#id").val(selectedNode.id);
	$("#parent_id").val(selectedNode.parentId);
	$("#depth").val(selectedNode.depth);
	//初始化上传
	destroyUpload2(upload);
	var attachId = selectedNode.attachId;
	$("#attach_id").val(attachId);
	upload = initUpload(true, attachId, 'uploadBtn', 'uploadList', '*.jpg;*.png');
	togglePanel('div1', 'div2', null);
	$.post("<%=path%>/ajaxJSONAction.srq?JCDP_SRV_NAME=SysManualSrv&JCDP_OP_NAME=getNodeInfo",{id:selectedNode.id}, function(result,ts,xhr) {
		$("#name").val(result.name);
		$("#sortno").val(result.sortno);
	},"json");
}

//加载左边树
function reload(){
	$('#root_id').val(id);
	if(status != '0')
		$('.easyui-layout').layout('remove', 'south');
		
	togglePanel(null, 'div1','div2');
	//异步加载 获取tree
	$.post("<%=path%>/ajaxJSONAction.srq?JCDP_SRV_NAME=SysManualSrv&JCDP_OP_NAME=queryTreeDatasByParentId",{root_id:"", id:id},
		function(result,ts,xhr) {
			var ztree = $.fn.zTree.init($("#org_tree"), setting, result);
			ztree.expandAll(true);
	}, "json");
}

//保存修改后的目录信息
function toSave(){
	var valid = $("#myform1").validationEngine({returnIsValid: true});
	if(valid){
		$(".easyui-layout").mask("正在提交");
		var params = $('#myform1').serialize();
		//后台进行保存操作
		jcdpCallService('SysManualSrv','saveNode',params,function(ret){
			$(".easyui-layout").unmask();
			//回调函数弹框提醒  
			var nodeId = $('#id').val();
			top.Dialog.alert(ret.returnMsg);
			$('#div1').form('clear');
			$("#div1").panel('close');
			var zTree = $.fn.zTree.getZTreeObj("org_tree");
			selectedNode.isParent = true;
			if(nodeId == ''){//新增
				zTree.getSelectedNodes()[0].isleaf = '0';//改节点不再是叶子节点
				zTree.reAsyncChildNodes(selectedNode, 'refresh', false);
			} else//修改
				zTree.reAsyncChildNodes(selectedNode.getParentNode(), 'refresh', false);
			$('#buttonEdit').hide();
			$('#buttonRemove').hide();
		});
	}
}

function toSave2(){
	var valid = $("#myform2").validationEngine({returnIsValid: true});
	if(valid){
		$(".easyui-layout").mask("正在提交");
		//获取节点ID
		$("#node_id").val(selectedNode.id);
		//序列化form表单中的参数 
		var params = $('#myform2').serialize();
		jcdpCallService('SysManualSrv','saveContent',params,function(ret){
			$(".easyui-layout").unmask();
			//回调函数弹框提醒  
		    top.Dialog.alert(ret.returnMsg);
		});
	}
}

//提交审批
function toSave3(){
	$(".easyui-layout").mask("正在提交");
	var params = {id:id};
	jcdpCallService('SysManualSrv','sendApprove',params,function(ret){
		$(".easyui-layout").unmask();
		var topWin = window.top.document.getElementById("mainF").contentWindow;
		topWin.grid.loadData();
		//回调函数弹框提醒  
		top.Dialog.alert(ret.msg,function(){
			top.Dialog.close();
		});
	});
}

function beforeRemove(treeId, treeNode){
	return window.confirm("确定删除吗？");
}

function remove(){
	jcdpQueryRecord2({sqlId:'sysManual-getChildrenNum', node_id:selectedNode.id}, function(ret){
		if(ret.data.num > 0){
			alert("请先刷新数据，删除子节点!");
			return;
		}
		var zTree = $.fn.zTree.getZTreeObj("org_tree");
		zTree.removeNode(selectedNode, true);
	});
}

function onRemove(event,treeId,treeNode){
	jcdpCallService('SysManualSrv','deleteNode',{node_id:treeNode.id,parent_id:treeNode.parentId},function(ret){
		top.Dialog.alert(ret.returnMsg, function(){
		    if(ret.childrenNum == 0){
                treeNode.getParentNode().isleaf = '1';}
        });
		var zTree = $.fn.zTree.getZTreeObj("org_tree");
		selectedNode.isParent = true;

		togglePanel(null,'div1', 'div2');
	});
}

function destroyUpload2(upload){
	if(upload){
		upload.destroy();
		$("#imageRow").remove();
		$("#titleRow").before('<tr id="imageRow"><td >图片：</td><td colspan="3"><div id="uploadBtn"></div><div id="uploadList"></div></td></tr>');
	}
}

//AngularJs
var myApp = angular.module('myApp', []);
myApp.controller('controlList', ['$scope',
	function($scope) {
	 	$scope.contents = [];
	 	$scope.releasedate = '';
	 	$scope.hasDate = 0;
	 	
		$scope.onchangeSelect = function(id,index1,index2){
			$(id+index1+ "_"+index2).change(function(){
				$scope.contents[index1].files[index2].fileid = $(this).select2("val");
				$scope.$apply();
			});
		};
		
		//添加内容
		$scope.addContent = function(){
			$scope.contents.push({btnValue:'关联'+fileName,files:[]});
		}; 
		
		$scope.insertContent = function(index){
			$scope.contents.splice(index,0,{btnValue:'关联'+fileName,files:[]});
		};
		
		//删除内容
		$scope.removeContent = function(index) { 
			$scope.contents.splice(index,1); 
		};
		
		//删除管理制度, index1当前内容索引   index2当前管理制度索引 
		$scope.removeFile = function(index1, index2) {
			$scope.contents[index1].files.splice(index2, 1); 
		};
		
		//自己重新定义方法  实现解析内容中的书名号  因为内容有多个  所以需要传递索引
		$scope.getFileTitles = function(index){
			// files 初始为空 
			$scope.contents[index].files = [];
			
			//判断传递过来的内容框中内容是否为空 
			if($scope.contents[index].content){
				//将内容赋值给stmp 
				var stmp = $scope.contents[index].content;
				var  i=0;
				while(stmp.indexOf("《") > -1 && stmp.indexOf("》") > -1){
					var name = stmp.substring(stmp.indexOf("《")+1, stmp.indexOf("》"));
					stmp = stmp.substring(stmp.indexOf("》")+1);
					//$("#wjname").val(name);
					//解析后的书名号对象  data 
					var data = {name:name};
					//将书名号的个数赋值给n
					var n = $scope.contents[index].files.length;
					//将data对象添加到书名号数组中 
					$scope.contents[index].files.push(data);
					$scope.$apply();
					
					var url = "<%=path%>/ajaxJSONAction.srq?JCDP_SRV_NAME=DictSrv&JCDP_OP_NAME=getProgramFile";
				    initSelectSingle("#select_" + index + "_" + i, null, url);
					//綁定事件
					$scope.onchangeSelect("#select_", index, i);
					i++;
				}
			}
		};
	} 
]);
</script>
  
<body class="easyui-layout" ng-app="myApp" ng-controller="controlList" id="myApp">
	<div data-options="region:'south'" style="height:30px;">
		<center>
			<input type="button" value="提交" onclick="toSave3()"/>
			<input type="button" value="JCDP_button_cancel" onclick="closeDialog()"/>
		</center>
	</div>
    <div data-options="region:'west',split:true,collapsible:false,tools:'#west-tools'" title="体系手册" style="width:200px;">
    	<div id="west-tools">
    		<a href="javascript:void(0)" title="新增 " id="buttonAdd" class="icon-add" style="display:none" onclick="add()"></a>
			<a href="javascript:void(0)" title="编辑" id="buttonEdit" class="icon-edit" style="display:none" onclick="edit()"></a>
			<a href="javascript:void(0)" title="删除" id="buttonRemove" class="icon-cancel"  style="display:none" onclick="remove()"></a>
			<a href="javascript:void(0)" title="刷新 " id="buttonReload" class="icon-reload" onclick="reload()"></a>
		</div>
    	<ul id="org_tree" class="ztree"></ul>
    </div>
    
    <div region="center">
     	<div class="easyui-panel" id="div1" title="新增/修改目录" style="display:none;width:100%;height:100%;padding:30px 60px;">
     		<form id="myform1">
				<input type="hidden" name="id" id="id" />
				<input type="hidden" name="parent_id" id="parent_id" />
				<input type="hidden" name="attach_id" id="attach_id" />
				<input type="hidden" name="depth" id="depth" />
		        <table class="tableStyle" formMode="line" align="center">
		        	<tr id="imageRow">
		        		<td>图片：</td>
						<td colspan="3">
							<div id="uploadBtn"></div>
							<div id="uploadList"></div>
						</td>
		        	</tr>
		        	<tr id="titleRow">
		        		<td>名称：</td>
		        		<td colspan="3">
		        			<textarea autoHeight="true" ng-model="content" id="name" name="name" style="width:650px;height:150px;" class="validate[required]"></textarea>
		        			<span class="star">*</span>
		        		</td>
		        	</tr>
		            <tr>
		        		<td>序号：</td>
		        		<td colspan="3">
		        		    <input type="text" name="sortno" id="sortno" class="validate[required,custom[onlyNumber]]" />
		        		    <span class="star">*</span>
		        		</td>
		        	</tr>
		        </table>
		        <table formMode="transparent" align="center">
		        	<tr>
						<td colspan="4">
						</td>
					</tr>
					<tr>
						<td colspan="4">
							<input type="button" id="submit1" value="保存" onclick="toSave()" />
						</td>
					</tr>
				</table>
     		</form>
     	</div>
     	
    <div class="easyui-panel" id="div2" title="新增/修改内容" style="display:none;width:100%;height:100%;padding:30px 60px;">
			<form id="myform2">
			 	<input type="button" ng-click="addContent();" value="添加内容" />
				<table class="tableStyle" formMode="line" align="center">
				<tbody ng-repeat='($index1,c) in contents'>
					<tr>
						<td rowspan="2"><img src="<%=path%>/epui/jquery-easyui-1.5/themes/icons/no.png" ng-click="removeContent($index1)" /></td>
						<td>内容：</td>
						<td colspan="3">
							<!--内容   content-->
							<textarea autoHeight="true" name="content{{$index1}}" id="content{{$index1}}" style="width:650px;height:150px;" ng-model="c.content" class="validate[required]"></textarea>
						</td>
					</tr>
					<tr>
						<td colspan="4">
							<button type="button" ng-click="insertContent($index1);">插入</button>
						</td>
					</tr>
					<tr>
						<td colspan="4">
							<input type="button" value="{{c.btnValue}}" ng-click="getFileTitles($index1);" />
							<input type="hidden" name="count2{{$index1}}" id="count2{{$index1}}" value="{{c.files.length}}" />
						</td>
					</tr>
					<tr>
						<td colspan="4">
							<table ng-repeat='($index2,b) in c.files' width="100%" border="0" cellspacing="0" cellpadding="0">
								<tr>
					        		<td colspan="4">
					        			<img src="<%=path%>/epui/jquery-easyui-1.5/themes/icons/no.png" ng-click="removeFile($index1,$index2)" />{{$index2+1}}
					        			<select id="select_{{$index1}}_{{$index2}}" style="width:200px">
										</select>
					        			<input type="hidden" value="{{b.id}}" name="id_{{$index1}}_{{$index2}}" />
					        			<input type="hidden" name="fileid_{{$index1}}_{{$index2}}" value="{{b.fileid}}"/>
					        		</td>
					        	</tr>
							</table>
						</td>
					</tr>
					</tbody>
					<tr style="text-align:left" ng-if="hasDate==1">
						<td>日期：</td>
						<td colspan="3">
						 <input type="text" name="releasedate" class="validate[required]" style="width:300px" />
						</td>
					</tr>
				</table>
				<table formMode="transparent" align="center">
					<tr>
						<td colspan="4">
							<input type="hidden" name="node_id" id="node_id" />
							<input type="hidden" name="root_id" id="root_id" />
							<input type="hidden" name="count" id="count" value="{{contents.length}}" />
							<input type="button" id="submit" value="保存" onclick="toSave2()"/>
						</td>
					</tr>
				</table>
     		</form>
		</div>
</body>
</html>
