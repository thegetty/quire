var path  = require('path');
var fs    = require("fs");

var _            = require('lodash');
var handlebars   = require('handlebars');
var cheerio      = require('cheerio');
var Q            = require('q');
var shell        = require('shelljs');
var JSZip        = require('./src/libs/jszip.js');
var archiver     = require('archiver');
var utils        = require('./src/utils.js');
var upath        = require('upath');

var readFile = Q.denodeify(fs.readFile);

var templatesBase    = 'templates/';
var templatesDir     = __dirname + '/src/' + templatesBase;
// handlebars.templates = require(templatesDir + 'templates.js');
handlebars.templates = {};

var tmpls = ['container.xml', 'content.opf','page.html', 'toc.html', 'toc.ncx', 'com.apple.ibooks.display-options.xml'];

function setupTemplates(){
  return Q.all(tmpls.map(function(tmpl){
    return readFile(templatesDir + tmpl, 'utf8')
    .then(function(tmplContent){
      handlebars.templates[templatesBase + tmpl] = handlebars.compile(tmplContent);
    });
  }));
}

function setupTemplatesSync(){
  _.each(tmpls, function(tmpl){
    handlebars.templates[templatesBase + tmpl] = handlebars.compile(fs.readFileSync(templatesDir + tmpl, 'utf8'));
  });
}


  /**
   * check Operating System
   * @returns {boolean} 
   */
  function isWin() {
    return process.platform === 'win32' ? true : false
  }


/**
 *
 */
var Peepub;
Peepub = function Peepub(first, debug) {
  'use strict';
  this.json = {};
  if (first) {
    this.json = _.cloneDeep(first);
  }
  if (debug) {
    this.debug = debug;
    this.useFs = true;
  }

  this.id             = utils.guid();
  this.requiredFields = ['title', 'cover']; // we'll take care of publish date and uuid
  this.epubFiles      = [];
  this.streams        = {};
  this.buffers        = {};
  this.assets         = {
                          css     : [],
                          js      : [],
                          assets  : []
                        };

  this.json.css = this.json.css || [];
  if (this.json.css && typeof this.json.css === 'string') {
    this.json.css = [this.json.css];
  }
  this.json.js = this.json.js || [];
  if (this.json.js && typeof this.json.js === 'string') {
    this.json.js = [this.json.js];
  }

};

Peepub.EPUB_DIR         = __dirname + '/epubs/';
Peepub.EPUB_CONTENT_DIR = 'OEBPS/'; // this is hard coded in content.opf - use handlebars if this will ever change
Peepub.EPUB_META_DIR    = 'META-INF/';

Peepub.prototype._handleDefaults = function () {
  var that = this;
  var d    = new Date(this.json.date || Date.now());
  if(isNaN(d.getMonth())){
    d = new Date;
  }
  var m    = d.getMonth() + 1;
  var day  = d.getDate();
  if (m.toString().length === 1) {
    m = '0' + m;
  }
  if (day.toString().length === 1) {
    day = '0' + day;
  }
  this.json.date = d.getFullYear() + '-' + m + '-' + day;
  this.json.language = this.json.language || 'en-US';

  // identifiers - can be isbn,url,uuid in that order of preference
  if (utils.falseString(this.json.isbn) && utils.falseString(this.json.url)) {
    this.json.uuid = this.json.uuid || utils.guid();
    this.json.url  = null;
    this.json.isbn = null;
    this.json.id   = this.json.uuid;

  } else if (!utils.falseString(this.json.isbn)) {
    this.json.url  = null;
    this.json.uuid = null;
    this.json.id   = this.json.isbn;

  } else if (!utils.falseString(this.json.url)) {
    this.json.uuid = null;
    this.json.isbn = null;
    this.json.id   = this.json.url;
  }

};

Peepub.prototype._epubDir = function(){
  return (this.epubDir || Peepub.EPUB_DIR);
};

