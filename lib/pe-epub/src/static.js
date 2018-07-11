// Peepub STATIC methods //
var followRedirects = require('follow-redirects');
var http            = followRedirects.http;
var https           = followRedirects.https;
var Buffers         = require('buffers');
var fs              = require("fs");



module.exports = function(Peepub){
  /**
   * An Array of functions that determine the type of asset and then get them
   * - the goal is to make this extensible
   *
   * @param obj => {
   *          dest : // destination,
   *        source : // where's it coming from,
   *        peepub : // the Peepub instance,
   *             d : // the deferred to resolve or reject
   *        }
   * @return bool whether this test caught it
   */
  Peepub._createFileFuncs = [
    // pull from the internet
    function(obj){
      if((/^https?:\/\//).test(obj.source)){

        ((/^https:\/\//).test(obj.source) ? https : http)
        .get(obj.source, function(res){
          if(obj.peepub.useFs){
            res.pipe(fs.createWriteStream(obj.dest));
          }
          obj.peepub.streams[obj.dest] = Buffers();
          res.on('data', function(data){
            obj.peepub.streams[obj.dest].push(new Buffer(data));
          });
          res.on('end', function(err){
            if (err){
              return obj.d.reject(err);
            }
            obj.peepub.buffers[obj.dest] = obj.peepub.streams[obj.dest].toBuffer();
            obj.d.resolve(res);
            delete obj.peepub.streams[obj.dest];
          });
        });
        return true;
      }
    }
  ];

  /**
   * Don't manipulate the array directly
   */
  Peepub.addCreateFileFunc = function(func){
    Peepub._createFileFuncs.push(func);
  }

  return Peepub;
}