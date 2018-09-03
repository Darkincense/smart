package com.richfit.bjsop.controller.user;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.cnpc.jcdp.util.MD5;
import com.richfit.bjsop.controller.backgrd.loginInfo.GetLoginInfoController;
import com.richfit.bjsop.dao.comm.DBOperate;
import com.richfit.bjsop.entity.BasOrg;
import com.richfit.bjsop.entity.BasUser;
import com.richfit.bjsop.entity.CusCommonUser;
import com.richfit.bjsop.entity.CusInfo;
import com.richfit.bjsop.entity.UserToken;
import com.richfit.bjsop.util.CommPropertyAddUtil;
import com.richfit.bjsop.util.DateUtils;
import com.richfit.bjsop.util.UuidTools;

@Controller
@RequestMapping("/comm/userLogin")
public class CommUserLoginControl {

	//发送短信正文
	public static String print="您正在打印提油二维码，校验码：@，请注意保密。【中石油上海销售】";//打印
	
	public static String loginInfo  = "您正在登录EGOU账号";//登录
	public static String registered = "您正在注册EGOU账号";//注册
	public static String editPassword = "您正在进行EGOU修改密码操作";//修改密码
	public static String forgotPassword = "您正在进行EGOU忘记密码操作";//忘记密码
	
	@Autowired
	private DBOperate dbOperate;
	
	@Autowired
	private GetLoginInfoController getLoginInfoController;

	@Autowired
	private SendSMS sendSMS;
	
	private static String Url = "http://106.ihuyi.com/webservice/sms.php?method=Submit";
	
	/**
	 * 登录第一步，获取验证码
	 * @param request
	 * @param response
	 * @param loginName
	 * @param loginPassword
	 * @return
	 */
	@RequestMapping("/login2")
	@ResponseBody
	public String login2(HttpServletRequest request,HttpServletResponse response,
			String loginName,String loginPassword){
		String jsonString ="";
		Map retMap = new HashMap();
		ModelAndView modelAndView = null;
		String cusId="";
		
		String phone="";
		String retStr ="";
		
		MD5 md = new MD5();
		loginPassword=md.getMD5ofStr(loginPassword);
		
		Map map=new HashMap();
		map.put("loginName", loginName);
		map.put("loginPassword", loginPassword);
		map.put("state", 1);
		
		String nameSpace = "com.richfit.bjsop.entity.BasUser.queryByList11";
		List<Map> entityList=dbOperate.select(nameSpace, map);
			
		//后加需求--手机号、身份证号可以登录
		String pandan="false";
		String userID="";
		if(entityList.size()==0){
			String phoneCardSpace = "com.richfit.bjsop.entity.CusCommonUser.queryListByPhoneCard";
			List<Map> phoneCardSpaceList=dbOperate.select(phoneCardSpace, map);
			if(phoneCardSpaceList.size()>0){//查询身份证或手机号是否存在，存在获取userId
				Map pmap=phoneCardSpaceList.get(0);
				if(pmap.get("USER_ID")!=null){
					userID=pmap.get("USER_ID").toString();
					phone=pmap.get("PHONE_NUMBER").toString();
				}
			}/*else{
				//查询cus_info信息，phone查询
				String cusSpace = "com.richfit.bjsop.entity.CusInfo.queryListByPhone";
				Map cusMap=new HashMap();
				cusMap.put("phone", phone);
				List<Map> cusList=dbOperate.select(cusSpace, cusMap);
				if(cusList.size()>0){
					CusInfo cusInfo=(CusInfo)cusList.get(0);
					userID=cusInfo.getUserId();
				}
			}*/
			if(userID!=""){
				//通过userID查询bas_user表的数据，看密码是否正确
				String userSpace = "com.richfit.bjsop.entity.BasUser.selectBasUserGetObj";
				Map userMap=new HashMap();
				userMap.put("userId", userID);
				List<Map> userList=dbOperate.select(userSpace, userMap);
				if(userList.size()>0){
					BasUser basUser=(BasUser)userList.get(0);
					String userloginpass=basUser.getLoginPassword();
					if(userloginpass.equals(loginPassword)){//密码正确，发送短信验证码
						//this.trueNameAndpassword(userList,cusId,loginName,retMap,request);
						this.sendMessages(request,response,phone,retMap);
						pandan="true";
					}
				}
			}
		}
		
		if(entityList.size()>0){//用户名密码正确，查询用户手机号，发送短信验证码
			BasUser basUser=(BasUser)entityList.get(0);
			String cusID=basUser.getCusId();
			//公司账号查询cus_info--通过bas_user的cus_id
			if(cusID!=null){//公司账号
				String phoneSpace = "com.richfit.bjsop.entity.CusInfo.queryListByCusId";
				Map cusMap=new HashMap();
				cusMap.put("cusId", cusID);
				List<Map> cusList=dbOperate.select(phoneSpace, cusMap);
				if(cusList.size()>0){
					CusInfo cusInfo=(CusInfo)cusList.get(0);
					phone=cusInfo.getCusMobile();
					this.sendMessages(request,response,phone,retMap);
				}
			}else{//个人账号
				//this.trueNameAndpassword(entityList,cusId,loginName,retMap,request);
				String phoneSpace = "com.richfit.bjsop.entity.CusCommonUser.selectCommonUser";
				Map userMap=new HashMap();
				userMap.put("userId", basUser.getUserId());
				List<Map> userList=dbOperate.select(phoneSpace, userMap);
				if(userList.size()>0){
					CusCommonUser commonUser=(CusCommonUser)userList.get(0);
					phone=commonUser.getPhoneNumber();
					this.sendMessages(request,response,phone,retMap);
				}
			}
		}else{//用户名或密码错误
			if(pandan.equals("false")){
				retStr = "用户名或密码不正确，请重新输入！";
				retMap.put("phone", null);
				retMap.put("retStr", retStr);
				retMap.put("cusId", cusId);
				retMap.put("userId",null);
				retMap.put("yesno", "no");
			}
		}
		jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
		return jsonString;
	}
	