Peepub.prototype._epubPath = function(add){
  var dir = this._epubDir() + this.id + '/';
  if(add){
    this._epubPath();

    // all additions go in the content dir
    dir += Peepub.EPUB_CONTENT_DIR + add + '/';
  }

  // set up the whole structure
  if(!this.useFs){
    if(_.isUndefined(this.buffers[dir + Peepub.EPUB_META_DIR + 'container.xml'] && !add)){

      this.buffers[dir + Peepub.EPUB_META_DIR + 'container.xml'] = new Buffer(handlebars.templates[templatesBase + "container.xml"]({}));
      this.epubFiles.push(dir + Peepub.EPUB_META_DIR + 'container.xml');

      var ff = this.getJson().fixedFormat;
      if( !_.isUndefined(ff) ){
        this.epubFiles.push(dir + Peepub.EPUB_META_DIR + 'com.apple.ibooks.display-options.xml');
        this.buffers[dir + Peepub.EPUB_META_DIR + 'com.apple.ibooks.display-options.xml'] = new Buffer(handlebars.templates[templatesBase + "com.apple.ibooks.display-options.xml"]({}));
      }
    }
    return dir;
  }

  if(!fs.existsSync(dir)){
    shell.mkdir('-p', dir);

    // set up the whole structure
    if(!add){
      fs.mkdirSync(dir + Peepub.EPUB_META_DIR);
      fs.writeFileSync(dir + Peepub.EPUB_META_DIR + 'container.xml', handlebars.templates[templatesBase + "container.xml"]({}), "utf8");
      this.epubFiles.push(dir + Peepub.EPUB_META_DIR + 'container.xml');
      fs.mkdirSync(dir + Peepub.EPUB_CONTENT_DIR);
      // fs.writeFileSync(dir + 'mimetype', 'application/epub+zip');
      // this.epubFiles.push(dir + 'mimetype');

      var ff = this.getJson().fixedFormat;
      if( !_.isUndefined(ff) ){
        fs.writeFileSync(dir + Peepub.EPUB_META_DIR + 'com.apple.ibooks.display-options.xml', handlebars.templates[templatesBase + "com.apple.ibooks.display-options.xml"]({}), "utf8");
        this.epubFiles.push(dir + Peepub.EPUB_META_DIR + 'com.apple.ibooks.display-options.xml');
        this.buffers[dir + Peepub.EPUB_META_DIR + 'com.apple.ibooks.display-options.xml'] = new Buffer(handlebars.templates[templatesBase + "com.apple.ibooks.display-options.xml"]({}));
      }
    }
  }
  return dir;
};

Peepub.prototype._fetchAssets = function(){
  this._fetchAssetsCalled = true;
  var that      = this;
  var d         = Q.defer();
  var json      = this.getJson();
  var all_pages = _.map(json.pages, function(page){ return page.body; }).join('');
  var $         = this._getDom(all_pages);
  var images    = _.filter(([json.cover]).concat(_.map($('img'), function(i){ return $(i).attr('src'); })), function(src){ return src !== ''; });
  var videoSrcs = [];
  var audioSrcs = [];

  _.each($('video'), function(video){
    if ($(video).attr('poster')) {
      images.push($(video).attr('poster'));
    }
    $(video).find('source').each(function(){
      videoSrcs.push($(this).attr('src'));
    });
    var inlineVideoSrc = $(video).attr('src');
    if(inlineVideoSrc){
      videoSrcs.push(inlineVideoSrc);
    }
  });
  videoSrcs = _.uniq(videoSrcs);
  images = _.uniq(images);

  _.each($('audio'), function(audio){
    $(audio).find('source').each(function(){
      audioSrcs.push($(this).attr('src'));
    });
    var inlineAudioSrc = $(audio).attr('src');
    if(inlineAudioSrc){
      audioSrcs.push(inlineAudioSrc);
    }
  });
  audioSrcs = _.uniq(audioSrcs);

  var allAssets = [];
  _.each(_.union(videoSrcs, audioSrcs, images), function(src){

    // Does this asset file name already exist?
    // we're trying to keep the orig file name to make the epub contents more accessible
    var fileName = path.basename(src);
    var hrefI = 1;
    while(_.map(allAssets, 'fileName').indexOf(fileName) > -1){

      fileName = path.basename(src, path.extname(src)) + '_' + hrefI + path.extname(src);
      hrefI++;
    }
    allAssets.push({
      src : src,
      fileName : fileName
    });
  });


  var assetPromises = _.map(allAssets, function(assetObj){
    var src      = assetObj.src;
    var fileName = assetObj.fileName;

    var filePath = that._epubPath('assets') + fileName;
    return that._createFile(filePath, src)
            .then(function(res){
              if(res.headers){
                var asset = {
                           src : src,
                  'media-type' : res.headers['content-type'],
                          href : 'assets/' + fileName,
                           _id : utils.guid()
                };
                if(src === json.cover){
                  asset.properties = 'cover-image';
                  asset.id = 'cover-image';
                }
                that.assets.assets.push(asset);

              } else { // this wasnt a proper image, video or audio file
                fs.unlink(filePath);

              }
              return Q.fcall(function () { return true;  });
            });
  });

  Q.all(assetPromises)
  .then(function(){
    var cssPromises = _.map(json.css, function(css, i){
      var filePath = that._epubPath('styles') + 'css_' + i + '.css';
      return that._createFile(filePath, css)
              .then(function(res){
                var asset = {
                           src : css,
                  'media-type' : 'text/css',
                          href : 'styles/' + path.basename(filePath),
                           _id : utils.guid(),
                           id  : 'css_' + i
                };
                that.assets.css.unshift(asset);
                return Q.fcall(function () { return true;  });
              });
    });
    return Q.all(cssPromises);
  })
  .then(function(){
    var jsPromises = _.map(json.js, function(js, i){
      var filePath = that._epubPath('scripts') + 'js_' + i + '.js';
      return that._createFile(filePath, js)
              .then(function(res){
                var asset = {
                           src : js,
                  'media-type' : 'text/javascript',
                          href : 'scripts/' + path.basename(filePath),
                           _id : utils.guid(),
                           id  : 'js_' + i
                };
                that.assets.js.unshift(asset);
                return Q.fcall(function () { return true;  });
              });
    });
    return Q.all(jsPromises);
  })
  .then(function(){
    d.resolve(that.assets.assets.concat(that.assets.css).concat(that.assets.js));
  })
  .fail(d.reject);
  return d.promise;
};

