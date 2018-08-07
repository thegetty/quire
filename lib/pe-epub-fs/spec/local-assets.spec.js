var path     = require('path');
var Peepub   = require("../index.js")(require('pe-epub'));
var _        = require('lodash');
var fs       = require('fs');
var cheerio  = require('cheerio');
var epubJson = require('../examples/example.json');
var pp;

var epubDir = __dirname + '/';


describe("Local assets in the EPUB", function(){
  beforeEach(function(){
    pp = new Peepub(_.cloneDeep(epubJson), true);
  });

  it("doesn't break things", function(){
    var epubPath = '';
    var fName;
    runs(function(){
      pp.create(epubDir)
      .then(function(fileName){
        epubPath = pp._epubPath();
        fName = fileName;
      })
      .fail(function(err){
        console.log('err' + err);
      })
      .done();
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      expect(fs.existsSync(fName)).toBe(true);
      pp.clean();
    });
  });

  it("can pull in local assets", function(){
    var epubPath      = '';
    var localTestFile = __dirname + "/assets/test.jpg";
    runs(function(){
      pp.json.pages[0].body += "<img src='file://"+localTestFile+"'/>";
      pp.create(epubDir)
      .then(function(){
        epubPath = pp._epubPath();
      })
      .fail(function(){
        console.log('err');
      })
      .done();
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      expect(fs.existsSync(epubPath + Peepub.EPUB_CONTENT_DIR + 'assets/' + path.basename(localTestFile))).toBe(true);
      pp.clean();
    });
  });

  it("can pull in local pages", function(){
    var epubPath      = '';
    var testPhrase    = "peoples_e--peoples_e" + Date.now();
    var localTestFile = __dirname + "/assets/test.html";

    fs.writeFileSync(localTestFile, "<!DOCTYPE html>\n<body>\n" + pp.json.pages[0].body + testPhrase + "\n</body>\n</html>");
    var ogPageBody = pp.json.pages[0].body;
    pp.json.pages[0].body = 'file://' + localTestFile;

    runs(function(){
      pp.create(epubDir, function(err, file){
        epubPath = pp._epubPath();
      });
    });

    waitsFor(function(){
      return epubPath !== '';
    }, "it to assemble everything");

    runs(function(){
      var firstPage  = fs.readFileSync(epubPath + Peepub.EPUB_CONTENT_DIR + pp.json.pages[0].href, 'utf8');
      var $page      = cheerio.load(firstPage);

      expect($page('body').html().match(testPhrase)).not.toBeNull();

      fs.unlinkSync(localTestFile);
      pp.clean();
    });
  });
  
});