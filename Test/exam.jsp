<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.richfit.dreambuilder.common.UserToken"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
	String path = request.getContextPath();
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title></title>
	<!-- 通用样式 -->
<link href="<%=path%>/epui/new/css/style.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/epui/new/css/common.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/epui/new/css/sec.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/epui/new/css/dialog.css" rel="stylesheet" type="text/css" />
	<script src="<%=path%>/epui/js/jquery.js"></script>
	<script src="<%=path%>/epui/js/framework.js"></script>
	<script src="<%=path%>/epui/js/form/form.js"></script>
	<script src="<%=path%>/epui/js/comm/utils.js"></script>	
	<script src="<%=path%>/epui/js/comm/common.js"></script>
	<script type="text/javascript" src="<%=path%>/epui/new/js/dialog.js"></script>
	<!-- 表单验证start -->
	<script src="<%=path%>/epui/js/form/validationRule.js" type="text/javascript"></script>
	<script src="<%=path%>/epui/js/form/validation.js" type="text/javascript"></script>
	<!-- 表单验证end -->
	<script>
		$(function(){
			var taskId = getQueryString('task_id');
			var tag = getQueryString('tag');
			var fileType = getQueryString('file_type');
			var fileId = getQueryString('file_id');
			var tableName = getQueryString('table_name');
			$('#task_id').val(taskId);
			$('#file_type').val(fileType);
			$('#tag').val(tag);
			$('#file_id').val(fileId);
			$('#table_name').val(tableName);
		});
		
		function toSave(){
			var valid = $('#myForm').validationEngine({returnIsValid: true});
			if(valid){
				$('#myForm').mask('正在提交');
				var params = $('#myForm').serialize();
				jcdpCallService('CommSrv','updateCompleteTask',params,function(ret){
					$('#myForm').unmask();
	          		$.DialogNew.Alert({Content:ret.returnMsg,ConfirmFun:function(){
						refreshAndClose();
					}});
	    		});
			}
		}
	</script>
</head>
<body>

	<form id="myForm">
		<input type="hidden" name="task_id" id="task_id" />
		<input type="hidden" name="tag" id="tag" />
		<input type="hidden" name="file_type" id="file_type" />
		<input type="hidden" name="file_id" id="file_id" />
		<input type="hidden" name="table_name" id="table_name" />
		<table class="tableStyle" formMode="transparent" align="center">
			<tr>
				<td>是否同意</td>
				<td>
					<input type="radio" value="1" name="is_pass" checked />是    <input type="radio" value="0" name="is_pass" />否
				</td>
			</tr>
			<tr>
				<td>审批意见</td>
				<td>
					<textarea name="comments" style="width:450px;height:100px;"></textarea>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<input type="button" value="确定" onclick="toSave()" />
					<input type="button" value="取消" onclick="closeDialogNew()" />
				</td>
			</tr>
		</table>
	</form>
</body>
</html>