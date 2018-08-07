var Peepub                   = require('../Peepub.js');
var _               = require('lodash');
var fs              = require('fs');
var cheerio         = require('cheerio');
var path            = require('path');
var helpers         = require('./helpers.js');

var pp,min_pp;

describe("First Asset Test", function(){
  beforeEach(function(){
    helpers.start();
    pp = helpers.getFull();
  });

  afterEach(function(){
    helpers.stop();
  });
  
  it("will make css files for you", function(){
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
      expect(fs.existsSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'styles')).toBe(true);
      pp.clean();
    });
  });
});

describe("Assets in the EPUB", function(){
  beforeEach(function(){
    helpers.start();
    pp = helpers.getFull();
  });

  afterEach(function(){
    helpers.stop();
  });

  it("will make css files for you", function(){
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
      expect(fs.existsSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'styles')).toBe(true);
      pp.clean();
    });
  });
  
  it("puts the css in the manifest", function(){
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
      
      _.each(pp.assets.css, function(css){
        var itemCss = $('manifest item[id='+css.id+']');
        expect(itemCss.length).toBe(1);
        expect(fs.existsSync(epubPath + Peepub.EPUB_CONTENT_DIR + css.href)).toBe(true);
      });
      
      pp.clean();
    });
  });
  
  
  it("puts the js in the manifest", function(){
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
      
      _.each(pp.assets.js, function(js){
        var itemJs = $('manifest item[id='+js.id+']');
        expect(itemJs.length).toBe(1);
        expect(fs.existsSync(epubPath + Peepub.EPUB_CONTENT_DIR + js.href)).toBe(true);
      });
      
      pp.clean();
    });
  });

  it("wont put multiple assets in the manifest", function(){
    var epubPath = '';
    runs(function(){
      pp.json.pages[0].body += pp.json.pages[0].body;  // this page has an image in it
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
      
      expect($("manifest item[href*='printing-press.jpg']").length).toBe(1);
      
      pp.clean();
    });
  });

  it("can handle https", function(){
    var epubPath = '';
    runs(function(){
      pp.json.cover = 'https://s3.amazonaws.com/net.thepeoplesebook/pe-epub/printing-press.jpg';  
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
      
      expect($("manifest item[href*='printing-press.jpg']").length).toBe(1);
      
      pp.clean();
    });
  });
  
  it("makes image paths relative to the epub", function(){
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
      
      for(var i in pp.json.pages){
        var page = pp.json.pages[i];
        var $page = cheerio.load(page.body);
        if($page('img').length > 0){
          expect($page('img').first().attr('src').match(/http/)).toBe(null);
          $htmlPage = cheerio.load(fs.readFileSync(page.path));
          expect($htmlPage("img[src='"+$page('img').first().attr('src')+"']").length > 0).toBe(true);
          
          break;
        }
      }
      pp.clean();
    });
  });
  
  it("image tags need to be self-closed", function(){
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
      
      for(var i in pp.json.pages){
        var page = pp.json.pages[i];
        var $page = cheerio.load(page.body);
        if($page('img').length > 0){
          var regex = new RegExp('<img[^>]+/>', 'i');
          expect(regex.test(page.body)).toBe(true);
          break;
        }
      }
      pp.clean();
    });
  });
  
  
  it("handles video tag assets", function(){
    var epubPath = '';
    runs(function(){
      pp.json.pages[0].body += "<video poster='http://localhost:"+helpers.port+"/test.jpg' controls><source src='http://localhost:"+helpers.port+"/test.mp4' type='video/mp4'></video>";
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      expect(fs.existsSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'assets/test.mp4')).toBe(true);
      expect(fs.existsSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'assets/test.jpg')).toBe(true);
      pp.clean();
    });
  });

  it("handles video tag src attributes", function(){
    var epubPath = '';
    runs(function(){
      pp.json.pages[0].body += "<video controls src='http://localhost:"+helpers.port+"/test.mp4'></video>";
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      expect(fs.existsSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'assets/test.mp4')).toBe(true);
      pp.clean();
    });
  });

  it("makes video inline srcs relative to the epub", function(){
    var epubPath = '';
    runs(function(){
      pp.json.pages[0].body += "<video controls src='http://localhost:"+helpers.port+"/test.mp4'></video>";
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      
      var page = pp.json.pages[0];
      var $page = cheerio.load(page.body);
      expect($page('video').first().attr('src').match(/http/)).toBe(null);
      
      $htmlPage = cheerio.load(fs.readFileSync(page.path));
      expect($htmlPage("video[src='"+$page('video').first().attr('src')+"']").length > 0).toBe(true);
      pp.clean();
    });
  });
  
  it("makes video tag paths relative to the epub", function(){
    var epubPath = '';
    runs(function(){
      pp.json.pages[0].body += "<video poster='http://localhost:"+helpers.port+"/printing-press.jpg' controls><source src='http://localhost:"+helpers.port+"/test.mp4' type='video/mp4'></video>";
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      
      var page = pp.json.pages[0];
      var $page = cheerio.load(page.body);
      expect($page('video source').first().attr('src').match(/http/)).toBe(null);
      
      $htmlPage = cheerio.load(fs.readFileSync(page.path));
      expect($htmlPage("video source[src='"+$page('video source').first().attr('src')+"']").length > 0).toBe(true);
      pp.clean();
    });
  });
  
  it("image tags need to be self-closed when there's a video", function(){
    var epubPath = '';
    runs(function(){
      pp.json.pages[0].body += "<video poster='http://localhost:"+helpers.port+"/printing-press.jpg' controls><source src='http://localhost:"+helpers.port+"/test.mp4' type='video/mp4'></video>";
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      
      for(var i in pp.json.pages){
        var page = pp.json.pages[i];
        var $page = cheerio.load(page.body);
        if($page('img').length > 0){
          var regex = new RegExp('<img[^>]+/>', 'g');
          expect(regex.test(page.body)).toBe(true);
          break;
        }
      }
      pp.clean();
    });
  });
  

  it("handles audio tags", function(){
    var epubPath = '';
    runs(function(){
      pp.json.pages[0].body += "<audio controls><source src='http://localhost:"+helpers.port+"/test.mp3' type='audio/mp3'></audio>";
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      expect(fs.existsSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'assets/test.mp3')).toBe(true);
      pp.clean();
    });
  });

  it("handles redirects", function(){
    var epubPath = '';
    runs(function(){
      pp.json.pages[0].body += "<img src='http://localhost:"+helpers.port+"/redirect' />";
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      expect(fs.existsSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'assets/redirect')).toBe(true);
      expect(fs.statSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'assets/redirect').size > 100).toBe(true);
      // pp.clean();
    });
  });

  it("makes audio tag paths relative to the epub", function(){
    var epubPath = '';
    runs(function(){
      pp.json.pages[0].body += "<audio controls><source src='http://localhost:"+helpers.port+"/test.mp3' type='audio/mp3'></audio>";
      pp.create(function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      
      var page = pp.json.pages[0];
      var $page = cheerio.load(page.body);
      expect($page('audio source').first().attr('src').match(/http/)).toBe(null);
      
      $htmlPage = cheerio.load(fs.readFileSync(page.path));
      expect($htmlPage("audio source[src='"+$page('audio source').first().attr('src')+"']").length > 0).toBe(true);
      pp.clean();
    });
  });
});
