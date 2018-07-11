var Peepub   = require('../Peepub.js');
var _       = require('lodash');
var fs      = require('fs');
var cheerio = require('cheerio');
var path    = require('path');
var helpers = require('./helpers.js');

var pp,min_pp;

describe("Broken / Problematic Json", function(){
  beforeEach(function(){
    helpers.start();
    pp = helpers.getFull();
  });

  afterEach(function(){
    helpers.stop();
  });
  
  it("won't freak out about bad assets", function(){
    var epubPath = '';
    var error = false;
    runs(function(){
      pp.create()
      .then(function(file){
        epubPath = pp._epubPath();
      })
      .fail(function(err){
        error = err;
      })
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      expect(error).toBe(false);
      pp.clean();
    });
  });
});