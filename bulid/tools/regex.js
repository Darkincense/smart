/**
 * 按类型校验字符串
 *
 * @param {*} str
 * @param {*} type
 * @returns
 */
function checkType(str, type) {
	switch (type) {
		case 'empty':
			return (str == null || str == '' || str == undefined || typeof (str) == typeof (undefined));
		case 'email':
			return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
		case 'phone':
			return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
		case 'tel':
			return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
		case 'number':
			return /^[0-9]$/.test(str);
			/**
			 * 校验邮政编码
			 * @param {string} str 字符串
			 * @return {bool}
			 */
		case 'isZipCode':
			return /^(\d){6}$/.test(str);
		case 'isURL':
			return /^(https|http):\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(str);
		case 'english':
			return /^[a-zA-Z]+$/.test(str);
		case 'allChinese':
			return /^[\u4E00-\u9FA5]+$/.test(str);
		case 'hasChinese':
			return /^[\u4E00-\u9FA5]/.test(str);
		case 'lower':
			return /^[a-z]+$/.test(str);
		case 'upper':
			return /^[A-Z]+$/.test(str);
		default:
			return true;
	}
}

/**
 * 是否身份证号码
 * @param {string} str 字符串
 * @return {bool}
 */

function isIDCard(str) {
	var C15ToC18 = function (c15) {
		var cId = c15.substring(0, 6) + "19" + c15.substring(6, 15);
		var strJiaoYan = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
		var intQuan = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		var intTemp = 0;
		for (i = 0; i < cId.length; i++)
			intTemp += cId.substring(i, i + 1) * intQuan[i];
		intTemp %= 11;
		cId += strJiaoYan[intTemp];
		return cId;
	}
	var Is18IDCard = function (IDNum) {
		var aCity = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外"
		};

		var iSum = 0,
			info = "",
			sID = IDNum;
		if (!/^\d{17}(\d|x)$/i.test(sID)) {
			return false;
		}
		sID = sID.replace(/x$/i, "a");

		if (aCity[parseInt(sID.substr(0, 2))] == null) {
			return false;
		}

		var sBirthday = sID.substr(6, 4) + "-" + Number(sID.substr(10, 2)) + "-" + Number(sID.substr(12, 2));
		var d = new Date(sBirthday.replace(/-/g, "/"))

		if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return false;

		for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sID.charAt(17 - i), 11)

		if (iSum % 11 != 1) return false;
		return true;
	}

	return str.length == 15 ? Is18IDCard(C15ToC18(str)) : Is18IDCard(str);
}

// 验证省份证号码 http://www.42du.cn/p/41
// 身份证格式基本验证
var checkCode = function (val) {
	var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
	var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
	var code = val.substring(17);
	if (p.test(val)) {
		var sum = 0;
		for (var i = 0; i < 17; i++) {
			sum += val[i] * factor[i];
		}
		if (parity[sum % 11] == code.toUpperCase()) {
			return true;
		}
	}
	return false;
};

// 出生日期码校验
var checkDate = function (val) {
	var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
	if (pattern.test(val)) {
		var year = val.substring(0, 4);
		var month = val.substring(4, 6);
		var date = val.substring(6, 8);
		var date2 = new Date(year + "-" + month + "-" + date);
		if (date2 && date2.getMonth() == (parseInt(month) - 1)) {
			return true;
		}
	}
	return false;
};

// 省级地址码校验
var checkProv = function (val) {
	var pattern = /^[1-9][0-9]/;
	var provs = {
		11: "北京",
		12: "天津",
		13: "河北",
		14: "山西",
		15: "内蒙古",
		21: "辽宁",
		22: "吉林",
		23: "黑龙江 ",
		31: "上海",
		32: "江苏",
		33: "浙江",
		34: "安徽",
		35: "福建",
		36: "江西",
		37: "山东",
		41: "河南",
		42: "湖北 ",
		43: "湖南",
		44: "广东",
		45: "广西",
		46: "海南",
		50: "重庆",
		51: "四川",
		52: "贵州",
		53: "云南",
		54: "西藏 ",
		61: "陕西",
		62: "甘肃",
		63: "青海",
		64: "宁夏",
		65: "新疆",
		71: "台湾",
		81: "香港",
		82: "澳门"
	};
	if (pattern.test(val)) {
		if (provs[val]) {
			return true;
		}
	}
	return false;
};

var checkID = function (val) {
	if (checkCode(val)) {
		var date = val.substring(6, 14);
		if (checkDate(date)) {
			if (checkProv(val.substring(0, 2))) {
				return true;
			}
		}
	}
	return false;
}