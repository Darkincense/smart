 // 模板引擎补充

 function fmoney(s, n) {
   //s:传入的float数字 ，n:希望返回小数点几位
   var n = n > 0 && n <= 20 ? n : 2,
     s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "",
     l = s.split(".")[0].split("").reverse(),
     r = s.split(".")[1],
     t = "";
   for (i = 0; i < l.length; i++) {
     t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
   }
   return t.split("").reverse().join("") + "." + r;
 }
 template.defaults.imports.OneDecimal = function (number) {
   return number.toFixed(1);
 }
 template.defaults.imports.TwoDecimal = function (number) {
   return number.toFixed(2);
 }
 template.defaults.imports.changeMoney = function (value) {
   return fmoney(value)
 }