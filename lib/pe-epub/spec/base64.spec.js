var Peepub  = require('../Peepub.js');
var _       = require('lodash');
var fs      = require('fs');

// var cheerio = require('cheerio');
var path     = require('path');
var epubJson = require('../examples/example.json');
var pp,min_pp;

xdescribe("outputs a base64 epub", function(){
  beforeEach(function(){
    pp = new Peepub(_.cloneDeep(epubJson));
  });
  
  it("outputs an epub", function(){
    var epubFile = '';
    runs(function(){
      pp.create(function(err, file){
        epubFile = file;
      })
    });

    waitsFor(function(){
      return epubFile !== '';
    }, "it to assemble everything");

    runs(function(){
      expect(fs.existsSync(pp._epubPath())).not.toBe(true);

      var epubPath = path.normalize(__dirname + '/../epubs/test.epub');
      fs.writeFile(epubPath, epubFile, 'base64', function(err){
      });
      // pp.clean();
    });
  });
  
});