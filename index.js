https://www.flaticon.com/authors/basic-miscellany/flat/4

var Crawler = require("crawler");
var fs = require('fs');

var FILE_PATH = './data/json/';

/** 
var COLLECTION = 'essential-collection';
var PAGES = 8;

**/
var COLLECTION = 'all-lists';
var START = 4;
var PAGES = 4; //21


var PATH_TMP = 'https://www.flaticon.com/authors/basic-miscellany/flat/X';

var DATASVG = 'data-icon_src';

var getUrls = function(tpl, n) {
  var arr = [];
  for(let i = START; i<= n; i++) {
    arr.push(tpl.replace('X', i));
  }
  return arr;
}

var writeJSON = function(name, data, fn) {
  fs.writeFile(FILE_PATH + name + '.json', JSON.stringify(data), fn);
}

var getName = function(str) {
  var a = str.split('/');
  return a[a.length -1];
}

var rs = [];
 
var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            var $a = $('.search-result .box-container .box a');
            var $span = $('.search-result .box-container .box a .badge');
            var hrefs = [];
            var count = [];
            $a.each(function(index, item) {
              hrefs.push(item.attribs.href);
            });
            $span.each(function(index, item){
              count.push(item.children[0].data.match(/\d+/g)[0])
            });

            hrefs.forEach(item=> {
              console.log(getName(item));
            });
            count.forEach(item=>{
              console.log( Math.ceil(item/50) );
            })
            
            console.log('page requested')
        }
        done();
    }
});

c.queue(getUrls(PATH_TMP, PAGES));

c.on('drain', function(){

  console.log('DONE');
  return;

  writeJSON(COLLECTION, rs, function(err, data){
    if(err) throw err;
    console.log('json file saved! = ' + COLLECTION + ' count =' + rs.length);
  })
});