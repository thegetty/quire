var mmm   = require('mmmagic');
var Magic = mmm.Magic;
var fs    = require("fs");

function PeepubFs(Peepub){

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
  Peepub.addCreateFileFunc( 
    function(obj){
      if((/^file:\/\//).test(obj.source)){

        var file  = obj.source.replace('file://', '');
        var magic = new Magic(mmm.MAGIC_MIME_TYPE);
        
        magic.detectFile(file, function(err, mime_type) {
          if (err){
            return obj.d.reject(err);
          }
          
          fs.readFile(file, function(err, data){
            if (err){
              return obj.d.reject(err);
            }
            fs.writeFile(obj.dest, data, function(err){
              if (err){
                return obj.d.reject(err);
              }
              obj.d.resolve({ headers : { 'content-type' : mime_type }, source : obj.source });
            });
          });
        });
        return true;
      }
    } 
  );
  return Peepub;
}

module.exports = PeepubFs;