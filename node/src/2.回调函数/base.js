function callFunction(fun, name) {
  fun(name);
}

callFunction(function(name) {
  console.log(name + ' Bye');
}, 'rails365');