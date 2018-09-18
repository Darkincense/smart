<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
	String path = request.getContextPath();
	String jsPath = session.getAttribute("locale").equals("gb")
			? "js/gb"
			: "js";
	String pageId = request.getParameter("pageId") == null
			? ""
			: request.getParameter("pageId");
	String level = request.getParameter("level") == null ? "" : request
			.getParameter("level");
	String orgId = request.getParameter("org_id");
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
<!--通用樣式 -->
<link href="<%=path%>/epui/new/css/style.css" rel="stylesheet"
	type="text/css" />
<link href="<%=path%>/epui/new/css/common.css" rel="stylesheet"
	type="text/css" />
<link href="<%=path%>/epui/new/css/sec.css" rel="stylesheet"
	type="text/css" />
<link href="<%=path%>/epui/new/css/dialog.css" rel="stylesheet"
	type="text/css" />
<!--框架必需start-->
<script type="text/javascript"
	src="<%=path%>/epui/<%=jsPath%>/jquery.js"></script>
<script type="text/javascript"
	src="<%=path%>/epui/<%=jsPath%>/framework.js"></script>

<!--框架必需end-->
<!-- 日期选择框start -->
<script type="text/javascript"
	src="<%=path%>/epui/<%=jsPath%>/form/datePicker/WdatePicker.js"></script>
<!-- 日期选择框end -->
<script type="text/javascript"
	src="<%=path%>/epui/<%=jsPath%>/comm/utils.js"></script>
<script type="text/javascript"
	src="<%=path%>/epui/<%=jsPath%>/comm/common.js"></script>
<script type="text/javascript"
	src="<%=path%>/epui/<%=jsPath%>/comm/cru.js"></script>

<!-- 表单验证start -->
<script src="<%=path%>/epui/js/form/validationRule.js"
	type="text/javascript"></script>
<script src="<%=path%>/epui/js/form/validation.js"
	type="text/javascript"></script>
<!-- 表单验证end -->

<script type="text/javascript"
	src="<%=path%>/epui/js/form/upload/fileUpload.js"></script>
<script type="text/javascript"
	src="<%=path%>/epui/js/form/upload/handlers.js"></script>
<script type="text/javascript" src="<%=path%>/epui/js/angular-1.3.0.js"></script>

<link href="<%=path%>/epui/js/select2/css/select2.css" rel="stylesheet"
	type="text/css" />
<script type="text/javascript"
	src="<%=path%>/epui/js/select2/js/select2.full.js"></script>
<script type="text/javascript"
	src="<%=path%>/epui/js/select2/js/select2.min.js"></script>
<script type="text/javascript"
	src="<%=path%>/epui/js/select2/js/i18n/zh-CN.js"></script>

<!-- 树组件start -->
<script type="text/javascript"
	src="<%=path%>/epui/js/tree/ztree/ztree.js"></script>
<link type="text/css" rel="stylesheet"
	href="<%=path%>/epui/js/tree/ztree/ztree.css"></link>
<!-- 树组件end -->

<!-- 树形双选器start -->
<script type="text/javascript"
	src="<%=path%>/epui/js/form/listerTree.js"></script>
<!-- 树形双选器end -->

<!-- 树形下拉框start -->
<script type="text/javascript"
	src="<%=path%>/epui/js/form/selectTree.js"></script>