Peepub.prototype._getDom = function(str){
  var that = this;
  var uuid = utils.guid();
  return cheerio.load("<div id='"+uuid+"'>" + str + '</div>', { xmlMode: true });
};


Peepub.prototype._contentOpf = function(options, callback){
  var that = this;
  var d    = Q.defer();
  var json;

  var opts = _.extend({
    fetchAssets : true
  }, options);

  if(opts.fetchAssets){
    setupTemplates()
    .then(function () {
      json = that.getJson();
      return that._fetchAssets();
    })
    .then(function(assets){
      json.items = assets;

      // these tags need IDs, so we need to make them unique
      var needIs = ['creators', 'contributors', 'items'];
      _.each(needIs, function(field){
        if(that.json[field]){
          for(var i in that.json[field]){
            that.json[field][i]['i'] = parseInt(i)+1;
          }
        }
      });

      that._createPages(function(){

        json.items    = json.items.concat(that.json.pages);   // add pages to the manifest
        json.itemrefs = that.json.pages;                      // add pages to the spine

        that._createToc(function(){
          var contentOpf = handlebars.templates[templatesBase + "content.opf"](json);
          if(!that.useFs){
            that.buffers[that.contentOpfPath()] = new Buffer(contentOpf);
            that.epubFiles.push(that.contentOpfPath());
            d.resolve(contentOpf);

          } else {
            fs.writeFile(that.contentOpfPath(), contentOpf, function(err){
              if(err){
                d.reject('content.opf didnt save');
              } else {
                that.epubFiles.push(that.contentOpfPath());
                d.resolve(contentOpf);
              }
            });
          }
        });
      });
    }).fail(function(err){
      d.reject(err);
    });
    return d.promise;

  // this is used for testing
  // synchronously returns basic contentOpf
  } else {
    setupTemplatesSync();
    return handlebars.templates[templatesBase + "content.opf"](that.getJson());
  }
};

