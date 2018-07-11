var Peepub  = require('../Peepub.js');
var _       = require('lodash');
var fs      = require('fs');

var helpers = require('./helpers.js');
var pp,min_pp;

describe("Outputting an EPUB", function(){
  beforeEach(function(){
    helpers.start();
    pp = helpers.getFull();
  });

  afterEach(function(){
    helpers.stop();
  });
  
  
  it("if you give create() a file name and path it will put the epub there", function(){
    var epubFile = '';
    var whereToPutIt = __dirname + '/assets/test.epub';
    runs(function(){
      pp.create(whereToPutIt, function(err, file){
        epubFile = file;
      })
    });

    waitsFor(function(){
      return epubFile !== '';
    }, "it to assemble everything");

    runs(function(){
      expect(fs.existsSync(whereToPutIt)).toBe(true);
      pp.clean();
    });
  });

  it("if you give create() a path it will make name and put the epub there", function(){
    var epubFile = '';
    var whereToPutIt = __dirname + '/assets/';
    runs(function(){
      pp.create(whereToPutIt, function(err, file){
        epubFile = file;
      })
    });

    waitsFor(function(){
      return epubFile !== '';
    }, "it to assemble everything");

    runs(function(){
      expect(fs.existsSync(epubFile)).toBe(true);
      pp.clean();
    });
  });

  it("create() returns a promise", function(){
    var epubFile = '';
    var whereToPutIt = __dirname + '/assets/';
    runs(function(){
      pp.create(whereToPutIt)
      .then(function(file){
        epubFile = file;
      });
    });

    waitsFor(function(){
      return epubFile !== '';
    }, "it to assemble everything", 10000);

    runs(function(){
      expect(fs.existsSync(epubFile)).toBe(true);
      pp.clean();
    });
  });

});