const fetch = require("node-fetch");

function fetchUrl(userId) {
  return fetch(`https://jsonplaceholder.typicode.com/todos/${userId}`)
  .then(response => response.json())
  .then(json => console.log(json))
}

const result = fetchUrl(1);
console.dir(result);