	/**
	 *  登录第二步，登录
	 */
	@RequestMapping("/login1")
	@ResponseBody
	public String login1(HttpServletRequest request,HttpServletResponse response,
			String loginName,String loginPassword,String vCode){
		String jsonString ="";
		Map retMap = new HashMap();
		HttpSession session = request.getSession();
		
		//判断验证码是否正确
		String code="";
		if(session.getAttribute("vCode")!=null){
			code=session.getAttribute("vCode").toString();
		
			if(vCode.equals(code)){//验证码正确
				ModelAndView modelAndView = null;
				String cusId="";
				
				Map data =new HashMap();
				data.put("loginName",loginName);
				data.put("userType", "2");
				data.put("state", "1");
				data.put("delFlag", 0);
				
				String nameSpace1 = "com.richfit.bjsop.entity.BasUser.queryByList";
				List<Map> entityList1=dbOperate.select(nameSpace1, data);
				if(entityList1.size()>0){
					BasUser user = (BasUser)entityList1.get(0);
					UserToken userToken = new UserToken();
					userToken.setLoginName(user.getLoginName());
					userToken.setUserId(user.getUserId());
					userToken.setEmplId(user.getEmpId()==null?"-1":user.getEmpId());
					userToken.setOrgId(user.getOrgId()==null?"-1":user.getOrgId());
					userToken.setOrgName(user.getOrgName());
					userToken.setOrgType(user.getOrgType()==null?"-1":user.getOrgType());
					userToken.setEmplName(user.getEmpName());
					userToken.setEmplType(user.getEmpType());
					synchronized (session) {
						session.setAttribute("setOrgId", user.getOrgId()==null?"-1":user.getOrgId());
					}
				}
				
				MD5 md = new MD5();
				loginPassword=md.getMD5ofStr(loginPassword);
				
				Map map=new HashMap();
				map.put("loginName", loginName);
				map.put("loginPassword", loginPassword);
				map.put("state", 1);                       //查询激活用户  20160516 gl
				
				String nameSpace = "com.richfit.bjsop.entity.BasUser.queryByList11";
				List<Map> entityList=dbOperate.select(nameSpace, map);
					
				//后加需求--手机号、身份证号可以登录
				String pandan="false";
				String userID="";
				if(entityList.size()==0){
					String phoneCardSpace = "com.richfit.bjsop.entity.CusCommonUser.queryListByPhoneCard";
					List<Map> phoneCardSpaceList=dbOperate.select(phoneCardSpace, map);
					if(phoneCardSpaceList.size()>0){
						Map pmap=phoneCardSpaceList.get(0);
						if(pmap.get("USER_ID")!=null){
							userID=pmap.get("USER_ID").toString();
						}
					}
					if(userID!=""){
						//通过userID查询bas_user表的数据，看密码是否正确
						String userSpace = "com.richfit.bjsop.entity.BasUser.selectBasUserGetObj";
						Map userMap=new HashMap();
						userMap.put("userId", userID);
						List<Map> userList=dbOperate.select(userSpace, userMap);
						if(userList.size()>0){
							BasUser basUser=(BasUser)userList.get(0);
							String userloginpass=basUser.getLoginPassword();
							if(userloginpass.equals(loginPassword)){//密码正确
								this.trueNameAndpassword(userList,cusId,loginName,retMap,request);
								pandan="true";
							}
						}
					}
				}
				
				if(entityList.size()>0){//保存数据到session
					this.trueNameAndpassword(entityList,cusId,loginName,retMap,request);
				}else{//用户名或密码错误
					if(pandan.equals("false")){
						String retStr = "用户名或密码不正确，请重新输入！";
						retMap.put("phone", null);
						retMap.put("retStr", retStr);
						retMap.put("cusId", cusId);
						retMap.put("userId",null);
					}
				}
			}else{//验证码错误
				retMap.put("retStr", "验证码错误！");
			}
		}else{
			retMap.put("retStr", "请先获取验证码！");
		}
		jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
		return jsonString;
	}
	
	/**
	 * 忘记密码第一步，获取验证码
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/onlySendSMSByLoginName")
	@ResponseBody
	public String onlySendSMSByLoginName(HttpServletRequest request,HttpServletResponse response,
			@RequestParam Map data){
		String jsonString="";
		Map retMap = new HashMap();
		
		Map map=getPhoneByLoginName(data.get("loginName").toString());
		String phone=map.get("phone")!=null?map.get("phone").toString():null;
		String cusId=map.get("cusId")!=null?map.get("cusId").toString():null;
		String userId=map.get("userId")!=null?map.get("userId").toString():null;
		String retMessage="";
		if(phone!=""){
			boolean validateTime=this.getValidateTime(request); 
			if(validateTime==true){//可以发送---第一次发送或是超过3分钟了
				//发送验证码  
				retMessage=this.sendInfo(request,response,phone,forgotPassword);
			}else{
				retMessage="验证码有效时间3分钟，请输入有效期内的验证码！";
				retMap.put("retMsg", "other");
			}
			retMap.put("retMsg", "true");
		}else{
			retMap.put("retMsg", "false");
		}
		retMap.put("retStr", retMessage);
		retMap.put("cusId", cusId);
		retMap.put("userId", userId);
		retMap.put("phone", phone);
		jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
		return jsonString;
	}
	
	/**
	 * 忘记密码第二步，确认验证码正确
	 * @param request
	 * @param response
	 * @param data
	 * @return
	 */
	@RequestMapping("/onlyValidateSMS")
	@ResponseBody
	public String onlyValidateSMS(HttpServletRequest request,HttpServletResponse response,
			@RequestParam Map data){
		
		Map retMap = new HashMap();
		String jsonString="";
		
		String phone=data.get("phone").toString();
		String code=data.get("code").toString();
		
		String retMsg=SendSMS.validationSMS(request,response,phone,code);
		String cusId="";
		if(retMsg=="0"){//验证码正确
			jsonString="true";
		}else{
			jsonString="false";
		}
		return jsonString;
	}
	
	/**
	 * 忘记密码第三步，确认修改密码
	 */
	@RequestMapping("/updatePassword")
	@ResponseBody
	public String updatePassword(HttpServletRequest request,HttpServletResponse response,
			@RequestParam Map data){
		Map cusmap=new HashMap();
		cusmap.put("loginName", data.get("loginName"));
		cusmap.put("delFlag", 0);
		String cusSpace = "com.richfit.bjsop.entity.BasUser.queryByLoginName";
		List <Map> BasList=dbOperate.select(cusSpace, cusmap);//查询客户信息
		
		MD5 md = new MD5();
		String loginPassword=md.getMD5ofStr(data.get("loginPassword").toString());
		
		if(BasList.size()>0){
			BasUser basUser=(BasUser)BasList.get(0);
			String userId=basUser.getUserId()!=null?basUser.getUserId().toString():null;
			
			Map cusmap1=new HashMap();
			cusmap1.put("userId", userId);
			cusmap1.put("loginPassword", loginPassword);
			String cusSpace1 = "com.richfit.bjsop.entity.BasUser.UpdateLoginPassword";
			int  i =dbOperate.update(cusSpace1, cusmap1);
		}
		
		//输入是手机号或身份证号
		if(BasList.size()==0){
			String phoneCardSpace = "com.richfit.bjsop.entity.CusCommonUser.queryListByPhoneCard";
			List<Map> phoneCardSpaceList=dbOperate.select(phoneCardSpace, cusmap);
			if(phoneCardSpaceList.size()>0){//查询身份证或手机号是否存在，存在获取userId
				Map pmap=phoneCardSpaceList.get(0);
				String userId=pmap.get("USER_ID").toString();
				
				Map cusmap1=new HashMap();
				cusmap1.put("userId", userId);
				cusmap1.put("loginPassword", loginPassword);
				String cusSpace1 = "com.richfit.bjsop.entity.BasUser.UpdateLoginPassword";
				int  i =dbOperate.update(cusSpace1, cusmap1);
			}
		}
		
		return "true";
	}
	
