const fs = require('fs');
const pdf = require('pdf-parse');

console.log(typeof pdf);
console.log(pdf);

let dataBuffer = fs.readFileSync('D:/bundles/ecommerce.pdf');

const parseFunc = typeof pdf === 'function' ? pdf : pdf.default || pdf.pdf;

parseFunc(dataBuffer).then(function(data) {
  console.log(data.text);
}).catch(function(error) {
  console.error('Error fetching PDF:', error);
});
