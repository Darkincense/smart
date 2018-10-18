var myRefreshToken = null;

function refreshJwtToken($http) {
    var jwtTokenExpiration = localStorage.getItem("jwt_token_expiration");
    var refreshTokenExpiration = localStorage.getItem("refresh_token_expiration");
    var timestamp = (new Date()).valueOf();
    var refreshToken = localStorage.getItem('refresh_token').slice(1, localStorage.getItem('refresh_token').length - 1);
    $http({
        method: "POST",
        url: "/c10/api/auth/token",
        data: {
            refreshToken: refreshToken
        }
    }).
    then(function success(data) {
            console.log(data)
            var token = '"' + data.data.token + '"';
            myRefreshToken = token;
            localStorage.jwt_token = token;
            var base = new Base64();
            var cookietwo = token.split('.')[1];
            var str = base.decode(cookietwo);
            str = JSON.parse(str.slice(0, (str.indexOf("}") + 1)));
            console.log(str)
            var ttl = str.exp - str.iat;
            localStorage.jwt_token_expiration = new Date().valueOf() + ttl * 1000;
            location.reload();
        },
        function error(resp) {
            console.log(resp);
        })
    if (timestamp > refreshTokenExpiration) {
        clearTokenData();
        location.href = 'c10login.html';
    }
}


  
  verifyToken();

function refreshHerder(httpProvider, token) {
    var token = localStorage.getItem("jwt_token");
    $httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + token.slice(1, token.length - 1);
}