	/**
	 * 注册第一步
	 * 获取三证合一编码，判断是否存在，存在提示用户，不存在记录数据，保存到第二个页面，与第二个月面一并提交数据
	 */
	@RequestMapping("/validateSzhyCode")
	@ResponseBody
	public String validateSzhyCode(HttpServletRequest request,HttpServletResponse response,
			String szhyCode){
		String jsonString="";
		
		Map retMap = new HashMap();
		
		Map map=new HashMap();
		map.put("szhyCode", szhyCode);
		
		String nameSpace = "com.richfit.bjsop.entity.CusInfo.queryForSzhyCode";
		
		List<Map> entityList=dbOperate.select(nameSpace, map);
		
		if(entityList.size()>0){//用户名存在
			jsonString = "0";
		}else{
			jsonString = "1";
		}
		return jsonString;
	}
	/**
	 * 注册第一步
	 * 获取用户名密码，判断用户名是否存在，存在提示用户，不存在记录数据，保存到第二个页面，与第二个月面一并提交数据
	 */
	@RequestMapping("/validateName")
	@ResponseBody
	public String validateName(HttpServletRequest request,HttpServletResponse response,
			String loginName,String loginPassword){
		String jsonString="";
		
		Map retMap = new HashMap();
		
		Map map=new HashMap();
		map.put("loginName", loginName);
		
		String nameSpace = "com.richfit.bjsop.entity.BasUser.queryByList";
		
		List<Map> entityList=dbOperate.select(nameSpace, map);
		
		if(entityList.size()>0){//用户名存在
			jsonString = "0";
		}else{
			jsonString = "1";
		}
		return jsonString;
	}
	
	
	/**
	 * 注册第二步，获取手机号，发送验证码
	 * 客户个人注册
	 * 司机押运员注册
	 */
	@RequestMapping("/sendSMS")
	@ResponseBody
	public String sendSMS(HttpServletRequest request,HttpServletResponse response,
			String phone){
		//String retStr="验证码已发送到您的手机，请查收！";//SendSMS.sendMessage(request,response,phone);
		
		String retMessage="";
		boolean validateTime=this.getValidateTime(request); 
		if(validateTime==true){//可以发送---第一次发送或是超过3分钟了
			//发送验证码  
			retMessage=this.sendInfo(request,response,phone,registered);
		}else{
			retMessage="验证码有效时间3分钟，请输入有效期内的验证码！";
		}
		return retMessage;
	}
	
	/**
	 * 注册第二步，验证验证码，保存数据到客户表，用户表
	 * @throws Exception 
	 */
	@RequestMapping("/registered")
	@ResponseBody
	public String registered(HttpServletRequest request,HttpServletResponse response,
			@RequestParam Map data) throws Exception{
		
		Map retMap = new HashMap();
		String jsonString="";
		
		String phone=data.get("cusMobile").toString();
		String code=data.get("code").toString();
		
		String retMsg=SendSMS.validationSMS(request,response,phone,code);
		String cusId="";
		if(retMsg=="0"){//验证码正确
			String cusUUID=UuidTools.getUUID();
			//1、保存客户信息 
			cusId=cusUUID;
			Map addCusMap=new HashMap();
			addCusMap.put("cusId",cusUUID);
			//addCusMap.put("cusType", data.get("cusType").toString());
			String cusCompany=(String) data.get("cusCompany");
			if (cusCompany!=null && !cusCompany.equals("")) {
				Pattern p = Pattern.compile("\\s*|\r|\n");//去除字符串中的空格\t、回车\n、换行符\r、制表符\t
				Matcher m = p.matcher(cusCompany);
				cusCompany = m.replaceAll("");
			}
			addCusMap.put("cusCompany",cusCompany);
			addCusMap.put("cusType",data.get("cusType").toString());
			//addCusMap.put("cusArea", data.get("cusArea").toString());
			addCusMap.put("cusAddress",data.get("cusAddress").toString());
			addCusMap.put("cusLeader",data.get("cusLeader").toString());
			//addCusMap.put("registerOrg",data.get("registerOrg").toString());
			addCusMap.put("cusRegno",data.get("cusRegno").toString());
			addCusMap.put("registerCapital",data.get("registerCapital").toString());
			addCusMap.put("registerCur",data.get("registerCur").toString());
			addCusMap.put("cusOrg",data.get("cusOrg").toString());
			
			//addCusMap.put("taxNo", data.get("taxNo").toString());
			//addCusMap.put("orgNo",data.get("orgNo").toString());
			//addCusMap.put("cusCurrent",data.get("cusCurrent").toString());
			//addCusMap.put("companyType",data.get("companyType").toString());
			addCusMap.put("cusNature", data.get("cusNature").toString());
			addCusMap.put("cusBank",data.get("cusBank").toString());
			addCusMap.put("cusAccount",data.get("cusAccount").toString());
			addCusMap.put("cusBus1",data.get("cusBus1").toString());
			addCusMap.put("cusContact",data.get("cusContact").toString());
			addCusMap.put("szhyCode",data.get("szhyCode").toString());
			
			addCusMap.put("cusPost", data.get("cusPost").toString());
			
			addCusMap.put("cusMobile",phone);
			
			addCusMap.put("cusState",0);
			addCusMap.put("cusWorkstate",0);
			addCusMap.put("remark","");
			addCusMap.put("cys",data.get("cys"));
			
			CommPropertyAddUtil.addCommProp(addCusMap, null);
			
			String addCusSpace = "com.richfit.bjsop.entity.CusInfo.add";
			int cusNum=dbOperate.insert(addCusSpace, addCusMap);
			if (cusNum != 0) {
				String nameSpace = "com.richfit.bjsop.entity.CusOrgLink.addCompany";
				Map addOrgLink=new HashMap();
				addOrgLink.put("cusId", cusId);
				addOrgLink.put("linkId", UuidTools.getUUID());
				addOrgLink.put("basOrgId",data.get("cusOrg").toString());
				addOrgLink.put("state", "0");
				CommPropertyAddUtil.addCommPropCus(addOrgLink, cusId);
				int temp = dbOperate.insert(nameSpace, addOrgLink);
			
			}
			
			int userNum=0;
			Map addUserMap=new HashMap();
			if(cusNum==0){//添加失败
				jsonString="数据添加失败！";
				return jsonString;
			}else{
				//2、保存用户信息
				MD5 md = new MD5();
				String loginPassword=md.getMD5ofStr(data.get("loginPassword").toString());
				
				addUserMap.put("userId", UuidTools.getUUID());
				addUserMap.put("loginName", data.get("loginName").toString());
				addUserMap.put("loginPassword", loginPassword);
				addUserMap.put("cusId",cusUUID);
				addUserMap.put("userType", 0);
				addUserMap.put("state",0);
				addUserMap.put("remark","");
				
				CommPropertyAddUtil.addCommProp(addUserMap, null);
				
				String addUserSpace ="com.richfit.bjsop.entity.BasUser.add";
				userNum=dbOperate.insert(addUserSpace, addUserMap);
				
				
				//将客户信息插入收油单位类型表
				Map oilReceiveMap = new HashMap();
				oilReceiveMap.put("oilReceiveId", UuidTools.getUUID());
				oilReceiveMap.put("encode", "");
				oilReceiveMap.put("erpCode", "");//erp代码
				oilReceiveMap.put("logisitics2Code", "");//物流2.0代码
				oilReceiveMap.put("pipingSystemCode", "");//加管系统代码
				oilReceiveMap.put("oilReceiveName", data.get("cusCompany").toString());//公司名称
				oilReceiveMap.put("oilReceiveNameAk", data.get("cusCompany").toString());//公司简称
				oilReceiveMap.put("orgId", data.get("cusOrg").toString());//所属单位
				//oilReceiveMap.put("type", data.get("cusType").toString());//单位类型
				oilReceiveMap.put("type", "F62D8CB3E1254817ADEBF09BCFCFCB69");//单位类型  //前台注册都是客户
				oilReceiveMap.put("isuseable", "0");//是否可用，默认是
				oilReceiveMap.put("oilReceiveAddress", data.get("cusAddress").toString());//地址？用油网点地址?
				CommPropertyAddUtil.addCommPropUser(oilReceiveMap, addUserMap.get("userId").toString());
				String oilReceiveSpace = "com.richfit.bjsop.entity.BasOilreceive.insert";
				dbOperate.insert(oilReceiveSpace, oilReceiveMap);
			}
			int empNum = 0;
			if(userNum==0){
				jsonString="数据添加失败！";
				return jsonString;
			}else{
				
				//3、保存客户和客户经理关系
				Map addEmpMap = new HashMap();
				
				addEmpMap.put("empId", data.get("empId").toString());
				addEmpMap.put("cusId", cusId);
				addEmpMap.put("createId", addUserMap.get("userId"));
				addEmpMap.put("updateId", addUserMap.get("userId"));
				addEmpMap.put("createDate", new Date());
				addEmpMap.put("updateDate", new Date());
				addEmpMap.put("delFlag", 0);
				
				/*UserToken user = (UserToken)request.getSession().getAttribute("current_user_session");
				CommPropertyAddUtil.addCommProp(addEmpMap, user);
				empNum = cusMngSrv.addCustomerToEmpl(addEmpMap,user);*/
				String nameSpace = "com.richfit.bjsop.entity.CusEmplink.add";
				
				empNum =dbOperate.insert(nameSpace, addEmpMap);
				
				if(empNum==0){
					jsonString="数据添加失败！";
					return jsonString;
				}else{
					HttpSession session = request.getSession();
					session.setAttribute("cusId", cusId);
					jsonString="数据添加成功！";
				}
			}
		}else{
			jsonString="验证码错误，请重新输入！";
		}
		return jsonString;
	}
	
