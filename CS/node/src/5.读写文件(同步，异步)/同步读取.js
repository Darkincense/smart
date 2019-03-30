var fs = require('fs');

var readMeOne = fs.readFile("readMe.txt", "utf8", function(err, data) {
    var waitTill = new Date(new Date().getTime() + 2 * 1000);
    while (waitTill > new Date()) {}
    console.log("first async");
});

var readMeTwo = fs.readFile("readMe.txt", "utf8", function(err, data) {
    var waitTill = new Date(new Date().getTime() + 2 * 1000);
    while (waitTill > new Date()) {}
    console.log("second async");
});

console.log("finished");