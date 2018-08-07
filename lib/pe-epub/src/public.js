// Peepub PUBLIC methods //

var cheerio = require('cheerio');
var _       = require('lodash');
var fs      = require("fs");
var Q       = require('q');
var path    = require('path');


function deleteFolderRecursive(pth) {
  var files = [];
  if (fs.existsSync(pth)) {
    files = fs.readdirSync(pth);
    files.forEach(function (file, index) {
      var curPath = pth + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(pth);
  }
}


module.exports = function(Peepub){


  Peepub.prototype.getJson = function(){
    var that = this;
    this._handleDefaults();
    
    // we want these to be arrays, but we'll be nice to people
    var oneToMany = ['subject', 'publisher', 'creator', 'contributor', 'language'];
    _.each(oneToMany, function _oneToMany(field){
      if(that.json[field] && !that.json[field + 's']){
        that.json[field + 's'] = [that.json[field]];
      }
      if(that.json[field + 's'] && that.json[field + 's'].length === 1 && that.json[field + 's'][0] === ''){
        delete that.json[field + 's'];
      }
    });

    // required fields
    _.each(this.requiredFields, function(field){
      if(!that.json[field]) throw "Missing a required field: " + field;
    });

    // fixed format required fields
    if( !_.isUndefined(this.json.fixedFormat) ){
      if( _.isUndefined(this.json.fixedFormat.w) || _.isUndefined(this.json.fixedFormat.h) ){
        throw "Fixed format epubs must define width and height: w,h";
      }
      if( !this.json.fixedFormat._loaded ){
        this.json.css.unshift("body { width: "+parseInt(this.json.fixedFormat.w)+"px;height: "+parseInt(this.json.fixedFormat.h)+"px;margin: 0; }");
        this.json.fixedFormat._loaded = true;
      }
    }

    // local pages
    if( !this._checkedForLocalPages ){
      this._checkedForLocalPages = true;
      _.each(that.json.pages, function(page, i){
        // read local files for pe-eps
        if((/^file:\/\//).test(page.body)){
          var $ = cheerio.load(fs.readFileSync(page.body.replace('file://', ''), 'utf8'));
          that.json.pages[i].body = $('body').html();
        }
      });
    }
    
    // modified - 2013-03-20T12:00:00Z
    var utc = new Date((new Date).toUTCString());
    function _pad(a){
      return a.toString().length === 1 ? '0' + a.toString() : a;
    }
    this.json.modified =  utc.getFullYear() + '-' + 
                          _pad(utc.getMonth() + 1) + '-' +
                          _pad(utc.getDate()) + 'T' + 
                          _pad(utc.getHours() + 1) + ':' + 
                          _pad(utc.getMinutes() + 1) + ':' + 
                          _pad(utc.getSeconds() + 1) + 'Z';


    return this.json;
  };

  Peepub.prototype.set = function(key, val){
    this.json[key] = val;
  };

  Peepub.prototype.clean = function(){
    deleteFolderRecursive(this._epubPath());
    if (fs.existsSync(this.epubFile)) {
      fs.unlinkSync(this.epubFile);
    }
  };

  Peepub.prototype.create = function(options, callback){
    var that = this;
    var d    = Q.defer();
    
    if (arguments.length === 1 && typeof options === 'function'){
      callback = options;
      options = {};

    } else if(typeof options === 'string') {
      var tmp = {};
      if(options.match(/\.epub$/)){
        tmp.epubDir = path.dirname(options) + '/';
        this.fileName = path.basename(options);
      } else {
        tmp.epubDir = options.replace(/\/$/, '') + '/';
      }
      this.useFs = true;
      options = tmp;
    }
    
    var opts = _.extend({
      epubDir : null,
      zip : true
    }, options);


    if(opts.epubDir) {
      this.epubDir = opts.epubDir;
    }
    this._contentOpf()
    .then(function() {
      if(opts.zip) {
        that._zip(function(err, epubPath) {
          if(callback){
            callback(err, epubPath);
          }
          if(err){
            d.reject(err);
          } else {
            d.resolve(epubPath);
          }
        });
        
      } else {
        if(callback){
          callback(null, that._epubPath());
        }
        d.resolve(that._epubPath());
      }
    })
    .fail(function(err){
      d.reject(err);
    }).done();
    return d.promise;
  };

  Peepub.prototype.contentOpfPath = function(){
    if(!this.id) throw "This epub has not been created yet";
    return this._epubPath() + Peepub.EPUB_CONTENT_DIR + 'content.opf';
  };

  Peepub.prototype.getTocPages = function(){
    return _.filter(this.getJson().pages, function(page){ return page.toc; });
  };


  return Peepub;
}