	/**
	 * 判断用户名密码是否存在，存在发送验证码，不存在提示用户错误信息
	 */
	@RequestMapping("/queryUserInfo")
	@ResponseBody
	public String queryUserInfo(HttpServletRequest request,HttpServletResponse response,
			String loginName,String loginPassword){
		String jsonString ="";
		Map retMap = new HashMap();
		ModelAndView modelAndView = null;
		String cusId="";
		
		MD5 md = new MD5();
		loginPassword=md.getMD5ofStr(loginPassword);
		
		Map map=new HashMap();
		map.put("loginName", loginName);
		map.put("loginPassword", loginPassword);
		
		String nameSpace = "com.richfit.bjsop.entity.BasUser.queryByList";
		
		List<Map> entityList=dbOperate.select(nameSpace, map);
			
		if(entityList.size()>0){//用户名密码正确，查询用户手机号，发送验证码
			BasUser pojoMap=(BasUser)entityList.get(0);
			String cus_id=pojoMap.getCusId()!=null?pojoMap.getCusId().toString():null;//获取客户ID
			
			if(cus_id!=null && cus_id!=""){//是客户
				Map cusmap=new HashMap();
				cusmap.put("cusId", cus_id);
				String cusSpace = "com.richfit.bjsop.entity.CusInfo.queryByList";
				List <Map> cusList=dbOperate.select(cusSpace, cusmap);//查询客户信息
				
				if(cusList.size()>0){
					CusInfo cusMap=(CusInfo)cusList.get(0);
					String phone=cusMap.getCusMobile()!=null?cusMap.getCusMobile().toString():null;//获取客户手机号
					//String retStr="验证码已发送到您的手机，请查收！";//SendSMS.sendMessage(request,response,phone);
					
					String content="";
					//发送验证码  
					String retMessage=this.sendInfo(request,response,phone,content);
					//String retStr=SendSMS.sendMessage(request,response,phone);
					retMap.put("phone", phone);
					retMap.put("cusId", cus_id);
					retMap.put("retStr", retMessage);
					jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
				}
			}else{//提示注册
				retMap.put("phone", null);
				retMap.put("cusId", cusId);
				retMap.put("retStr", "请先注册！");
				jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
			}
		}else{//用户名或密码错误，提示用户
			String retStr = "用户名或密码不正确，请重新输入！";
			retMap.put("phone", null);
			retMap.put("retStr", retStr);
			retMap.put("cusId", cusId);
			jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
		}
		
		return jsonString;
	}
	
	
	/**
	 * 登录操作
	 * 获取用户名密码验证码，判断验证码是否正确
	 */
	@RequestMapping("/login")
	@ResponseBody
	public String login(HttpServletRequest request,HttpServletResponse response,String loginName,String phone,String code,String cusId){
		Map map = new HashMap();
		ModelAndView modelAndView = null;
		
		String jsonString="";
		String retMsg=SendSMS.validationSMS(request,response,phone,code);
		if(retMsg=="0"){//验证码正确
			Map cusmap=new HashMap();
			cusmap.put("cusId", cusId);
			String cusSpace = "com.richfit.bjsop.entity.CusInfo.queryByList";
			List <Map> cusList=dbOperate.select(cusSpace, cusmap);//查询客户信息
			CusInfo cusMap=new CusInfo();
			if(cusList.size()>0){
				cusMap=(CusInfo)cusList.get(0);
				map.put("pojo", cusMap);
				map.put("codeState", "验证码正确！");
			}
			
			//将用户信息保存到session
			HttpSession session = request.getSession();
			session.setAttribute("loginName", loginName);
			session.setAttribute("cusId", cusId);
			session.setAttribute("cusGrade", cusMap.getCusGrade());
			session.setAttribute("cusPojo", cusMap);
			session.setAttribute("cusState", cusMap.getCusState());
			
			jsonString = JSONArray.toJSONString(map,SerializerFeature.WriteDateUseDateFormat);
		}else{
			map.put("codeState", "验证码错误！");
			map.put("pojo", null);
			jsonString = JSONArray.toJSONString(map,SerializerFeature.WriteDateUseDateFormat);
		}
		return jsonString;
	}
	
	
	
