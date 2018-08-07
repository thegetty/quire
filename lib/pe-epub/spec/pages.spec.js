var Peepub          = require('../Peepub.js');
var _               = require('lodash');
var cheerio         = require('cheerio');
var fs              = require('fs');
var path            = require('path');
var epubJson        = require('../examples/example.json');
var helpers         = require('./helpers.js');
var pp,min_pp;


describe("Page Handling", function(){
  
  beforeEach(function(){
    helpers.start();
    pp = helpers.getFull();
    min_pp = helpers.getMin();
  });

  afterEach(function(){
    helpers.stop();
  });
  

  it("creates pages", function(){
    var epubPath = '';
    
    runs(function(){
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      expect(fs.existsSync(pp.getJson().pages[0].path)).not.toBeNull();
      expect(fs.existsSync(pp.getJson().pages[0].path)).toBe(true);
      pp.clean();
    });
    
  });
  
  it("adds pages to the manifest", function(){
    var epubPath = '';
    
    runs(function(){
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      var contentopf = fs.readFileSync(pp.contentOpfPath(), 'utf8');
      var $ = cheerio.load(contentopf);
      _.each(pp.getJson().pages, function(page){
        var itemPage = $('item#' + page.id);
        expect(itemPage.length).toBe(1);
        expect(itemPage.attr('href').match(page.id)).not.toBeNull();
      });
      
      pp.clean();
    });
  });
  
  it("adds pages to the spine", function(){
    var epubPath = '';
    
    runs(function(){
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });
    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      var contentopf = fs.readFileSync(pp.contentOpfPath(), 'utf8');
      var $ = cheerio.load(contentopf);
      _.each(pp.getJson().pages, function(page){

        var itemPage = $('spine itemref[idref='+page.id+']');
        expect(itemPage.length).toBe(1);
      });
      pp.clean();
    });
  });

  it("will hide pages from the spine", function(){
    var epubPath = '';
    runs(function(){
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      var contentopf = fs.readFileSync(pp.contentOpfPath(), 'utf8');
      var $          = cheerio.load(contentopf);
      
      var pagesThatAreHidden = _.filter(pp.json.pages, function(page){ return page.hidden; });
      pagesThatAreHidden.forEach(function(page){
        expect($('spine itemref[idref='+page.id+']').attr('linear')).toBe('no');
      });
    });
      
    pp.clean();
  });
  
  it("puts a css/link tag in every page", function(){
    var epubPath = '';
    runs(function(){
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      var contentopf = fs.readFileSync(pp.contentOpfPath(), 'utf8');
      var $          = cheerio.load(contentopf);
      var firstPage  = fs.readFileSync(epubPath + Peepub.EPUB_CONTENT_DIR + pp.json.pages[0].href, 'utf8');
      var $page      = cheerio.load(firstPage);
      
      _.each(pp.assets.css, function(css){
        var itemCss = $('manifest item[id='+css.id+']');
        expect($page("link[href='"+$(itemCss).attr('href')+"']").length).toBe(1);
      });
      
      pp.clean();
    });
  });
  
  it("puts a js/script tag in every page", function(){
    var epubPath = '';
    runs(function(){
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      var contentopf = fs.readFileSync(pp.contentOpfPath(), 'utf8');
      var $          = cheerio.load(contentopf);
      var firstPage  = fs.readFileSync(epubPath + Peepub.EPUB_CONTENT_DIR + pp.json.pages[0].href, 'utf8');
      var $page      = cheerio.load(firstPage);
      
      _.each(pp.assets.js, function(js){
        var itemJs = $('manifest item[id='+js.id+']');
        expect($page("script[src='"+$(itemJs).attr('href')+"']").length).toBe(1);
      });
      
      pp.clean();
    });
  });
  
  it("removes problem webkit chars", function(){
    var epubPath = '';
    runs(function(){
      pp.json.pages[0].body += '&nbsp;&shy;&nbsp;&shy;';
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      var firstPage  = fs.readFileSync(epubPath + Peepub.EPUB_CONTENT_DIR + pp.json.pages[0].href, 'utf8');
      var $page      = cheerio.load(firstPage);
      
      expect($page.html().match(/&nbsp;/)).toBe(null);
      expect($page.html().match(/&shy;/)).toBe(null);
      
      pp.clean();
    });
  });


  it("handles name attr in a tags smartly", function(){
    var epubPath = '';
    runs(function(){
      pp.json.pages[0].body += "<a name='ptotheetothepub'></a>";
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      var firstPage  = fs.readFileSync(epubPath + Peepub.EPUB_CONTENT_DIR + pp.json.pages[0].href, 'utf8');
      var $page      = cheerio.load(firstPage);
      expect($page("a[name=ptotheetothepub]").length).toBe(0); // removes them
      expect($page("a[id=ptotheetothepub]").length).toBe(1);   // makes it the id if there isn't one already
      var reg = new RegExp('(<a[^>]+)></a>');
      expect(reg.test(firstPage)).toBe(false);   // empty tags become self-closing or they show up wrong in eReaders
      
      pp.clean();
    });
  });

  it("does not strip self-closing <hr>s ", function(){
    var epubPath = '';
    runs(function(){
      pp.json.pages[0].body += "<img src='http://thepeoplesebook.net/pe-epub/testing/test.png' />words words words. <hr/>";
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      var firstPage  = fs.readFileSync(epubPath + Peepub.EPUB_CONTENT_DIR + pp.json.pages[0].href, 'utf8');
      var $page      = cheerio.load(firstPage);

      expect(firstPage.match(/<hr>/)).toBeNull();
      pp.clean();
    });
  });

  it("does not strip self-closing <br>s ", function(){
    var epubPath = '';
    runs(function(){
      pp.json.pages[0].body += "<img src='http://thepeoplesebook.net/pe-epub/testing/test.png' />words words words. <br/>";
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      var firstPage  = fs.readFileSync(epubPath + Peepub.EPUB_CONTENT_DIR + pp.json.pages[0].href, 'utf8');
      var $page      = cheerio.load(firstPage);

      expect(firstPage.match(/<br>/)).toBeNull();
      pp.clean();
    });
  });

  it("templates the titles page", function(){
    for(var i in epubJson.pages){
      var reg = new RegExp('<title>\s*'+epubJson.pages[i].title+'\s*</title>');
      expect(pp._getPage(i).match(reg)).not.toBeNull();
    }
  });

  

});
