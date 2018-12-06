package com.richfit.bjsop.controller.user;


import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URL;
import java.net.URLConnection;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import com.alibaba.fastjson.JSONObject;
import com.richfit.bjsop.entity.Submit;
import org.apache.commons.codec.binary.Base64;

import com.alibaba.fastjson.JSON;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/SendSMS")
public class SendSMS {
	//public static String Url = "http://106.ihuyi.com/webservice/sms.php?method=Submit";
	public static String accountActivation="您的EGOU账号已激活，欢迎您登录系统体验网上油品批发。";
	public static String confirm= "您好，@客户的意向单请您尽快处理。";
	public static String payment= "您好，@客户的待处理意向单请您尽快处理。";
	public static String notice=  "您好，@客户的付油通知单请您尽快处理。";
	
	/**
	 *  发送验证码到第三方
	  * 方法说明
	  * @Discription:扩展说明
	  * @return
	  * @return String
	 */
	@RequestMapping("sendMessage")
	@ResponseBody
	public static String sendMessage(HttpServletRequest request, HttpServletResponse response,
									 String phone, String content,String code){
		String Sent_Result = "";
		String success = "";
		//String Url = "http://112.35.1.155:1992/sms/norsubmit?";//普通短信
		String Url = "http://112.35.1.155:1992/sms/tmpsubmit?";//模板短信
		try {
			Sent_Result = SentSms(Url,GetSmsParam(phone,content,code));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		success = jsonToBean(Sent_Result, "success");
		System.out.println("短信返回数据："+jsonToBean(Sent_Result, "success"));
		return success;
	}
	// 短信发送SentSms
	public static String SentSms(String Url, String Param) {
		String s_SentSms = postRequest(Url, Param);

		System.out.println("【发送结果】"+s_SentSms);
		return s_SentSms;
	}
	// SmsParam获取
	public static String GetSmsParam(String phone,String content,String code) throws UnsupportedEncodingException {
		Submit submit = new Submit();
		submit.setEcName("中国石油天然气股份有限公司上海销售分公司");
		submit.setApId("shxs");
		submit.setSecretKey("shxs_123");
		submit.setTemplateId("eead96bd2af9440c93147404ad1d829d");
		submit.setMobiles(phone);
		submit.setParams("[\""+content+"\",\""+code+"\"]");
		submit.setSign("xtlcMirQA");
		submit.setAddSerial("");
		
		StringBuffer stringBuffer = new StringBuffer();
		stringBuffer.append(submit.getEcName());
		stringBuffer.append(submit.getApId());
		stringBuffer.append(submit.getSecretKey());
		stringBuffer.append(submit.getTemplateId());
		stringBuffer.append(submit.getMobiles());
		stringBuffer.append(submit.getParams());
		stringBuffer.append(submit.getSign());
		stringBuffer.append(submit.getAddSerial());

		String selfMac = encryptToMD5(stringBuffer.toString());
		//System.out.println("selfMac:" + selfMac);
		submit.setMAC(selfMac);
		String param = JSON.toJSONString(submit);
		//System.out.println("param:" + param.getBytes());

		//Base64加密
		String encode = Base64.encodeBase64String(param.getBytes("UTF-8"));
		System.out.println("encode:" + encode);

		return encode;
	}
	// MD5转换
	public static String encryptToMD5(String password) {
		byte[] digesta = null;
		String result = null;
		try {

			// 得到一个MD5的消息摘要
			MessageDigest mdi = MessageDigest.getInstance("MD5");
			// 添加要进行计算摘要的信息
			mdi.update(password.getBytes("utf-8"));
			// 得到该摘要
			digesta = mdi.digest();
			result = byteToHex(digesta);
		} catch (NoSuchAlgorithmException e) {

		} catch (UnsupportedEncodingException e) {

			e.printStackTrace();
		}
		return result;
	}

	/**
	 * 将二进制转化为16进制字符串
	 */
	public static String byteToHex(byte[] pwd) {
		StringBuilder hs = new StringBuilder("");
		String temp = "";
		for (int i = 0; i < pwd.length; i++) {
			temp = Integer.toHexString(pwd[i] & 0XFF);
			if (temp.length() == 1) {
				hs.append("0").append(temp);
			} else {
				hs.append(temp);
			}
		}
		return hs.toString().toLowerCase();
	}

	// 取json对应
	public static String jsonToBean(String data, String tittle) {
		// System.out.println("data:"+data);
		// System.out.println("tittle:"+tittle);
		try {
			JSONObject json = JSONObject.parseObject(data);
			String result = json.getString(tittle);
			return result;
		} catch (Exception e) {
			return "Json解析失败";
		}
	}
	/**
	 * 随机生成6位随机验证码
	  * 方法说明
	  * @Discription:扩展说明
	  * @return
	  * @return String
	 */
	public static String createRandomVcode(){
		//验证码
		String vcode = "";
		for (int i = 0; i < 6; i++) {
			vcode = vcode + (int)(Math.random() * 9);
		}
		return vcode;
	}
	
	
	
	/**
	 *  收到验证码进行验证
	  * 方法说明
	  * @Discription:扩展说明
	  * @return
	  * @return String
	 */
	@RequestMapping("validationSMS")
	@ResponseBody
	public static String validationSMS(HttpServletRequest request, HttpServletResponse response, String phone, String code){
		String retMessage = "";
	
		//1、获取session中的验证码
		HttpSession session = request.getSession();
		/** 获取session中存放的手机短信验证码 */  
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
	 * HttpClient 模拟POST请求
	  * 方法说明
	  * @Discription:扩展说明
	  * @param url
	  * @return String
	 */
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

			/*URL realUrl = new URL(url);
			URLConnection conn = realUrl.openConnection();
			HttpURLConnection httpURLConnection = (HttpURLConnection)conn;
			httpURLConnection.setRequestMethod("POST");
			httpURLConnection.setDoOutput(true);//允许写出
			httpURLConnection.setDoInput(true);//允许读入
			httpURLConnection.setUseCaches(false);//不使用缓存
			httpURLConnection.connect();*/
			
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
}
