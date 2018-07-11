var Peepub   = require('../Peepub.js');
var _       = require('lodash');
var fs      = require('fs');
var cheerio = require('cheerio');
var path    = require('path');
var helpers = require('./helpers.js');

describe("Peepub Basics", function() {
  it("is a function", function() {
    expect(typeof Peepub).toBe('function');
  });
  
  var epubJson        = require('../examples/example.json');
  var minimumEpubJson = require('../examples/minimum.json');
  var pp,min_pp;
  
  beforeEach(function(){
    helpers.start();
    pp = helpers.getFull();
    min_pp = helpers.getMin();
  });

  afterEach(function(){
    helpers.stop();
  });
  
  
  it("made a contentopf alright", function(){
    
    var contentOpf = '';
    runs(function(){
      pp._contentOpf().then(function(copf){
        contentOpf = copf;
      })
    });

    waitsFor(function(){
      return contentOpf !== '';
    }, "it to assemble everything");

    runs(function(){
      expect(contentOpf).not.toEqual('');
      pp.clean();
    });
  });
  
  it("creates a meta tag for the cover image and adds it to the manifest", function(){
    
    var contentOpf = '';
    runs(function(){
      pp._contentOpf().then(function(copf){
        contentOpf = copf;
      })
    });

    waitsFor(function(){
      return contentOpf !== '';
    }, "it to assemble everything");

    runs(function(){
      var $ = cheerio.load(contentOpf);
      expect($("item[id='cover-image']").length).not.toBe(0);
      expect($("meta[content='cover-image']").length).not.toBe(0);
      pp.clean();
    });
  });
  
  it("creates a proper file structure with necessaries", function(){
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
      expect(fs.existsSync(epubPath)).toBe(true);
      expect(fs.existsSync(epubPath + 'META-INF/')).toBe(true);
      expect(fs.existsSync(epubPath + 'META-INF/container.xml')).toBe(true);
      pp.clean();
    });
  });
  
});



describe("Content OPFs", function() {
  
  var epubJson = require('../examples/example.json');
  var minimumEpubJson = require('../examples/minimum.json');
  var pp,min_pp, pp_opf;
  

  beforeEach(function(){
    helpers.start();
    pp = helpers.getFull();
    pp_opf = pp._contentOpf({ fetchAssets : false });
    min_pp = helpers.getMin();
  });

  afterEach(function(){
    helpers.stop();
  });
  
  it("can template", function(){
    expect(pp_opf.match(epubJson.title)).not.toBeNull();
  });
  
  it("have multiple subjects", function(){
    for(var i in epubJson.subjects){
      expect(pp_opf.match(epubJson.subjects[i])).not.toBeNull();
    }
  });
  
  it("creates uuids by default", function(){
    pp.set('uuid', null);
    pp.set('isbn', null);
    pp.set('url', null);
    var opf = pp._contentOpf({ fetchAssets : false });
    expect(opf.match('>urn:uuid:')).not.toBeNull();
    expect(opf.match('>urn:isbn:')).toBeNull();
    expect(opf.match('>url:')).toBeNull();
  });
  
  it("only ever has one identifier", function(){
    pp.set('uuid', null);
    pp.set('isbn', 'abc');
    pp.set('url', 'http://thepeoplesebook.net');
    var opf = pp._contentOpf({ fetchAssets : false });
    expect(opf.match('>urn:uuid:')).toBeNull();
    expect(opf.match('>urn:isbn:')).not.toBeNull();
    expect(opf.match('>url:')).toBeNull();
  });

  it("only ever has one identifier", function(){
    pp.set('uuid', null);
    pp.set('isbn', '');
    pp.set('url', null);
    var opf = pp._contentOpf({ fetchAssets : false });
    expect(opf.match('>urn:uuid:')).not.toBeNull();
    expect(opf.match('>urn:isbn:')).toBeNull();
    expect(opf.match('>url:')).toBeNull();
  });
  

  
  it("will be nice and handle plurals for you", function(){
    pp.set('subject', epubJson.subjects[0]);
    pp.set('subjects', null);
    var opf = pp._contentOpf({ fetchAssets : false });
    expect(opf.match(epubJson.subjects[0])).not.toBeNull();
    expect(opf.match(epubJson.subjects[1])).toBeNull();
  });

  it("handles multiple languages", function(){
    var opf = pp._contentOpf({ fetchAssets : false });
    expect(opf.match(/<dc:language>/g).length).toBe(epubJson.languages.length);
  });
  
  it("handles the modified date correctly", function(){
    var opf          = pp._contentOpf({ fetchAssets : false });
    var $            = cheerio.load(opf, { xmlMode : true });
    var modified     = $('meta[property*=modified]').text();
    var modifiedDate = new Date(modified);
    var now          = new Date();
    
    expect(modifiedDate.getMonth()).toEqual(now.getMonth());
    expect(modifiedDate.getYear()).toEqual(now.getYear());
  });

  it("doesnt have blank creators", function(){
    min_pp.set('creators', [{ name : '', role : 'aut', 'file-as' : '' }]);
    var opf = min_pp._contentOpf({ fetchAssets : false });
    var $ = cheerio.load(opf);
    expect($('dc:creator').length).toBe(0);
  });

  it("doesnt have blank file-as", function(){
    min_pp.set('creators', [{ name : 'owise1', role : 'aut', 'file-as' : '' }]);
    var opf = min_pp._contentOpf({ fetchAssets : false });
    var $ = cheerio.load(opf);
    expect($('meta[property="file-as"]').length).toBe(0);

    min_pp.set('contributor', [{ name : 'owise1', role : 'aut', 'file-as' : '' }]);
    opf = min_pp._contentOpf({ fetchAssets : false });
    $ = cheerio.load(opf);
    expect($('meta[property="file-as"]').length).toBe(0);
  });

  it("wont modify the original", function(){
    var minEpubJson = _.cloneDeep(minimumEpubJson);
    minEpubJson.publishers = [''];
    min_pp = new Peepub(minEpubJson, true);
    var opf = min_pp._contentOpf({ fetchAssets : false });
    var $ = cheerio.load(opf);
    expect($('dc:publisher').length).toBe(0);
    expect(minEpubJson.publishers).toBeDefined();
  });
  

});
