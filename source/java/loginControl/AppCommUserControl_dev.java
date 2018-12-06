package com.richfit.bjsop.controller.user;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URL;
import java.net.URLConnection;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.cnpc.jcdp.util.MD5;
import com.richfit.bjsop.dao.comm.DBOperate;
import com.richfit.bjsop.entity.BasOrg;
import com.richfit.bjsop.entity.BasUser;
import com.richfit.bjsop.entity.CusCommonUser;
import com.richfit.bjsop.entity.CusInfo;
import com.richfit.bjsop.entity.UserToken;
import com.richfit.bjsop.util.CommPropertyAddUtil;
import com.richfit.bjsop.util.DateUtils;
import com.richfit.bjsop.util.MySessionContext;
import com.richfit.bjsop.util.UuidTools;

@Controller
@RequestMapping("/comm/user")
public class AppCommUserControl {

	@Autowired
	private DBOperate dbOperate;
	
	@Autowired
	private CommUserLoginControl commUserLoginControl;
	
	@Autowired
	private SendSMS sendSMS;
	/**
	 * 登录操作
	 * 获取用户名密码验证码，判断验证码是否正确
	 */
	@RequestMapping("/login1")
	@ResponseBody
	public String login1(HttpServletRequest request,HttpServletResponse response,
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
	 * 查询人员权限操作
	 * 
	 * @param dataType
	 * @return jsonString
	 * @throws ParseException
	 */
	@RequestMapping("/queryPersonAuthorityForIndex")
	@ResponseBody
	public String queryPersonAuthorityForIndex(
			HttpServletRequest request,
			@RequestParam Map params,
			@RequestParam(value = "dataType", defaultValue = "json", required = false) String dataType)
			throws Exception {
		 HttpSession session = request.getSession();
		 String jsonString="";
		 /** 获取session中的客户信息 */
		String cusId = (String)session.getAttribute("cusId");
		String userId = (String)session.getAttribute("userId");
		params.put("userId", userId);

		// 先看一下是不是普通客户(usertype==3)
		String nameSpace = "com.richfit.bjsop.entity.BasUser.queryByList";
		
		List<Map> entityList=dbOperate.select(nameSpace, params);
		params.put("cusId", cusId);
		if(entityList.size()>0){
			BasUser pojoMap=(BasUser)entityList.get(0);
			String cus_type=pojoMap.getUserType()!=null?pojoMap.getUserType().toString():null;//获取客户type
			if ("3".equals(cus_type)) {
				nameSpace = "com.richfit.bjsop.entity.CusCommonUser.queryPersonAuthority";

				entityList = null;

				CommPropertyAddUtil.addQueryPar(params, null);

				if ("json".equals(dataType)) {
					entityList = dbOperate.select(nameSpace, params);
					
					jsonString = JSONArray.toJSONString(entityList,
							SerializerFeature.WriteDateUseDateFormat);

				} else {
					return null;
				}
			}
			else {
				Map map =new HashMap();
				map.put("commonUserId", "-1");
				map.put("cusAuthority", "0,1,2,3");
				List<Map> entityList1 = new ArrayList<>();
				entityList1.add(map);
				jsonString = JSONArray.toJSONString(entityList1,
						SerializerFeature.WriteDateUseDateFormat);
			}
			return jsonString;
		}
		return null;

	}
	/**
	 * 判断用户名密码是否存在，验证码是否正确,都对进入系统
	 */
	@RequestMapping("/login2")
	@ResponseBody
	public String login2(HttpServletRequest request,HttpServletResponse response,
			String loginName,String loginPassword,String vCode,String sid){
		String jsonString ="";
		Map retMap = new HashMap();
		
		MySessionContext myc= MySessionContext.getInstance();  
		HttpSession session = myc.getSession(sid);  
		
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
								this.trueNameAndpassword(userList,cusId,loginName,retMap,session,request);
								pandan="true";
							}
						}
					}
				}
				
				if(entityList.size()>0){//保存数据到session
					this.trueNameAndpassword(entityList,cusId,loginName,retMap,session,request);
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
	
	public void trueNameAndpassword(List entityList,String cusId,String loginName,Map retMap,
			HttpSession session,HttpServletRequest request){
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
		if (cusId!=null&&!"".equals(cusId)) { // 说明是公司管理员登录
			cusmap.put("cusId", cus_id);
			String cusSpace = "com.richfit.bjsop.entity.CusInfo.queryByList";
			cusList=dbOperate.select(cusSpace, cusmap);//查询客户信息
			if(cusList.size()>0){
				cusMap=(CusInfo)cusList.get(0);
				cusMap.setUserId(pojoMap.getUserId());
				session.setAttribute("orgAttribute", cusMap.getOrgAttribute());
				
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
		this.getLoginInfo(session,request);
	}
	
	public String getLoginInfo(HttpSession session,HttpServletRequest request){
		int entityList;
		String userId = (String) session.getAttribute("userId");
		Map<String,Object> paramMap=new HashMap<String,Object>();
		String addr = getRemortIP(request);
		paramMap.put("LOGIN_IP",addr);
		paramMap.put("LAST_LOGIN_TIME", new Date());
		paramMap.put("USER_ID",userId);
		//修改登录IP地址和时间
		String nameSpace = "com.richfit.bjsop.entity.BasUser.UpdateIpTime";
		entityList=dbOperate.executeEntity(nameSpace, paramMap);
		//返回json字符串
		String jsonString = JSONArray.toJSONString(paramMap,SerializerFeature.WriteDateUseDateFormat);
		return jsonString;
	}
	
	public String getRemortIP(HttpServletRequest request) {
	  if (request.getHeader("x-forwarded-for") == null) {
		  return request.getRemoteAddr();
	  }
	  return request.getHeader("x-forwarded-for");
	}
	
	/**
	 * 如果该用户被多个公司账号绑定，为多个公司账号买油，查询绑定公司账号（选择为谁买油）
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
	

	/**
	 * 为多家公司账号买油，选择其中一家公司
	 * @param request
	 * @param response
	 * @param data
	 * @return
	 */
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
		
		//将用户信息保存到session
		MySessionContext myc= MySessionContext.getInstance();  
		HttpSession session = myc.getSession(data.get("sid").toString());  
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
		
		retMap.put("userForCompany", 0);//0没有意义
		jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
		return jsonString;
	}
	
	
	/**
	 * 注册第二部
	 * 获取手机号，发送验证码
	 */
	@RequestMapping("/sendSMS")
	@ResponseBody
	public String sendSMS(HttpServletRequest request,HttpServletResponse response,
			String phone){
		String jsonString ="";
		
		String vCode=SendSMS.createRandomVcode();
		String repContent=commUserLoginControl.registered.replace("@", vCode);
		//2、保存手机号验证码到session
		HttpSession session = request.getSession();
		//session.setAttribute(phone, vCode);
		//屏蔽发短信，固定验证码123
		session.setAttribute(phone, "123");
		
		MySessionContext myc= MySessionContext.getInstance();  
		myc.AddSession(session);  
		
		String sessionId=session.getId();
		String sendTime=DateUtils.dateToStr(new Date());//定时发送时间
		//3、发送验证码
		//int retNum=SendSMS.sendMessage(request,response,phone,repContent,sendTime);
		int retNum=1;
		//4、通过返回值整理返回的提示信息
		String retMessage = "";
		if(retNum>=0){//成功
			retMessage="验证码已发送到您的手机，请查收！";
		}else{
			retMessage="短信发送过程发生异常，请稍后再试！";
		}
		//String retMessage=commUserLoginControl.sendInfo(request,response,phone,registered);
		//Map retStr=this.sendMessage(request,response,phone);
		Map map=new HashMap();
		map.put("sid", sessionId);
		map.put("retMessage", retMessage);
		
		jsonString = JSONArray.toJSONString(map,SerializerFeature.WriteDateUseDateFormat);
		return jsonString;
	}
	
	
	/**
	 * 注册第二部
	 * 验证验证码，保存数据到客户表，用户表
	 */
	@RequestMapping("/registered")
	@ResponseBody
	public String registered(HttpServletRequest request,HttpServletResponse response,
			@RequestParam Map data){
		
		Map retMap = new HashMap();
		String jsonString="";
		String sid=data.get("sid").toString();
		
		String phone=data.get("cusMobile").toString();
		String code=data.get("code").toString();
		
		String retMsg=this.validationSMS(code,sid);
		String cusId="";
		if(retMsg=="0"){//验证码正确
			String cusUUID=UuidTools.getUUID();
			//1、保存客户信息 
			cusId=cusUUID;
			Map addCusMap=new HashMap();
			addCusMap.put("cusId",cusUUID);
			addCusMap.put("cusType", data.get("cusType").toString());
			addCusMap.put("cusCompany", data.get("cusCompany").toString());
			//addCusMap.put("cusProvince",data.get("cusProvince").toString());
			//addCusMap.put("cusCity", data.get("cusCity").toString());
			//addCusMap.put("cusArea",data.get("cusArea").toString());
			addCusMap.put("cusAddress",data.get("cusAddress").toString());
			addCusMap.put("cusPostcode",data.get("cusPostcode").toString());
			addCusMap.put("cusLeader",data.get("cusLeader").toString());
			//addCusMap.put("cusOfficephone",data.get("cusOfficephone").toString());
			addCusMap.put("cusEmail",data.get("cusEmail").toString());
			addCusMap.put("cusMobile",phone);
			
			addCusMap.put("cusState",0);
			addCusMap.put("cusWorkstate",0);
			addCusMap.put("remark","");
			
			CommPropertyAddUtil.addCommProp(addCusMap, null);
			
			String addCusSpace = "com.richfit.bjsop.entity.CusInfo.add";
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
	
	public static Map sendMessage(HttpServletRequest request,HttpServletResponse response,String phone){
		String retMessage = "";
		Map retMap = new HashMap();
		//1、生成6位数字验证码
		String vCode=createRandomVcode();
		
		//2、将验证码保存到session中
		 HttpSession session = request.getSession();
		 session.setAttribute(phone, vCode);
		 String sessionId=session.getId();
		 
		 MySessionContext myc= MySessionContext.getInstance();  
		 myc.AddSession(session);  
		 
		//3、整理发送信息为借口格式
		 String content="验证码："+vCode+"【上海销售 】";
		 String sendTime=DateUtils.dateToStr(new Date());//定时发送时间
		 
		//4、用http协议发送信息并接受返回信息
		//String retMsg="1";//this.postRequest(Url, params);
		 
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
			retMap.put("sid", sessionId);
			retMap.put("retMessage", "验证码已发送到您的手机，请查收！"+vCode);
			//retMessage="验证码已发送到您的手机，请查收！"+vCode;
		}else{
			retMap.put("retMessage", "短信发送过程发生异常，请稍后再试！"+vCode);
			//retMessage="短信发送过程发生异常，请稍后再试！"+vCode;
		}
		
		return retMap;
	}
	
	public static String createRandomVcode(){
		//验证码
		String vcode = "";
		for (int i = 0; i < 6; i++) {
			vcode = vcode + (int)(Math.random() * 9);
		}
		return vcode;
	}
	
	public static String validationSMS(String code,String sid){
		String retMessage = "";
	
		MySessionContext myc= MySessionContext.getInstance();  
		HttpSession session = myc.getSession(sid);  
        String sessionCode = (String)session.getAttribute("vCode");  
        
        if(sessionCode==null && sessionCode==""){
        	return "验证码超时，请从新申请发送验证码！";//session中不存在该手机信息，验证码超时
        }
        
		//2、验证码比较，返回信息
		if(code.equals(sessionCode)){
			retMessage="0";//验证码正确
		}else{
			retMessage="1";//验证码错误
		}
		
		return retMessage;
	}
	
	
	/**
	 * 执行查询操作
	 * @param dataType
	 * @return jsonString
	 * @throws ParseException
	 */
	@RequestMapping("/queryPList")
	@ResponseBody
	public String queryPList(HttpServletRequest request,@RequestParam Map params,@RequestParam(value="dataType",defaultValue="json",required=false)String dataType) throws ParseException {
		
		String nameSpace = "com.richfit.bjsop.entity.BasCustype.queryByList";
		
		List<Map> entityList=null;

		params.put("delFlag", 0);
		params.put("orderByClause", "custype_code");
		
		if ("json".equals(dataType)) {
			entityList=dbOperate.select(nameSpace, params);
			
			String jsonString = JSONArray.toJSONString(entityList,SerializerFeature.WriteDateUseDateFormat);
			return jsonString;
		}else {
			return null;
		}
		
	}
	
	/**
	 * 执行查询操作
	 * @param dataType
	 * @return jsonString
	 * @throws ParseException
	 */
	@RequestMapping("/queryCList")
	@ResponseBody
	public String queryCList(HttpServletRequest request,@RequestParam Map params,@RequestParam(value="dataType",defaultValue="json",required=false)String dataType) throws ParseException {
		
		String nameSpace = "com.richfit.bjsop.entity.BasCustypesub.queryByList";
		
		List<Map> entityList=null;

		params.put("delFlag", 0);
		params.put("orderByClause", "custypesub_code");
		
		if ("json".equals(dataType)) {
			entityList=dbOperate.select(nameSpace, params);
			
			String jsonString = JSONArray.toJSONString(entityList,SerializerFeature.WriteDateUseDateFormat);
			return jsonString;
		}else {
			return null;
		}
		
	}
	
	/**
	 * 判断验证码，修改密码
	 */
	@RequestMapping("/changePassword")
	@ResponseBody
	public String changePassword(HttpServletRequest request,HttpServletResponse response,
			@RequestParam Map data){
		Map retMap = new HashMap();
		String jsonString="";
		
		String loginPassword=data.get("oldPassword").toString();
		String newPassword=data.get("newPassword").toString();
		String phone=data.get("phone").toString();
		String code=data.get("code").toString();
		
		String retMsg=SendSMS.validationSMS(request,response,phone,code);
		
		if(retMsg=="0"){//验证码正确
	        String loginName = data.get("loginName").toString();
	        
	        MD5 md = new MD5();
			loginPassword=md.getMD5ofStr(loginPassword);
			
			Map map=new HashMap();
			map.put("loginName", loginName);
			map.put("loginPassword", loginPassword);
			
			String nameSpace = "com.richfit.bjsop.entity.BasUser.queryByList";
			List<Map> entityList=dbOperate.select(nameSpace, map);//查询原始密码
				
			String userId="";
			if(entityList.size()>0){//原始密码正确
				BasUser basUser=(BasUser)entityList.get(0);
				userId=basUser.getUserId();
			}
			
			//修改原始密码为新密码
			Map pasMap=new HashMap();
			pasMap.put("userId", userId);
			pasMap.put("loginPassword", md.getMD5ofStr(newPassword));
			pasMap.put("updateId", "1");
			
			//修改保存数据
			String updateSpace = "com.richfit.bjsop.entity.BasUser.updateBySelective";
			int num=dbOperate.update(updateSpace, pasMap);//查询原始密码
			if(num>0){
				jsonString="密码修改成功！";
			}else{
				jsonString="原始密码错误！";
			}
		}else{
			jsonString="验证码错误！";
		}
		
		return jsonString;
	}
	
	/**
	 * 注册
	 * 获取用户名，判断用户名是否存在，提示用户
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
	 * 通过客户ID找到客户手机号并且发送验证码
	 * @param request
	 * @param response
	 * @param cusId
	 * @param CusType
	 * @return
	 */
	@RequestMapping("/onlySendSMSByCusId")
	@ResponseBody
	public String onlySendSMSByCusId(HttpServletRequest request,HttpServletResponse response,String sid){
		String jsonString="";
		Map retMap = new HashMap();
		
		/** 获取session中的客户信息 */  
		MySessionContext myc= MySessionContext.getInstance();  
		HttpSession session = myc.getSession(sid);  
        String userId = (String)session.getAttribute("userId");  
        String cusId = (String)session.getAttribute("cusId");  
        
        String phone=commUserLoginControl.getPhoneByCusId(userId);
        
		String retMessage="";
		if(phone!=""){
			boolean validateTime=commUserLoginControl.getValidateTime(request); 
			if(validateTime==true){//可以发送---第一次发送或是超过3分钟了
				//发送验证码  
				retMessage=this.sendInfo(request,response,phone,commUserLoginControl.print,sid);
			}else{
				retMessage="验证码有效时间3分钟，请输入有效期内的验证码！";
			}
			
		}
		retMap.put("cusId", cusId);
		retMap.put("userId", userId);
		retMap.put("retStr", retMessage);
		retMap.put("phone", phone);
		
		jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
		return jsonString;
	}
	
	/**
	 * 整理发送短信的数据，发送短信
	 * @param request
	 * @param response
	 * @param phone
	 * @return
	 */
	public static String sendInfo(HttpServletRequest request,HttpServletResponse response,String phone,String content,String sid){
		//1、生成6位数字验证码
		String vCode=SendSMS.createRandomVcode();
		//String repContent=content.replace("@", vCode);
		//2、保存手机号验证码到session
		MySessionContext myc= MySessionContext.getInstance();  
		HttpSession session = myc.getSession(sid); 
		session.setAttribute(phone, vCode);
		String sendTime=DateUtils.dateToStr(new Date());//定时发送时间
		//3、发送验证码
		String retNum=SendSMS.sendMessage(request,response,phone,content,vCode);
		//4、通过返回值整理返回的提示信息
		String retMessage = "";
		if(retNum=="0"){//成功
			retMessage="验证码已发送到您的手机，请查收！";
		}else{
			retMessage="短信发送过程发生异常，请稍后再试！";
		}
		return retMessage;
	}
	
	@RequestMapping("/onlyValidateSMS")
	@ResponseBody
	public String onlyValidateSMS(HttpServletRequest request,HttpServletResponse response,
			String code,String sid){
		
		Map retMap = new HashMap();
		String jsonString="";
		
		String retMsg=this.validationSMS(code,sid);
		String cusId="";
		if(retMsg=="0"){//验证码正确
			jsonString="true";
		}else{
			jsonString="false";
		}
		return jsonString;
	}
	
	@RequestMapping("/loginOut")
	@ResponseBody
	public String loginOut(HttpServletRequest request,HttpServletResponse response,String sid){
		MySessionContext myc= MySessionContext.getInstance();  
		HttpSession session = myc.getSession(sid);  
		session.invalidate();
		return "exit";
	}
	
	/**
	 * 修改密码，获取手机号并发送验证码
	 */
	@RequestMapping("/queryPhoneSend")
	@ResponseBody
	public String queryPhoneSend(HttpServletRequest request,HttpServletResponse response,String sid){
		Map retMap = new HashMap();
		String jsonString="";
		MySessionContext myc= MySessionContext.getInstance();  
		HttpSession session = myc.getSession(sid);  
        String userId = (String)session.getAttribute("userId");  
        String cusId = (String)session.getAttribute("cusId");  
        
        //查询客户信息（手机号）
        String phone=commUserLoginControl.getPhoneByCusId(userId);
        
        String retMessage="";
        if(phone!=""){
        	boolean validateTime=commUserLoginControl.getValidateTime(request); 
			if(validateTime==true){//可以发送---第一次发送或是超过3分钟了
				//发送验证码  
				retMessage=commUserLoginControl.sendInfo(request,response,phone,commUserLoginControl.editPassword);
			}else{
				retMessage="验证码有效时间3分钟，请输入有效期内的验证码！";
			}
			//发送验证码  
        	//retStr=SendSMS.sendMessage(request,response,phone);
        }
        retMap.put("cusId", cusId);
		retMap.put("retStr", retMessage);
		retMap.put("phone", phone);
		retMap.put("userId", userId);
		jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
		
		return jsonString;
	}
	
	
	
	
	@RequestMapping("/updatePassword")
	@ResponseBody
	public String updatePassword(HttpServletRequest request,HttpServletResponse response,
			@RequestParam Map data){
		Map retMap = new HashMap();
		String jsonString="";
		
		String loginPassword=data.get("oldPassword").toString();
		String newPassword=data.get("newPassword").toString();
		//String phone=data.get("phone").toString();
		//String code=data.get("code").toString();
		
		//String retMsg=SendSMS.validationSMS(request,response,phone,code);
		
		//if(retMsg=="0"){//验证码正确
			//判断原始密码是否正确
			MySessionContext myc= MySessionContext.getInstance();  
			HttpSession session = myc.getSession(data.get("sid").toString());  
			/** 获取session中的客户信息 */  
	        String loginName = (String)session.getAttribute("loginName");  
	        
	        MD5 md = new MD5();
			loginPassword=md.getMD5ofStr(loginPassword);
			
			Map map=new HashMap();
			map.put("loginName", loginName);
			map.put("loginPassword", loginPassword);
			
			String nameSpace = "com.richfit.bjsop.entity.BasUser.queryByList";
			List<Map> entityList=dbOperate.select(nameSpace, map);//查询原始密码
				
			String userId="";
			if(entityList.size()>0){//原始密码正确
				BasUser basUser=(BasUser)entityList.get(0);
				userId=basUser.getUserId();
			}
			
			//修改原始密码为新密码
			Map pasMap=new HashMap();
			pasMap.put("userId", userId);
			pasMap.put("loginPassword", md.getMD5ofStr(newPassword));
			pasMap.put("updateId", "1");
			
			//修改保存数据
			String updateSpace = "com.richfit.bjsop.entity.BasUser.updateBySelective";
			int num=dbOperate.update(updateSpace, pasMap);//查询原始密码
			
			String ret="";
			if(num>0){
				ret= "true";
			}else{
				ret= "false";
			}
		return ret;
	}
	
	public void sendMessages(HttpServletRequest request,HttpServletResponse response,
			String phone,Map retMap){
		String retStr="";
		String retMsg="";
		boolean validateTime=commUserLoginControl.getValidateTime(request); 
		if(validateTime==true){//可以发送---第一次发送或是超过3分钟了
			//发送验证码  
			retMsg=this.sendMsg(request,response,phone,commUserLoginControl.loginInfo,retMap);
		}else{
			retStr="验证码有效时间3分钟，请输入有效期内的验证码！";
		}
		if(retMsg.equals("yes")){
			retStr="验证码已发送到您的手机，请查收！";
		}else if(retMsg.equals("no")){
			retStr="短信发送过程发生异常，请稍后再试！";
		}else{
			
		}
		retMap.put("retStr", retStr);
		retMap.put("phone", phone);
		retMap.put("yesno", retMsg);
	}
	
	public String sendMsg(HttpServletRequest request,HttpServletResponse response,
			String phone,String content,Map retMap){
		//1、生成6位数字验证码
		String vCode=SendSMS.createRandomVcode();
		//2、保存手机号验证码到session
		HttpSession session = request.getSession();
		//session.setAttribute("vCode", vCode);
		//屏蔽发短信，固定验证码123_dev
		session.setAttribute("vCode", "123");
		
		System.out.println("【验证码】"+vCode);
		
		//增加时间判断，3分钟内验证码有效
		String sendTime=DateUtils.dateTimeToStr(new Date());//定时发送时间
		session.setAttribute("codeDate", sendTime);
		
		
		MySessionContext myc= MySessionContext.getInstance();  
		myc.AddSession(session); 
		String sid=session.getId();
		retMap.put("sid",sid);
		
		//3、发送验证码_dev
		//String retNum=this.sendMessage(request,response,phone,content,vCode);
		String retNum="true";
		//4、通过返回值整理返回的提示信息
		String retMessage = "";
		if(retNum=="true"){//成功
			retMessage="yes";
		}else{
			retMessage="no";
		}
		return retMessage;
	}
	
	public String sendMessage(HttpServletRequest request, HttpServletResponse response,
			 String phone, String content,String code){
		String Sent_Result = "";
		String success = "";
		//String Url = "http://112.35.1.155:1992/sms/norsubmit?";//普通短信
		String Url = "http://112.35.1.155:1992/sms/tmpsubmit?";//模板短信
		try {
		Sent_Result = SentSms(Url,sendSMS.GetSmsParam(phone,content,code));
		} catch (UnsupportedEncodingException e) {
		e.printStackTrace();
		}
		success = sendSMS.jsonToBean(Sent_Result, "success");
		System.out.println("短信返回数据："+sendSMS.jsonToBean(Sent_Result, "success"));
		return success;
	}
	
	public static String SentSms(String Url, String Param) {
		String s_SentSms = postRequest(Url, Param);

		System.out.println("【发送结果】"+s_SentSms);
		return s_SentSms;
	}
	
	public static String postRequest(String url, String param) {
		OutputStreamWriter out = null;

		BufferedReader in = null;
		String result = "";
		try {
			URL realUrl = new URL(url);
			// 创建代理服务器
			//InetSocketAddress addr = new InetSocketAddress("proxy3.bj.petrochina", 8080);
			//Proxy proxy = new Proxy(Proxy.Type.HTTP, addr); // http 代理
			//URLConnection conn = realUrl.openConnection(proxy);
			
			URLConnection conn = realUrl.openConnection();
			
			conn.setRequestProperty("accept", "*/*");
			conn.setRequestProperty("contentType", "utf-8");
			conn.setRequestProperty("connection", "Keep-Alive");
			//conn.setRequestProperty("user-agent","Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)");
			conn.setRequestProperty("User-Agent", "Mozilla/4.0 (compatible; MSIE 5.0; Windows NT; DigExt)");
			conn.setDoOutput(true);
			conn.setDoInput(true);
			
			System.out.println("开始连接...");
			
			out = new OutputStreamWriter(conn.getOutputStream());
			out.write(param);
			out.flush();

			in = new BufferedReader(
					new InputStreamReader(conn.getInputStream()));
			String line;
			while ((line = in.readLine()) != null) {
				result += "\n" + line;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (out != null) {
					out.close();
				}
				if (in != null) {
					in.close();
				}
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
		return result;
	}
	
	
	/**
	 * 通过客户登录账号找到客户手机号并且发送验证码
	 * 登录账号存在手机号有发验证码，登录账号不存在，提示客户
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/onlySendSMSByLoginName")
	@ResponseBody
	public String onlySendSMSByLoginName(HttpServletRequest request,HttpServletResponse response,
			String loginName){
		String jsonString="";
		Map retMap = new HashMap();
		
		Map map=commUserLoginControl.getPhoneByLoginName(loginName);
		String phone=map.get("phone")!=null?map.get("phone").toString():null;
		String cusId=map.get("cusId")!=null?map.get("cusId").toString():null;
		String userId=map.get("userId")!=null?map.get("userId").toString():null;
		String retMessage="";
		if(phone!=""){
			boolean validateTime=commUserLoginControl.getValidateTime(request); 
			if(validateTime==true){//可以发送---第一次发送或是超过3分钟了
				//发送验证码  
				retMessage=this.sendMsg(request,response,phone,commUserLoginControl.forgotPassword,retMap);
			}else{
				retMessage="验证码有效时间3分钟，请输入有效期内的验证码！";
				retMap.put("retMsg", retMessage);
			}
			retMap.put("retMsg", "true");
		}else{
			retMap.put("retMsg", "登录账号不存在，请确认！");
		}
		retMap.put("retStr", retMessage);
		retMap.put("cusId", cusId);
		retMap.put("userId", userId);
		retMap.put("phone", phone);
		jsonString = JSONArray.toJSONString(retMap,SerializerFeature.WriteDateUseDateFormat);
		return jsonString;
	}
	
	
	/**
	 * 修改密码
	 */
	@RequestMapping("/editPassword")
	@ResponseBody
	public String editPassword(HttpServletRequest request,HttpServletResponse response,
			String loginName,String password){
		Map cusmap=new HashMap();
		cusmap.put("loginName", loginName);
		cusmap.put("delFlag", 0);
		String cusSpace = "com.richfit.bjsop.entity.BasUser.queryByLoginName";
		List <Map> BasList=dbOperate.select(cusSpace, cusmap);//查询客户信息
		
		MD5 md = new MD5();
		String loginPassword=md.getMD5ofStr(password);
		
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
}
