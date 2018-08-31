angular.module('app.router', ['ui.router', 'ngFileUpload']).config(
  function ($stateProvider) {
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
        params: { 'url': null, 'title': null },
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
        params: { 'url': null, 'title': null },
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
        params: { 'index': null, 'name': null },
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