Peepub.prototype._createToc = function(callback){
  var that           = this;
  var json           = this.getJson();
  var finished_files = 0;

  json.tocPages = this.getTocPages();

  // by default we'll make one navpoint to their first page
  if(json.tocPages.length === 0){
    json.tocPages.push(json.pages[0]);
  }
  for(var i in json.tocPages){
    json.tocPages[i]['i'] = parseInt(i)+1;
  }
  json.items.push({
      id            : 'toc',
      href          : 'toc.html',
      'media-type'  : 'application/xhtml+xml',
      properties    : 'nav'
    });
  json.items.push({
      id            : 'ncx',
      href          : 'toc.ncx',
      'media-type'  : 'application/x-dtbncx+xml'
    });
  json.css = this.assets.css;

  var tocHtml = handlebars.templates[templatesBase + "toc.html"](json);
  var tocNcx = handlebars.templates[templatesBase + "toc.ncx"](json);
  this.buffers[this._epubPath() + Peepub.EPUB_CONTENT_DIR + 'toc.html'] = new Buffer(tocHtml);
  this.buffers[this._epubPath() + Peepub.EPUB_CONTENT_DIR + 'toc.ncx'] = new Buffer(tocNcx);

  if(this.useFs){
    fs.writeFile(this._epubPath() + Peepub.EPUB_CONTENT_DIR + 'toc.html', tocHtml, function(err){
      if(err) throw 'toc.html didnt save';

      that.epubFiles.push(that._epubPath() + Peepub.EPUB_CONTENT_DIR + 'toc.html');
      finished_files++;
      if(finished_files === 2){
        callback();
      }
    });

    fs.writeFile(this._epubPath() + Peepub.EPUB_CONTENT_DIR + 'toc.ncx', tocNcx, function(err){
      if(err) throw 'toc.ncx didnt save';

      that.epubFiles.push(that._epubPath() + Peepub.EPUB_CONTENT_DIR + 'toc.ncx');
      finished_files++;
      if(finished_files === 2){
        callback();
      }
    });
  } else {
    callback();
  }
};

Peepub.prototype._getPage = function(i){
  var that         = this;
  var epubJson     = this.getJson();
  var json         = epubJson.pages[i];
  var matches;

  json.body = utils.cheerioCleanup(json.body || '');

  // add links/script tags
  json.css         = this.assets.css;
  json.js          = this.assets.js;
  json.fixedFormat = epubJson.fixedFormat;
  return handlebars.templates[templatesBase + "page.html"](json);

};


// will pull it from the internet (or not) and write it
Peepub.prototype._createFile = function(dest, source){

  if (isWin()) {
    dest = upath.normalize(dest).replace(/\/.xhtml/g, '.xhtml');
    source = upath.normalize(source);
    
    newdest = dest.split('OEBPS')[1]
    newdest = newdest.split('/')
    if (newdest.length >= 3) {
      if (newdest[2].indexOf('.xhtml') !== -1) {
        if (newdest[2] !== null) {
          dest = dest.replace('/' + newdest[2], '_' + newdest[2]);
        }
      }
    }
    
  }

  var that = this;
  var d    = Q.defer();
  this.epubFiles.push(dest);

  // is one of the Peepub.createFileFuncs taking care of this asset?
  if( ! _.some( Peepub._createFileFuncs, function(func) {
          if( func({
              source : source,
                dest : dest,
                   d : d,
              peepub : that
              })
            ) return true;
        })
    ){
    // nope - it's a string
    if(this.useFs){
      fs.writeFile(dest, source, function(err){
        if (err){
          return d.reject(err);
        }
        return d.resolve({ source : source });
      });
    } else {
      this.buffers[dest] = new Buffer(source);
      d.resolve({ source : source });
    }
  }
  return d.promise;
};

Peepub.prototype._createPage = function(i, callback){

  var d        = Q.defer();
  var pad      = "00000";
  var name     = 'e' + (pad+i.toString()).slice(-pad.length);
  var href     = this.json.pages[i].href || (name + '.html');
  var fullpath = this._epubPath() + Peepub.EPUB_CONTENT_DIR + href;
  //console.log(fullpath)
  //fullpath = upath.toUnix(fullpath)
  //console.log(fullpath)
  var that     = this;

  var $pageBody = cheerio.load(that.json.pages[i].body);
  // replace external assets with local
  _.each(that.assets.assets, function(ass){
    if ($pageBody("img[src='"+ass.src+"']").length > 0) {
      $pageBody("img[src='"+ass.src+"']").attr('src', ass.href);
      that.json.pages[i].body = $pageBody.html();
    }
    if ($pageBody("video").length > 0) {
      if($pageBody("video[poster='"+ass.src+"']")[0]){
        $pageBody("video[poster='"+ass.src+"']").attr('poster', ass.href);
      }
      if($pageBody("video[src='"+ass.src+"']")[0]){
        $pageBody("video[src='"+ass.src+"']").attr('src', ass.href);
      }
      if($pageBody("source[src='"+ass.src+"']")[0]){
        $pageBody("source[src='"+ass.src+"']").attr('src', ass.href);
      }
      that.json.pages[i].body = $pageBody.html();
    }

    if ($pageBody("audio").length > 0) {
      if($pageBody("audio[src='"+ass.src+"']")[0]){
        $pageBody("audio[src='"+ass.src+"']").attr('src', ass.href);
      }
      if($pageBody("source[src='"+ass.src+"']")[0]){
        $pageBody("source[src='"+ass.src+"']").attr('src', ass.href);
      }
      that.json.pages[i].body = $pageBody.html();
    }

  });

  // remove name attrs from a tags - invalid
  if($pageBody('a[name]').length > 0){
    $pageBody('a[name]').each(function(){
      var name = $pageBody(this).attr('name');
      if(!$pageBody(this).attr('id')){
        $pageBody(this).attr('id', name);
      }
      $pageBody(this).attr('name', null);
    })
    that.json.pages[i].body = $pageBody.html();
  }

  this._createFile(fullpath, this._getPage(i))
    .then(function(res){

      // prep page for manifest + addtn'l info
      that.json.pages[i].path          = fullpath;
      that.json.pages[i].id            = name;
      that.json.pages[i].href          = href;
      that.json.pages[i]['media-type'] = 'application/xhtml+xml';
      if(that.json.js.length > 0){
        that.json.pages[i]['properties'] = 'scripted';
      }
      d.resolve(fullpath);
      if(callback) callback(fullpath);

    }, function(err){
      d.reject(filename + ' didnt save');
      throw filename + ' didnt save';
    });
  return d.promise;
};