	/**
	 * 个人注册
	 * 验证验证码，保存数据到客户表，用户表
	 */
	@RequestMapping("/personRegistered")
	@ResponseBody
	public String personRegistered(HttpServletRequest request,HttpServletResponse response,
			@RequestParam Map data){
		
		Map retMap = new HashMap();
		String jsonString="";
		
		String phone=data.get("phoneNumber").toString();
		String code=data.get("code").toString();
		
		String retMsg=SendSMS.validationSMS(request,response,phone,code);
		String cusId="";
		if(retMsg=="0"){//验证码正确
			String userUUID = UuidTools.getUUID();
			String cusUUID=UuidTools.getUUID();
			//1、保存客户信息 
			cusId=cusUUID;
			Map addCusMap=new HashMap();
			addCusMap.put("commonUserId",cusUUID);
			//addCusMap.put("cusType", data.get("cusType").toString());
			addCusMap.put("commonUserName", data.get("commonUserName").toString());
			addCusMap.put("phoneNumber",data.get("phoneNumber").toString());
			addCusMap.put("cardId", data.get("cardId").toString());
			//addCusMap.put("cusId", data.get("belongCompany").toString());
			addCusMap.put("userId", userUUID);
			CommPropertyAddUtil.addCommProp(addCusMap, null);
			
			String addCusSpace = "com.richfit.bjsop.entity.CusCommonUser.insert";
			int cusNum=dbOperate.insert(addCusSpace, addCusMap);
			
			int userNum=0;
			if(cusNum==0){//添加失败
				jsonString="数据添加失败！";
				return jsonString;
			}else{
				//2、保存用户信息
				Map addUserMap=new HashMap();
				MD5 md = new MD5();
				String loginPassword=md.getMD5ofStr(data.get("loginPassword").toString());
				
				addUserMap.put("userId", userUUID);
				addUserMap.put("loginName", data.get("loginName").toString());
				addUserMap.put("loginPassword", loginPassword);
				//addUserMap.put("cusId",cusUUID);
				addUserMap.put("userType", 3);
				addUserMap.put("state",0);
				addUserMap.put("remark","");
				
				CommPropertyAddUtil.addCommProp(addUserMap, null);
				
				String addUserSpace ="com.richfit.bjsop.entity.BasUser.add";
				userNum=dbOperate.insert(addUserSpace, addUserMap);
			}
			if(userNum==0){
				jsonString="数据添加失败！";
				return jsonString;
			}else{
				HttpSession session = request.getSession();
				session.setAttribute("cusId", cusId);
				
				jsonString="数据添加成功！";
			}
		}else{
			jsonString="验证码错误，请重新输入！";
		}
		return jsonString;
	}
	/**
	 * 司机押运员注册
	 * 
	 */
	@RequestMapping("/driverRegistered")
	@ResponseBody
	public String driverRegistered(HttpServletRequest request,HttpServletResponse response,
			@RequestParam Map data){
		
		Map retMap = new HashMap();
		String jsonString="";
		
		String phone=data.get("driverMobile").toString();
		String code=data.get("code").toString();
		HttpSession session = request.getSession();
		String retMsg=SendSMS.validationSMS(request,response,phone,code);
		String cusId="";
		if(retMsg=="0"){//验证码正确
			String driverId = UuidTools.getUUID();
			CommPropertyAddUtil.addCommProp(data, null);
			Map addCusMap=new HashMap();
			addCusMap.put("driverId", driverId);
			data.put("driverId", driverId);
			data.put("cusId", "zhuce");
			data.put("extend", 0);//未审核状态
			String addCusSpace = "com.richfit.bjsop.entity.CusDriver.insertDriver";
			int cusNum=dbOperate.insert(addCusSpace, data);
			
			if(cusNum==0){//添加失败
				jsonString="数据添加失败！";
				return jsonString;
			}else{
				session.setAttribute("driverId", driverId);
				jsonString="数据添加成功！";
			}
		}else{
			jsonString="验证码错误，请重新输入！";
		}
		return jsonString;
	}
	/*@RequestMapping("/queryOrgList")
	@ResponseBody
	public String queryOrgList(HttpServletRequest request,@RequestParam Map data,
		@RequestParam(value="dataType",defaultValue="json",required=false)String dataType,
		int limit,int offset,String search,String order,String sort)throws ParseException {
		
		this.startPage(offset,limit);//limit   每页显示行数
									 //offset  从第几条开始 
		
		Map map=new HashMap();
		map.put("search", search);
		map.put("order", order);
		map.put("sort", sort);
		
		String nameSpace = "com.richfit.bjsop.entity.BasOrg.queryByList";
		
		List<Map> entityList=dbOperate.select(nameSpace, map);
			
		PageInfo page = new PageInfo(entityList);
	    int num=(int)page.getTotal();
		
		Map retMap=new HashMap();
		retMap.put("rows", entityList);
		retMap.put("total", num);
		
		return JSONArray.toJSONString(retMap);
	}
	
	public void startPage(int offset,int limit){
		if(offset==0){
			PageHelper.startPage(offset+1,limit);
		}else{
			PageHelper.startPage((limit+offset)/limit,limit);
		}
	}*/
	
	@RequestMapping("/queryIndexUserInfo")
	@ResponseBody
	public String queryIndexUserInfo(HttpServletRequest request,@RequestParam Map data,
			@RequestParam(value="dataType",defaultValue="json",required=false)String dataType){
		
		CusInfo cus = (CusInfo)request.getSession().getAttribute("cusPojo");
		Map retMap = new HashMap();
		
		if(null==cus){
			retMap.put("isLogin", "1");
		}else{
			retMap.put("isLogin", "0");
			retMap.put("pojo", cus);
		}
		
		String cusType="";//是普通客户还是控股公司
		if(cus.getSzhyCode()!=null){
			Map map=new HashMap();
			map.put("szhyCode", cus.getSzhyCode());
			String basOrgSpace = "com.richfit.bjsop.entity.BasOrg.queryBySzhyCode";
			List <Map> basOrgList=dbOperate.select(basOrgSpace, map);
			if(basOrgList.size()>0){
				BasOrg basOrg=(BasOrg)basOrgList.get(0);
				if(cus.getSzhyCode().equals(basOrg.getCertificateCode())){
					cusType="控股公司";
				}else{
					cusType="普通客户";
				}
			}else{
				cusType="普通客户";
			}
		}
		
		HttpSession session = request.getSession();
		session.setAttribute("cusType",cusType);
		
		return JSONArray.toJSONString(retMap);
	}
	
	
	/**
	 * 账号激活
	 * 催办
	 */
	@RequestMapping("/sendSMSById")
	@ResponseBody
	public String sendSMSById(HttpServletRequest request,HttpServletResponse response,
			String cusId,String CusType){
		String jsonString="";
		Map retMap = new HashMap();
		
		Map cusmap=new HashMap();
		cusmap.put("cusId", cusId);
		String cusSpace = "com.richfit.bjsop.entity.CusInfo.queryCusInfo";
		List <Map> cusList=dbOperate.select(cusSpace, cusmap);//查询客户信息
		
		if(cusList.size()>0){
			CusInfo cusMap=(CusInfo)cusList.get(0);
			String phone=cusMap.getCusMobile()!=null?cusMap.getCusMobile().toString():null;//获取客户手机号
			String empId=cusMap.getEmpId()!=null?cusMap.getEmpId().toString():null;
			String empName=cusMap.getEmpName()!=null?cusMap.getEmpName().toString():null;
			String empMobile=cusMap.getEmpMobile()!=null?cusMap.getEmpMobile().toString():null;
			
			String retStr="";
			String content="";
			if(CusType=="0"){//账号激活    客户经理-->客户
				content=sendSMS.accountActivation;
			}else if(CusType=="1"){//催办（待确认）    客户-->客户经理
				content=sendSMS.confirm.replace("@", empName);
			}else if(CusType=="2"){//催办（待付款）    客户-->客户经理
				content=sendSMS.payment.replace("@", empName);
			}else if(CusType=="3"){//催办（待转付油通知单）    客户-->客户经理
				content=sendSMS.notice.replace("@", empName);
			}
			
			retStr=this.sendMessage(request,response,empMobile,content);
			retMap.put("phone", empMobile);
			
			retMap.put("cusId", cusId);
			retMap.put("empId", empId);
			retMap.put("empName", empName);
			retMap.put("retStr", retStr);
			
			jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
		}
		return jsonString;
	}
	
