$('ui-view').css('height', (window.innerHeight - 50) + 'px');
$('.content-wrapper').css('width', (window.innerWidth - 230) + 'px')
var togNum = 0;
$("body").on("click", "#togle", function() {
    togNum += 1;
    if (togNum % 2 == 0) {
        $("body").removeClass("sidebar-collapse");
        $('.content-wrapper').css('width', (window.innerWidth - 230) + 'px');
    } else {
        $("body").addClass("sidebar-collapse");
        $('.content-wrapper').css('width', (window.innerWidth - 50) + 'px');
    }

})

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

function verifyToken() {
    var cumToken = localStorage.getItem("jwt_token_expiration");
    var timestamp = Date.parse(new Date());
    if (timestamp > cumToken) {
        location.href = 'c10login.html';
    }
}

var token ;
var news ;
var tsMenuList=0;
var newtsMenuList=[];//一级菜单

$(document).ready(function(){

	token = localStorage.getItem("jwt_token");
	if(token!=null){
		news = 'Bearer ' + token.slice(1, token.length - 1);
		queryMenu(news);
	}
});


function assemble(data){
  if(data.length>0){
        for(var i=0;i<data.length;i++){
             var menuLevel=data[i].tsMenu.menuLevel;
             if('1'==menuLevel){
                var newMenu={
                    menuRoute:"",
                    class:"",
                    menuName:"",
                    orderId:"",
                    accessMenu:""
                   };
                newMenu.class=data[i].tsMenu.menuClass;
                newMenu.menuName=data[i].tsMenu.menuName;
                newMenu.orderId=data[i].tsMenu.orderId;
                newMenu.menuRoute=data[i].tsMenu.menuRoute;
                newtsMenuList.push(newMenu);

             }
        }
        if(newtsMenuList.length>0){
            for(var i=0;i<newtsMenuList.length;i++){
                var accessMenuList=[];//二级菜单
                var menuRoute=newtsMenuList[i].menuRoute;
                for(var j=0;j<tsMenuList.length;j++){
                    var parentId=tsMenuList[j].tsMenu.parentId;
                    if(menuRoute==parentId){
                        var accessMenu={
                            menuRoute:"",
                            class:"",
                            menuName:"",
                            orderId:""
                           };
                        accessMenu.menuRoute=tsMenuList[j].tsMenu.menuRoute;
                        accessMenu.class=tsMenuList[j].tsMenu.menuClass;
                        accessMenu.menuName=tsMenuList[j].tsMenu.menuName;
                        accessMenu.orderId=tsMenuList[j].tsMenu.orderId;
                        accessMenuList.push(accessMenu);
                    }
                }
                if(accessMenuList.length>0){
                    newtsMenuList[i].accessMenu=accessMenuList;
                }
            }
        }
  }
}
function queryMenu(){
$.ajax({ 
    url: "/c10/api/initializtion/findUserGroup",
    async: false,
    type: "GET",
    headers: {
        Accept: "application/json; charset=utf-8",
        Authorization: "" + news
    },
    success:function(data){
        console.log(data);  
        tsMenuList=data.tsMenuList;     
        assemble(tsMenuList);//组装数据
    },error:function(data){
        
    }
    });        
}
var app = angular.module('app', ['ui.router', 'ngFileUpload']).config(
        function($stateProvider) {
        $stateProvider
            .state('c10catalogue', {
                url: '/admin/catalogue',
                views: {
                    "@": {
                        templateUrl: "/c10/components/dictionaries/catalogue.html"
                    }
                },
                data: {
                    pageTitle: '目录管理'
                },
            })
            .state('c10classify', {
                url: '/admin/classifys',
                views: {
                    "@": {
                        templateUrl: "/c10/components/dictionaries/classify.html"
                    }
                },
                data: {
                    pageTitle: '分类管理'
                },
            })
            .state('c10parameter', {
                url: '/admin/parameter',
                views: {
                    "@": {
                        templateUrl: "/c10/components/dictionaries/parameter.html"
                    }
                },
                data: {
                    pageTitle: '参数管理'
                },
            })
            .state('c10series', {
                url: '/admin/series',
                views: {
                    "@": {
                        templateUrl: "/c10/components/dictionaries/series.html"
                    }
                },
                data: {
                    pageTitle: '系列管理'
                },
            })
            .state('c10assetDeviceSearch', {
                url: '/admin/assetDeviceSearch',
                views: {
                    "@": {
                        templateUrl: "/c10/components/query/assetDeviceSearch.html"
                    }
                },
                data: {
                    pageTitle: '站点机组查询'
                },
            })
            .state('c10history', {
                url: '/admin/history',
                views: {
                    "@": {
                        templateUrl: "/c10/components/query/history.html"
                    }
                },
                data: {
                    pageTitle: '历史数据查询'
                },
            })
            .state('c10alarm', {
                url: '/admin/alarm',
                views: {
                    "@": {
                        templateUrl: "/c10/components/query/alarm.html"
                    }
                },
                data: {
                    pageTitle: '报警与故障原因查询'
                },
            })
            .state('c10custom', {
                url: '/admin/custom',
                views: {
                    "@": {
                        templateUrl: "/c10/components/customer/customer.html"
                    }
                },
                data: {
                    pageTitle: '客户管理'
                },
            })
            .state('c10page', {
                url: '/admin/page',
                views: {
                    "@": {
                        templateUrl: "/c10/components/asset/page.html"
                    }
                },
                data: {
                    pageTitle: '站点管理'
                },
            })
			.state('c10gateway', {
                url: '/admin/gateway',
                views: {
                    "@": {
                        templateUrl: "/c10/components/gateway/gateway.html"
                    }
                },
                data: {
                    pageTitle: '网关管理'
                },
            })
            .state('c10machine', {
                url: '/admin/machine',
                views: {
                    "@": {
                        templateUrl: "/c10/components/machine/machine.html"
                    }
                },
                data: {
                    pageTitle: '机组管理'
                },
            })
            .state('c10product', {
                url: '/admin/product',
                views: {
                    "@": {
                        templateUrl: "/c10/components/product/product.html"
                    }
                },
                data: {
                    pageTitle: '型号管理'
                },
            })
            .state('c10rule', {
                url: '/admin/rule',
                views: {
                    "@": {
                        templateUrl: "/c10/components/rule/rule.html"
                    }
                },
                data: {
                    pageTitle: '维保规则管理'
                },
            })
            .state('c10user', {
                url: '/admin/user',
                views: {
                    "@": {
                        templateUrl: "/c10/components/user/user.html"
                    }
                },
                data: {
                    pageTitle: '用户管理'
                },
            })
            .state('c10tenant', {
                url: '/admin/tenant',
                views: {
                    "@": {
                        templateUrl: "/c10/components/tenant/tenant.html"
                    }
                },
                data: {
                    pageTitle: ''
                },
            })
            .state('c10control', {
                url: '/admin/control',
                views: {
                    "@": {
                        templateUrl: "/c10/components/control/control.html"
                    }
                },
                data: {
                    pageTitle: ''
                },
            })
            .state('c10knowledge', {
                url: '/admin/knowledge',
                views: {
                    "@": {
                        templateUrl: "/c10/components/knowledge/knowledge.html"
                    }
                },
                data: {
                    pageTitle: '知识库'
                },
            })
            .state('c10tenantuserstate', {
                url: '/admin/tenantuserstate',
                views: {
                    "@": {
                        templateUrl: "/c10/components/tenantuserstate/tenantuserstate.html"
                    }
                },
                data: {
                    pageTitle: '站点'
                },
            })
            .state('c10tenantuserunit', {
                url: '/admin/tenantuserunit',
                views: {
                    "@": {
                        templateUrl: "/c10/components/tenantuserunit/tenantuserunit.html"
                    }
                },
                data: {
                    pageTitle: '机组'
                },
            })
            .state('c10customertenant', {
                url: '/admin/customertenant',
                views: {
                    "@": {
                        templateUrl: "/c10/components/customertenant/customertenant.html"
                    }
                },
                data: {
                    pageTitle: '站点'
                },
            })
            .state('c10customerunit', {
                url: '/admin/customerunit',
                views: {
                    "@": {
                        templateUrl: "/c10/components/customerunit/customerunit.html"
                    }
                },
                data: {
                    pageTitle: '机组'
                },
            })
            .state('c10certificate', {
                url: '/admin/download',
                views: {
                    "@": {
                        templateUrl: "/c10/components/download/downloadcertificate.html"
                    }
                },
                data: {
                    pageTitle: '证书下载'
                },
            })
            .state('c10menu', {
                url: '/admin/menu',
                views: {
                    "@": {
                        templateUrl: "/c10/components/menu/menucontrol.html"
                    }
                },
                data: {
                    pageTitle: '菜单维护'
                },
            })
            .state('c10allocatemenu', {
                url: '/admin/menucontrol',
                views: {
                    "@": {
                        templateUrl: "/c10/components/menucontrol/c10allocatemenu.html"
                    }
                },
                data: {
                    pageTitle: '菜单分配'
                },
            })
            .state('c10tenantmenuallocate', {
                url: '/admin/menucontrols',
                views: {
                    "@": {
                        templateUrl: "/c10/components/menucontrol/tenantmenuallocate.html"
                    }
                },
                data: {
                    pageTitle: '菜单分配'
                },
            })
            .state('tenantAdminmenu', {
                url: '/admin/menus',
                views: {
                    "@": {
                        templateUrl: "/c10/components/menu/tenantmenucontrol.html"
                    }
                },
                data: {
                    pageTitle: '菜单维护'
                },
            })
            .state('tenantGroup', {
                url: '/admin/usergroup',
                views: {
                    "@": {
                        templateUrl: "/c10/components/usergroup/tenantGroup.html"
                    }
                },
                data: {
                    pageTitle: '用户组管理'
                },
            })
              .state('c10history_gangguan', {
                url: '/zbzz/c10history_gangguan',
                params: {'url': null,'title':null},
                views: {
                    "@": {
                        templateUrl: "/c10/components/gangguan/history_gangguan.html",                       
                        controller: 'c10history_gangguan'
                    }
                },
                data: {
                    pageTitle: '钢管全流程追溯'
                },
            })
            .state('c10ggGYZL', {
                url: '/admin/history/c10ggGYZL',               
                views: {
                    "@": {
                        templateUrl: "/c10/components/gangguan/c10ggGYZL.html",                        
                        controller: 'c10ggGYZL'
                    }
                },
                data: {
                    pageTitle: '工艺质量数据实时监测'
                },
            })
            .state('c10ggSCWL', {
                url: '/zbzz/c10ggSCWL',
                params: {'url': null,'title':null},
                views: {
                    "@": {
                        templateUrl: "/c10/components/gangguan/c10ggSCWL.html",                       
                        controller: 'c10ggSCWL'
                    }
                },
                data: {
                    pageTitle: '生产物流实时追溯'
                },
            })
            .state('c10ggGYZL2', {
                url: '/admin/history/c10ggGYZL2',
                params: {'index': null,'name':null},
                views: {
                    "@": {
                        templateUrl: "/c10/components/gangguan/c10ggGYZL2.html",                        
                        controller: 'c10ggGYZL2'
                    }
                },
                data: {
                    pageTitle: '工艺质量数据实时监测'
                },
            })
            .state('tenantuserGroup', {
                url: '/admin/usergroups',
                views: {
                    "@": {
                        templateUrl: "/c10/components/usergroup/tenantuserGroup.html"
                    }
                },
                data: {
                    pageTitle: '用户组管理'
                },
            })
    });

   
  
  verifyToken();

function refreshHerder(httpProvider, token) {
    var token = localStorage.getItem("jwt_token");
    $httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + token.slice(1, token.length - 1);
}
app.config(function($httpProvider) {
    var token = localStorage.getItem("jwt_token");
    $httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + token.slice(1, token.length - 1);
})
app.controller("index", function($scope, $http, $state, $injector, $location) {
    $scope.newtsMenuList=newtsMenuList;
    verifyToken();
    $scope.sliderArr = null;
    $injector.get('$rootScope').c10ForceFullscreen = true;
    $scope.identity = {
        "SYS_ADMIN": false, //系统管理员
        "TENANT_ADMIN": false, //租户管理员
        "TENANT_USER": false, //租户用户
        "CUSTOMER_USER": false, //客户用户
        "name": ''
    }
    if (localStorage.getItem("jwt_token") == undefined) {
        location.href = 'c10login.html'
    }
    var base = baseLocalStorage("jwt_token");

    $scope.identity[base.scopes[0]] = true;
    switch (base.scopes[0]) {
        case "SYS_ADMIN":
            $scope.identity.name = '系统管理员';
            break;
        case "TENANT_ADMIN":
            $scope.identity.name = '租户管理员';
            break;
        case "TENANT_USER":
            $scope.identity.name = '租户用户';
            break;
        case "CUSTOMER_USER":
            $scope.identity.name = '客户用户';
            break;
    }

    $scope.logout = function() {
        clearTokenData();
        location.href = 'c10login.html'
    }
});
// <!--历史查询页面-查询数据分页-->
app.service("cutData", function() {
    return function(data, $scope) {
        // 根据总数据和每页显示的条数，得出页码总数
        $scope.pageLength = Math.ceil(data.length / $scope.everyPageLength)
            //定义一个数组放入除第一页，和最后一页以外的页码    
        $scope.pageArr = []
            // 将总页码放入一个数组进行存储，
        for (var i = 2; i < $scope.pageLength; i++) {
            $scope.pageArr.push(i)
        }

        // 控制前后...的显示与隐藏
        $scope.showState1 = true
        $scope.showState2 = true
            // 控制最后那个页码的显示
        $scope.lastPageShow = true
            // 获取初始页码数的临界点
        $scope.statePage = $scope.showPageLength - ($scope.showPageLength - 1) / 2
            // 临界点的判断
        $scope.go = function(num) {
            // 获取当前页码
            $scope.pagenum = num
                // 根据页码，对数据进行截取
            $scope.cutDataFn()
                //  // 定义一个数组放入将要显示的页码
            $scope.showPageArr = []

            if ($scope.pagenum < $scope.statePage + 1) {

                $scope.showState1 = false
                $scope.showState2 = true
                    // 要显示的页码放入一个数组
                for (var i = 2; i <= $scope.showPageLength; i++) {
                    $scope.showPageArr.push(i)
                }

            } else if ($scope.pagenum >= $scope.statePage + 1 && $scope.pagenum <= $scope.pageLength - ($scope.showPageLength - 1) / 2 - 1) {

                $scope.showState1 = true
                $scope.showState2 = true
                    // 要显示的页码放入一个数组
                $scope.showPageArr.push($scope.pagenum)
                for (var i = 1; i <= ($scope.showPageLength - 1) / 2; i++) {
                    $scope.showPageArr.push($scope.pagenum + i)
                    $scope.showPageArr.push($scope.pagenum - i)
                }

                // 临界点特殊情况判断
                if ($scope.pagenum == $scope.statePage + 1) {
                    $scope.showState1 = false
                }
                if ($scope.pagenum == $scope.pageLength - ($scope.showPageLength - 1) / 2 - 1) {
                    $scope.showState2 = false
                }

            } else {

                $scope.showState1 = true
                $scope.showState2 = false
                    // 要显示的页码放入一个数组
                for (var i = 1; i <= $scope.showPageLength - 1; i++) {
                    $scope.showPageArr.push($scope.pageLength - i)

                }

            }
            // 当页码总数小于中间规定显示的页码数时
            if ($scope.pageLength <= $scope.showPageLength + 1) {
                $scope.showState1 = false
                $scope.showState2 = false
                if ($scope.pageLength <= 1) {
                    $scope.lastPageShow = false
                }
            }
        }

        // 数据切割
        $scope.cutDataFn = function() {
                var cutdataCopy = []
                    // 对数组进行深拷贝，不在元数据上进行操作
                data.forEach(function(i) {
                        cutdataCopy.push(i)
                    })
                    // 根据页码对数据进行截取
                $scope.everyDATA = cutdataCopy.splice(($scope.pagenum - 1) * $scope.everyPageLength, $scope.everyPageLength)

            }
            // 初始化第一页
        $scope.go(1)
            // 上下页操作
        $scope.upDownFn = function(i) {
            $scope.pagenum = $scope.pagenum + i
            if ($scope.pagenum <= 0) {
                $scope.pagenum = 1
            } else if ($scope.pagenum > ($scope.pageLength - 1)) {
                $scope.pagenum = $scope.pageLength - 1
            }
            $scope.go($scope.pagenum)

        }
    }
});

