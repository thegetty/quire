var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var _       = require('lodash');

var Peepub          = require('../Peepub.js');
var epubJson        = require('../examples/example.json');
var minimumEpubJson = require('../examples/minimum.json');
var ffEpubJson      = require('../examples/fixed-format.json');



app.configure(function() {
  app.use(express.static(__dirname + '/assets'));
  app.use(app.router);
});

app.get('/redirect', function(req, res){
  res.redirect('/test.jpg');
});

var port = 3344;

function replaceField(field){
  if(/^https/.test(field)){
    return field;
  } 
  return field.replace('s3.amazonaws.com/net.thepeoplesebook/pe-epub', 'localhost:' + port)
              .replace('ajax.googleapis.com/ajax/libs/jquery/1.7.2', 'localhost:' + port);
}

minimumEpubJson.cover  = replaceField(minimumEpubJson.cover);
epubJson.cover         = replaceField(epubJson.cover);
epubJson.css[1]        = replaceField(epubJson.css[1]);
epubJson.js            = replaceField(epubJson.js);
epubJson.pages[0].body = replaceField(epubJson.pages[0].body);

module.exports = {
  port : port,
  start : function(){
    server.listen(port);
  },
  stop : function(){
    server.close();
  },
  getFull : function(){
    return new Peepub(_.cloneDeep(epubJson), true);
  },
  getMin : function(){
    return new Peepub(_.cloneDeep(minimumEpubJson), true);
  },
  getFixed : function(){
    return new Peepub(_.cloneDeep(ffEpubJson), true);
  }
}
