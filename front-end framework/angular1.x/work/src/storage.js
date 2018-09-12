function baseLocalStorage(name) {
  var base = new Base64();
  var cookietwo = localStorage.getItem(name).split('.')[1];
  var str = base.decode(cookietwo);
  str = str.slice(0, (str.indexOf("}") + 1));
  return JSON.parse(str);
}

function clearTokenData() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('jwt_token_expiration');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('refresh_token_expiration');
}
function verifyToken() {
  var cumToken = localStorage.getItem("jwt_token_expiration");
  var timestamp = Date.parse(new Date());
  if (timestamp > cumToken) {
      location.href = 'c10login.html';
  }
}
verifyToken();