const https = require('https');

https.get('https://docs.google.com/document/d/e/2PACX-1vQKfU4NN05jbeQI9NA8W98IdIATB39Zw-ppekM8nv1bZOv9cY2PRkKjKbDer2RfUKlii6mrhvByXtJw/pub', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data);
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
