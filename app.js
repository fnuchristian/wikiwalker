var cheerio = require('cheerio'),
    request = require('request'),
    express = require('express'),
    async = require('async'),
    path = require('path'),
    http = require('http'),
    swig = require('swig');

var baseUrl = "http://192.168.1.246:3000/";

// // A test function to test cheerio
// // Get the HTML text of the starting room
// var pageHtml = request({
//   uri: baseUrl
// }, function(err, response, body) {
//   // Just a basic error check
//   if (err && response.statusCode !== 200) {
//     console.log('Request error.');
//   }

//   $ = cheerio.load(body);

//   var mainDivText = $('div').text();
//   var allPageLinks = $('a');

//   var pageLinks = allPageLinks.filter(function(index, link) {
//     if ($(link).attr('href').match(/wiki\/.*/)) {
//       return true;
//     }
//   });

//   debugger;
// });

// A helper function for creating a full url
var addBaseUrl = function(url) {
  return baseUrl + url;
};

// A javascript class that represents a Page to organize pages easier
var Page = function(attrs) {
  this.url = attrs.url;
  this.links = attrs.links;
  this.title = attrs.title;
};

// Create helper variables to keep track visited pages
// Create an object which property keys are the URLs and the values are the Page objects
var visitedLinks = [],
    urlToPage = {};

var getAndCrawlLink = function(url) {
  console.log("Crawling URL: ", url);

  // Step 1: Grab the page at the URL we're given
  request({
    uri: url
  }, function(err, response, body) {
    // A basic error check
    if (err && response.statusCode !== 200) {
      console.log('Request error getting: ', url);
    }

    // Step 2: Find links in the page that start with /wiki
    // Convert them into a list of just the URLs we want to crawl
    // Filter and map functions are from cheerios
    // $ indicating that it is a cheerio object
    var $ = cheerio.load(body);

    var $allPageLinksObject = $('a');
    var $wikiPageLinksObject = $allPageLinksObject.filter(function(index, linkElement) {
      if ($(linkElement).attr('href').match(/wiki\/.*/)) return true;
    });

    var $completePageLinks = $wikiPageLinksObject.map(function(index, linkElement) {
      // Getting the partial url
      var url = $(linkElement).attr('href');

      // Completing the url
      return addBaseUrl(url);
    });

    // Step 3: Store the title information from the page
    var title = $('main h3').text();

    // Step 4: Save the fact that we've visited this page
    visitedLinks.push(url);

    // Step 5: Convert the currently crawled page into a Page object and store info about it
    urlToPage[url] = new Page({
      title: title,
      url: url,
      links: $completePageLinks
    });

    // Step 6: Recursively crawl each link
    // Each function is from cheerios
    $completePageLinks.each(function(index, completePageLink) {
      if (visitedLinks.indexOf(completePageLink) === -1) {
        getAndCrawlLink(completePageLink);
      }
    });
  });
};

getAndCrawlLink(baseUrl);

