	@RequestMapping("sendMessage")
	@ResponseBody
	public static String sendMessage(HttpServletRequest request,HttpServletResponse response,
			String phone,String content){
		String retMessage = "";
		
		//1、发送时间
		String sendTime=DateUtils.dateToStr(new Date());//定时发送时间
		 
		//2、用http协议发送信息并接受返回信息
		//String retMsg="1";//sendSMS.postRequest(Url, params);
		 
		 // 屏蔽短信发送
		 int retNum=1;
		//int retNum=sendSMS(phone,content,sendTime);
		
		//5、通过返回信息成功与否提示用户，将提示信息返回到页面
		/*if(retMsg!=null){
			if(retMsg=="1"){//成功（假设）
				retMessage="验证码已发送到您的手机，请查收！"+vCode;
			}else{
				retMessage="短信发送过程发生异常，请稍后再试！";
			}
		}*/
		if(retNum>0){//成功（假设）
			retMessage="已通知您的客户经理！"+content;
		}else{
			retMessage="发送过程发生异常，请稍后再试！";
		}
		
		return retMessage;
	}
	
	
	
	
	//用户名密码正确
	public void trueNameAndpassword(List entityList,String cusId,String loginName,Map retMap,
			HttpServletRequest request){
		BasUser pojoMap=(BasUser)entityList.get(0);
		String cus_id=pojoMap.getCusId()!=null?pojoMap.getCusId().toString():null;//获取客户ID
		cusId=cus_id;
		// 根据usertype判断是否从cus_common_user表中获取type=3（普通用户）的以及type=4（司机）
		String userType = pojoMap.getUserType()!=null?pojoMap.getUserType().toString():null;//获取客户type
		String userId = pojoMap.getUserId()!=null?pojoMap.getUserId().toString():null;//获取客户type
		Map cusmap=new HashMap();
		List <Map> cusList=new ArrayList<Map>();
		CusInfo cusMap=new CusInfo();
		//将用户信息保存到session
		HttpSession session = request.getSession();
		if (cusId!=null&&!"".equals(cusId)) { // 说明是公司管理员登录
			cusmap.put("cusId", cus_id);
			String cusSpace = "com.richfit.bjsop.entity.CusInfo.queryByList";
			cusList=dbOperate.select(cusSpace, cusmap);//查询客户信息
			if(cusList.size()>0){
				cusMap=(CusInfo)cusList.get(0);
				cusMap.setUserId(pojoMap.getUserId());
				session.setAttribute("orgAttribute", cusMap.getOrgAttribute());
				session.setAttribute("cusCompany", cusMap.getCusCompany());
				
				//查询资质是否完整
				String querySpace="com.richfit.bjsop.entity.CusBuslicence.queryByList";
				List<Map> list=dbOperate.select(querySpace, cusmap);
				String querySpace1="com.richfit.bjsop.entity.CusTaxlicence.queryByList";
				List<Map> list1=dbOperate.select(querySpace1, cusmap);
				String querySpace2="com.richfit.bjsop.entity.CusAcclicence.queryByList";
				List<Map> list2=dbOperate.select(querySpace2, cusmap);
				String querySpace3="com.richfit.bjsop.entity.CusWholicence.queryByList";
				List<Map> list3=dbOperate.select(querySpace3, cusmap);
				
				if (list.size()>0 && list1.size()>0 && list2.size()>0 && list3.size()>0) {
					retMap.put("jsonString", "0");
				}else{
					retMap.put("jsonString", "1");
				}
			}
		}else { // 说明的普通用户登录
			retMap.put("userForCompany", "1");
		}

		// 普通用户ID保存
		
		
		session.setAttribute("loginName", loginName);
		session.setAttribute("cusId", cusId);
		session.setAttribute("cusGrade", cusMap.getCusGrade());
		session.setAttribute("cusPojo", cusMap);
		session.setAttribute("cusState", cusMap.getCusState());
		session.setAttribute("userId", pojoMap.getUserId());
		
		Map usermap=new HashMap();
		usermap.put("userId", pojoMap.getUserId());
		String userSpace = "com.richfit.bjsop.entity.BasUser.queryUserListByUserId";
		List <Map> userList=dbOperate.select(userSpace, usermap);//查询客户信息
		
		if(userList.size()>0){
			retMap.put("userStr", "1");
			session.setAttribute("company", "has");
		}else{
			retMap.put("userStr", "0");
			session.setAttribute("company", "nothas");
		}
		retMap.put("cusId", cus_id);
		retMap.put("userId", pojoMap.getUserId());
		retMap.put("retStr", "正确");
		getLoginInfoController.getLoginInfo(request);
	}
	
	/**
	 * 通过客户ID找到客户手机号并且发送验证码
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/onlySendSMSByCusId")
	@ResponseBody
	public String onlySendSMSByCusId(HttpServletRequest request,HttpServletResponse response){
		String jsonString="";
		Map retMap = new HashMap();
		
		/** 获取session中的客户信息 */  
		HttpSession session = request.getSession();
        String userId = (String)session.getAttribute("userId");  
        
        String phone=getPhoneByCusId(userId);
        
		String retStr="";
		if(phone!="" && phone!=null){
			boolean validateTime=this.getValidateTime(request); 
			if(validateTime==true){//可以发送---第一次发送或是超过3分钟了
				//发送验证码  
				retStr=this.sendInfo(request,response,phone,print);
			}else{
				retStr="验证码有效时间3分钟，请输入有效期内的验证码！";
			}
			//发送验证码  
			//retStr=this.sendInfo(request,response,phone,print);
			//retStr=SendSMS.sendMessage(request,response,phone,"123");
		}
		retMap.put("userId", userId);
		retMap.put("retStr", retStr);
		//retMap.put("phone", phone);
		
		jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
		return jsonString;
	}
	
	
	
	
	
	
	
	
	/**
	 * 通过登录用户名查询手机号
	 * @param loginName
	 * @return
	 */
	public Map getPhoneByLoginName(String loginName){
		Map retMap=new HashMap();
		String phone="";
		String userId="";
		String cusId="";
		
		Map cusmap=new HashMap();
		cusmap.put("loginName", loginName);
		cusmap.put("delFlag", 0);
		String cusSpace = "com.richfit.bjsop.entity.BasUser.queryByLoginName";
		List <Map> BasList=dbOperate.select(cusSpace, cusmap);//查询客户信息
		
		//输入是手机号或身份证号
		if(BasList.size()==0){
			String phoneCardSpace = "com.richfit.bjsop.entity.CusCommonUser.queryListByPhoneCard";
			List<Map> phoneCardSpaceList=dbOperate.select(phoneCardSpace, cusmap);
			if(phoneCardSpaceList.size()>0){//查询身份证或手机号是否存在，存在获取userId
				Map pmap=phoneCardSpaceList.get(0);
				phone=pmap.get("PHONE_NUMBER").toString();
				userId=pmap.get("USER_ID").toString();
			}
		}
		
		//输入的是bas_user有的登录名，查询cus_info
		if(BasList.size()>0){
			BasUser basUser=(BasUser)BasList.get(0);
			cusId=basUser.getCusId()!=null?basUser.getCusId().toString():null;//获取客户ID
			userId=basUser.getUserId()!=null?basUser.getUserId().toString():null;
			if(cusId!=null){
				String cusSpace1 = "com.richfit.bjsop.entity.CusInfo.queryListByCusId";
				cusmap.put("cusId", cusId);
				List <Map> cusList=dbOperate.select(cusSpace1, cusmap);//查询客户信息
				if(cusList.size()>0){
					CusInfo cusMap=(CusInfo)cusList.get(0);
					phone=cusMap.getCusMobile()!=null?cusMap.getCusMobile().toString():null;
				}
			}
		}
		retMap.put("cusId", cusId);
		retMap.put("userId", userId);
		retMap.put("phone", phone);
		return retMap;
	}
	
	public String getPhoneByCusId(String userId){
		String phone="";
		Map cusmap=new HashMap();
		cusmap.put("userId", userId);
		cusmap.put("delFlag", 0);
		String cusSpace = "com.richfit.bjsop.entity.BasUser.queryByCusId";
		List <Map> BasList=dbOperate.select(cusSpace, cusmap);//查询客户信息
		
		if(BasList.size()>0){
			BasUser basUser=(BasUser)BasList.get(0);
			String userType=basUser.getUserType().toString();
			String cusId=basUser.getCusId().toString();
			cusmap.put("cusId", cusId);
			if(userType.equals("0")){//主账户（CUS_INFO查询手机号）
				String cusSpace1 = "com.richfit.bjsop.entity.CusInfo.queryCusInfo";
				List <Map> cusList=dbOperate.select(cusSpace1, cusmap);//查询客户信息
				CusInfo cusMap=(CusInfo)cusList.get(0);
				phone=cusMap.getCusMobile()!=null?cusMap.getCusMobile().toString():null;//获取客户手机号
			}else{//子账户（BAS_USER查询手机号）
				phone=basUser.getCusEmpMobile().toString();
			}
		}
		return phone;
	}
	
	/**
	 * 查询登录客户所关联的用户集合
	 * @param request
	 * @param response
	 * @param data
	 * @return
	 */
	@RequestMapping("/queryUserList")
	@ResponseBody
	public String queryUserList(HttpServletRequest request,HttpServletResponse response,
			@RequestParam Map data){
		String jsonString ="";
		Map retMap = new HashMap();
		
		Map map = new HashMap();
		map.put("userId", data.get("userId"));
		map.put("cusCompany", data.get("cusCompany"));
		String nameSpace = "com.richfit.bjsop.entity.CusInfo.queryUserList2";
		List<Map> entityList=dbOperate.select(nameSpace, map);
			
		if(entityList.size()>0){
			retMap.put("pojoList", entityList);
			retMap.put("retStr", "1");
		}else{
			retMap.put("pojoList", null);
			retMap.put("retStr","0");
		}
		jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
		return jsonString;
	}
	
	@RequestMapping("/subChooseUser")
	@ResponseBody
	public String subChooseUser(HttpServletRequest request,HttpServletResponse response,
			@RequestParam Map data){
		String jsonString ="";
		Map retMap = new HashMap();
		
		Map cusmap=new HashMap();
		cusmap.put("cusId", data.get("cusId"));
		String cusSpace = "com.richfit.bjsop.entity.CusInfo.queryListByCusId";
		List <Map> cusList=dbOperate.select(cusSpace, cusmap);//查询客户信息
		CusInfo cusMap=new CusInfo();
		if(cusList.size()>0){
			cusMap=(CusInfo)cusList.get(0);
		}
		
		Map cusmap1=new HashMap();
		cusmap1.put("cusId", data.get("cusId"));
		cusmap1.put("delFlag", 0);
		String cusSpace1 = "com.richfit.bjsop.entity.BasUser.queryByCusId";
		List <Map> BasList=dbOperate.select(cusSpace1, cusmap1);//查询客户信息
		BasUser basUser=new BasUser();
		if(BasList.size()>0){
			basUser=(BasUser)BasList.get(0);
		}
		
		String cusType="";//是普通客户还是控股公司
		if(cusMap.getSzhyCode()!=null){
			Map map=new HashMap();
			map.put("szhyCode", cusMap.getSzhyCode());
			String basOrgSpace = "com.richfit.bjsop.entity.BasOrg.queryBySzhyCode";
			List <Map> basOrgList=dbOperate.select(basOrgSpace, map);
			if(basOrgList.size()>0){
				BasOrg basOrg=(BasOrg)basOrgList.get(0);
				if(cusMap.getSzhyCode().equals(basOrg.getCertificateCode())){
					cusType="控股公司";
				}else{
					cusType="普通客户";
				}
			}else{
				cusType="普通客户";
			}
		}
		//查询合同价格
		String hetongSpace = "com.richfit.bjsop.entity.price.BasContractFile.queryByCusId";
		Map hetongmap=new HashMap();
		hetongmap.put("cusId", data.get("cusId"));
		Date date = new Date();
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		String time = simpleDateFormat.format(date);
		hetongmap.put("time", time);
		List <Map> hetongList=dbOperate.select(hetongSpace, hetongmap);
		
		//将用户信息保存到session
		HttpSession session = request.getSession();
		session.setAttribute("loginNameCompany", basUser.getLoginName());
		session.setAttribute("cusId", data.get("cusId"));
		session.setAttribute("cusGrade", cusMap.getCusGrade());
		session.setAttribute("cusPojo", cusMap);
		session.setAttribute("cusState", cusMap.getCusState());
		session.setAttribute("company", "has");
		session.setAttribute("szhyCode", cusMap.getSzhyCode());
		session.setAttribute("cusType",cusType);
		session.setAttribute("cusCompany",cusMap.getCusCompany());
		session.setAttribute("orgAttribute",cusMap.getOrgAttribute());
		
		if(hetongList.size()>0){
			session.setAttribute("hetong", "yes");
		}else{
			session.setAttribute("hetong", "no");
		}
		
		jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
		return jsonString;
	}
	
	/**
	 * 验证时间是否在3分钟之内
	 * true可以发送
	 * @param request
	 * @return
	 */
	public boolean getValidateTime(HttpServletRequest request){
		boolean retStr = false;
		HttpSession session = request.getSession();
		String sendTime=session.getAttribute("codeDate")!=null?session.getAttribute("codeDate").toString():null;
		if(sendTime==null){//没有发送过验证码
			retStr=true;//可以发送
		}else{
			//判断是否3分钟内
			String nowTime=DateUtils.dateTimeToStr(new Date());//定时发送时间
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			try {
				Date d1 = df.parse(nowTime);
				Date d2 = df.parse(sendTime);
				long l=d1.getTime()-d2.getTime();
				long day=l/(24*60*60*1000);
				long hour=(l/(60*60*1000)-day*24);
				long min=((l/(60*1000))-day*24*60-hour*60);
				if(min>3){//超过3分钟
					retStr=true;//可以发送
				}
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return retStr;
	}
	/**
	 * 执行查询分公司
	 * 
	 * @param dataType
	 * @return jsonString
	 * @throws ParseException
	 */
	@RequestMapping("/selectCompany")
	@ResponseBody
	public String selectCompany(
			HttpServletRequest request,
			@RequestParam Map params,
			@RequestParam(value = "dataType", defaultValue = "json", required = false) String dataType)
			throws Exception {
		String nameSpace = "com.richfit.bjsop.entity.BasOrg.selectCompany";

		CommPropertyAddUtil.addQueryPar(params, null);

		List<Map> entityList = dbOperate.select(nameSpace, null);
		//System.out.println(entityList.size()+"!!!!!!!!!!!!!!!");
		String jsonString = JSONArray.toJSONString(entityList,
				SerializerFeature.WriteDateUseDateFormat);
		return jsonString;

	}
	/**
	 * 执行查询分公司所有的客户经理
	 * 
	 * @param dataType
	 * @return jsonString
	 * @throws ParseException
	 */
	@RequestMapping("/selectPeople")
	@ResponseBody
	public String selectPeople(
			HttpServletRequest request,
			@RequestParam Map params,
			@RequestParam(value = "dataType", defaultValue = "json", required = false) String dataType)
					throws Exception {
		String nameSpace = "com.richfit.bjsop.entity.BasEmp.selectPeople";
		                    
		CommPropertyAddUtil.addQueryPar(params, null);
		List<Map> entityList = dbOperate.select(nameSpace, params);
		String jsonString = JSONArray.toJSONString(entityList,
				SerializerFeature.WriteDateUseDateFormat);
		return jsonString;
		
	}
	/**
	 * 执行查询是否已绑定分公司
	 * 
	 * @param dataType
	 * @return jsonString
	 * @throws ParseException
	 */
	@RequestMapping("/checkedCompany")
	@ResponseBody
	public String checkedCompany(
			HttpServletRequest request,
			@RequestParam Map params,
			@RequestParam(value = "dataType", defaultValue = "json", required = false) String dataType)
					throws Exception {
		String nameSpace = "com.richfit.bjsop.entity.CusOrgLink.selectCompany";
		/** 获取session中的客户信息 */  
		HttpSession session = request.getSession();
        String cusId = (String)session.getAttribute("cusId"); 
        params.put("cusId", cusId);
		CommPropertyAddUtil.addQueryPar(params, null);
		List<Map> entityList = dbOperate.select(nameSpace, params);
		String jsonString = "";
		if (entityList.size()>0) {
			jsonString="0";//该公司已绑定
		}
		//控制只能绑定一个全资公司
		//1.查询要绑定的公司的性质
		nameSpace = "com.richfit.bjsop.entity.BasOrg.selectByPrimaryKey";
		Map paramsMap=new HashMap();
		paramsMap.put("orgId", params.get("basOrgId"));
		List<Map> orgList = dbOperate.select(nameSpace, paramsMap);
		if (orgList.size()>0) {
			BasOrg basOrg= (BasOrg) orgList.get(0);
			Integer orgType = basOrg.getOrgType();
			if (orgType == 3 || orgType == 0) {//要绑定的公司为全资公司时（总部当做全资处理）
				//2、查询已绑定的公司有无全资公司
				nameSpace = "com.richfit.bjsop.entity.CusOrgLink.selectAllCompany";
				paramsMap.put("cusId", cusId);
				List<Map> selectList = dbOperate.select(nameSpace, paramsMap);
				if (selectList.size()>0) {
					jsonString="1";//已经绑定过全资公司
				}
			}
		}
		
		return jsonString;
		
	}
	/**
	 * 添加分公司
	 * 
	 * @param dataType
	 * @return jsonString
	 * @throws ParseException
	 */
	@RequestMapping("/addCompany")
	@ResponseBody
	public String addCompany(
			HttpServletRequest request,
			@RequestParam Map params,
			@RequestParam(value = "dataType", defaultValue = "json", required = false) String dataType)
					throws Exception {
		String nameSpace = "com.richfit.bjsop.entity.CusOrgLink.addCompany";
		/** 获取session中的客户信息 */  
		HttpSession session = request.getSession();
        String cusId = (String)session.getAttribute("cusId"); 
        params.put("cusId", cusId);
        params.put("linkId", UuidTools.getUUID());
        params.put("state", "0");
		CommPropertyAddUtil.addCommPropCus(params, cusId);
		int temp = dbOperate.insert(nameSpace, params);
		String jsonString = "添加成功";
		if (temp==0) {
			jsonString="添加失败！";
		}
		
		return jsonString;
		
	}
/*	@RequestMapping("/testZiZhi")
	@ResponseBody
	public String testZiZhi(HttpServletRequest request,HttpServletResponse response) throws Exception{
		Map paramMap = new HashMap();
		*//** 获取session中的客户信息 *//*  
		HttpSession session = request.getSession();
        String cusId = (String)session.getAttribute("cusId"); 
		paramMap.put("cusId", cusId);
		String jsonString = "";
		
		String querySpace="com.richfit.bjsop.entity.CusBuslicence.queryByList";
		List<Map> list=dbOperate.select(querySpace, paramMap);
		String querySpace1="com.richfit.bjsop.entity.CusTaxlicence.queryByList";
		List<Map> list1=dbOperate.select(querySpace1, paramMap);
		String querySpace2="com.richfit.bjsop.entity.CusAcclicence.queryByList";
		List<Map> list2=dbOperate.select(querySpace2, paramMap);
		String querySpace3="com.richfit.bjsop.entity.CusWholicence.queryByList";
		List<Map> list3=dbOperate.select(querySpace3, paramMap);
		
		if (list.size()>0 && list1.size()>0 && list2.size()>0 && list3.size()>0) {
		    jsonString = "0";
		}else{
			jsonString = "1";
		}
				
		return jsonString;
		
	}*/
	
	/**
	 * 查询承运商信息--下拉框
	 * @param request
	 * @param params
	 * @param dataType
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/selectCys")
	@ResponseBody
	public String selectCys(
			HttpServletRequest request,
			@RequestParam Map params,
			@RequestParam(value = "dataType", defaultValue = "json", required = false) String dataType)
			throws Exception {
		String nameSpace = "com.richfit.bjsop.entity.BasCarrier.selectCarrierListBy";

		CommPropertyAddUtil.addQueryPar(params, null);

		List<Map> entityList = dbOperate.select(nameSpace, null);
		String jsonString = JSONArray.toJSONString(entityList,
				SerializerFeature.WriteDateUseDateFormat);
		return jsonString;
	}
	
	
	

	
	
	public void sendMessages(HttpServletRequest request,HttpServletResponse response,
			String phone,Map retMap){
		String retStr="";
		String retMsg="";
		boolean validateTime=this.getValidateTime(request); 
		if(validateTime==true){//可以发送---第一次发送或是超过3分钟了
			//发送验证码  
			retMsg=this.sendMsg(request,response,phone,loginInfo);
		}else{
			retStr="验证码有效时间3分钟，请输入有效期内的验证码！";
		}
		if(retMsg.equals("yes")){
			retStr="验证码已发送到您的手机（"+phone+"），请查收！";
		}else if(retMsg.equals("no")){
			retStr="短信发送过程发生异常，请稍后再试！";
		}else{
			
		}
		retMap.put("retStr", retStr);
		retMap.put("phone", phone);
		retMap.put("yesno", retMsg);
	}
	
	//随机生成6位数字，并发送短信
	public String sendMsg(HttpServletRequest request,HttpServletResponse response,String phone,String content){
		//1、生成6位数字验证码
		String vCode=SendSMS.createRandomVcode();
		//2、保存手机号验证码到session
		HttpSession session = request.getSession();
		session.setAttribute("vCode", vCode);
		//屏蔽发短信，固定验证码123
		//session.setAttribute("vCode", "123");
		
		System.out.println("【验证码】"+vCode);
		//增加时间判断，3分钟内验证码有效
		String sendTime=DateUtils.dateTimeToStr(new Date());//定时发送时间
		session.setAttribute("codeDate", sendTime);
		
		//3、发送验证码
		String retNum=SendSMS.sendMessage(request,response,phone,content,vCode);
		//屏蔽发短信，固定验证码123
		//retNum="true";//内网写死提示发送成功
		//String retNum="true";
		//4、通过返回值整理返回的提示信息
		String retMessage = "";
		if(retNum=="true"){//成功
			retMessage="yes";
		}else{
			retMessage="no";
		}
		return retMessage;
	}
	
	/**
	 * 整理发送短信的数据，发送短信
	 * @param request
	 * @param response
	 * @param phone
	 * @return
	 */
	public String sendInfo(HttpServletRequest request,HttpServletResponse response,String phone,String content){
		//1、生成6位数字验证码
		String vCode=SendSMS.createRandomVcode();
		//2、保存手机号验证码到session
		HttpSession session = request.getSession();
		session.setAttribute("vCode", vCode);
		//屏蔽发短信，固定验证码123
		//session.setAttribute("vCode", "123");
		
		System.out.println("【验证码】"+vCode);
		//增加时间判断，3分钟内验证码有效
		String sendTime=DateUtils.dateTimeToStr(new Date());//定时发送时间
		session.setAttribute("codeDate", sendTime);
		
		//3、发送验证码
		String retNum=SendSMS.sendMessage(request,response,phone,content,vCode);
		//屏蔽发短信，固定验证码123
		//retNum="true";//内网写死，提示验证码发送成功
		//String retNum="true";
		//4、通过返回值整理返回的提示信息
		String retMessage = "";
		if(retNum=="true"){//成功
			retMessage="验证码已发送到您的手机（"+phone+"），请查收！";
		}else{
			retMessage="短信发送过程发生异常，请稍后再试！";
		}
		return retMessage;
	}
}