app.controller('c10catalogue', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = {};
    $scope.myshow = false;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.submitName = false;
    $scope.submitType = false;
    $scope.updata = {};
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/categories",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.go($scope.pagenum)
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].name)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/category/" + obj[0].id,
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data
                        $scope.myshow = false;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.newData = datas;
        $scope.myshow = true;
        $scope.modshow = true;
    }
    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.submitName = false;
        $scope.submitName = false;
    }
    $scope.modaffirm = function() {
        if ($scope.newData.name == "" || $scope.newData.name == null) {
            $scope.submitName = true;
        }
        if ($scope.newData.name !== "" && $scope.newData.name !== null) {
            $scope.submitName = false;
            $scope.submitType = false;
            $http({
                method: "PUT",
                url: "/c10/api/category/" + $scope.newData.id,
                data: $scope.newData
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data
                    $scope.modshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }

    }
    $scope.addaffirm = function() {
        if ($scope.updata.name == undefined) {
            $scope.submitName = true;
        } else {
            $scope.submitName = false;
        }
        if ($scope.updata.type == undefined) {
            $scope.submitType = true;
        } else {
            $scope.submitType = false;
        }
        if ($scope.updata.name !== undefined && $scope.updata.type !== undefined) {
            $scope.submitName = false;
            $scope.submitType = false;
            $http({
                method: "POST",
                url: "/c10/api/category",
                data: $scope.updata
            }).
            then(function success(data) {
                    location.reload()
                    $scope.updata = {
                        "name": "",
                        "type": ""
                    };
                    $scope.addshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.add = function() {
        $scope.addshow = true;
        $scope.myshow = true;

    }
});
app.controller('c10classify', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = {};
    $scope.myshow = false;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.submitName = false;
    $scope.submitType = false;
    $scope.updata = {};
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/subclasses",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.go($scope.pagenum)
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].name)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/subclass/" + obj[0].id,
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data
                        $scope.myshow = false;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.modCatalogueArr = null;
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.newData.id = datas.id;
        $scope.newData.name = datas.name;
        $scope.newData.remark = datas.remark;
        $scope.newData.categoryId = datas.category.id;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/category-list"
        }).
        then(function success(data) {
                $scope.modCatalogueArr = data.data;
                $scope.modshow = true;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });
    }
    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.submitName = false;
        $scope.submitType = false;
    }
    $scope.modaffirm = function() {
        if ($scope.newData.name == "") {
            $scope.submitName = true;
        } else {
            $scope.submitName = false;
        }
        if ($scope.newData.categoryId == "") {
            $scope.submitType = true;
        } else {
            $scope.submitType = false;
        }
        if ($scope.newData.name !== "" && $scope.newData.categoryId !== "") {
            $scope.submitName = false;
            $scope.submitType = false;
            $http({
                method: "PUT",
                url: "/c10/api/subclass/" + $scope.newData.id,
                data: $scope.newData
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data
                    $scope.modshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.addaffirm = function() {
        if ($scope.updata.name == undefined) {
            $scope.submitName = true;
        } else {
            $scope.submitName = false;
        }
        if ($scope.updata.categoryId == undefined) {
            $scope.submitType = true;
        } else {
            $scope.submitType = false;
        }
        if ($scope.updata.name !== undefined && $scope.updata.categoryId !== undefined) {
            $scope.submitName = false;
            $scope.submitType = false;
            $http({
                method: "POST",
                url: "/c10/api/subclass",
                data: $scope.updata
            }).
            then(function success(data) {
                    location.reload()
                    $scope.updata = {
                        "name": "",
                        "type": ""
                    };
                    $scope.addshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.catalogueArr = null;
    $scope.add = function() {
        $scope.addshow = true;
        $scope.myshow = true;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/category-list"
        }).
        then(function success(data) {
                $scope.catalogueArr = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });
    }
    $scope.alldel = function() {

    }
});
app.controller('c10parameter', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = {};
    $scope.myshow = false;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.catalog = null;
    $scope.series = null;
    $scope.topArr = null;
    $scope.topNewArr = null;
    $scope.submitName = false;
    $scope.submitSelctItem = false;
    $scope.submitCode = false;
    $scope.updata = {};
    var pagearr = baseLocalStorage("jwt_token");
    $http({
        method: "GET",
        url: "/c10/api/tenant/" + pagearr.tenantId + "/categories"
    }).
    then(function success(data) {
            $scope.topArr = data.data.content;
        },
        function error(resp) {
            if (resp.data.status == 401) {
                refreshJwtToken($http);
            }
        })
    $scope.$watch('pCatalog', function(newValue, oldValue) {
        if (newValue != oldValue) {
            var i = 0;
            len = $scope.topArr.length;
            if (!newValue) {
                $scope.topNewArr = [];
                return;
            }
            for (i; i < len; i++) {
                if ($scope.topArr[i].id == $scope.pCatalog) {
                    $scope.topNewArr = $scope.topArr[i].subclasses;
                }
            }
        }
    });
    $scope.search = function() {
        if ($scope.pCatalog == undefined) {
            $scope.pCatalog = "";
        }
        if ($scope.pClass == undefined) {
            $scope.pClass = "";
        }
        if ($scope.pCode == undefined) {
            $scope.pCode = "";
        }
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/items/filter",
            params: {
                "page": 0,
                "size": 10,
                "categoryId": $scope.pCatalog,
                "subclassId": $scope.pClass,
                "keyChar": $scope.pCode
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.totalElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
		
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
		$scope.pagenum = num;
		
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/items/filter",
            params: {
                "page": $scope.pagenum,
                "size": 10,
                "categoryId": $scope.pCatalog,
                "subclassId": $scope.pClass,
                "keyChar": $scope.pCode
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.totalElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.go($scope.pagenum)
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].name)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/item/" + obj[0].id,
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data
                        $scope.myshow = false;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.newData.code = datas.code;
        $scope.newData.name = datas.name;
        $scope.newData = datas;
        $scope.myshow = true;
        $scope.modshow = true;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/category-list",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.catalog = data.data
                $scope.selectseries = datas.category.id;
                $scope.selectitem = datas.subclass.id;
                $scope.modshow = true;

            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.submitName = false;
        $scope.submitSelctItem = false;
        $scope.submitCode = false;
    }
    $scope.$watch('selectseries', function(newValue, oldValue) {
        if (newValue != oldValue) {
            var i = 0;
            len = $scope.catalog.length;
            if (!newValue) {
                $scope.series = [];
                return;
            }
            for (i; i < len; i++) {
                if ($scope.catalog[i].id == $scope.selectseries) {
                    $scope.series = $scope.catalog[i].subclasses;
                }
            }
        }
    });
    $scope.modaffirm = function() {
        $scope.newData.categoryId = $scope.selectseries;
        $scope.newData.subclassId = $scope.selectitem;
        if ($scope.newData.name == undefined || $scope.newData.name == "") {
            $scope.submitName = true;
        } else {
            $scope.submitName = false;
        }
        if ($scope.newData.code == undefined || $scope.newData.code == "") {
            $scope.submitCode = true;
        } else {
            $scope.submitCode = false;
        }
        if ($scope.newData.name !== undefined && $scope.newData.name !== "" && $scope.newData.code !== undefined && $scope.newData.code !== "") {
            $scope.submitName = false;
            $scope.submitSelctItem = false;
            $scope.submitCode = false;
            $http({
                method: "PUT",
                url: "/c10/api/item/" + $scope.newData.id,
                data: $scope.newData
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data
                    $scope.modshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.addaffirm = function() {
        $scope.updata.categoryId = $scope.selectseries;
        $scope.updata.subclassId = $scope.selectitem;
        if ($scope.updata.name == undefined || $scope.updata.name == "") {
            $scope.submitName = true;
        } else {
            $scope.submitName = false;
        }
        if ($scope.updata.code == undefined || $scope.updata.code == "") {
            $scope.submitCode = true;
        } else {
            $scope.submitCode = false;
        }
        if ($scope.updata.subclassId == undefined) {
            $scope.submitSelctItem = true;
        } else {
            $scope.submitSelctItem = false;
        }
        if ($scope.updata.name !== undefined && $scope.updata.name !== "" && $scope.updata.code !== undefined && $scope.updata.code !== "" && $scope.updata.subclassId !== undefined) {
            $scope.submitName = false;
            $scope.submitSelctItem = false;
            $scope.submitCode = false;
            $http({
                method: "POST",
                url: "/c10/api/item",
                data: $scope.updata
            }).
            then(function success(data) {
                    location.reload()
                    $scope.updata = {
                        "name": "",
                        "type": ""
                    };
                    $scope.addshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.add = function() {
        $scope.selectseries = null;
        $scope.selectitem = null;
        $scope.addshow = true;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/category-list",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.catalog = data.data
                $scope.addshow = true;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.alldel = function() {

    }
});
app.controller('c10series', function(cutData, $scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = {};
    $scope.myshow = false;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.addparamshow = false;
    $scope.addarr = null;
    $scope.modarr = null;
    $scope.showItemsPage = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.submitName = false;
    $scope.submitSelect = false;
    $scope.id = null;
    $scope.updata = {};
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.showItemsClick = function(series) {
        $scope.showItemsPage = true;
        $scope.seriesId = series.id;
        $scope.itemArr = series.items;
        $scope.everyPageLength = 5;
        $scope.showPageLength = 5;
        cutData($scope.itemArr, $scope);
    }
    $scope.delItem = function(seriesId, item) {
        $scope.item = item;
        var pagearr = baseLocalStorage("jwt_token");
        if (confirm("是否删除" + $scope.item.code + ':' + $scope.item.name)) {
            $http({
                    method: "DELETE",
                    url: "/c10/api/series/" + seriesId + "/item/" + item.id
                })
                .then(function success(data) {
                    $scope.showItemsPage = false;
                })
        }
    }
    $scope.addparam = function(series) {
        $scope.addparamshow = true;
        $scope.seriesId = series.id;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/category-list",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.modarr = data.data
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.addparamaffirm = function() {
        if ($scope.moreselect == undefined) {
            $scope.submitSelect = true;
        } else {
            $scope.submitSelect = false;
            $http({
                method: "PUT",
                url: "/c10/api/series/" + $scope.seriesId + "/items",
                data: $scope.moreselect
            }).
            then(function success(data) {
                    location.reload();
                    $scope.addparamshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                })
        }
    }
    $scope.go = function(num) {
        $scope.pagenum = num;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/series",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.go($scope.pagenum)
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].name)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/series/" + obj[0].id,
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data
                        $scope.myshow = false;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.paramsclick = function() {
        $scope.paramshow = true;
    }
    $scope.mod = function(datas, ind) {
        $scope.newData = datas;
        $scope.modshow = true;

    }
    $scope.$watch('selectedProvince', function(newValue, oldValue) {
        if (newValue != oldValue) {
            var i = 0;
            len = $scope.modarr.length;
            if (!newValue) {
                $scope.citys = [];
                return;
            }
            for (i; i < len; i++) {
                if ($scope.modarr[i].id == $scope.selectedProvince) {
                    $scope.citys = $scope.modarr[i].subclasses;
                }
            }
            $scope.districts = [];
        }
    });
    $scope.$watch('selectedCity', function(newValue, oldValue) {
        if (newValue != oldValue) {
            if (!newValue) {
                $scope.districts = [];
                return;
            }
            var i = 0;
            len = $scope.citys.length;
            for (i; i < len; i++) {
                if ($scope.citys[i].id == $scope.selectedCity) {
                    $scope.districts = $scope.citys[i].items;
                }
            }
        }
    });
    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.addparamshow = false;
        $scope.showItemsPage = false;
        $scope.submitName = false;
        $scope.submitSelect = false;
    }
    $scope.modaffirm = function() {
        if ($scope.newData.name == "" || $scope.newData.name == undefined) {
            $scope.submitName = true;
        } else {
            $scope.submitName = false;
            $http({
                method: "PUT",
                url: "/c10/api/series/" + $scope.newData.id,
                data: $scope.newData
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data;
                    $scope.modshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.addaffirm = function() {
        if ($scope.updata.name == "" || $scope.updata.name == undefined) {
            $scope.submitName = true;
        } else {
            $scope.submitName = false;
            $http({
                method: "POST",
                url: "/c10/api/series",
                data: $scope.updata
            }).
            then(function success(data) {
                    location.reload()
                    $scope.updata = {
                        "name": "",
                        "type": ""
                    };
                    $scope.addshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.add = function() {
        $scope.addshow = true;
        $scope.myshow = true;

    }
    $scope.alldel = function() {

    }
});
app.controller("c10assetDeviceSearch", function(cutData, $scope, $http) {
    $scope.customers = [];
    $scope.limits = [];
    $scope.heads = [];
    $scope.searchData = [];
    $scope.showData = false;
    $scope.deviceSelect = '';
    $http({
        method: "GET",
        url: "/c10/api/query/history-data/parameter"
    }).
    then(function success(data) {
            $scope.data = data.data
            $scope.customers = data.data.customers;
            $scope.seriesList = data.data.series;
        },
        function error(resp) {
            if (resp.data.status == 401) {
                refreshJwtToken($http);
            }
        })


    $scope.search = function() {
        var customerId = '';
        var assetId = '';
        var deviceId = '';
        if ($scope.customer != undefined)
            customerId = $scope.customer['id'];
        if ($scope.asset != undefined)
            assetId = $scope.asset['id'];
        if ($scope.device != undefined)
            deviceId = $scope.device['id'];

        $http({
            method: "GET",
            url: "/c10/api/query/asset-device",
            params: {
                customerId: customerId,
                assetId: assetId,
                deviceId: deviceId
            }
        }).
        then(function success(data) {
                $scope.showData = true;
                $scope.searchData = data.data
                $scope.everyPageLength = 10;
                $scope.showPageLength = 10;
                cutData($scope.searchData, $scope)

            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    };
});
app.controller('c10history', function(cutData, $scope, $http) {
    initDatePicker();
    $scope.customers = [];
    $scope.limits = [];
    $scope.heads = [];
    $scope.searchData = [];
    $scope.showData = false;
    $scope.deviceSelect = '';
    $http({
        method: "GET",
        url: "/c10/api/query/history-data/parameter"
    }).
    then(function success(data) {
            $scope.data = data.data;
            $scope.customers = data.data.customers;
            $scope.seriesList = data.data.series;
        },
        function error(resp) {
            if (resp.data.status == 401) {
                refreshJwtToken($http);
            }
        })
	
	$scope.outExcel = function() {
		
		var deviceId = document.getElementById('deviceData').value;
        var keys = getSerieSelects();
        // var deviceId = '49eddeb0-bfae-11e7-88e5-9d4308cf813f';
        // var keys = 'xxx,act_pwr,b_freq'
		
		var startStr;
		var endStr;
		if($("#reportrange").val() != ""){
			var daterange = $("#reportrange").val().split(" - ");
			startStr = daterange[0].trim();
			endStr = daterange[1].trim();
		} else {
			alert("请选择时间范围！");
			return;
		}

        var date = new Date(startStr);
        var humanDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        startTs = (humanDate.getTime() / 1000 - 8 * 60 * 60) + '000';

        date = new Date(endStr);
        humanDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        endTs = (humanDate.getTime() / 1000 - 8 * 60 * 60) + '000';

        interval = document.getElementById('interval').value;
        limit = document.getElementById('limitData').value;
		
		$http({
            method: "get",
            url: "/c10/api/query/outexcel",
            params: {
                deviceId: deviceId,
                startTs: startTs,
                keys: keys,
                endTs: endTs,
                interval: interval,
                limit: limit
            },
			responseType: 'arraybuffer'
        }).
        then(function success(data) {
			var blob = new Blob([data.data], {type: "application/vnd.ms-excel"});
			var objectUrl = URL.createObjectURL(blob);
			var a = document.createElement('a');
			document.body.appendChild(a);
			a.setAttribute('style', 'display:none');
			a.setAttribute('href', objectUrl);
			var filename = "历史数据.xls";
			a.setAttribute('download', filename);
			a.click();
			URL.revokeObjectURL(objectUrl);
		},
		function error(resp) {
			console.log(resp)
			if (resp.data.status == 401) {
				refreshJwtToken($http);
			}
		})
		
		
	}
	
    $scope.exportExcel = function() {
		exportExcel()
    }
    $scope.c = function() {
        console.log($scope.seriesList);
    };
    $scope.hisData = null;
    $scope.hisNo = false;
    $scope.hisYes = false;
    $scope.c1 = function() {};
    $scope.c2 = function() {
        $scope.hisData = null;
        if ($scope.device != undefined) {
            $scope.deviceSelect = $scope.device['id'];
            document.getElementById('deviceData').value = $scope.deviceSelect;
            $http({
                method: "GET",
                url: '/c10/api/query/history-data/parameter/keys?deviceId=' + $scope.device['id']
            }).
            then(function success(data) {
                    console.log(data.data)
                    if (data.data == "") {
                        $scope.hisData = "没有数据,请重新选择";
                        $scope.hisNo = true;
                        $scope.hisYes = false;
                    } else {
                        $scope.hisData = data.data;
                        $scope.hisNo = false;
                        $scope.hisYes = true;
                    }
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                })
        }
    };

    $scope.search = function() {
        var deviceId = document.getElementById('deviceData').value;
        var keys = getSerieSelects();
        // var deviceId = '49eddeb0-bfae-11e7-88e5-9d4308cf813f';
        // var keys = 'xxx,act_pwr,b_freq'
		var startStr;
		var endStr;
		if($("#reportrange").val() != ""){
			var daterange = $("#reportrange").val().split(" - ");
			startStr = daterange[0].trim();
			endStr = daterange[1].trim();
		} else {
			alert("请选择时间范围！");
			return;
		}
		
        var date = new Date(startStr);
        var humanDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        startTs = (humanDate.getTime() / 1000 - 8 * 60 * 60) + '000';
		console.log(startTs);
        date = new Date(endStr);
        humanDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        endTs = (humanDate.getTime() / 1000 - 8 * 60 * 60) + '000';

        interval = document.getElementById('interval').value;
        limit = document.getElementById('limitData').value;

        if (deviceId == '') {
            alert('机组信息不能为空，请选择!')
            return;
        }

        if (keys == '') {
            alert('机组遥测参数不能为空，请选择!')
            return;
        }

        $http({
            method: "get",
            url: "/c10/api/query/history-data",
            params: {
                deviceId: deviceId,
                startTs: startTs,
                keys: keys,
                endTs: endTs,
                interval: interval,
                limit: limit
            }
        }).
        then(function success(data) {

                initChat(data.data.data);

                $scope.heads = data.data.head;
                /* for (var key in data.data.head) {
                     $scope.heads.push(data.data.head[key]);
                 }*/

                /*                        $scope.heads.push('出厂编号');
                                        $scope.heads.push('采集时间');
                                        $scope.heads.push('母排功率');
                                        $scope.heads.push('有功功率');*/
                $scope.searchData = data.data.data
                $scope.everyPageLength = 10;
                $scope.showPageLength = 10;
                cutData($scope.searchData, $scope)
                $scope.showData = true;
                getSerieSelects();

            },
            function error(resp) {
                console.log(resp)
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    };


});

// <!--获取遥测参数复选框的值-->
function getSerieSelects() {
    var obj = document.getElementsByName('serieKeys');
    var s = '';
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].checked) s += obj[i].value + ',';
    }
    s = s.substring(0, s.length - 1);
    return s;
}

// <!--初始化时间控件-->
function initDatePicker() {
	
	laydate.render({
		elem: '#reportrange',
		type: 'datetime',
		range: true
	}); 
	
}

//获取随机数
function GetRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));

}

// <!--根据json数据获取趋势数据集合-->
function getChart(data) {

    var lineChartData = {
        labels: [],
        datasets: []
    };




    var datasets = [];
    for (var key in data[0]) {
        if (key != 'prod_no' && key != 'ts') {
            var obj = {
                label: '',
                borderColor: 'rgba(' + GetRandomNum(1, 255) + ',' + GetRandomNum(1, 255) + ', ' + GetRandomNum(1, 255) + ', 1)',
                fill: false,
                data: []
            };
            obj.label = key;
            datasets.push(obj);
        }
    }
    var temp = 0;
    for (var i = 0; i < data.length; i++) {
        for (var item in data[i]) {
            if (item != 'prod_no' && item != 'ts') {
                for (var m = 0; m < datasets.length; ++m) {
                    if (datasets[m].label == item) {
                        datasets[m].data.push(parseFloat(data[i][item]));
                    }
                }
            } else if (item == 'ts') {
                /* if(i==0){
                    temp = data[i][item];
                }else if(i<100){
                    lineChartData.labels.push((data[i][item]-temp)/1000);
                    temp =data[i][item];
                } */

                var unixTimestamp = new Date(data[i][item]);
                lineChartData.labels.push(unixTimestamp.toLocaleString());
            }
        }

    }
    lineChartData.datasets = datasets;
    return lineChartData;
}

//初始化趋势图
function initChat(data) {
    // var lineChartCanvas = document.getElementById("lineChart1").getContext('2d');
    // var lineChartData = getChart(data);
    // var lineChartOptions = {
    //     responsive: true
    // };
    // var lineChart = new Chart(lineChartCanvas, {
    //     type: 'line',
    //     data: lineChartData,
    //     options: lineChartOptions
    // });
}
//------------alarm-----------
app.filter("filterSeverity", function() {
    return function(input, name) {
        switch (name) {
            case "CRITICAL":
                return '危险';
                break;
            case "MAJOR":
                return '重要';
                break;
            case "MINOR":
                return '次要';
                break;
            case "WARNING":
                return '警告';
                break;
            case "INDETERMINATE":
                return '不确定';
                break;
        }
    }
});
app.filter("filterReason", function() {
    return function(input, reasonFlag) {
        if (reasonFlag == "2") {
            return '(推荐)';
        }
    }
});
app.controller("c10alarm", function($scope, $http) {

    // <!-- 初始化时间-->
    initdatepicker();
    function initdatepicker() {
		laydate.render({
			elem: '#reservation',
			type: 'datetime',
			range: true
		}); 
    }
    // <!-- 此处设置全局变量-->
    var paramValue = "";
    var flagValue = 0;
    var mNumberValue = "";
    var pagearr = baseLocalStorage("jwt_token");
    $scope.tableArray = [];
    $scope.deviceId = null;
    $scope.data = null;
    $scope.dialog = false;
    $scope.pagenum = 0;
    //下拉框变量初始化
    $scope.faultParttern = []; //故障原因
    $scope.functionPart = []; //功能部位
    $scope.pieceImp = []; // 源件重要度
    $scope.pieceSource = []; //源件来源
    $scope.pieceType = []; //源件类别
    $scope.productType = []; //产品类别
    $scope.faultDegree = []; //故障程度
    //导出excel前，没有查询,不能导出
    $scope.canExport = false;

    //初始化 下拉框-客户
    $http({
        method: "get",
        url: "/c10/api/query/history-data/parameter"
    }).
    then(function success(data) {
            $scope.customers = data.data.customers;
        },
        function error(resp) {
            if (resp.data.status == 401) {
                refreshJwtToken($http);
            }
        })
    $scope.p1 = function() {};
    $scope.p2 = function() {};

    //初始化 下拉框-型号
    //王瑞修改
    $http({
        method: "GET",
        url: "/c10/api/tenant/" + pagearr.tenantId + "/product-list"
    }).
    then(function success(data) {
                $scope.mNumbers = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
        // $http({
        //     method: "GET",
        //     //baseLocalStorage('jwt_token').tenantId是临时错误ID 要修改这个后台接口 18/2/28
        //     url: "/c10/api/subclass/" + baseLocalStorage('jwt_token').tenantId
        // }).
        // then(function success(data) {
        //             console.log(data)
        //             $scope.mNumbers = data.data.items;
        //         },
        //         function error(resp) {
        //             if (resp.data.status == 401) {
        //     refreshJwtToken($http);
        // }
        //         })

    // -- --导出excel
    $scope.excel = function() {
        if (!$scope.canExport) {
            alert("先查询，再导出");
            return;
        }
		if($('#reservation').val() == ""){
			alert("请先选择报警日期范围！");
            return;
		}

        $http({
            method: "GET",
            url: "/c10/api/query/excel",
            params: {
                flag: flagValue,
                paramId: paramValue,
                mNumber: mNumberValue,
                time: $('#reservation').val(),
                pageNum: 10000,
                pageSize: 10
            },
            responseType: 'arraybuffer'
        }).
        then(function success(data) {
                var blob = new Blob([data.data], {
                    type: "application/vnd.ms-excel"
                });
                var objectUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display:none');
                a.setAttribute('href', objectUrl);
                var filename = "报警数据导出报表.xls";
                a.setAttribute('download', filename);
                a.click();
                URL.revokeObjectURL(objectUrl);
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }

    //----分页
    $scope.jump = function(num) {
        if (num < 1) {
            alert("请选择大于0页数");
            return;
        }
        $scope.pagenum = num - 1;
        $scope.search($scope.pagenum);

    }
    $scope.upDownFn = function(i) {
            $scope.pagenum = $scope.pagenum + i;
            if ($scope.pagenum <= 0) {
                $scope.pagenum = 0;
            } else if ($scope.pagenum > ($scope.totalPages - 1)) {
                $scope.pagenum = $scope.totalPages - 1
            }
            $scope.search($scope.pagenum)
        }
        //click to search
    $scope.clickSearch = function(num) {
            $scope.pagenum = 0;
            $scope.search(num)
        }
        //---search
    $scope.search = function(num) {
        //查询后，可以导出
        $scope.canExport = true;
        //什么都不选，不让查询（至少要选择客户）       		
        /* if ($("#kehu").val() == "") {
            alert("请选择");
            $scope.tableArray = [];
               cutDataA($scope.tableArray,$scope);                   
            return;
        } */
        //获取级联下拉框参数 1，customerId； 2，groupId；3，deviceId
        if ($("#jizu").val() == "") {
            if ($("#zhandian").val() == "") {
                if ($("#kehu").val() == "") {
                    flagValue = 0;
                } else {
                    paramValue = $scope.customer['id'];
                    flagValue = 1;
                }
            } else {
                paramValue = $scope.asset['id'];
                flagValue = 2;
            }
        } else {
            paramValue = $scope.device['id'];
            flagValue = 3;
        }

        //获取型号参数 （对应为tb_alarm_reason里的a_type字段）
        if ($scope.mNumber == null || $scope.mNumber == 'undefined') {
            //如果为空，sql不去append a_type字段 
            mNumberValue = "";
        } else {
            //王瑞修改
            mNumberValue = $scope.mNumber;
            flagValue = 4;
        }
		
		if($('#reservation').val() == ""){
			alert("请先选择报警日期范围！");
            return;
		}

        $http({
            method: "GET",
            url: "/c10/api/query/queryAlarm",
            params: {
                flag: flagValue,
                paramId: paramValue,
                mNumber: mNumberValue,
                time: $('#reservation').val(),
                pageNum: num,
                pageSize: 10
            }
        }).
        then(function success(data) {
                //totalPages 共几页
                if (data.data.totalNumber % 10 == 0) {
                    $scope.totalPages = data.data.totalNumber / 10;
                } else {
                    $scope.totalPages = (data.data.totalNumber - data.data.totalNumber % 10 + 10) / 10;
                }
                //共多少条
                $scope.numberOfElements = data.data.totalNumber;
                //数据
                $scope.tableData = data.data.list;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    };

    //弹出框 配置
    $scope.dialogshow = function(obj) {
            $scope.aAlarmId = obj;
            $scope.dialog = true;

            var pagearr = baseLocalStorage("jwt_token");
            var Id = '7bbc7e9b-4a68-4ff5-a4ac-2f94c112818b';
            $http({
                method: "GET",
                url: "/c10/api/category/" + Id
            }).
            then(function success(data) {
                    for (var i = 0; i < data.data.subclasses.length; i++) {
                        switch (data.data.subclasses[i].name) {
                            case "故障原因":
                                $scope.faultParttern = data.data.subclasses[i].items;
                                break;
                            case "源件类别":
                                $scope.pieceType = data.data.subclasses[i].items;
                                break;
                            case "源件来源":
                                $scope.pieceSource = data.data.subclasses[i].items;
                                break;
                            case "源件重要度":
                                $scope.pieceImp = data.data.subclasses[i].items;
                                break;
                            case "功能部位":
                                $scope.functionPart = data.data.subclasses[i].items;
                                break;
                            case "故障程度":
                                $scope.faultDegree = data.data.subclasses[i].items;
                                break;
                            case "产品类别":
                                $scope.productType = data.data.subclasses[i].items;
                                break;
                        }
                    }
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                })
        }
        //关闭
    $scope.close = function() {

            $scope.dialog = false;
        }
        //确认 王瑞修改
    $scope.modaffirm = function() {
        if ($scope.mfaultParttern == null) {
            $scope.dialog = false;
        }
        var params = { alarmId: $scope.aAlarmId };
        if ($scope.queryAlarm.fFaultParttern != null) {
            params['faultParttern'] = $scope.queryAlarm.fFaultParttern;
        }
        if ($scope.queryAlarm.fFunctionPart != null) {
            params['functionPart'] = $scope.queryAlarm.fFunctionPart;
        }
        if ($scope.queryAlarm.fPieceImp != null) {
            params['pieceImp'] = $scope.queryAlarm.fPieceImp;
        }
        if ($scope.queryAlarm.fPieceSource != null) {
            params['pieceSource'] = $scope.queryAlarm.fPieceSource;
        }
        if ($scope.queryAlarm.fPieceType != null) {
            params['pieceType'] = $scope.queryAlarm.fPieceType;
        }
        if ($scope.queryAlarm.fProductType != null) {
            params['productType'] = $scope.queryAlarm.fProductType;
        }
        if ($scope.queryAlarm.fFaultDegree != null) {
            params['faultDegree'] = $scope.queryAlarm.fFaultDegree;
        }
        $http({
            method: "GET",
            url: "/api/query/update",
            params: params
        }).
        then(function success(data) {
                alert("修改成功");
                //search
                $http({
                    method: "GET",
                    url: "/api/query/queryAlarm",
                    params: {
                        flag: flagValue,
                        paramId: paramValue,
                        mNumber: mNumberValue,
                        time: $('#reservation').val(),
                        pageNum: $scope.pagenum,
                        pageSize: 10
                    }
                }).
                then(function success(data) {
                        $scope.tableData = data.data.list;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    })
                $scope.dialog = false;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });

    }
});
app.controller('c10custom', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = null;
    $scope.myshow = false;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.setshow = false;
    $scope.submitTitle = false;
    $scope.id = null;
    $scope.updata = {
        "name": "",
        "country": "",
        "address": "",
        "phone": ""
    };
    $scope.area = {
        "dashboardId": '',
        "url": ''
    }
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.set = function(id) {
        $scope.id = id;
        $scope.setshow = true;
    }
    $scope.setaffirm = function() {
        $http({
            method: "GET",
            url: "/c10/api/customer/" + $scope.id + "/updata-url",
            data: $scope.area
        }).
        then(function success(data) {},
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/customers",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.go($scope.pagenum)
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].title)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/customer/" + obj[0].id,
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data
                        $scope.myshow = false;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.newData = datas;
        $scope.myshow = true;
        $scope.modshow = true;
    }
    $scope.close = function() {
        $scope.newData = null;
        $scope.updata = {
            "name": "",
            "type": ""
        };
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.setshow = false;
        $scope.submitTitle = false;
    }
    $scope.modaffirm = function() {
        if ($scope.newData.title == "") {
            $scope.submitTitle = true;
        } else {
            $scope.submitTitle = false;
            $http({
                method: "PUT",
                url: "/c10/api/customer/" + $scope.newData.id,
                data: $scope.newData
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data
                    $scope.modshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.addaffirm = function() {
        if ($scope.updata.title == undefined) {
            $scope.submitTitle = true;
        } else {
            $scope.submitTitle = false;
            $http({
                method: "POST",
                url: "/c10/api/customer",
                data: $scope.updata
            }).
            then(function success(data) {
                    location.reload()
                    $scope.updata = {
                        "name": "",
                        "type": ""
                    };
                    $scope.addshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.add = function() {
        $scope.addshow = true;
        $scope.myshow = true;

    }
    $scope.alldel = function() {

    }
});

app.controller('c10page', function($scope, $http, Upload) {
    $scope.pagenum = 0;
    $scope.selectseries = "";
    $scope.num = null;
    $scope.newData = null;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.catalog = [];
    $scope.series = [];
    $scope.TnewVal = '';
    $scope.BnewVal = '';
    $scope.examshow = false;
    $scope.submitAddClientNum = false;
    $scope.submitSelecItem = false;
    $scope.examinedata = [];
    $scope.clientarr = [];
    $scope.pinId = '';
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.updata = {};
    $scope.newObj = {}
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }

    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/assets",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.go($scope.pagenum)
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].name)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/asset/" + obj[0].id,
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data

                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.examine = function(ind) {
        $scope.pinId = $scope.data[ind].id
        $http({
            method: "GET",
            url: "/c10/api/asset/" + $scope.pinId + "/parameters"
        }).
        then(function success(data) {
                $scope.examinedata = data.data.content;
                $scope.examshow = true;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.tablechange = function(newind, tablemodel) {
        $scope.examinedata[newind].value = tablemodel
    }
    $scope.tableaffirm = function() {
        $http({
            method: "PUT",
            url: "/c10/api/asset/" + $scope.pinId + "/parameters",
            data: $scope.examinedata
        }).
        then(function success(data) {
                $scope.examshow = false;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.newData = datas;
        console.log($scope.newData);
        var assetId = $scope.newData.id;

        $http({
            method: "GET",
            url: "/c10/api/asset/" + assetId + "/attributes"
        }).
        then(
            function success(data) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i]["key"] == "loc_deploy") {
                        $scope.updatafile = "/static/proxy/" + data.data[i]["value"];
                        $scope.oldfile = data.data[i]["value"];
                    }
                }
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            }
        )

        $scope.modshow = true;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/category-list",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.catalog = data.data
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/customer-list"
        }).
        then(function success(data) {
                $scope.clientarr = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.add = function() {
        $scope.addshow = true;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/category-list",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.catalog = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/customer-list"
        }).
        then(function success(data) {
                $scope.clientarr = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.newObj = {};
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.examshow = false;
        $scope.submitAddClientNum = false;
        $scope.submitSelecItem = false;
    }

    $scope.$watch('selectseries', function(newValue, oldValue) {
        if (newValue != oldValue) {
            var i = 0;
            len = $scope.catalog.length;
            if (!newValue) {
                $scope.series = [];
                return;
            }
            for (i; i < len; i++) {
                if ($scope.catalog[i].id == $scope.selectseries) {
                    $scope.series = $scope.catalog[i].subclasses;
                }
            }
            $scope.districts = [];
        }
    });

    $scope.$watch('selectitem', function(newValue, oldValue) {
        $scope.newObj.subclassId = newValue;
        $scope.updata.subclassId = newValue;
        $scope.updata.type = "ZD";
    });

    function doUpdate(data) {
        var file = "";
        if (data != null && data.file != null) {
            file = data.file;
        }
        $scope.newObj.name = $scope.newData.name;
        $scope.newObj.country = $scope.newData.country;
        $scope.newObj.state = $scope.newData.state;
        $scope.newObj.city = $scope.newData.city;
        $scope.newObj.address = $scope.newData.address;
        $scope.newObj.type = $scope.newData.type;
        $scope.newObj.title = $scope.newData.title;
        $scope.newObj.customerId = $scope.clientnum;

        if ($scope.newObj.customerId == undefined) {
            $scope.submitAddClientNum = true;
        } else {
            $scope.submitAddClientNum = false;
        }
        if ($scope.newObj.subclassId == undefined) {
            $scope.submitSelecItem = true;
        } else {
            $scope.submitSelecItem = false;
        }
        if ($scope.newObj.customerId !== undefined && $scope.newObj.subclassId !== undefined && $scope.newObj.name !== undefined) {
            $http({
                method: "PUT",
                url: "/c10/api/asset/" + $scope.newData.id + "?file=" + file,
                data: $scope.newObj
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data;
                    $scope.modshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }

    $scope.modaffirm = function() {
        if ($scope.updatafile != "" && $scope.oldfile != null && $scope.updatafile != "/static/proxy/" + $scope.oldfile) {
            $http({
                method: "DELETE",
                url: "/c10/api/upload?file=" + $scope.oldfile
            }).
            then(
                function success(data) {
                    Upload.upload({
                        //服务端接收
                        url: 'c10/api/upload',
                        //上传的文件
                        file: $scope.updatafile
                    }).progress(function(evt) {
                        //进度条
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    }).success(function(data, status, headers, config) {
                        console.log(data);
                        doUpdate(data);
                    }).error(function(data, status, headers, config) {
                        //上传失败
                        console.log('error status: ' + status);
                    });
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                }
            );
        } else if ($scope.updatafile != "" && $scope.oldfile == null) {
            Upload.upload({
                //服务端接收
                url: 'c10/api/upload',
                //上传的文件
                file: $scope.updatafile
            }).progress(function(evt) {
                //进度条
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config) {
                console.log(data);
                doUpdate(data);
            }).error(function(data, status, headers, config) {
                //上传失败
                console.log('error status: ' + status);
            });
        } else {
            doUpdate(null);
        }
    }

    function doAdd(data) {
        var file = "";
        if (data != null && data.file != null) {
            file = data.file;
        }
        $scope.newObj.name = $scope.updata.name;
        $scope.newObj.type = $scope.updata.type;
        $scope.newObj.country = $scope.updata.country;
        $scope.newObj.state = $scope.updata.state;
        $scope.newObj.address = $scope.updata.address;
        $scope.newObj.city = $scope.updata.city;
        $scope.newObj.title = $scope.updata.title;
        $scope.newObj.customerId = $scope.addclientnum;
        if ($scope.newObj.customerId == undefined) {
            $scope.submitAddClientNum = true;
        } else {
            $scope.submitAddClientNum = false;
        }
        if ($scope.newObj.subclassId == undefined) {
            $scope.submitSelecItem = true;
        } else {
            $scope.submitSelecItem = false;
        }
        if ($scope.newObj.customerId !== undefined && $scope.newObj.subclassId !== undefined && $scope.newObj.name !== undefined) {
            $http({
                method: "POST",
                url: "/c10/api/asset?file=" + file,
                data: $scope.newObj
            }).
            then(function success(data) {
                    location.reload()
                    $scope.updata = {
                        "name": "",
                        "type": ""
                    };
                    $scope.addshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }

    $scope.addaffirm = function() {
        if ($scope.file != undefined && $scope.file != "" && $scope.file != null) {
            Upload.upload({
                //服务端接收
                url: 'c10/api/upload',
                //上传的文件
                file: $scope.file
            }).progress(function(evt) {
                //进度条
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config) {
                console.log(data);
                doAdd(data);
            }).error(function(data, status, headers, config) {
                //上传失败
                console.log('error status: ' + status);
            });
        } else {
            doAdd(null);
        }
    }

    $scope.alldel = function() {

    }
});

app.controller('c10gateway', function(cutData, $scope, $http) {
    $scope.pagenum = 0;
    $scope.selectseries = "";
    $scope.num = null;
    $scope.newData = {};
    $scope.myshow = false;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.remindShow = false;
    $scope.catalog = [];
    $scope.assets = [];
    $scope.TnewVal = '';
    $scope.BnewVal = '';
    $scope.examshow = false;
    $scope.examinedata = [];
    $scope.pinId = '';
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.assetId = null;
    $scope.updata = {};
    $scope.submitName = false;
    $scope.submitProNo = false;
    $scope.submitAssetsNum = false;
    $scope.submitSelItem = false;
    $scope.runtime = null;
    $scope.timeLineArr = null;
    $scope.isdisabled = false;
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.clientarr = [];
    $scope.newObj = {}
    $scope.sitearr = null;
    $scope.checkText = "";
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.isCheck = function(a, data, evt) {
        if (a) {
            $scope.isdisabled = true;
            if (confirm("是否处理")) {
                $http({
                    method: "PUT",
                    url: "/c10/api/confirmAlarm",
                    params: {
                        id: data.id
                    }
                }).
                then(function success(data) {
                        // $(evt.target).disabled = false;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            } else {
                $(evt.target).prop("checked", false);
                $(evt.target).prop("disabled", false);
                a = !a;

            }
        }
    };
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/devices",
            params: {
				type: "GATEWAY",
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.go($scope.pagenum)
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].name)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/device/" + obj[0].id,
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data
                        $scope.myshow = false;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.remind = function(obj) {
        $http({
            method: "GET",
            url: "/c10/api/device/" + obj.id + "/maintain-timeline",
        }).
        then(function success(data) {
                $scope.timeLineArr = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
        $http({
            method: "GET",
            url: "/c10/api/device/" + obj.id
        }).
        then(function success(data) {
                $scope.runtime = data.data.runtime;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
        $http({
            method: "GET",
            url: "/c10/api/deviceAlarm",
            params: {
                deviceId: obj.id
            }
        }).
        then(function success(data) {
                $scope.everyPageLength = 5;
                $scope.showPageLength = 5;
                cutData(data.data.content, $scope)
                $scope.remindShow = true;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.examine = function(ind) {
        $scope.pinId = $scope.data[ind].id
        $http({
            method: "GET",
            url: "/c10/api/device/" + $scope.pinId + "/credentials"
        }).
        then(function success(data) {
				$scope.credential = data.data;
                $scope.examshow = true;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
	
	$scope.saveCredential = function(){
		$scope.newObj = $scope.credential;
		$http({
			method: "POST",
			url: "/c10/api/device/credentials",
			data: $scope.newObj
		}).
		then(function success(data) {
			$scope.examshow = false;
		},
		function error(resp) {
			if (resp.data.status == 401) {
				refreshJwtToken($http);
			}
		});
	}
	
    $scope.tablechange = function(newind, tablemodel) {
        $scope.examinedata[newind].value = tablemodel
    }
    $scope.tableaffirm = function() {
        $http({
            method: "PUT",
            url: "/c10/api/device/" + $scope.pinId + "/parameters",
            data: $scope.examinedata
        }).
        then(function success(data) {
                $scope.examshow = false;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.newData = datas;
        $scope.myshow = true;
        $scope.modshow = true;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/category-list",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.catalog = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/customer-list"
        }).
        then(function success(data) {
                $scope.clientarr = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

        //王瑞修改
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/product-list"
        }).
        then(function success(data) {
                $scope.product = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

    }
    $scope.$watch('clientnum', function(newValue, oldValue) {
        if (newValue != oldValue) {
            var i = 0;
            len = $scope.clientarr.length;
            if (!newValue) {
                $scope.assets = [];
                return;
            }
            for (i; i < len; i++) {
                if ($scope.clientarr[i].id == $scope.clientnum) {
                    $scope.assets = $scope.clientarr[i].assets;
                }
            }
        }
    });

    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.examshow = false;
        $scope.submitName = false;
        $scope.submitProNo = false;
        $scope.submitAssetsNum = false;
        $scope.submitSelItem = false;
        $scope.remindShow = false;
    };


    $scope.$watch('selectseries', function(newValue, oldValue) {
        if (newValue != oldValue) {
            var i = 0;
            len = $scope.catalog.length;
            if (!newValue) {
                $scope.series = [];
                return;
            }
            for (i; i < len; i++) {
                if ($scope.catalog[i].id == $scope.selectseries) {
                    $scope.series = $scope.catalog[i].subclasses;
                }
            }
            $scope.districts = [];
        }
    });

    $scope.$watch('selectitem', function(newValue, oldValue) {
        $scope.newObj.subclassId = newValue;
        $scope.updata.subclassId = newValue;
        $scope.updata.type = "GATEWAY";
    });
    $scope.modaffirm = function() {
        $scope.newObj.productionNo = $scope.newData.productionNo;
        $scope.newObj.type = "GATEWAY";
        //王瑞修改
        if ($scope.newObj.productionNo == undefined) {
            $scope.submitProNo = true;
        } else {
            $scope.submitProNo = false;
        }
        if ($scope.newObj.productionNo !== undefined) {
            $scope.submitName = false;
            $scope.submitProNo = false;
            $scope.submitAssetsNum = false;
            $scope.submitSelItem = false;
            $http({
                method: "PUT",
                url: "/c10/api/gateway/" + $scope.newData.id,
                data: $scope.newObj
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data;
                    $scope.modshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }

    $scope.addaffirm = function() {
        $scope.newObj.productionNo = $scope.updata.productionNo;
        $scope.newObj.type = "GATEWAY";
        //王瑞修改
        if ($scope.newObj.productionNo == undefined) {
            $scope.submitProNo = true;
        } else {
            $scope.submitProNo = false;
        }
        if ($scope.newObj.productionNo !== undefined) {
            $scope.submitName = false;
            $scope.submitProNo = false;
            $scope.submitAssetsNum = false;
            $scope.submitSelItem = false;
            $http({
                method: "POST",
                url: "/c10/api/gateway",
                data: $scope.newObj,
				params: {
					additionalInfo:"{\"gateway\":true}"
				}
            }).
            then(function success(data) {
                    location.reload()
                    $scope.updata = {};
                    $scope.addshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.add = function() {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/category-list",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.catalog = data.data

            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/customer-list"
        }).
        then(function success(data) {
                $scope.clientarr = data.data;
                $scope.addshow = true;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

        //王瑞修改
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/product-list"
        }).
        then(function success(data) {
                $scope.product = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

    }
    $scope.alldel = function() {

    }
});

app.controller('c10machine', function(cutData, $scope, $http) {
    $scope.pagenum = 0;
    $scope.selectseries = "";
    $scope.num = null;
    $scope.newData = {};
    $scope.myshow = false;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.remindShow = false;
    $scope.catalog = [];
    $scope.assets = [];
    $scope.TnewVal = '';
    $scope.BnewVal = '';
    $scope.examshow = false;
    $scope.examinedata = [];
    $scope.pinId = '';
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.assetId = null;
    $scope.updata = {};
    $scope.submitName = false;
    $scope.submitProNo = false;
    $scope.submitAssetsNum = false;
    $scope.submitSelItem = false;
    $scope.runtime = null;
    $scope.timeLineArr = null;
    $scope.isdisabled = false;
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.clientarr = [];
    $scope.newObj = {}
    $scope.sitearr = null;
    $scope.checkText = "";
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.isCheck = function(a, data, evt) {
        if (a) {
            $scope.isdisabled = true;
            if (confirm("是否处理")) {
                $http({
                    method: "PUT",
                    url: "/c10/api/confirmAlarm",
                    params: {
                        id: data.id
                    }
                }).
                then(function success(data) {
                        // $(evt.target).disabled = false;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            } else {
                $(evt.target).prop("checked", false);
                $(evt.target).prop("disabled", false);
                a = !a;

            }
        }
    };
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/devices",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.go($scope.pagenum)
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].name)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/device/" + obj[0].id,
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data
                        $scope.myshow = false;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.remind = function(obj) {
        $http({
            method: "GET",
            url: "/c10/api/device/" + obj.id + "/maintain-timeline",
        }).
        then(function success(data) {
                $scope.timeLineArr = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
        $http({
            method: "GET",
            url: "/c10/api/device/" + obj.id
        }).
        then(function success(data) {
                $scope.runtime = data.data.runtime;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
        $http({
            method: "GET",
            url: "/c10/api/deviceAlarm",
            params: {
                deviceId: obj.id
            }
        }).
        then(function success(data) {
                $scope.everyPageLength = 5;
                $scope.showPageLength = 5;
                cutData(data.data.content, $scope)
                $scope.remindShow = true;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.examine = function(ind) {
        $scope.pinId = $scope.data[ind].id
        $http({
            method: "GET",
            url: "/c10/api/device/" + $scope.pinId + "/parameters"
        }).
        then(function success(data) {
                $scope.examinedata = data.data.content;
                $scope.everyPageLength = 5;
                $scope.showPageLength = 5;
                cutData($scope.examinedata, $scope)
                $scope.examshow = true;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.tablechange = function(newind, tablemodel) {
		for(var i=0;i<$scope.examinedata.length;i++){
			if($scope.examinedata[i].keyChar == newind){
				$scope.examinedata[i].value = tablemodel;
			}
		}
    }
    $scope.tableaffirm = function() {
        $http({
            method: "PUT",
            url: "/c10/api/device/" + $scope.pinId + "/parameters",
            data: $scope.examinedata
        }).
        then(function success(data) {
                $scope.examshow = false;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.newData = datas;
        $scope.myshow = true;
        $scope.modshow = true;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/category-list",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.catalog = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/customer-list"
        }).
        then(function success(data) {
                $scope.clientarr = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

        //王瑞修改
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/product-list"
        }).
        then(function success(data) {
                $scope.product = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

    }
    $scope.$watch('clientnum', function(newValue, oldValue) {
        if (newValue != oldValue) {
            var i = 0;
            len = $scope.clientarr.length;
            if (!newValue) {
                $scope.assets = [];
                return;
            }
            for (i; i < len; i++) {
                if ($scope.clientarr[i].id == $scope.clientnum) {
                    $scope.assets = $scope.clientarr[i].assets;
                }
            }
        }
    });

    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.examshow = false;
        $scope.submitName = false;
        $scope.submitProNo = false;
        $scope.submitAssetsNum = false;
        $scope.submitSelItem = false;
        $scope.remindShow = false;
    };


    $scope.$watch('selectseries', function(newValue, oldValue) {
        if (newValue != oldValue) {
            var i = 0;
            len = $scope.catalog.length;
            if (!newValue) {
                $scope.series = [];
                return;
            }
            for (i; i < len; i++) {
                if ($scope.catalog[i].id == $scope.selectseries) {
                    $scope.series = $scope.catalog[i].subclasses;
                }
            }
            $scope.districts = [];
        }
    });

    $scope.$watch('selectitem', function(newValue, oldValue) {
        $scope.newObj.subclassId = newValue;
        $scope.updata.subclassId = newValue;
        $scope.updata.type = "ZD";
    });
    $scope.modaffirm = function() {
        $scope.newObj.name = $scope.newData.name;
        $scope.newObj.country = $scope.newData.country;
        $scope.newObj.state = $scope.newData.state;
        $scope.newObj.city = $scope.newData.city;
        $scope.newObj.address = $scope.newData.address;
        $scope.newObj.productionNo = $scope.newData.productionNo;
        $scope.newObj.type = $scope.newData.type;
        $scope.newObj.title = $scope.newData.title;
        $scope.newObj.customerId = $scope.clientnum;
        $scope.newObj.assetId = $scope.assetsnum;
        //王瑞修改
        $scope.newObj.productId = $scope.productnum;
        if ($scope.newObj.name == undefined) {
            $scope.submitName = true;
        } else {
            $scope.submitName = false;
        }
        if ($scope.newObj.productionNo == undefined) {
            $scope.submitProNo = true;
        } else {
            $scope.submitProNo = false;
        }
        if ($scope.newObj.assetId == undefined) {
            $scope.submitAssetsNum = true;
        } else {
            $scope.submitAssetsNum = false;
        }
        if ($scope.newObj.subclassId == undefined) {
            $scope.submitSelItem = true;
        } else {
            $scope.submitSelItem = false;
        }
        if ($scope.newObj.name !== undefined && $scope.newObj.productionNo !== undefined && $scope.newObj.assetId !== undefined && $scope.newObj.subclassId !== undefined) {
            $scope.submitName = false;
            $scope.submitProNo = false;
            $scope.submitAssetsNum = false;
            $scope.submitSelItem = false;
            $http({
                method: "PUT",
                url: "/c10/api/device/" + $scope.newData.id,
                data: $scope.newObj
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data;
                    $scope.modshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }

    $scope.addaffirm = function() {
        $scope.newObj.name = $scope.updata.name;
        $scope.newObj.country = $scope.updata.country;
        $scope.newObj.state = $scope.updata.state;
        $scope.newObj.city = $scope.updata.city;
        $scope.newObj.productionNo = $scope.updata.productionNo;
        $scope.newObj.address = $scope.updata.address;
        $scope.newObj.type = $scope.updata.type;
        $scope.newObj.title = $scope.updata.title;
        $scope.newObj.customerId = $scope.clientnum;
        $scope.newObj.assetId = $scope.assetsnum;
        //王瑞修改
        $scope.newObj.productId = $scope.productnum;
        if ($scope.newObj.name == undefined) {
            $scope.submitName = true;
        } else {
            $scope.submitName = false;
        }
        if ($scope.newObj.productionNo == undefined) {
            $scope.submitProNo = true;
        } else {
            $scope.submitProNo = false;
        }
        if ($scope.newObj.assetId == undefined) {
            $scope.submitAssetsNum = true;
        } else {
            $scope.submitAssetsNum = false;
        }
        if ($scope.newObj.subclassId == undefined) {
            $scope.submitSelItem = true;
        } else {
            $scope.submitSelItem = false;
        }
        if ($scope.newObj.name !== undefined && $scope.newObj.productionNo !== undefined && $scope.newObj.assetId !== undefined && $scope.newObj.subclassId !== undefined) {
            $scope.submitName = false;
            $scope.submitProNo = false;
            $scope.submitAssetsNum = false;
            $scope.submitSelItem = false;
            $http({
                method: "POST",
                url: "/c10/api/device",
                data: $scope.newObj
            }).
            then(function success(data) {
                    location.reload()
                    $scope.updata = {};
                    $scope.addshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.add = function() {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/category-list",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.catalog = data.data

            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/customer-list"
        }).
        then(function success(data) {
                $scope.clientarr = data.data;
                $scope.addshow = true;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

        //王瑞修改
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/product-list"
        }).
        then(function success(data) {
                $scope.product = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })

    }
    $scope.alldel = function() {

    }
});
app.controller('c10product', function($scope, $http, Upload) {
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.data = null;
    $scope.pinId = null;
    $scope.citys = null;
    $scope.districts = null;
    $scope.pagenum = 0;
    $scope.modarr = null;
    $scope.addshow = false;
    $scope.modshow = false;
    $scope.addparamshow = false;
    $scope.disCode = false;
    $scope.submitCode = false;
    $scope.submitName = false;
    $scope.submitMoreSelect = false;
    $scope.examineNum = 0;
    $scope.updata = {
        "code": "",
        "name": "",
        "remark": ""
    };
    $scope.newObj = {
        "code": "",
        "name": "",
        "remark": ""
    }
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }

    $scope.tableValchange = function(newind, tdVal) {
        $scope.examinedata[newind].value = tdVal;
    }
    $scope.tableUnitchange = function(newind, tdUnit) {
        $scope.examinedata[newind].unit = tdUnit;
    }
    $scope.diaMod = function(datas, ind) {
        $http({
            method: "PUT",
            url: "/c10/api/specification/" + datas.id,
            data: {
                "productId": $scope.pinId,
                "value": $scope.examinedata[ind].value,
                "unit": $scope.examinedata[ind].unit,
                "code": datas.code,
                "name": datas.name
            }
        }).
        then(function success(data) {},
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.diaAdd = function(series) {
        $scope.addparamshow = true;
        // $scope.id = $scope.data[ind].id;
        $scope.seriesId = series;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/category-list",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.modarr = data.data
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.diaDel = function(id, ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.examinedata[ind].name)) {
                $http({
                    method: "DELETE",
                    url: "/c10/api/specification/" + id
                }).
                then(function success(data) {
                        alert("已删除");
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    })
            }
        }

    }
    $scope.diaAddParm = function() {
        if ($scope.moreselect !== undefined) {
            $scope.submitMoreSelect = false;;
            $http({
                method: "POST",
                url: "/c10/api/product/" + $scope.seriesId + "/specifications",
                data: $scope.moreselect
            }).
            then(function success(data) {
                    $scope.addparamshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                })
        } else {
            $scope.submitMoreSelect = true;
        }
    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/products",
            params: {
                page: num,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.go($scope.pagenum);
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].name)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/product/" + obj[0].id,
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.$watch('selectedProvince', function(newValue, oldValue) {
        if (newValue != oldValue) {
            var i = 0;
            len = $scope.modarr.length;
            if (!newValue) {
                $scope.citys = [];
                return;
            }
            for (i; i < len; i++) {
                if ($scope.modarr[i].id == $scope.selectedProvince) {
                    $scope.citys = $scope.modarr[i].subclasses;
                }
            }
            $scope.districts = [];
        }
    });
    $scope.$watch('selectedCity', function(newValue, oldValue) {
        if (newValue != oldValue) {
            if (!newValue) {
                $scope.districts = [];
                return;
            }
            var i = 0;
            len = $scope.citys.length;
            for (i; i < len; i++) {
                if ($scope.citys[i].id == $scope.selectedCity) {
                    $scope.districts = $scope.citys[i].items;
                }
            }
        }
    });
    $scope.examine = function(id) {
            $scope.pinId = id;
            $scope.examineGo(id, $scope.examineNum);
        }
        //王瑞修改
    $scope.examineGo = function(id, nums) {
        $http({
            method: "GET",
            url: "/c10/api/product/" + id + "/specifications",
            params: {
                size: 10,
                page: nums
            }
        }).
        then(function success(data) {
                $scope.examinedata = data.data.content;
                $scope.minTotalElements = data.data.totalElements;
                $scope.minTotalPages = data.data.totalPages;
                $scope.examshow = true;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }

    $scope.examineJump = function(num) {
        $scope.examineNum = num - 1;
        $scope.examine($scope.pinId, $scope.examineNum)
    }
    $scope.examineUpDownFn = function(i) {
        $scope.examineNum = $scope.examineNum + i;
        if ($scope.examineNum <= 0) {
            $scope.examineNum = 0
        }
        $scope.examine($scope.pinId, $scope.examineNum)
    }


    $scope.tableaffirm = function() {
        $http({
            method: "PUT",
            url: "/c10/api/asset/" + $scope.pinId + "/parameters",
            data: $scope.examinedata
        }).
        then(function success(data) {
                $scope.examshow = false;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.newData = datas;
        $scope.modshow = true;

        var productId = $scope.newData.id;

        $http({
            method: "GET",
            url: "/c10/api/product/" + productId + "/attributes"
        }).
        then(
            function success(data) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i]["key"] == "loc_deploy") {
                        $scope.updatafile = "/static/proxy/" + data.data[i]["value"];
                        $scope.oldfile = data.data[i]["value"];
                    }
                }
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            }
        )

    }
    $scope.add = function() {
        $scope.addshow = true;
    }
    $scope.close = function() {
        $scope.newData = null;
        $scope.updata = {
            "name": "",
            "type": ""
        };
        $scope.newObj = {
            "name": "",
            "code": "",
            "remark": ""
        };
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.examshow = false;
        $scope.addparamshow = false;
        $scope.submitCode = false;
        $scope.submitName = false;
        $scope.submitMoreSelect = false;
    }

    function doUpdate(data) {
        var file = "";
        if (data != null && data.file != null) {
            file = data.file;
        }
        $scope.newObj.code = $scope.newData.code;
        $scope.newObj.name = $scope.newData.name;
        $scope.newObj.remark = $scope.newData.remark;
        if ($scope.newObj.code == null) {
            $scope.submitCode = true;
        } else {
            $scope.submitCode = false;
        }
        if ($scope.newObj.name == "") {
            $scope.submitName = true;
        } else {
            $scope.submitName = false;
        }
        if ($scope.newObj.code !== null && $scope.newObj.name !== "") {
            $scope.submitCode = false;
            $scope.submitName = false;
            $http({
                method: "PUT",
                url: "/c10/api/product/" + $scope.newData.id + "?file=" + file,
                data: $scope.newObj
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data;
                    $scope.modshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }

    }

    $scope.modaffirm = function() {
        if ($scope.updatafile != "" && $scope.oldfile != null && $scope.updatafile != "/static/proxy/" + $scope.oldfile) {
            $http({
                method: "DELETE",
                url: "/c10/api/upload?file=" + $scope.oldfile
            }).
            then(
                function success(data) {
                    Upload.upload({
                        //服务端接收
                        url: 'c10/api/upload',
                        //上传的文件
                        file: $scope.updatafile
                    }).progress(function(evt) {
                        //进度条
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    }).success(function(data, status, headers, config) {
                        doUpdate(data);
                    }).error(function(data, status, headers, config) {
                        //上传失败
                        console.log('error status: ' + status);
                    });
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                }
            );
        } else if ($scope.updatafile != "" && $scope.oldfile == null) {
            Upload.upload({
                //服务端接收
                url: 'c10/api/upload',
                //上传的文件
                file: $scope.updatafile
            }).progress(function(evt) {
                //进度条
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config) {
                doUpdate(data);
            }).error(function(data, status, headers, config) {
                //上传失败
                console.log('error status: ' + status);
            });
        } else {
            doUpdate(null);
        }

    }

    function doAdd(data) {
        var file = "";
        if (data != null && data.file != null) {
            file = data.file;
        }
        $scope.newObj.code = $scope.updata.code;
        $scope.newObj.name = $scope.updata.name;
        $scope.newObj.remark = $scope.updata.remark;
        if ($scope.newObj.code == "" || $scope.newObj.code == undefined) {
            $scope.submitCode = true;
        } else {
            $scope.submitCode = false;
        }
        if ($scope.newObj.name == "") {
            $scope.submitName = true;
        } else {
            $scope.submitName = false;
        }
        if ($scope.newObj.code !== "" && $scope.newObj.name !== "") {
            $scope.submitCode = false;
            $scope.submitName = false;
            $http({
                method: "POST",
                url: "/c10/api/product?file=" + file,
                data: $scope.newObj
            }).
            then(function success(data) {
                    //location.reload()
                    $scope.updata = {
                        "name": "",
                        "type": ""
                    };
                    $scope.addshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }

    }

    $scope.addaffirm = function() {

        if ($scope.file != undefined && $scope.file != "" && $scope.file != null) {
            Upload.upload({
                //服务端接收
                url: 'c10/api/upload',
                //上传的文件
                file: $scope.file
            }).progress(function(evt) {
                //进度条
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config) {
                console.log(data);
                doAdd(data);
            }).error(function(data, status, headers, config) {
                //上传失败
                console.log('error status: ' + status);
            });
        } else {
            doAdd(null);
        }
    }
});
app.controller('c10rule', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.modarr = null;
    $scope.newData = {};
    $scope.myshow = false;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.submitName = false;
    $scope.submitKeyChar = false;
    $scope.submitSymbol1 = false;
    $scope.submitSymbol2 = false;
    $scope.submitProductId = false;
    $scope.submitCycle = false;
    $scope.submitPreWarning = false;
    $scope.submitWarning = false;
    $scope.submitMessage = false;
    $scope.twoshow = false;
    $scope.updata = {};
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    var pagearr = baseLocalStorage("jwt_token");
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.ruleKeyUp = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.go(0);
        }

    }
    $scope.go = function(num) {
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/rules",
            params: {
                page: num,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.search = function() {
        $http({
            method: "GET",
            url: "/c10/api/rules",
            params: {
                productName: $scope.proId,
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.del = function(id, name, ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + name)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/rule/" + id,
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data
                        $scope.myshow = false;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.go($scope.pagenum)
    $scope.mod = function(datas, ind) {
        $scope.newData = datas;
        $scope.newData.warning = String($scope.newData.warning);
        $scope.num = ind;
        $scope.modshow = true;
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/product-list",
            data: $scope.updata
        }).
        then(function success(data) {
                $scope.modarr = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });
    }
    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.twoshow = false;
        $scope.submitName = false;
        $scope.submitKeyChar = false;
        $scope.submitSymbol1 = false;
        $scope.submitSymbol2 = false;
        $scope.submitProductId = false;
        $scope.submitCycle = false;
        $scope.submitPreWarning = false;
        $scope.submitWarning = false;
        $scope.submitMessage = false;
    }
    $scope.changeShow = function() {
        if ($scope.updata.symbol1 !== "0" && $scope.updata.symbol1 !== "1") {
            $scope.twoshow = true;
        } else {
            $scope.twoshow = false;
        }
    }

    $scope.modaffirm = function() {
        if ($scope.newData.name == undefined || $scope.newData.name == "") {
            $scope.submitName = true;
        } else {
            $scope.submitName = false;
        }
        if ($scope.newData.cycle == "") {
            $scope.submitCycle = true;
        } else {
            $scope.submitCycle = false;
        }
        if ($scope.newData.preWarning == "") {
            $scope.submitPreWarning = true;
        } else {
            $scope.submitPreWarning = false;
        }
        if ($scope.newData.warning == "") {
            $scope.submitWarning = true;
        } else {
            $scope.submitWarning = false;
        }
        if ($scope.newData.message == "" || $scope.newData.message == undefined) {
            $scope.submitMessage = true;
        } else {
            $scope.submitMessage = false;
        }
        if ($scope.newData.productId == undefined) {
            $scope.submitProductId = true;
        } else {
            $scope.submitProductId = false;
        }
        if ($scope.newData.name !== undefined && $scope.newData.name !== "" && $scope.newData.productId !== undefined && $scope.newData.cycle !== "" && $scope.newData.preWarning !== "" && $scope.newData.warning !== "" && $scope.newData.message !== "" && $scope.newData.message !== undefined) {
            $scope.newData.tenantId = pagearr.tenantId;
            $http({
                method: "PUT",
                url: "/c10/api/rule/" + $scope.newData.id,
                data: $scope.newData
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data
                    $scope.modshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });

        }

    }
    $scope.addaffirm = function() {
        if ($scope.updata.name == undefined || $scope.updata.name == "") {
            $scope.submitName = true;
        } else {
            $scope.submitName = false;
        }
        if ($scope.updata.cycle == "") {
            $scope.submitCycle = true;
        } else {
            $scope.submitCycle = false;
        }
        if ($scope.updata.preWarning == "") {
            $scope.submitPreWarning = true;
        } else {
            $scope.submitPreWarning = false;
        }
        if ($scope.updata.message == "" || $scope.updata.message == undefined) {
            $scope.submitMessage = true;
        } else {
            $scope.submitMessage = false;
        }
        if ($scope.updata.warning == "") {
            $scope.submitWarning = true;
        } else {
            $scope.submitWarning = false;
        }
        if ($scope.updata.productId == undefined) {
            $scope.submitProductId = true;
        } else {
            $scope.submitProductId = false;
        }
        if ($scope.updata.name !== undefined && $scope.updata.name !== "" && $scope.updata.cycle !== "" && $scope.updata.preWarning !== "" && $scope.updata.warning !== "" && $scope.updata.productId !== undefined && $scope.updata.message !== "" && $scope.updata.message !== undefined) {
            $scope.updata.tenantId = pagearr.tenantId;
            $http({
                method: "POST",
                url: "/c10/api/rule",
                data: $scope.updata
            }).
            then(function success(data) {
                    location.reload()
                    $scope.updata = {};
                    $scope.addshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });

        }

    }

    $scope.add = function() {
        $scope.updata.cycle = "100";
        $scope.updata.preWarning = "24";
        $scope.updata.warning = "false";
        $scope.addshow = true;
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/product-list",
            data: $scope.updata
        }).
        then(function success(data) {
                $scope.modarr = data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });
    }
    $scope.alldel = function() {

    }
});
app.filter("filterrole", function() {
    return function(input, name) {
        switch (name) {
            case "SYS_ADMIN":
                return '系统管理员';
                break;
            case "TENANT_ADMIN":
                return '租户管理员';
                break;
            case "TENANT_USER":
                return '租户用户';
                break;
            case "CUSTOMER_USER":
                return '客户用户';
                break;
        }
    }

});
app.filter("filterset", function() {
    return function(input, data) {
        switch (data) {
            case "TENANT_USER":
                return true;
                break;
            case "CUSTOMER_USER":
                return false;
                break;
        }
    }
});
app.controller('c10user', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = null;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.set = false;
    $scope.setshow = false;
    $scope.setarr = null;
    $scope.id = 0;
    $scope.newArr = [];
    $scope.updata = {
        "username": undefined,
        "firstName": undefined,
        "authority": undefined,
        "customerId": undefined,
        "email": undefined,
        "phone": undefined
    }
    $scope.submitAuthority = false;
    $scope.submitCustomerId = false;
    $scope.submitEmail = false;
    $scope.submitFirstName = false;
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/users",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
                // if(resp.data.status == )
            })
    }
    $scope.go($scope.pagenum)
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].firstName)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/tenant/user/" + obj[0].id,
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.checkclick = function(event, obj) {
        if (event.target.checked) { //true

            $scope.newArr.push(obj)

        } else { //false
            for (var i = 0; i < $scope.newArr.length; i++) {
                if ($scope.newArr[i].id == obj.id) {
                    $scope.newArr.splice(i, 1);
                }
            }
        }
    }

    $scope.setAssets = function(id) {
        $scope.id = id;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/tuser/" + id + "/assigned-assets"
        }).
        then(function success(data) {
                $scope.setarr = data.data;
                $scope.setshow = true;
                for (var i = 0; i < $scope.setarr.length; i++) {
                    for (var j = 0; j < $scope.setarr[i].assignedAssets.length; j++) {
                        if ($scope.setarr[i].assignedAssets[j].selected) {
                            $scope.newArr.push($scope.setarr[i].assignedAssets[j])
                        }
                    }
                }
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });
    }
    $scope.setaffirm = function() {

        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "PUT",
            url: "api/tenant/" + pagearr.tenantId + "/tuser/" + $scope.id + "/assigned-assets",
            data: $scope.newArr
        }).
        then(function success(data) {
                $scope.setshow = false;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });
    }
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.newData = datas;
        $scope.modshow = true;
    }
    $scope.close = function() {
        $scope.newData = null;
        $scope.updata = {
            "name": "",
            "type": ""
        };
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.setshow = false;
        $scope.submitAuthority = false;
        $scope.submitCustomerId = false;
        $scope.submitEmail = false;
        $scope.submitFirstName = false;
    }
    $scope.modaffirm = function() {
        if ($scope.newData.firstName !== "" && $scope.newData.email !== "" && /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($scope.newData.email)) {
            $scope.submitFirstName = false;
            $scope.submitEmail = false;
            $http({
                method: "PUT",
                url: "/c10/api/user/" + $scope.newData.id,
                data: $scope.newData
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data
                    $scope.modshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
        if ($scope.newData.firstName == "") {
            $scope.submitFirstName = true;
        }
        if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($scope.newData.email) == false) {
            $scope.submitEmail = true;
        }
    }
    $scope.addaffirm = function() {
        if ($scope.updata.authority == undefined && $scope.updata.customerId == undefined) { //两个下拉框都不为空
            $scope.submitAuthority = true;
            $scope.submitCustomerId = true;
            $scope.submitEmail = true;
        }
        if ($scope.updata.authority == "TENANT_USER" && $scope.updata.email !== undefined && $scope.updata.firstName !== undefined && $scope.updata.username !== undefined && /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($scope.updata.email)) {
            $scope.submitAuthority = false;
            $scope.submitCustomerId = false;
            $scope.submitEmail = false;
            $http({
                method: "POST",
                url: "/c10/api/user",
                data: $scope.updata
            }).
            then(function success(data) {
                    location.reload()
                    $scope.updata = {
                        "name": "",
                        "type": ""
                    };
                    $scope.addshow = false;
                    location.reload();
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                    // alert(resp.data.message)
                });
        }
        if ($scope.updata.authority == "CUSTOMER_USER" && $scope.updata.customerId == "") {
            $scope.submitCustomerId = true;
        }
        if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($scope.updata.email) == false) {
            $scope.submitEmail = true;
        }
        if ($scope.updata.authority == "CUSTOMER_USER" && $scope.updata.customerId !== undefined && $scope.updata.email !== undefined && $scope.updata.firstName !== undefined && $scope.updata.username !== undefined && /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($scope.updata.email)) {
            $scope.submitAuthority = false;
            $scope.submitCustomerId = false;
            $scope.submitEmail = false;
            $http({
                method: "POST",
                url: "/c10/api/user",
                data: $scope.updata
            }).
            then(function success(data) {
                    location.reload()
                    $scope.updata = {
                        "name": "",
                        "type": ""
                    };
                    $scope.addshow = false;
                    location.reload();
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                    // alert(resp.data.message)
                });
        }


    }
    $scope.customerArr = null;
    $scope.add = function() {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/customer-list"
        }).
        then(function success(data) {
                $scope.customerArr = data.data;
                $scope.addshow = true;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });
    }
    $scope.alldel = function() {

    }
});
app.controller('c10tenant', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = {};
    $scope.myshow = false;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.submitTitle = false;
    $scope.updata = {};
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        $http({
            method: "GET",
            url: "/c10/api/tenants",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.go($scope.pagenum)
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.newData = datas;
        $scope.myshow = true;
        $scope.modshow = true;
    }
    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
    }
    $scope.modaffirm = function() {
        console.log($scope.newData.title)
        if ($scope.newData.title == undefined || $scope.newData.title == "") {
            $scope.submitTitle = true;
        } else {
            $http({
                method: "PUT",
                url: "/c10/api/tenant/" + $scope.newData.id,
                data: $scope.newData
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data
                    $scope.myshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.addaffirm = function() {
        if ($scope.updata.title == undefined || $scope.updata.title == "") {
            $scope.submitTitle = true;
        } else {
            $http({
                method: "POST",
                url: "/c10/api/tenant",
                data: $scope.updata
            }).
            then(function success(data) {
                    location.reload()
                    $scope.updata = {};
                    $scope.myshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }


    }
    $scope.add = function() {
        $scope.addshow = true;
        $scope.myshow = true;

    }
    $scope.alldel = function() {

    }
});
app.controller('c10control', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = {};
    $scope.myshow = false;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.selectarr = null;
    $scope.submitUserName = false;
    $scope.submitFirstName = false;
    $scope.submitEmail = false;
    $scope.submitTenantId = false;
    $scope.updata = {};
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        $http({
            method: "GET",
            url: "/c10/api/tenant-admins",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    }
    $scope.go($scope.pagenum)
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].title)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/tenant-admin/" + obj[0].id,
                    headers: {
                        'Authorization': 'Bearer ' + $.cookie('token')
                    },
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data
                        $scope.myshow = false;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.newData = datas;
        $scope.myshow = true;
        $scope.modshow = true;

    }
    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.submitUserName = false;
        $scope.submitFirstName = false;
        $scope.submitEmail = false;
        $scope.submitTenantId = false;
    }
    $scope.modaffirm = function() {
        console.log($scope.newData.username)
        if ($scope.newData.username == undefined || $scope.newData.username == "") {
            $scope.submitUserName = true;
        } else {
            $scope.submitUserName = false;
        }
        if ($scope.newData.firstName == undefined || $scope.newData.firstName == "") {
            $scope.submitFirstName = true;
        } else {
            $scope.submitFirstName = false;
        }
        if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($scope.newData.email) == false) {
            $scope.submitEmail = true;
        } else {
            $scope.submitEmail = false;
        }
        if ($scope.newData.username !== undefined && $scope.newData.username !== "" && $scope.newData.firstName !== undefined && $scope.newData.firstName !== "" && /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($scope.newData.email)) {
            $scope.submitUserName = false;
            $scope.submitFirstName = false;
            $scope.submitEmail = false;
            $scope.submitTenantId = false;
            $http({
                method: "PUT",
                url: "/c10/api/tenant-admin/" + $scope.newData.id,
                data: $scope.newData
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data
                    $scope.modshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.addaffirm = function() {

        console.log($scope.updata.tenantId)
        if ($scope.updata.username == undefined || $scope.updata.username == "") {
            $scope.submitUserName = true;
        } else {
            $scope.submitUserName = false;
        }
        if ($scope.updata.firstName == undefined || $scope.updata.firstName == "") {
            $scope.submitFirstName = true;
        } else {
            $scope.submitFirstName = false;
        }
        if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($scope.updata.email) == false) {
            $scope.submitEmail = true;
        } else {
            $scope.submitEmail = false;
        }
        if ($scope.updata.tenantId == undefined) {
            $scope.submitTenantId = true;
        } else {
            $scope.submitTenantId = false;
        }
        if ($scope.updata.username !== undefined && $scope.updata.username !== "" && $scope.updata.firstName !== undefined && $scope.updata.firstName !== "" && /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($scope.updata.email) && $scope.updata.tenantId !== undefined) {
            $scope.submitUserName = false;
            $scope.submitFirstName = false;
            $scope.submitEmail = false;
            $scope.submitTenantId = false;
            $http({
                method: "POST",
                url: "/c10/api/tenant-admin",
                data: $scope.updata
            }).
            then(function success(data) {
                    location.reload()
                    $scope.updata = {
                        "name": "",
                        "type": ""
                    };
                    $scope.addshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.add = function() {
        $scope.addshow = true;
        $scope.myshow = true;
        $http({
            method: "GET",
            url: "/c10/api/tenants"
        }).
        then(function success(data) {
                $scope.selectarr = data.data.content;
                console.log($scope.selectarr)
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });
    }
    $scope.alldel = function() {

    }
});
app.controller('c10tenantuserstate', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = null;
    $scope.myshow = false;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.updata = {
        "name": "",
        "country": "",
        "address": "",
        "phone": ""
    };
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tuser/" + pagearr.userId + "/assets",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                console.log(resp);
            })
    }
    $scope.go($scope.pagenum)
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].title)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/customer/" + obj[0].id,
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data
                        $scope.myshow = false;
                    },
                    function error(resp) {
                        console.log(resp);
                    });
            }
        }
    }
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.newData = datas;
        $scope.myshow = true;
        $scope.modshow = true;
    }
    $scope.close = function() {
        $scope.newData = null;
        $scope.updata = {
            "name": "",
            "type": ""
        };
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
    }
    $scope.modaffirm = function() {
        $http({
            method: "PUT",
            url: "/c10/api/customer/" + $scope.newData.id,
            data: $scope.newData
        }).
        then(function success(data) {
                $scope.data[$scope.num] = data.data
                $scope.myshow = false;
            },
            function error(resp) {
                console.log(resp);
            });

    }
    $scope.addaffirm = function() {
        $http({
            method: "POST",
            url: "/c10/api/customer",
            data: $scope.updata
        }).
        then(function success(data) {
                location.reload()
                $scope.updata = {
                    "name": "",
                    "type": ""
                };
                $scope.myshow = false;
            },
            function error(resp) {
                console.log(resp);
            });

    }
    $scope.add = function() {
        $scope.addshow = true;
        $scope.myshow = true;

    }
    $scope.alldel = function() {

    }

    $scope.looktemantuserstate = function(ind) {
        $http({
            method: "GET",
            url: "/c10/api/asset/" + ind + "/parameters"
        }).
        then(function success(data) {
                console.log(data.data.content)
                $scope.num = data.data.content;
                $scope.myshow = true
            },
            function error(resp) {
                console.log(resp);
            })
    }
});
app.controller('c10tenantuserunit', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = null;
    $scope.myshow = false;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.updata = {
        "name": "",
        "country": "",
        "address": "",
        "phone": ""
    };
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tuser/" + pagearr.userId + "/devices",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                console.log(resp);
            })
    }
    $scope.go($scope.pagenum)
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].title)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/customer/" + obj[0].id,
                    data: $scope.newData
                }).
                then(function success(data) {
                        $scope.data[$scope.num] = data.data
                        $scope.myshow = false;
                    },
                    function error(resp) {
                        console.log(resp);
                    });
            }
        }
    }
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.newData = datas;
        $scope.myshow = true;
        $scope.modshow = true;
    }
    $scope.close = function() {
        $scope.newData = null;
        $scope.updata = {
            "name": "",
            "type": ""
        };
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
    }
    $scope.modaffirm = function() {
        $http({
            method: "PUT",
            url: "/c10/api/customer/" + $scope.newData.id,
            data: $scope.newData
        }).
        then(function success(data) {
                $scope.data[$scope.num] = data.data
                $scope.myshow = false;
            },
            function error(resp) {
                console.log(resp);
            });

    }
    $scope.addaffirm = function() {
        $http({
            method: "POST",
            url: "/c10/api/customer",
            data: $scope.updata
        }).
        then(function success(data) {
                location.reload()
                $scope.updata = {
                    "name": "",
                    "type": ""
                };
                $scope.myshow = false;
            },
            function error(resp) {
                console.log(resp);
            });

    }
    $scope.add = function() {
        $scope.addshow = true;
        $scope.myshow = true;

    }
    $scope.alldel = function() {

    }

    $scope.query = function(ind) {
        $http({
            method: "GET",
            url: "/c10/api/device/" + ind + "/parameters"
        }).
        then(function success(data) {
                console.log(data.data.content)
                $scope.num = data.data.content;
                $scope.myshow = true
            },
            function error(resp) {
                console.log(resp);
            })
    }
});
app.controller('c10customertenant', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.lookshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.lookarr = null;
    $scope.updata = {
        "name": "",
        "country": "",
        "address": "",
        "phone": ""
    };
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/customer/" + pagearr.customerId + "/assets",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                console.log(resp);
            })
    }
    $scope.go($scope.pagenum)
    $scope.close = function() {
        $scope.newData = null;
        $scope.updata = {
            "name": "",
            "type": ""
        };
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
    }
    $scope.look = function(ind) {
        $http({
            method: "GET",
            url: "/c10/api/asset/" + ind + "/parameters"
        }).
        then(function success(data) {
                console.log(data.data.content)
                $scope.lookarr = data.data.content;
                $scope.lookshow = true
            },
            function error(resp) {
                console.log(resp);
            })
    }
    $scope.close = function() {
        $scope.lookshow = false;
    }
    $scope.add = function() {
        $scope.addshow = true;
        $scope.myshow = true;

    }
    $scope.alldel = function() {

    }
});
app.controller('c10customerunit', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = null;
    $scope.myshow = false;
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.updata = {
        "name": "",
        "country": "",
        "address": "",
        "phone": ""
    };
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/customer/" + pagearr.customerId + "/devices",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                console.log(resp);
            })
    }
    $scope.look = function(ind) {
        $http({
            method: "GET",
            url: "/c10/api/device/" + ind + "/parameters"
        }).
        then(function success(data) {
                $scope.lookarr = data.data.content;
                $scope.lookshow = true
            },
            function error(resp) {
                console.log(resp);
            })
    }
    $scope.go($scope.pagenum)

    $scope.close = function() {
        $scope.lookshow = false;
    }

});

app.controller('c10knowledge', function($scope, $http) {
    $scope.srcurl = "/share/page?SsoUserHeader=Bearer " + localStorage.getItem('jwt_token').slice(1, localStorage.getItem('jwt_token').length - 1);
});


var allapp = angular.module('allapp', ['app', 'thingsboard']);


$(document).ready(function() {
    $('md-sidenav').css("display", "none");
})

app.controller('c10certificate', function($scope, $http) {
        $scope.download = function() {
           // var filename ='证书';
           // var blob = new Blob([filename], {type: "application/vnd.ms-excel"});
		//	var objectUrl = URL.createObjectURL(blob);
		//	var a = document.createElement('a');
		//	document.body.appendChild(a);
		//	a.setAttribute('style', 'display:none');
		//	a.setAttribute('href', objectUrl);
		//	var filename = "证书.xls";
		//	a.setAttribute('download', filename);
		//	a.click();
        //	URL.revokeObjectURL(objectUrl);

        $http({
            method: "GET",
            url: "/c10/api/download",
            responseType: 'arraybuffer'
        }).
        then(function success(data) {
                var blob = new Blob([data.data], {
                    type: "application/vnd.ms-excel"
                });
                var objectUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display:none');
                a.setAttribute('href', objectUrl);
                var filename = "证书.xls";
                a.setAttribute('download', filename);
                a.click();
                URL.revokeObjectURL(objectUrl);
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
        }
})

app.controller('c10menu', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = {};
    $scope.updata = {};
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.set = false;
    $scope.setshow = false;
    $scope.setarr = null;
    $scope.id = 0;
    $scope.newArr = [];
    $scope.submitTitle = false;
    $scope.submitId = false;
    $scope.submitURL = false;
    $scope.submitTemplate = false;
    $scope.submitLevel = false;
    $scope.submitorderId = false;
    $scope.submitLevel1 = false;
    $scope.showtenantdata=false;
    $scope.tenantdata={};
    $scope.submittenantdata=false;
    $scope.submitmenuType=false;
    $scope.menuTypeValue=[{value:"0",name:"系统级"},{value:"1",name:"租户级"}];
    $scope.identity = {
        "SYS_ADMIN": false, //系统管理员
        "TENANT_ADMIN": false, //租户管理员
        "name": ''
    }
    $scope.submitIdrepeat=false;
    var base = baseLocalStorage("jwt_token");
    $scope.identity[base.scopes[0]] = true;
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tsmenu/menus",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }
    $scope.go($scope.pagenum)
    $scope.add = function() {
        $scope.addshow = true;
        $scope.myshow = true;
        if($scope.identity.SYS_ADMIN){
            $scope.newData.menuType='0';
        }else if($scope.identity.TENANT_ADMIN){   
            $scope.newData.menuType='1';
        }
        //查询租户信息
        $http({
            method: "GET",
            url: "/c10/api/findAlltenants",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
               console.log(data);
               $scope.tenantdata=data.data;
            },
        function error(resp) {
            if (resp.data.status == 401) {
                refreshJwtToken($http);
            }
            
        })
    }
    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.submitTitle = false;
        $scope.submitId = false;
        $scope.submitURL = false;
        $scope.submitTemplate = false;
        $scope.submitLevel = false;
        $scope.submitorderId = false;
        $scope.submitLevel1 = false;
        $scope.showtenantdata=false;
        $scope.submittenantdata=false;
        $scope.submitmenuType=false;
    }
    $scope.addaffirm = function() {
        $scope.submitTitle = false;
        $scope.submitId = false;
        $scope.submitURL = false;
        $scope.submitTemplate = false;
        $scope.submitLevel = false;
        $scope.submitorderId = false;
        $scope.submitLevel1 = false;
        if("1"==$scope.newData.menuType){
            $scope.showtenantdata=true;
        }else{
            $scope.showtenantdata=false;
        }
        $scope.submittenantdata=false;
        $scope.submitmenuType = false;
        if("1"==$scope.newData.menuType){
            if($scope.newData.tenantId == undefined || $scope.newData.tenantId == ""){
                $scope.submittenantdata = true;
            }
        }
        if ($scope.newData.menuName == undefined || $scope.newData.menuName == "") {
            $scope.submitTitle = true;
        }else if($scope.newData.menuRoute == undefined || $scope.newData.menuRoute == ""){
            $scope.submitId = true;
        }else if($scope.newData.menuUrl == undefined || $scope.newData.menuUrl == ""){
            $scope.submitURL = true;
        }else if($scope.newData.menuTemplate == undefined || $scope.newData.menuTemplate == ""){
            $scope.submitTemplate = true;
        }else if($scope.newData.menuLevel == undefined || $scope.newData.menuLevel == ""){
            $scope.submitLevel = true;
        }else if($scope.newData.orderId == undefined || $scope.newData.orderId == ""){
            $scope.submitorderId = true;
        }else if($scope.newData.menuType == undefined || $scope.newData.menuType == ""){
            $scope.submitmenuType = true;
        }else {
          
            $http({
                method: "POST",
                url: "/c10/api/tsmenu/savemenu",
                data: $scope.newData
            }).
            then(function success(data) {
                    if(data.data.remark==null){
                        location.reload()
                        $scope.newData = {};
                        $scope.myshow = false;
                    }else{
                        $scope.submitIdrepeat=true;
                        data.data.remark="";
                        return;
                    }
                    
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }

    }
    $scope.mod = function(datas, ind) {
        $scope.showtenantdata=false;
        if("1"==datas.menuType){
            $scope.showtenantdata=true;
        }
           //查询租户信息
           $http({
            method: "GET",
            url: "/c10/api/findAlltenants",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
               console.log(data);
               $scope.tenantdata=data.data;
            },
        function error(resp) {
            if (resp.data.status == 401) {
                refreshJwtToken($http);
            }
            
        })
        $scope.num = ind;
        $scope.updata = datas;
        $scope.myshow = true;
        $scope.modshow = true;
        
    }
    $scope.modaffirm = function() {
        console.log($scope.updata.menuName);
        $scope.submittenantdata=false;
        $scope.submitmenuType = false;
        if("1"==$scope.updata.menuType){
            $scope.showtenantdata=true;
        }else{
            $scope.showtenantdata=false;
        }
        if ($scope.updata.menuName == undefined || $scope.updata.menuName == "") {
            $scope.submitTitle = true;
        } if ($scope.updata.menuName == undefined || $scope.updata.menuName == "") {
            $scope.submitTitle = true;
        } if("1"==$scope.updata.menuType){
            if($scope.updata.tenantId == undefined || $scope.updata.tenantId == ""){
                $scope.submittenantdata = true;
            } 
        } if($scope.updata.menuType == undefined || $scope.updata.menuType == ""){
            $scope.submitmenuType = true;
        }else {
            $http({
                method: "PUT",
                url: "/c10/api/tsmenu/updateMenu",
                data: $scope.updata
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data
                    $scope.myshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }

    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].menuName)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/tsmenu/"+obj[0].menuId+"/delete/",
                    data: $scope.updata
                }).
                then(function success(data) {
                       // $scope.data[$scope.num] = data.data
                        if(data.data.remark==null){
                            location.reload()
                            $scope.myshow = false;
                        }else{
                            alert("该菜单已分配给用户组，不能删除");
                            location.reload();
                        }
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    //选择是租户级别菜单还是系统级菜单
    $scope.action=function(data){
      if("1"==data.menuType){
        $scope.showtenantdata=true;
      }else{
        $scope.showtenantdata=false; 
      }
    }

})

app.controller('tenantAdminmenu', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = {};
    $scope.updata = {};
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.set = false;
    $scope.setshow = false;
    $scope.setarr = null;
    $scope.id = 0;
    $scope.newArr = [];
    $scope.submitTitle = false;
    $scope.submitId = false;
    $scope.submitURL = false;
    $scope.submitTemplate = false;
    $scope.submitLevel = false;
    $scope.submitorderId = false;
    $scope.submitLevel1 = false;
    $scope.datavalue=null;
    $scope.identity = {
        "SYS_ADMIN": false, //系统管理员
        "TENANT_ADMIN": false, //租户管理员
        "name": ''
    }
    $scope.submitIdrepeat=false;
    var base = baseLocalStorage("jwt_token");
    $scope.identity[base.scopes[0]] = true;
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        $scope.datavalue =null;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tsmenu/tenantmenus",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(newdata) {
                $scope.numberOfElements ="0";
                 $scope.totalPages ="0";
                $scope.datavalue = newdata.data;
                if($scope.datavalue.length>0){
                    for(var i=0;i<$scope.datavalue.length;i++){
                        var menuType=$scope.datavalue[i];
                        if('0'==menuType){  //系统级的不显示删除和修改按钮
                            $scope.datavalue[i].displaydm=false;
                        }else{
                            $scope.datavalue[i].displaydm=true;
                        }
                    }
                }
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }
    $scope.go($scope.pagenum)
    $scope.add = function() {
        $scope.addshow = true;
        $scope.myshow = true;
        if($scope.identity.SYS_ADMIN){
            $scope.newData.menuType='0';
        }else if($scope.identity.TENANT_ADMIN){   
            $scope.newData.menuType='1';
        }
    }
    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.submitTitle = false;
        $scope.submitId = false;
        $scope.submitURL = false;
        $scope.submitTemplate = false;
        $scope.submitLevel = false;
        $scope.submitorderId = false;
        $scope.submitLevel1 = false;
    }
    $scope.addaffirm = function() {
        $scope.submitTitle = false;
        $scope.submitId = false;
        $scope.submitURL = false;
        $scope.submitTemplate = false;
        $scope.submitLevel = false;
        $scope.submitorderId = false;
        $scope.submitLevel1 = false;
        if ($scope.newData.menuName == undefined || $scope.newData.menuName == "") {
            $scope.submitTitle = true;
        }else if($scope.newData.menuRoute == undefined || $scope.newData.menuRoute == ""){
            $scope.submitId = true;
        }else if($scope.newData.menuUrl == undefined || $scope.newData.menuUrl == ""){
            $scope.submitURL = true;
        }else if($scope.newData.menuTemplate == undefined || $scope.newData.menuTemplate == ""){
            $scope.submitTemplate = true;
        }else if($scope.newData.menuLevel == undefined || $scope.newData.menuLevel == ""){
            $scope.submitLevel = true;
        }else if($scope.newData.orderId == undefined || $scope.newData.orderId == ""){
            $scope.submitorderId = true;
        }else {
          
            $http({
                method: "POST",
                url: "/c10/api/tsmenu/savemenu",
                data: $scope.newData
            }).
            then(function success(data) {
                    if(data.data.remark!=""){
                        $scope.submitIdrepeat=true;
                        data.data.remark="";
                        return;
                    }
                    location.reload()
                    $scope.newData = {};
                    $scope.myshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }

    }
    $scope.mod = function(datas, ind) {
        $scope.num = ind;
        $scope.updata = datas;
        $scope.myshow = true;
        $scope.modshow = true;
    }
    $scope.modaffirm = function() {
        console.log($scope.updata.title)
        if ($scope.updata.menuName == undefined || $scope.updata.menuName == "") {
            $scope.submitTitle = true;
        } else {
            $http({
                method: "PUT",
                url: "/c10/api/tsmenu/updateMenu",
                data: $scope.updata
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data
                    $scope.myshow = false;
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }

    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].menuName)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                   // url: "/c10/api/tsmenu/delete/"+obj[0].menuId,
                    url: "/c10/api/tsmenu/"+obj[0].menuId+"/delete/",
                    data: $scope.updata
                }).
                then(function success(data) {
                        if(data.data.remark==null){
                            location.reload()
                            $scope.myshow = false;
                        }else{
                            alert("该菜单已分配给用户组，不能删除");
                            location.reload()
                        }
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }

})
//系统管理员创建用户组
app.controller('tenantGroup', function(cutData, $scope, $http)  {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = {};
    $scope.updata = {};
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.set = false;
    $scope.setshow = false;
    $scope.setarr = null;
    $scope.id = 0;
    $scope.newArr = [];
    $scope.groupTitle=false;
    $scope.groupType=false;
    $scope.submitrepeat=false;
    $scope.addUsershow=false;
    $scope.all=false;
    $scope.chooseuser=false;
    $scope.userdata = {};
    $scope.modUsershow=false;
    $scope.myshowedituser=false;
    $scope.usereditdata={};
    $scope.groupId=0;
    $scope.numberOfuser = null;
    $scope.totalPagesuser = null;
    $scope.pagenumuser = 0;
    $scope.numberOfudetail = null;
    $scope.totalPagesdetail = null;
    $scope.pagenumdetail = 0;
    $scope.tenantdata = {};
    $scope.tenantvalue=false;
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.add = function() {
        $scope.tenantvalue=false;
        //查询租户信息
        $http({
            method: "GET",
           // url: "/c10/api/findAlltenants",
            url: "/api/tenants",
            params: {
                // page: $scope.pagenum,
                // size: 10
                limit:1000
            }
        }).
        then(function success(data) {
               $scope.tenantdata=data.data.data;
            },
        function error(resp) {
            if (resp.data.status == 401) {
                refreshJwtToken($http);
            }
            
        })
            $scope.addshow = true;
            $scope.myshow = true;

    }
    $scope.mod = function(datas, ind) {
          //查询租户信息
          $http({
            method: "GET",
          //  url: "/c10/api/findAlltenants",\
             url: "/api/tenants",
            params: {
                // page: $scope.pagenum,
                // size: 10
                limit:1000
            }
        }).
        then(function success(data) {
               console.log(data);
               $scope.tenantdata=data.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
        $scope.modshow = true;
        $scope.myshow = true;
        $scope.updata = datas;

    }
    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.groupTitle=false;
        $scope.groupType=false;
        $scope.submitrepeat=false;
        $scope.myshowuser = false;
        $scope.chooseuser=false;
        $scope.id=0;
        $scope.userdata = {};
        $scope.modUsershow=false;
        $scope.myshowedituser=false;
        $scope.usereditdata={}; 
        $scope.groupId=0; 
        $scope.tenantvalue=false;
       
    }
    $scope.addgroupaffirm = function() {
        $scope.groupTitle=false;
        $scope.groupType=false;
        $scope.submitrepeat=false;
        $scope.tenantvalue=false;
        if ($scope.newData.groupName == undefined || $scope.newData.groupName == "") {
            $scope.groupTitle = true;
            return;
        }else if($scope.newData.groupType == undefined || $scope.newData.groupType == ""){
            $scope.groupType = true;
            return;
        }else if($scope.newData.tenantId == undefined || $scope.newData.tenantId == ""){
            $scope.tenantvalue=true;
            return;
        }
        $http({
            method: "POST",
            url: "/c10/api/usergroup/savegroup",
            data: $scope.newData
        }).
        then(function success(data) {
                if(data.data.remark==null){
                    location.reload()
                    $scope.newData = {};
                    $scope.myshow = false;
                }else{
                    $scope.submitrepeat=true;
                    data.data.remark=null;
                    return;
                }
                
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });

    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/usergroup/selectgroup",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }
    $scope.go($scope.pagenum)
    $scope.addUserDig = function(datas, ind) {
        $scope.addUsershow=true;
        $scope.myshowuser = true;
        $scope.chooseuser=false;
        $scope.all=false;
        $scope.id=datas.groupId;
        var tenantId=datas.tenantId;
        $http({
            method: "GET",
         //   url: "/c10/api/tenant-admins",
           // url: "/c10/api/usergroup/"+tenantId+"/tenant-admins/"+$scope.id,
              url: "/api/tenant/"+tenantId+"/users",
              params: {
                // page: $scope.pagenumuser,
                // size: 10,
                limit:1000
            }
        }).
        then(function success(data) {
                $scope.all=false;
                // $scope.numberOfuser = data.data.numberOfElements;
                // $scope.totalPagesuser = data.data.totalPages;
                $scope.userdata = data.data.data;
                if($scope.userdata.length>0){
                    for(var i=0;i<$scope.userdata.length;i++){
                        $scope.userdata[i].checkbox=false;
                        $scope.userdata[i].groupId=datas.groupId;
                        $scope.userdata[i].id=data.data.data[i].id.id;
                    }
                }
                $scope.showData = true;
                $scope.everyPageLength = 10;
                $scope.showPageLength = 10;
                cutData($scope.userdata, $scope)
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }
    $scope.jumpuser = function(num) {
        $scope.pagenumuser = num - 1;
        $scope.gouser($scope.pagenumuser)
    }
    $scope.upDownFnuser = function(i) {
        $scope.pagenumuser = $scope.pagenumuser + i
        if ($scope.pagenumuser <= 0) {
            $scope.pagenumuser = 0
        } else if ($scope.pagenumuser > ($scope.totalPagesuser - 1)) {
            $scope.pagenumuser = $scope.totalPagesuser - 1
        }
        $scope.gouser($scope.pagenumuser)
    }
    $scope.gouser = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant-admins",
            params: {
                page: $scope.pagenumuser,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.all=false;
                $scope.numberOfuser = data.data.numberOfElements;
                $scope.totalPagesuser = data.data.totalPages;
                $scope.userdata = data.data.content;
                if($scope.userdata.length>0){
                    for(var i=0;i<$scope.userdata.length;i++){
                        $scope.userdata[i].checkbox=false;
                        $scope.userdata[i].groupId=datas.groupId;

                    }
                }
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }


    $scope.lookuserDig = function(datas, ind) {
        $scope.modUsershow=true;
        $scope.myshowedituser=true;
        $http({
            method: "GET",
            url: "/c10/api/usergroup/selectgroupuser/"+datas.groupId,
            params: {
                page: $scope.pagenumdetail,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.groupId=datas.groupId;
                $scope.numberOfudetail = data.data.numberOfElements;
                $scope.totalPagesdetail = data.data.totalPages;
                if(data.data.content.length>0){
                    for(var i=0;i<data.data.content.length;i++){
                            var userid=data.data.content[i].tbId;
                            selectuserdetail(data.data.content[i],userid);
                    }
                }
                $scope.usereditdata = data.data.content;
                
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }
    //查询用户详细信息from thingsboard
    function selectuserdetail(user,userid){
        $http({
            method: "GET",
            url: "/api/user/"+userid
        }).
        then(function success(data) {
            console.log(data);
            user.firstName=data.data.firstName;
            user.authority=data.data.authority;
            user.email=data.data.email;
            user.phone=data.data.phone;
            user.tenantId=data.data.tenantId.id;
        },
        function error(resp) {
            if (resp.data.status == 401) {
                refreshJwtToken($http);
            }
           
        })
    }
    $scope.jumpudetail = function(num) {
        $scope.pagenumdetail = num - 1;
        $scope.gouserdetail($scope.pagenumdetail)
    }
    $scope.upDownFnudetail = function(i) {
        $scope.pagenumdetail = $scope.pagenumdetail + i
        if ($scope.pagenumdetail <= 0) {
            $scope.pagenumdetail = 0
        } else if ($scope.pagenumdetail > ($scope.totalPagesdetail - 1)) {
            $scope.pagenumdetail = $scope.totalPagesdetail - 1
        }
        $scope.gouserdetail($scope.pagenumdetail)
    }
    $scope.gouserdetail = function(num) {
        $http({
            method: "GET",
            url: "/c10/api/usergroup/selectgroupuser/"+datas.groupId,
            params: {
                page: $scope.pagenumdetail,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfudetail = data.data.numberOfElements;
                $scope.totalPagesdetail = data.data.totalPages;
                $scope.usereditdata = data.data.content;
                $scope.groupId=datas.groupId;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }
    $scope.modaffirm = function() {
        $scope.submitTitle = false;
        if ($scope.updata.groupName == undefined || $scope.updata.groupName == "") {
            $scope.submitTitle = true;
        } else {
            $http({
                method: "PUT",
                url: "/c10/api/usergroup/updateTsUserGroup",
                data: $scope.updata
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data
                    $scope.myshow = false;
                    location.reload();
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].groupName)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/usergroup/delete/"+obj[0].groupId,
                    data: $scope.updata
                }).
                then(function success(data) {
                      //  $scope.data[$scope.num] = data.data
                      if(data.data.remark==null){
                        location.reload()
                        $scope.myshow = false;
                        }else{
                        // $scope.submitrepeat=true;
                            alert(data.data.remark);
                            data.data.remark="";
                            location.reload()
                            return;
                        }

                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.adduseraffirm = function() {
        $scope.chooseuser=false;
      if($scope.userdata.length>0){
        if(!$scope.all){
                var flag="0";
                for(var i=0;i<$scope.userdata.length;i++){
                    var checkbox=$scope.userdata[i].checkbox;
                    if(checkbox){
                        flag++;
                    }
                }
                if(flag==0){
                   
                    $scope.chooseuser=true;
                    return;
                }else{
                    for(var i=0;i<$scope.userdata.length;i++){
                        var checkbox=$scope.userdata[i].checkbox;
                        if(!checkbox){
                            $scope.userdata[i].id='0';
                        }
                    }
                }
            }
                    $http({
                        method: "POST",
                        url: "/c10/api/usergroup/saveuserrel/"+$scope.id,
                        data: $scope.userdata
                    }).
                    then(function success(data) {
                            location.reload()
                            $scope.userdata = {};
                            $scope.myshowuser = false;
                            $scope.all = false;

                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
      }else{
        $scope.chooseuser=true;
        return;
      }    

    }

    $scope.checkallvalue=function(name){
        $scope.all=name;
    }
    
    $scope.checkvalue=function(data,name){
        data.checkbox=name;
        if(!name){
            $scope.all=false;
        }
    }
    
    $scope.deluser=function(data,name){
        if (confirm("是否删除用户" + data.firstName)) {
            $http({
                method: "DELETE",
                url: "/c10/api/usergroup/"+data.id+"/deleteuser/"+$scope.groupId
                
            }).
            then(function success(data) {

                $scope.usereditdata={};
                location.reload()


                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    
})
//租户管理员创建用户组
app.controller('tenantuserGroup', function(cutData, $scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = {};
    $scope.updata = {};
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.set = false;
    $scope.setshow = false;
    $scope.setarr = null;
    $scope.id = 0;
    $scope.newArr = [];
    $scope.groupTitle=false;
    $scope.groupType=false;
    $scope.submitrepeat=false;
    $scope.addUsershow=false;
    $scope.all=false;
    $scope.chooseuser=false;
    $scope.userdata = {};
    $scope.modUsershow=false;
    $scope.myshowedituser=false;
    $scope.usereditdata={};
    $scope.groupId=0;
    $scope.numberOfuser = null;
    $scope.totalPagesuser = null;
    $scope.pagenumuser = 0;
    $scope.numberOfudetail = null;
    $scope.totalPagesdetail = null;
    $scope.pagenumdetail = 0;
    $scope.assetAdd=false;
    $scope.assetAddshow=false;
    $scope.assetLook=false;
    $scope.assetLookshow=false;
    $scope.addAssetData = {};
    $scope.lookAssetData = {};
    $scope.allAsset=false;
    $scope.numberOfAssets=null;
    $scope.totalPagesAseet=null;
    $scope.pagenumAsset = 0;


    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.add = function() {
        $scope.addshow = true;
        $scope.myshow = true;
    }
    $scope.mod = function(datas, ind) {
        $scope.modshow = true;
        $scope.myshow = true;
        $scope.updata = datas;
    }
    $scope.close = function() {
        $scope.newData = {};
        $scope.updata = {};
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.groupTitle=false;
        $scope.groupType=false;
        $scope.submitrepeat=false;
        $scope.myshowuser = false;
        $scope.chooseuser=false;
        $scope.id=0;
        $scope.userdata = {};
        $scope.modUsershow=false;
        $scope.myshowedituser=false;
        $scope.usereditdata={}; 
        $scope.groupId=0; 
        $scope.assetAdd=false;
        $scope.assetAddshow=false;
        $scope.assetLook=false;
        $scope.assetLookshow=false;
        $scope.addAssetData = {};
        $scope.lookAssetData = {};
        $scope.allAsset=false;
        $scope.choosAsset=false;
    }
    $scope.addgroupaffirm = function() {
        $scope.groupTitle=false;
        $scope.groupType=false;
        $scope.submitrepeat=false;
        if ($scope.newData.groupName == undefined || $scope.newData.groupName == "") {
            $scope.groupTitle = true;
            return;
        }else if($scope.newData.groupType == undefined || $scope.newData.groupType == ""){
            $scope.groupType = true;
            return;
        }
        $http({
            method: "POST",
            url: "/c10/api/usergroup/savegroup",
            data: $scope.newData
        }).
        then(function success(data) {
                if(data.data.remark==null){
                    location.reload()
                    $scope.newData = {};
                    $scope.myshow = false;
                }else{
                    $scope.submitrepeat=true;
                    data.data.remark="";
                    return;
                }
                
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });

    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/usergroup/selectgroup",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }
    $scope.go($scope.pagenum)
    $scope.userDignew = function(datas, ind) {
        $scope.addUsershow=true;
        $scope.myshowuser = true;
        $scope.chooseuser=false;
        $scope.all=false;
        $scope.id=datas.groupId;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/users",
            params: {
                page: $scope.pagenumuser,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.all=false;
                $scope.numberOfuser = data.data.numberOfElements;
                $scope.totalPagesuser = data.data.totalPages;
                $scope.userdata = data.data.content;
                if($scope.userdata.length>0){
                    for(var i=0;i<$scope.userdata.length;i++){
                        $scope.userdata[i].checkbox=false;
                        $scope.userdata[i].groupId=datas.groupId;

                    }
                }
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }
    $scope.jumpuser = function(num) {
        $scope.pagenumuser = num - 1;
        $scope.gouser($scope.pagenumuser)
    }
    $scope.upDownFnuser = function(i) {
        $scope.pagenumuser = $scope.pagenumuser + i
        if ($scope.pagenumuser <= 0) {
            $scope.pagenumuser = 0
        } else if ($scope.pagenumuser > ($scope.totalPagesuser - 1)) {
            $scope.pagenumuser = $scope.totalPagesuser - 1
        }
        $scope.gouser($scope.pagenumuser)
    }
    $scope.gouser = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tenant/" + pagearr.tenantId + "/users",
            params: {
                page: $scope.pagenumuser,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.all=false;
                $scope.numberOfuser = data.data.numberOfElements;
                $scope.totalPagesuser = data.data.totalPages;
                $scope.userdata = data.data.content;
                if($scope.userdata.length>0){
                    for(var i=0;i<$scope.userdata.length;i++){
                        $scope.userdata[i].checkbox=false;
                        $scope.userdata[i].groupId=datas.groupId;

                    }
                }
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }


    $scope.queryuserDig = function(datas, ind) {
        $scope.modUsershow=true;
        $scope.myshowedituser=true;
        $http({
            method: "GET",
            url: "/c10/api/usergroup/selectgroupuser/"+datas.groupId,
            params: {
                page: $scope.pagenumdetail,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfudetail = data.data.numberOfElements;
                $scope.totalPagesdetail = data.data.totalPages;
                $scope.usereditdata = data.data.content;
                $scope.groupId=datas.groupId;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }
    $scope.jumpudetail = function(num) {
        $scope.pagenumdetail = num - 1;
        $scope.gouserdetail($scope.pagenumdetail)
    }
    $scope.upDownFnudetail = function(i) {
        $scope.pagenumdetail = $scope.pagenumdetail + i
        if ($scope.pagenumdetail <= 0) {
            $scope.pagenumdetail = 0
        } else if ($scope.pagenumdetail > ($scope.totalPagesdetail - 1)) {
            $scope.pagenumdetail = $scope.totalPagesdetail - 1
        }
        $scope.gouserdetail($scope.pagenumdetail)
    }
    $scope.gouserdetail = function(num) {
        $http({
            method: "GET",
            url: "/c10/api/usergroup/selectgroupuser/"+datas.groupId,
            params: {
                page: $scope.pagenumdetail,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfudetail = data.data.numberOfElements;
                $scope.totalPagesdetail = data.data.totalPages;
                $scope.usereditdata = data.data.content;
                $scope.groupId=datas.groupId;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }
    $scope.modaffirm = function() {
        $scope.submitTitle = false;
        if ($scope.updata.groupName == undefined || $scope.updata.groupName == "") {
            $scope.submitTitle = true;
        } else {
            $http({
                method: "PUT",
                url: "/c10/api/usergroup/updateTsUserGroup",
                data: $scope.updata
            }).
            then(function success(data) {
                    $scope.data[$scope.num] = data.data
                    $scope.myshow = false;
                    location.reload();
                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.data[ind].groupName)) {
                var obj = $scope.data.splice(ind, 1);
                $http({
                    method: "DELETE",
                    url: "/c10/api/usergroup/delete/"+obj[0].groupId,
                    data: $scope.updata
                }).
                then(function success(data) {
                      //  $scope.data[$scope.num] = data.data
                      if(data.data.remark==null){
                        location.reload()
                        $scope.myshow = false;
                        }else{
                        // $scope.submitrepeat=true;
                            alert(data.data.remark);
                            data.data.remark="";
                            location.reload()
                            return;
                        }
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }
    $scope.adduseraffirm = function() {
        $scope.chooseuser=false;
      if($scope.userdata.length>0){
        if(!$scope.all){
                var flag="0";
                for(var i=0;i<$scope.userdata.length;i++){
                    var checkbox=$scope.userdata[i].checkbox;
                    if(checkbox){
                        flag++;
                    }
                }
                if(flag==0){
                   
                    $scope.chooseuser=true;
                    return;
                }else{
                    for(var i=0;i<$scope.userdata.length;i++){
                        var checkbox=$scope.userdata[i].checkbox;
                        if(!checkbox){
                            $scope.userdata[i].id='0';
                        }
                    }
                }
            }
                    $http({
                        method: "POST",
                        url: "/c10/api/usergroup/saveuserrel/"+$scope.id,
                        data: $scope.userdata
                    }).
                    then(function success(data) {
                            location.reload()
                            $scope.userdata = {};
                            $scope.myshowuser = false;
                            $scope.all = false;

                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
      }else{
        $scope.chooseuser=true;
        return;
      }    

    }

    $scope.checkallvalue=function(name){
        $scope.all=name;
    }
    
    $scope.checkvalue=function(data,name){
        data.checkbox=name;
        if(!name){
            $scope.all=false;
        }
    }
    
    $scope.deluser=function(data,name){
        if (confirm("是否删除用户" + data.firstName)) {
            $http({
                method: "DELETE",
                url: "/c10/api/usergroup/"+data.id+"/deleteuser/"+$scope.groupId
                
            }).
            then(function success(data) {

                $scope.usereditdata={};
                location.reload()


                },
                function error(resp) {
                    if (resp.data.status == 401) {
                        refreshJwtToken($http);
                    }
                });
        }
    }
    //新增资产
    $scope.addAsset=function(datass,name){
        $scope.assetAdd=true; 
        $scope.choosAsset=false;
        $scope.assetAddshow=true;
        $http({
            method: "GET",
            url: "/api/tenant/assets",
            params: {
               limit:1000
            }
            
        }).
        then(function success(data) {
            console.log(data);
            $scope.addAssetData = data.data.data;
            if($scope.addAssetData.length>0){
                for(var i=0;i<$scope.addAssetData.length;i++){
                    $scope.addAssetData[i].checkbox=false;
                    $scope.addAssetData[i].groupId=datass.groupId;
                    $scope.addAssetData[i].assetId=data.data.data[i].id.id;
                }
               
            }
            $scope.showData = true;
            $scope.everyPageLength = 10;
            $scope.showPageLength = 10;
            cutData($scope.addAssetData, $scope)
          
        },
        function error(resp) {
            if (resp.data.status == 401) {
                refreshJwtToken($http);
            }
        });

    }
    //全选
    $scope.checkAssetvalue=function(name){
        $scope.allAsset=name;
    }
    //单选
    $scope.checkAsset=function(data,name){
        data.checkbox=name;
        if(!name){
            $scope.allAsset=false;
        }
    }
    
    $scope.addAssetaffirm=function(){
        $scope.choosAsset=false;
        if($scope.addAssetData.length>0){
            $scope.id=$scope.addAssetData[0].groupId;//用户组ID
            if(!$scope.allAsset){
                    var flag="0";
                    for(var i=0;i<$scope.addAssetData.length;i++){
                        var checkbox=$scope.addAssetData[i].checkbox;
                        if(checkbox){
                            flag++;
                        }
                    }
                    if(flag==0){
                        $scope.choosAsset=true;
                        return;
                    }else{
                        for(var i=0;i<$scope.addAssetData.length;i++){
                            var checkbox=$scope.addAssetData[i].checkbox;
                            if(!checkbox){
                                $scope.addAssetData[i].assetId='0';//资产id
                            }
                        }
                    }
                }
                $scope.assetValue=[];
                for(var j=0;j<$scope.addAssetData.length;j++){
                    var asses={assetId:'0'};
                    var checkbox=$scope.addAssetData[j].checkbox;
                    if(checkbox){
                        asses.assetId=$scope.addAssetData[j].assetId;
                        $scope.assetValue.push(asses);
                    }

                }
                        $http({
                            method: "POST",
                            url: "/c10/api/usergroup/saveAssetrel/"+$scope.id,
                            data: $scope.assetValue
                        }).
                        then(function success(data) {
                                location.reload()
                                $scope.addAssetData = {};
                                $scope.myshowuser = false;
                                $scope.allAsset = false;
    
                        },
                        function error(resp) {
                            if (resp.data.status == 401) {
                                refreshJwtToken($http);
                            }
                        });
          }else{
            $scope.choosAsset=true;
            return;
          }    
    }
    //查看资产
    $scope.assetGroupId="";
    $scope.lookAsset=function(datas,name){
        $scope.assetLook=true; 
        $scope.assetLookshow=true;
        $scope.lookAssetData = {};
        $scope.assetGroupId=datas.groupId;
        $http({
            method: "GET",
            url: "/c10/api/usergroup/selectAssetRel/"+datas.groupId,
            params: {
                page: $scope.pagenumAsset,
                size: 10
            }
        }).
        then(function success(data) {
            $scope.numberOfAssets = data.data.numberOfElements;
            $scope.totalPagesAseet = data.data.totalPages;
            $scope.lookAssetData = data.data.content;
            if($scope.lookAssetData.length>0){
                for(var i=0;i<$scope.lookAssetData.length;i++){
                    var assetId=$scope.lookAssetData[i].assetId;
                    //从thingsboard查询资产信息
                    lookAssetInfo($scope.lookAssetData[i],assetId);
                }
            }
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    } 
    
    function lookAssetInfo(asset,num) {
        $http({
            method: "GET",
            url: "/api/asset/"+num
            
        }).
        then(function success(data) {
            asset.name=data.data.name;
            },
        function error(resp) {
            if (resp.data.status == 401) {
                refreshJwtToken($http);
            }
        })
    }
    
    $scope.delAsset = function(asset,num) {
      var assetId=asset.assetId;
      var groupId=$scope.assetGroupId;
      if (confirm("是否删除资产" + asset.name)) {
        $http({
            method: "DELETE",
            url: "/c10/api/usergroup/"+assetId+"/deleteAsset/"+groupId
        }).
        then(function success(data) {
            location.reload()
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });
    }     
    }

    $scope.jumpAseet = function(num) {
        $scope.pagenumAsset = num - 1;
        $scope.goAsset($scope.pagenumAsset)
    }

    $scope.upDownAseet = function(i) {
        $scope.pagenumAsset = $scope.pagenumAsset + i
        if ($scope.pagenumAsset <= 0) {
            $scope.pagenumAsset = 0
        } else if ($scope.pagenumAsset > ($scope.totalPagesAseet - 1)) {
            $scope.pagenumAsset = $scope.totalPagesAseet - 1
        }
        $scope.goAsset($scope.pagenumAsset)
    }

    $scope.goAsset=function(num){
        $scope.assetLook=true; 
        $scope.assetLookshow=true;
        $scope.lookAssetData = {};
        $http({
            method: "GET",
            url: "/c10/api/usergroup/selectAssetRel/"+$scope.assetGroupId,
            params: {
                page: num,
                size: 10
            }
        }).
        then(function success(data) {
            $scope.numberOfAssets = data.data.numberOfElements;
            $scope.totalPagesAseet = data.data.totalPages;
            $scope.lookAssetData = data.data.content;
            if($scope.lookAssetData.length>0){
                for(var i=0;i<$scope.lookAssetData.length;i++){
                    var assetId=$scope.lookAssetData[i].assetId;
                    //从thingsboard查询资产信息
                    lookAssetInfo($scope.lookAssetData[i],assetId);
                }
            }
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    } 

})


app.filter("filterUserGroupRole", function() {
    return function(input, name) {
        switch (name) {
            case "0":
                return '系统管理员';
                break;
            case "1":
                return '租户管理员';
                break;
            case "2":
                return '租户用户';
                break;
            case "3":
                return '客户用户';
                break;
        }
    }

});
//系统管理员菜单分配
app.controller('c10allocatemenu', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = {};
    $scope.updata = {};
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.set = false;
    $scope.setshow = false;
    $scope.setarr = null;
    $scope.id = 0;
    $scope.newArr = [];
    $scope.all=false;
    $scope.pagenumgroup = 0;
    $scope.numberOfgroup = null;
    $scope.totalPagesgroup = null;
    $scope.chooseuser=false;
    $scope.menuid=0;
    $scope.groupuserdata={};
    $scope.modusershow = false;
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/tsmenu/selectmenus",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }
    $scope.go($scope.pagenum)
    
    $scope.allocate = function(data,ind) {
        $scope.addshow = true;
        $scope.myshow = true;
        $scope.all=false;
        $scope.chooseuser=false;
        $scope.menuid=data.menuId;//菜单id
        //查询用户组
        $http({
            method: "GET",
            url: "/c10/api/usergroup/"+data.tenantId+"/selectallocategroup/"+data.menuType,
            params: {
                page: $scope.pagenumgroup,
                size: 10
            }
        }).
        then(function success(datas) {
                $scope.numberOfgroup = datas.data.numberOfElements;
                $scope.totalPagesgroup = datas.data.totalPages;
                $scope.groupdata = datas.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })

    }
    $scope.checkallvalue=function(name){
        $scope.all=name;
    }
    
    $scope.checkvalue=function(data,name){
        data.checkbox=name;
        if(!name){
            $scope.all=false;
        }
    }
    $scope.close = function() {
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.chooseuser=false;
        $scope.menuid=0;
        $scope.modusershow = false;
        $scope.groupuserdata={};
    }
    
    $scope.addaffirm = function() {
        $scope.chooseuser=false;
        if($scope.groupdata.length>0){
            if(!$scope.all){
                var flag="0";
                for(var i=0;i<$scope.groupdata.length;i++){
                    var checkbox=$scope.groupdata[i].checkbox;
                    if(checkbox){
                        flag++;
                    }
                }
                if(flag==0){
                    $scope.chooseuser=true;
                    return;
                }else{
                    for(var i=0;i<$scope.groupdata.length;i++){
                        var checkbox=$scope.groupdata[i].checkbox;
                        if(!checkbox){
                            $scope.groupdata[i].groupId='0';//用户组id
                        }
                    }
                }
            }
            //保存
            $http({
                method: "POST",
                url: "/c10/api/usergroup/"+$scope.menuid+"/saveemunrel/",
                data: $scope.groupdata
            }).
            then(function success(data) {
                $scope.groupdata = {};
                $scope.addshow = false;
                $scope.all = false;
                location.reload()
                   

            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });

        }else{
            $scope.chooseuser=true; 
            return;
         }
       
    }
    $scope.lookallocate=function(data,ind){
        $scope.modshow = true;
        $scope.modusershow = true;
        $scope.menuid=data.menuId;//菜单id
        $http({
            method: "GET",
            url: "/c10/api/usergroup/"+$scope.menuid+"/selectgrouprel/"+data.menuType,
            params: {
                page: $scope.pagenumgroup,
                size: 10
            }
        }).
        then(function success(datas) {
                $scope.numberOfgroups = datas.data.numberOfElements;
                $scope.totalPagesgroups = datas.data.totalPages;
                $scope.groupuserdata = datas.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })

    }

    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.groupuserdata[ind].tsUserGroup.groupName)) {
                var groupId = $scope.groupuserdata[ind].tsUserGroup.groupId;
                var menuId=$scope.menuid;
                $http({
                    method: "DELETE",
                    url: "/c10/api/usergroup/"+groupId+"/deletemenuuser/"+menuId
                    
                }).
                then(function success(data) {
                      location.reload()
                        $scope.myshow = false;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }

})

app.filter("namenotnull", function() {
    return function(input, data) {
        var d = new Array();
        for(i=0;i<input.length;i++)
        {
            if(input[i].name!=null&&input[i].name!=undefined)
            {
                d.push(input[i]);
            }
        }
        return d;
        
    }
});

app.controller("c10history_gangguan", function ($scope, $http, $sce,$filter) {
    //$scope.myURL = $sce.trustAsResourceUrl("http://localhost//flowable-diagram/demo.html");
    //initDatePicker();
    
    $scope.index=0;
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.pagesize = 20;
    $scope.customers = [];
    $scope.limits = [];
    $scope.heads = [];
    $scope.searchData = [];
    $scope.showData = false;
    $scope.deviceSelect = '';
    $scope.totalPages =1;
    
      $scope.flowshow = function(name,i) {   
           if($("#process"+i+"detail").html()==undefined||$("#process"+i+"detail").html()==null||$("#process"+i+"detail").html()=="")
          {
              $("#processdetail").html("");
          }
          else
          {
             $("#processdetail").html("<table class='table table-bordered' ><caption>"+name+"工序实时数据</caption><tr><td><div id='process"+i+"detail2'>"+$("#process"+i+"detail").html()+"</div></td></tr></table>");
          }
       };
        $scope.close= function() {
           $scope.dialogshow=false;
      };
       $scope.hisrotyshow = function(i,id) {
           $scope.curi=i;
           $scope.curid=id;
           for(iii=0;iii<$scope.processdata.length;iii++)
          {
           for(j=0;j<$scope.processdata[iii].processes.length;j++)
          {
              if($scope.processdata[iii].processes[j].id==i)
              {
                  
                    $scope.iii=iii;
                    $scope.j=j;
                     var keys ="";
          var table ="<table  class='table table-bordered'><thead><tr><th width=40>时间</th>";
          for(ii=0;ii<$scope.processdata[iii].processes[j].keys.length;ii++)
          {
              keys =keys+$scope.processdata[iii].processes[j].keys[ii].name+",";
              table=table+"<th  width=60>"+$scope.processdata[iii].processes[j].keys[ii].title+"</th>";
          }
          keys=keys.substring(0,keys.length-1);
          table=table+"</tr></thead>";
          
          var time =$scope.processdata[iii].processes[j].time*1;
          var url ="/api/plugins/telemetry/DEVICE/"+$scope.curid+"/values/timeseries?keys="+keys+"&startTs="+(time-1440000)+"&endTs="+(time+1440000)+"&interval=1&limit=50000&agg=NONE";
          $http({
            method: "GET",
            url: url     
          }).
           then(function success(data) {
               if(data==null||data==undefined)
               {
                    $("#processhistory").html("");
               }
                data =data.data;
                var key =$scope.processdata[$scope.iii].processes[$scope.j].keys[0].name;   
                var xAxis = new Array();
                var legend = new Array();
                var series = new Array();
                for(jj=(data[key].length-1);jj>-1;jj--)
                {
                    table=table+"<tr>";
                    table=table+"<td>"+  $filter('date')(new Date(data[$scope.processdata[$scope.iii].processes[$scope.j].keys[0].name][jj].ts), 'yyyy-MM-dd HH:mm:ss')  +"</td>";
                    xAxis.push($filter('date')(new Date(data[$scope.processdata[$scope.iii].processes[$scope.j].keys[0].name][jj].ts), 'yyMMdd HH:mm:ss'));
                   
                     for(ii=0;ii<$scope.processdata[$scope.iii].processes[$scope.j].keys.length;ii++)
                    {    
                       if(jj==0)
                       {
                           legend.push($scope.processdata[$scope.iii].processes[$scope.j].keys[ii].title);
                       }
                       if(series[ii]==null||series[ii]==undefined)
                       {
                           series[ii] ={
                             name:$scope.processdata[$scope.iii].processes[$scope.j].keys[ii].title,
                           type:'line',           
                            data:new Array()
                            }
                       }
                       series[ii].data.push(data[$scope.processdata[$scope.iii].processes[$scope.j].keys[ii].name][jj].value);
                        table=table+"<td>"+data[$scope.processdata[$scope.iii].processes[$scope.j].keys[ii].name][jj].value+"</td>";
                     }
                     table=table+"</tr>";
                }
                 table=table+"<table>";
                  $("#processhistory").html(table);
                  
                  
                     var myChart = echarts.init(document.getElementById('main'));
           option = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:legend
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxis
    },
    yAxis: {
        type: 'value'
    },
    series: series
};
myChart.setOption(option);
setInterval(function (){
   
}, 2100);
        $scope.dialogshow=true;          
                 var _el = document.getElementById('processhistory');
                   _el.scrollTop = _el.scrollHeight;
            },
            function error(resp) {
              
                    $("#processhistory").html("");
               
            })
          
                  
                  
              }
          }
         }
         
         
         
        
          
      
     };  
    $scope.go = function(p) {
        if(p==0)
        {
            $scope.pagenum=0;
        }
        else
        {
             $scope.pagenum =$scope.pagenum+p;
            if($scope.pagenum>=0&&$scope.pagenum<$scope.totalPages)
           {
             
           }
           else
           {
               $scope.pagenum =$scope.pagenum-p;
           }
        }
        
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/gangguans",
            params: {
                page: $scope.pagenum,
                size: $scope.pagesize
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                
            })
        
    }
    $scope.go($scope.pagenum);
    $scope.query = function(i) {
        $scope.curid =i.id;
         $http({
            method: "GET",
            url: "/c10/api/findProcesslineByAssetId",
             params: {
                assetId: i.assetId,                
            }
        }).
        then(function success(data) {
               $scope.processdata =data.data;
             $scope.telemetry(i);
            },
            function error(resp) {
                
            })
        
       
    }

    $scope.search = function() {
       
        $http({
            method: "get",
            url: "/c10/api/findgangguansbyname",
            params: {
                ggh: $scope.newData.ggh,
                wlh: $scope.newData.ggh,
                page: $scope.pagenum
                
            }
        }).
        then(function success(data) {
                $scope.numberOfElements = data.data.numberOfElements;
                $scope.totalPages = data.data.totalPages;
                $scope.data = data.data.content;
            },
            function error(resp) {
                console.log(resp)
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            })
    };

    $scope.telemetry = function(i) {
            var token = localStorage.getItem("jwt_token").replace('"','').replace('"','');
            var entityId = $scope.curid;   
            $scope.cmdId =new Array();
            var object = {
                    tsSubCmds: [
                        {
                            entityType: "DEVICE",
                            entityId: entityId,                           
                            cmdId: $scope.cmdId.length
                        }
                    ],
                    historyCmds: [],
                    attrSubCmds: []
                };
             $scope.cmdId.push(entityId+"-v");
                var data = JSON.stringify(object);
            if($scope.webSocket==null||$scope.webSocket==undefined)
            {
            $scope.webSocket = new WebSocket("ws://11.11.136.104:8080/api/ws/plugins/telemetry?token="+token);
            $scope.webSocket.onopen = function () {
               
                $scope.webSocket.send(data);
               
            };
            }
            else
            {
                $scope.webSocket.send(data);
            }
            

            $scope.webSocket.onmessage = function (event) {
               var d =JSON.parse(event.data);
                if(d.data!=null)
                {
                     if($scope.cmdId[d.subscriptionId]==$scope.curid+"-v")
                     {
                     for (var key in d.data){
                         
                         for(i=0;i<$scope.processdata.length;i++)
                         {
                              for(ii=0;ii<$scope.processdata[i].processes.length;ii++)
                             {
                                  for(iii=0;iii<$scope.processdata[i].processes[ii].keys.length;iii++)
                                 {
                                     if(key==$scope.processdata[i].processes[ii].keys[iii].name)
                                     {
                                         $scope.processdata[i].processes[ii].curGangguanId=$scope.curid;
                                         $scope.processdata[i].processes[ii].keys[iii].value=d.data[key][0][1];
                                         $scope.processdata[i].processes[ii].keys[iii].time=d.data[key][0][0];
                                         $scope.processdata[i].processes[ii].color="#00CC33";
                                         if($scope.processdata[i].processes[ii].time==null||$scope.processdata[i].processes[ii].time==undefined)
                                         {
                                         $scope.processdata[i].processes[ii].time= d.data[key][0][0];
                                         }
                                        $scope.processdata[i].processes[ii].time1= d.data[key][0][0];
                                        
                                     }
                                 }
                             }
                         }
                        
                     }
                     }
                }
                $scope.hisrotyshow($scope.curi,$scope.curid);
                $scope.$apply();
               
                
            };

            $scope.webSocket.onclose = function (event) {
                
            };
        }
        
     
});

app.controller("c10ggGYZL", function ($scope,$state,$stateParams, $http, $sce,$filter)
{
   
   
    
    
     $scope.tabclick = function(i,name) {
         $state.go('c10ggGYZL2',{index:i,name:name});
          
    };
    $scope.query = function() {
        
         $http({
            method: "GET",
            url: "/c10/api/findProcesslineByTenantId",
             params: {
                tenentId: "83646230-25c1-11e8-aae6-9d4308cf813f",                
            }
        }).
        then(function success(data) {
              $scope.processdata =data.data;
               
               for(i=0;i<$scope.processdata.length;i++)
               {
                   if($scope.processdata[i].isShowGis!=null &&$scope.processdata[i].isShowGis!=undefined)
                   {
                       $scope.isShowGis=true;
                   }
                    $scope.processdata[i].color="green";
                   
               }
               $scope.$apply(); 
        });
         
    };
    
     $scope.query();
     
     
});



app.controller("c10ggGYZL2", function ($scope,$state,$stateParams, $http, $sce,$filter)
{
    
    $scope.processdata= new Array();
    $scope.query = function() {
        
         $http({
            method: "GET",
            url: "/c10/api/findProcesslineByTenantId",
             params: {
                tenentId: "83646230-25c1-11e8-aae6-9d4308cf813f",                
            }
        }).
        then(function success(data) {
               $scope.processdata =data.data;               
               for(i=0;i<$scope.processdata.length;i++)
               {
                   if($scope.processdata[i].isShowGis!=null &&$scope.processdata[i].isShowGis!=undefined)
                   {
                       $scope.isShowGis=true;
                   }
                    $scope.processdata[i].color="green";
                   
               }
               if($stateParams!=null&&$stateParams!=undefined)
              {
                      $scope.title =$stateParams.name;
                      $scope.curprocessdata=$scope.processdata[$stateParams.index];         
                      $scope.telemetry();      
                      $scope.$apply(); 
               }
        });
        
       
    }
    
      $scope.query();
     
      $scope.telemetry = function() {       
           var token = localStorage.getItem("jwt_token").replace('"','').replace('"','');
           var ids="";
           var cmd =new Array();          
           $scope.cmdId =new Array();
           for(o=0;o<$scope.curprocessdata.processes.length;o++)
           {
               if(ids.indexOf($scope.curprocessdata.processes[o].curGangguanId)==-1)
               {
                        ids =ids+$scope.curprocessdata.processes[o].curGangguanId+",";
                        $scope.cmdId.push($scope.curprocessdata.processes[o].curGangguanId+"-v");
                        cmd.push({
                            entityType: "DEVICE",
                            entityId: $scope.curprocessdata.processes[o].curGangguanId,                           
                            cmdId: $scope.cmdId.length-1,
//                            keys:"l_tyd,l_zd",
//                            startTs:1519862601000,
//                            endTs:1519862701000,
//                            interval:1,
//                            limit:50000,
//                            agg:"NONE"
                            
                        });                        
                   
               }
          }    
                   
            
             var webSocket = new WebSocket("ws://11.11.136.104:8080/api/ws/plugins/telemetry?token="+token);
             webSocket.onopen = function () {
                var object = {
                    tsSubCmds: cmd,
                    historyCmds: [],
                    attrSubCmds:  [],
                };
                var data = JSON.stringify(object);
                webSocket.send(data);
               
            };

            webSocket.onmessage = function (event) {
               var d =JSON.parse(event.data);
               
                if(d.data!=null)
                {
                     for (var key in d.data){
                              for(ii=0;ii<$scope.curprocessdata.processes.length;ii++)
                             {
                                 
                                 
                                  if($scope.cmdId[d.subscriptionId] == $scope.curprocessdata.processes[ii].curGangguanId+"-v")
                                  {
                                  for(iii=0;iii<$scope.curprocessdata.processes[ii].keys.length;iii++)
                                 {
                                     if(key==$scope.curprocessdata.processes[ii].keys[iii].name)
                                     {
                                         $scope.curprocessdata.processes[ii].keys[iii].value=d.data[key][0][1];
                                         $scope.curprocessdata.processes[ii].keys[iii].time=d.data[key][0][0];
                                         $scope.curprocessdata.processes[ii].color="#00CC33";
                                         if($scope.curprocessdata.processes[ii].time==null|$scope.curprocessdata.processes[ii].time==undefined)
                                         {
                                         $scope.curprocessdata.processes[ii].time= d.data[key][0][0];
                                         }
                                         $scope.curprocessdata.processes[ii].time1= d.data[key][0][0];
                                             
                                        
                                     }
                                 }
                             }
                                 
                             }
                        
                        
                     }
                }
                $scope.hisrotyshow($scope.curi,$scope.curid);
                $scope.$apply();
               
                     
              
            };

            webSocket.onclose = function (event) {
                
            };
        
    }
    
    
      $scope.flowshow = function(name,i) {  
          if($("#process"+i+"detail").html()==undefined||$("#process"+i+"detail").html()==null)
          {
              $("#processdetail").html("");
          }
          else
          {
          $("#processdetail").html("<table class='table table-bordered' ><caption>"+name+"-工序实时数据</caption><tr><td><div id='process"+i+"detail2'>"+$("#process"+i+"detail").html()+"</div></td></tr></table>");
          }
      };
      $scope.close= function() {
           $scope.dialogshow=false;
      };
      
       $scope.hisrotyshow = function(i,id) {
           $scope.curi=i;
           $scope.curid=id;
           for(ii=0;ii<$scope.curprocessdata.processes.length;ii++)
          {
              if($scope.curprocessdata.processes[ii].id==i)
              {
                  i=ii;
              }
          }
          var keys ="";
          var table ="<table  class='table table-bordered'><caption>&nbsp;&nbsp;历史工艺数据</caption><thead><tr><th width=40>时间</th>";
          for(ii=0;ii<$scope.curprocessdata.processes[i].keys.length;ii++)
          {
              keys =keys+$scope.curprocessdata.processes[i].keys[ii].name+",";
              table=table+"<th  width=60>"+$scope.curprocessdata.processes[i].keys[ii].title+"</th>";
          }
          keys=keys.substring(0,keys.length-1);
          table=table+"</tr></thead>";
          
          var time =$scope.curprocessdata.processes[i].time*1;
          var url ="/api/plugins/telemetry/DEVICE/"+$scope.curid+"/values/timeseries?keys="+keys+"&startTs="+(time-1000000)+"&endTs="+(time+1000000)+"&interval=1&limit=50000&agg=NONE";
          $http({
            method: "GET",
            url: url     
          }).
           then(function success(data) {
               if(data==null||data==undefined)
               {
                    $("#processhistory").html("");
               }
                data =data.data;
                
                var xAxis = new Array();
                var legend = new Array();
                var series = new Array();
                for(j=(data[$scope.curprocessdata.processes[i].keys[0].name].length-1);j>-1;j--)
                {
                    table=table+"<tr>";
                    table=table+"<td>"+  $filter('date')(new Date(data[$scope.curprocessdata.processes[i].keys[0].name][j].ts), 'yyyy-MM-dd HH:mm:ss')  +"</td>";
                    xAxis.push($filter('date')($filter('date')(new Date(data[$scope.curprocessdata.processes[i].keys[0].name][j].ts), 'yyMMdd HH:mm:ss')));
                   
                     for(ii=0;ii<$scope.curprocessdata.processes[i].keys.length;ii++)
                    {    
                        
                        if(j==0)
                       {
                           legend.push($scope.curprocessdata.processes[i].title);
                       }
                       if(series[ii]==null||series[ii]==undefined)
                       {
                           series[ii] ={
                             name:$scope.curprocessdata.processes[i].title,
                           type:'line',           
                            data:new Array()
                            }
                       }
                       series[ii].data.push(data[$scope.curprocessdata.processes[i].keys[ii].name][j].value);
                        
                        table=table+"<td>"+data[$scope.curprocessdata.processes[i].keys[ii].name][j].value+"</td>";
                     }
                     table=table+"</tr>";
                }
                 table=table+"<table>";
                  $("#processhistory").html(table);
                  
                  
                       var myChart = echarts.init(document.getElementById('main'));
           option = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:legend
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxis
    },
    yAxis: {
        type: 'value'
    },
    series: series
};
myChart.setOption(option);
setInterval(function (){
   
}, 2100); 
             
             
             $scope.dialogshow=true;
                 var _el = document.getElementById('processhistory');
                   _el.scrollTop = _el.scrollHeight - _el.height;
            },
            function error(resp) {
              
                    $("#processhistory").html("");
               
            })
          
          
      
     };   
});


//集成海航BS页面，马峰，2018-4-28
app.controller("c10ggSCWL", function ($scope,$state,$stateParams, $http, $sce,$filter)
{    
         $http({
                method: "POST",
                url: "/zbzz/loginController.do?checkuser",
                data: $.param({userName:"admin",password:"123456",langCode:"zh-cn"}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).
            then(function success(data) {
                   $scope.url =$sce.trustAsResourceUrl($stateParams.url);
                   document.title =$stateParams.title;
                   
                }
                );
       
});

//租户管理员菜单分配
app.controller('c10tenantmenuallocate', function($scope, $http) {
    $scope.pagenum = 0;
    $scope.num = null;
    $scope.newData = {};
    $scope.updata = {};
    $scope.modshow = false;
    $scope.addshow = false;
    $scope.numberOfElements = null;
    $scope.totalPages = null;
    $scope.set = false;
    $scope.setshow = false;
    $scope.setarr = null;
    $scope.id = 0;
    $scope.newArr = [];
    $scope.all=false;
    $scope.pagenumgroup = 0;
    $scope.numberOfgroup = null;
    $scope.totalPagesgroup = null;
    $scope.chooseuser=false;
    $scope.menuid=0;
    $scope.groupuserdata={};
    $scope.modusershow = false;
    $scope.data =null;
    $scope.jump = function(num) {
        $scope.pagenum = num - 1;
        $scope.go($scope.pagenum)
    }
    $scope.upDownFn = function(i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
            $scope.pagenum = 0
        } else if ($scope.pagenum > ($scope.totalPages - 1)) {
            $scope.pagenum = $scope.totalPages - 1
        }
        $scope.go($scope.pagenum)
    }
    $scope.go = function(num) {
        $scope.data =null;
        var pagearr = baseLocalStorage("jwt_token");
        $http({
            method: "GET",
            url: "/c10/api/selectenanttmenus",
            params: {
                page: $scope.pagenum,
                size: 10
            }
        }).
        then(function success(datas) {
                $scope.numberOfElements = "0";
                $scope.totalPages = "0";
                $scope.data = datas.data;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })
    }
    $scope.go($scope.pagenum)
    
    $scope.allocate = function(data,ind) {
        $scope.addshow = true;
        $scope.myshow = true;
        $scope.all=false;
        $scope.chooseuser=false;
        $scope.menuid=data.menuId;//菜单id
        //查询用户组
        $http({
            method: "GET",
          //  url: "/c10/api/usergroup/selectallocategroup/"+$scope.menuid,
          url: "/c10/api/usergroup/"+data.tenantId+"/selectallocategroup/"+data.menuType,
            params: {
                page: $scope.pagenumgroup,
                size: 10
            }
        }).
        then(function success(datas) {
                $scope.numberOfgroup = datas.data.numberOfElements;
                $scope.totalPagesgroup = datas.data.totalPages;
                $scope.groupdata = datas.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })

    }
    $scope.checkallvalue=function(name){
        $scope.all=name;
    }
    
    $scope.checkvalue=function(data,name){
        data.checkbox=name;
        if(!name){
            $scope.all=false;
        }
    }
    $scope.close = function() {
        $scope.myshow = false;
        $scope.modshow = false;
        $scope.addshow = false;
        $scope.chooseuser=false;
        $scope.menuid=0;
        $scope.modusershow = false;
        $scope.groupuserdata={};
    }
    
    $scope.addaffirm = function() {
        $scope.chooseuser=false;
        if($scope.groupdata.length>0){
            if(!$scope.all){
                var flag="0";
                for(var i=0;i<$scope.groupdata.length;i++){
                    var checkbox=$scope.groupdata[i].checkbox;
                    if(checkbox){
                        flag++;
                    }
                }
                if(flag==0){
                    $scope.chooseuser=true;
                    return;
                }else{
                    for(var i=0;i<$scope.groupdata.length;i++){
                        var checkbox=$scope.groupdata[i].checkbox;
                        if(!checkbox){
                            $scope.groupdata[i].groupId='0';//用户组id
                        }
                    }
                }
            }
            //保存
            $http({
                method: "POST",
             //   url: "/c10/api/usergroup/saveemunrel/"+$scope.menuid,
             url: "/c10/api/usergroup/"+$scope.menuid+"/saveemunrel/",
                data: $scope.groupdata
            }).
            then(function success(data) {
                $scope.groupdata = {};
                $scope.addshow = false;
                $scope.all = false;
                location.reload()
                   

            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
            });

        }else{
            $scope.chooseuser=true; 
            return;
         }
       
    }
    $scope.lookallocate=function(data,ind){
        $scope.modshow = true;
        $scope.modusershow = true;
        $scope.menuid=data.menuId;//菜单id
        $http({
            method: "GET",
          //  url: "/c10/api/usergroup/selectgrouprel/"+$scope.menuid,
          url: "/c10/api/usergroup/"+$scope.menuid+"/selectgrouprel/"+data.menuType,
            params: {
                page: $scope.pagenumgroup,
                size: 10
            }
        }).
        then(function success(datas) {
                $scope.numberOfgroups = datas.data.numberOfElements;
                $scope.totalPagesgroups = datas.data.totalPages;
                $scope.groupuserdata = datas.data.content;
            },
            function error(resp) {
                if (resp.data.status == 401) {
                    refreshJwtToken($http);
                }
               
            })

    }

    $scope.del = function(ind) {
        if (ind >= 0) {
            if (confirm("是否删除" + $scope.groupuserdata[ind].tsUserGroup.groupName)) {
                var groupId = $scope.groupuserdata[ind].tsUserGroup.groupId;
                var menuId=$scope.menuid;
                $http({
                    method: "DELETE",
                    url: "/c10/api/usergroup/"+groupId+"/deletemenuuser/"+menuId
                    
                }).
                then(function success(data) {
                      location.reload()
                        $scope.myshow = false;
                    },
                    function error(resp) {
                        if (resp.data.status == 401) {
                            refreshJwtToken($http);
                        }
                    });
            }
        }
    }

})


