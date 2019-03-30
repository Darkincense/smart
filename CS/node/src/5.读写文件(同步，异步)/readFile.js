var fs = require('fs');
/**
path <string> | <Buffer> | <URL> | <integer> 文件名或文件描述符。
options <Object> | <string>
encoding <string> | <null> 默认为 null。
flag <string> 默认为 'r'。
callback <Function>
err <Error>
data <string> | <Buffer>

异步读取文件的全部内容
 */
var readMe = fs.readFile("readMe.txt", "utf8", function(err, data) {
  fs.writeFile('writeMe.txt', data, function() {
      console.log('writeMe has finished');
  })
});

// var waitTill = new Date(new Date().getTime() + 4 * 1000);
// while (waitTill > new Date()) {}

console.log("finished");