<!-- 树形下拉框end -->
</head>
<script type="text/javascript">
	var id = getQueryString('id');
	var gkbmName = getQueryString('gkbmName');
	gkbmName=decodeURI(decodeURI(gkbmName));
	var upload = null;
	var uploaderMap = {};
 	$(function(){
 		init(id);
 		
 		var scope = angular.element($('#myApp')).scope();
	  	if(id != null){
	  		jcdpQueryRecord2({sqlId:'catalog-getFileInfo',id:id}, function(ret){
	  			//赋值
            	initEdit(ret.data);
            	
 	 			var attachId2 = ret.data.risk_proc_id;
	 	 		$("#risk_proc_id").val(attachId2);
	 	 		initUpload('program_file', true, attachId2, 'procBtn', 'procList', '*.png;*.jpg', 0);
	 	 		
	 	 		var attachId3 = ret.data.risk_file_id;
	 	 		$("#risk_file_id").val(attachId3);
	 	 		initUpload('program_file', true, attachId3, 'riskBtn', 'riskList', '*.pdf', 0);
	 	 		
	 	 		/*
	 	 		var attachId5 = ret.data.sup_file_id;
	 	 		$("#sup_file_id").val(attachId5);
	 	 		initUpload('program_file', true, attachId5, 'supBtn', 'supList', '*.pdf', 0);
	 	 		*/
            });
 	    	
 	    	//初始化记录文件
 	    	initRecords(scope, 'catalog-queryRecords', id, 1, 0, 'program_file_record');
 	    	//初始化附件
 	    	initAttaches(scope, 'catalog-queryRecords', id, 0, 0, 'program_file_attach');
 	    	//初始化国家规定
 	    	initRegs(scope, 'catalog-queryRecords', id, 0, 0, 'program_file_attach');
  		} else{
 	 		var attachId2 = $.fileUpload.generateCatalogId("<%=path%>/file/getCatalogId.srq");
 	 		$("#risk_proc_id").val(attachId2);
 	 		initUpload('program_file', false, attachId2, 'procBtn', 'procList', '*.png;*.jpg', 0);
 	 		
 	 		var attachId3 = $.fileUpload.generateCatalogId("<%=path%>/file/getCatalogId.srq");
 	 		$("#risk_file_id").val(attachId3);
 	 		initUpload('program_file', false, attachId3, 'riskBtn', 'riskList', '*.pdf', 0);
 	 		
 	 		var attachId5 = $.fileUpload.generateCatalogId("<%=path%>/file/getCatalogId.srq");
	 	 	$("#sup_file_id").val(attachId5);
	 	 	initUpload('program_file', false, attachId5, 'supBtn', 'supList', '*.pdf', 0);
 	 		
 	 		//默认选中
  			$('#yes').attr('checked', true);
  			$('#jituan').attr('checked', true);
			
			//记录、附件 、国家规定都为空
			scope.records =[];
			scope.attaches =[];
			scope.regs =[];
			scope.$apply();
  		} 
 	});
 	
 	function initEdit(map){
		$("#id").val(map.id);
		$("#name").val(map.name);
	   	$("#code").val(map.code);
		$("#release_date").val(map.release_date);
	   	
	   	$("#rule_type").val(map.rule_type);
	   	$("#rule_type_name").val(map.rule_type_name);
	   	$("#bc").val(map.bc);
	   	$("#bc_name").val(map.bc_name);
	   	$("#e_level").val(map.e_level);
	   	$("#e_level_name").val(map.e_level_name);
	   	$("#join_dept").val(map.join_dept);
	   	$("#join_dept_name").val(map.join_dept_name);
	   	$("#join_unit").val(map.join_unit);
	   	$("#join_unit_name").val(map.join_unit_name);
		$("#pro_type").val(map.pro_type);
		$("#pro_type_name").val(map.pro_type_name);
	   	$("#file_type").val(map.file_type);
	   	$("#file_type_name").val(map.file_type_name);
	   	$("#rel_unit").val(map.rel_unit);
	   	$("#rel_unit_name").val(map.rel_unit_name);
	   	$("#editor").val(map.editor);
	   	$("#editor_name").val(map.editor_name);
		$("#org_id").val(map.org_id);
		$("#org_id_name").val(map.org_id_name);
		$("#file_id").val(map.file_id);
		$("#file_id_name").val(map.file_id_name);
		$("#doc_id").val(map.doc_id);
		$("#doc_id_name").val(map.doc_id_name);
		$("#nat_reg_id_name").val(map.nat_reg_id_name);
		$("#sup_file_id_name").val(map.sup_file_id_name);
		$("#nan_reg_id_name").val(map.nan_reg_id_name);
		
		if(map.is_public == 1)
			$("#yes").attr('checked', true);
		else
			$("#no").attr('checked', true);
		if(map.belong_to == 1)
			$("#jituan").attr('checked', true);
		else
			$("#gufen").attr('checked', true);
 	}

 	//点击保存按钮
 	function toSave(){
 		var result = validateFileUpload();
 		var valid = $('#myForm').validationEngine({returnIsValid: true});
 		//valid = true;
		if(valid){
			if(!result){
				top.Dialog.alert('请上传文件！');
				return;
			}
			$('#myForm').mask('正在提交');
			var params = $('#myForm').serialize();
			jcdpCallService('CatalogSrv','saveFile2',params,function(ret){
				$('#myForm').unmask();
    			top.Dialog.alert(ret.returnMsg,function(){
					var topWin = window.top.document.getElementById("mainF").contentWindow;
					topWin.grid.loadData();
					if(ret.pk)
						window.location = jsContextPath + "/rule/category/program_edit.jsp?id="+ret.pk+"&status=0";
					else
						closeDialog();
          		});
    		});	 
		}
 	}	

