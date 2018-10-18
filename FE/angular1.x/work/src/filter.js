
function filterSeverity() {
  return function (input, name) {
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
}
function filterReason() {
  return function (input, reasonFlag) {
    if (reasonFlag == "2") {
      return '(推荐)';
    }
  }
}

function filterrole() {
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

}
function filterset() {
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
}


function filterUserGroupRole() {
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

}

 function namenotnull() {
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
}

angular
  .module('myApp')
  //------------alarm-----------
  .filter('filterSeverity', filterSeverity)
  .filter('filterReason',filterReason)
  .filter('filterrole',filterrole)
  .filter('filterset',filterset)
  .filter('filterUserGroupRole',filterUserGroupRole)
  .filter('namenotnull',namenotnull)