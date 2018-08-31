// <!--历史查询页面-查询数据分页-->
angular.module('app.service', [])
  .service('cutData', [function () {
    return function (data, $scope) {
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
      $scope.go = function (num) {
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
      $scope.cutDataFn = function () {
        var cutdataCopy = []
        // 对数组进行深拷贝，不在元数据上进行操作
        data.forEach(function (i) {
          cutdataCopy.push(i)
        })
        // 根据页码对数据进行截取
        $scope.everyDATA = cutdataCopy.splice(($scope.pagenum - 1) * $scope.everyPageLength, $scope.everyPageLength)

      }
      // 初始化第一页
      $scope.go(1)
      // 上下页操作
      $scope.upDownFn = function (i) {
        $scope.pagenum = $scope.pagenum + i
        if ($scope.pagenum <= 0) {
          $scope.pagenum = 1
        } else if ($scope.pagenum > ($scope.pageLength - 1)) {
          $scope.pagenum = $scope.pageLength - 1
        }
        $scope.go($scope.pagenum)

      }
    }
  }])