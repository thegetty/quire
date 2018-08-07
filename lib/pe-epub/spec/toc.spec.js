var Peepub          = require('../Peepub.js');
var _               = require('lodash');
var cheerio         = require('cheerio');
var fs              = require('fs');
var path            = require('path');
var helpers         = require('./helpers.js');
var pp,min_pp;


describe("TOC functionality", function(){
  beforeEach(function(){
    helpers.start();
    pp = helpers.getFull();
  });

  afterEach(function(){
    helpers.stop();
  });

  it("always creates a toc.html and toc.ncx", function(){
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
      expect(fs.existsSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'toc.html')).toBe(true);
      expect(fs.existsSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'toc.ncx')).toBe(true);
      pp.clean();
    });
  });
  
  it("puts the desired pages in the toc.html", function(){
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
      var toc = fs.readFileSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'toc.html', 'utf8');
      var $   = cheerio.load(toc);
      _.each(pp.getTocPages(), function(page){
        expect($("nav li a[href='"+page.href+"']").length).toBe(1);
      });
      pp.clean();
    });
  });
  
  it("puts the desired pages in the toc.ncx", function(){
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
      var toc = fs.readFileSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'toc.ncx', 'utf8');
      var $   = cheerio.load(toc);
      
      _.each(pp.getTocPages(), function(page){
        expect($("content[src='"+page.href+"']").length).toBe(1);
      });
      pp.clean();
    });
  });

  it("in the toc.ncx, meta id tag needs to reflect whether there is an isbn", function(){
    var epubPath = '', epub2Path = '';
    var pp2 = helpers.getFull();
    
    runs(function(){
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });

      pp2.json.isbn = 'peoples_e';
      pp2.create()
      .then(function(epath){
        epub2Path = pp2._epubPath();
      })
      .done();
    });
  
    waitsFor(function(){
      return epubPath !== '' && epub2Path !== '';
    }, "it to assemble everything");
  
    runs(function(){
      var toc = fs.readFileSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'toc.ncx', 'utf8');
      var $   = cheerio.load(toc);

      var toc2 = fs.readFileSync(epub2Path + Peepub.EPUB_CONTENT_DIR + 'toc.ncx', 'utf8');
      var $2   = cheerio.load(toc2);

      expect($("meta[name='dtb:uid']").attr('content').match(/urn:uuid/)).not.toBeNull();
      expect($2("meta[name='dtb:uid']").attr('content').match(/urn:isbn/)).not.toBeNull();

      pp.clean();
      pp2.clean();
    });
  });

  it("included the unique id in the toc.ncx", function(){
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
      var toc = fs.readFileSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'toc.ncx', 'utf8');
      var $   = cheerio.load(toc, { xmlMode : true });
      
      expect($("meta[content*='"+pp.json.url+"']").length).toBe(1);
      pp.clean();
    });
  });

  
  it("adds the tocs files to the manifest", function(){
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
      
      expect($("manifest item[href='toc.html']").length).toBe(1);
      expect($("manifest item[href='toc.ncx']").length).toBe(1);
      
      pp.clean();
    });
  });

  it("will create a toc link to the first page if you haven't put any pages in the TOC", function(){
    var epubPath = '';
    
    runs(function(){
      for(var i in pp.json.pages){
        pp.json.pages[i].toc = false;
      }
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      var toc = fs.readFileSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'toc.ncx', 'utf8');
      var $   = cheerio.load(toc);
      
      expect($("navPoint").length).toBe(1);

      toc = fs.readFileSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'toc.html', 'utf8');
      $ = cheerio.load(toc);

      expect($('ol li').length).toBe(1);
      expect($('ol li a').text()).toBe(pp.json.title);
      
      pp.clean();
    });
  });
});