function selectOrgId(inputId){
	var val = $('#'+inputId).val();
	var url = jsContextPath+"/rule/selectUser.jsp?id="+inputId+"&val="+val;
	popWindow(url, "选择"+gkbmName,530,700);
}

var myApp = angular.module('myApp', []);
myApp.controller('ruleController', ['$scope',
	function($scope) {
		$scope.records = [];
		$scope.attaches = [];
		$scope.regs = [];
		
		//$scope.isUpdate = false;
		
		$scope.addRecord = function(){
			var attachId = $.fileUpload.generateCatalogId("<%=path%>/file/getCatalogId.srq"); 
			var length = $scope.records.length;
			$scope.records.push({attach_id:attachId});
			$scope.$apply();
			//初始化机构、专业下拉
			$.post("<%=path%>/ajaxJSONAction.srq?JCDP_SRV_NAME=DictSrv&JCDP_OP_NAME=getTreeData",{},function(result,ts,xhr){
				$(".selectTree").bind('change', function(){
					var array = $(this).attr("id").split("_");
					var prop = array[1];
					var index = array[2];
					$scope.records[index][prop] = $(this).attr("relValue");
					$scope.records[index][prop+"_name"] = $(this).attr("relText");
					$scope.$apply();
				});
				//机构
				$("#sel_org_"+length).data("data",result.orgs); 
	    		$("#sel_org_"+length).render();
	    		//专业
	    		$("#sel_career_"+length).data("data",result.careers); 
	    		$("#sel_career_"+length).render();
	  		},"json");
	  		
			var uploader = initUpload('work_doc_record', false, attachId, 'recordBtn'+length, 'recordList'+length, '*.xls;*.xlsx', 1);
			$scope.records[length].upload = uploader;
		};
		
		$scope.addAttach = function(){
			var attachId = $.fileUpload.generateCatalogId("<%=path%>
	/file/getCatalogId.srq");
									var length = $scope.attaches.length;
									$scope.attaches.push({
										attach_id : attachId
									});
									$scope.$apply();
									var uploader = initUpload(
											'work_doc_attach', false, attachId,
											'attachBtn' + length, 'attachList'
													+ length, '*.pdf', 1);
									$scope.attaches[length].upload = uploader;
								};

								$scope.addReg = function() {
									$scope.regs.push({});
									$scope.$apply();
								};

								$scope.removeRecord = function(index) {
									destroyUpload($scope.records[index].upload);
									$scope.records.splice(index, 1);
								};

								$scope.removeAttach = function(index) {
									destroyUpload($scope.attaches[index].upload);
									$scope.attaches.splice(index, 1);
								};

								$scope.removeReg = function(index) {
									$scope.regs.splice(index, 1);
								};
							} ]);
</script>
<body>
	<div class="temp-content">
		<section class="m-lineheight2">
		<h3 class="section-title margin-b-l">基本信息</h3>
		<div class="f-box">

			<div class="f-box">
			<span>fabudanwei </span>
				 <input type='hidden' id='rel_unit' name='rel_unit' />
          <input type='text' class="input-large" id='rel_unit_name' name='rel_unit_name' readonly style="width:200px" class="validate[required]" /><input type="button" style="height：30px;" value="选择" onclick="selectUserControl_yue(this)" /><span class="margin-l-s required">*</span>
			</div>
			<div class="f-box">
				<label class="inline-block s-width t-right">发布时间</label> <input
					class="input-large input-w margin-l-s i-date" type="text" required
					id="release_date" name="release_date" autocomplete="off" readonly />
				<span class="margin-l-s required">*</span>
			</div>
		</div>
		</section>
	</div>
</body>
<script type="text/javascript">
	$("#gkbm").html(gkbmName + "：");
</script>
</html>