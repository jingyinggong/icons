var Crawler = require("crawler");
var fs = require('fs');

var FILE_PATH = './data/json/';

/** 
var COLLECTION = 'essential-collection';
var PAGES = 8;

**/
var COLLECTION = 'bugs-insects';
var PAGES = 1;


var PATH_TMP = 'https://www.flaticon.com/packs/' + COLLECTION + '/X';

var DATASVG = 'data-icon_src';

var getUrls = function(tpl, n) {
  var arr = [];
  for(let i = 1; i<= n; i++) {
    arr.push(tpl.replace('X', i));
  }
  return arr;
}

var writeJSON = function(name, data, fn) {
  fs.writeFile(FILE_PATH + name + '.json', JSON.stringify(data), fn);
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
            var $li = $('.search-result .icons li.icon');
            $li.each(function(index, item){
              if(item.attribs[DATASVG]) {
                rs.push(item.attribs[DATASVG]);
              }
            });
            console.log('page requested')
        }
        done();
    }
});

c.queue(getUrls(PATH_TMP, PAGES));

c.on('drain', function(){
  writeJSON(COLLECTION, rs, function(err, data){
    if(err) throw err;
    console.log('json file saved! = ' + COLLECTION + ' count =' + rs.length);
  })
});