
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