Peepub.prototype._createPages = function(callback){

  if(!this._fetchAssetsCalled) throw "_fetchAssets needs to be called before _createPages";

  var that           = this;
  var pagesCopy      = this.getJson().pages.slice();
  var howManyAtATime = 100;
  var currentChunk   = 0;

  (function doChunk(){
    if(pagesCopy.length > 0){
      var chunkPromises = pagesCopy.splice(0, howManyAtATime).map(function(page, i){
        return that._createPage(i + howManyAtATime*currentChunk);
      });
      currentChunk += 1;
      Q.all(chunkPromises)
      .then(doChunk);

    } else {

      callback();
    }
  })();
};

Peepub.prototype._zip = function(callback){

  if(this.useFs){
    return this._zipFs(callback);
  }

  // one day in the browser
  var zip  = new JSZip();
  var d    = Q.defer();
  var that = this;
  var dir  = this._epubPath().slice(0,-1);

  var epubPath = that.fileName ? that._epubDir() + that.fileName  : that._epubDir() + that.id + '.epub';

  var buff = new Buffer('application/epub+zip');
  zip.file('mimetype', buff.toString('base64'), { base64 : true });
  var filteredData = this.epubFiles;

  var finished = 0;
  function is_finished(){
    finished += 1;
    if(finished === filteredData.length){
        callback(null, zip.generate());
    }
  }

  _.each(filteredData, function(fileObj){
    if(typeof fileObj === 'string'){
      fileObj = {
        name : fileObj.replace(dir, "").substr(1),
        path : fileObj
      }
    }
    if(_.isUndefined(that.buffers[fileObj.path])){
    
      fs.readFile(fileObj.path, 'binary', function(err, data){
        zip.file(fileObj.name, data, { binary : true });
        is_finished();
      });

    } else {

      zip.file(fileObj.name, that.buffers[fileObj.path].toString('base64'), { base64 : true });
      is_finished();
    }
  });
};

Peepub.prototype._zipFs = function(callback){

  var d    = Q.defer();
  var that = this;
  var dir  = this._epubPath().slice(0,-1);

  var epubPath = that.fileName ? that._epubDir() + that.fileName  : that._epubDir() + that.id + '.epub';
  this.epubFile = epubPath;

  var output = fs.createWriteStream(epubPath);
  var archive = archiver('zip');

  output.on('close', function() {
    d.resolve(epubPath);
    if(callback) callback(null, epubPath);
  });

  archive.on('error', function(err) {
    d.reject(err);
    if(callback) callback(err, null);
  });

  archive.pipe(output);

  archive.append(new Buffer("application/epub+zip"), { name : "mimetype", store : true });
  archive.bulk([
    { expand: true, cwd : that._epubDir() + '/' + that.id, src: ['**'] }
  ]);

  archive.finalize();

  return d.promise;

};

Peepub = require('./src/static.js')(Peepub);
Peepub = require('./src/public.js')(Peepub);

module.exports = Peepub;
