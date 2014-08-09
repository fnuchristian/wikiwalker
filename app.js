var cheerio = require('cheerio'),
    request = require('request');

var baseUrl = "http://192.168.1.246:3000";

// Get the HTML text of the starting room
var pageHtml = request({
  uri: baseUrl
}, function(err, response, body) {
  // Just a basic error check
  if (err && response.statusCode !== 200) {
    console.log('Request error.');
  }

  $ = cheerio.load(body);

  var mainDivText = $('div').text();
  var allPageLinks = $('a');

  var pageLinks = allPageLinks.filter(function(index, link) {
    if ($(link).attr('href').match(/wiki\/.*/)) {
      return true;
    }
  });

  debugger;
});