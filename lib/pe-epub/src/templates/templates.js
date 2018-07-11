var glob = ('undefined' === typeof window) ? global : window,

Handlebars = glob.Handlebars || require('handlebars');

this["JST"] = this["JST"] || {};

this["JST"]["templates/container.xml"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<?xml version=\"1.0\"?>\n<container version=\"1.0\" xmlns=\"urn:oasis:names:tc:opendocument:xmlns:container\">\n  <rootfiles>\n    <rootfile full-path=\"OEBPS/content.opf\"\n     media-type=\"application/oebps-package+xml\" />\n  </rootfiles>\n</container>";
  });

this["JST"]["templates/content.opf"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "<dc:language>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</dc:language>\n		";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "";
  buffer += "<meta refines=\"#title01\" property=\"title-type\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</meta>";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "";
  buffer += "<dc:identifier id=\"bookid\">urn:isbn:"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</dc:identifier>";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "";
  buffer += "<dc:identifier id=\"bookid\">urn:uuid:"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</dc:identifier>";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "";
  buffer += "<dc:identifier id=\"bookid\">url:"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</dc:identifier>";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<dc:creator id=\"creator";
  if (stack1 = helpers['i']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['i']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dc:creator>\n		<meta refines=\"#creator";
  if (stack1 = helpers['i']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['i']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" property=\"role\" scheme=\"marc:relators\">";
  if (stack1 = helpers.role) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.role; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</meta>\n		<meta refines=\"#creator";
  if (stack1 = helpers['i']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['i']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" property=\"file-as\">";
  if (stack1 = helpers['file-as']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['file-as']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</meta>";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<dc:contributor id=\"contributor";
  if (stack1 = helpers['i']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['i']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dc:contributor>\n		<meta refines=\"#contributor";
  if (stack1 = helpers['i']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['i']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" property=\"role\" scheme=\"marc:relators\">";
  if (stack1 = helpers.role) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.role; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</meta>\n		<meta refines=\"#contributor";
  if (stack1 = helpers['i']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['i']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" property=\"file-as\">";
  if (stack1 = helpers['file-as']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['file-as']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</meta>";
  return buffer;
  }

function program15(depth0,data) {
  
  var buffer = "";
  buffer += "<dc:publisher>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</dc:publisher>";
  return buffer;
  }

function program17(depth0,data) {
  
  var buffer = "";
  buffer += "<dc:subject>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</dc:subject>";
  return buffer;
  }

function program19(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n		<item ";
  options = {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data};
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.id) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  options = {hash:{},inverse:self.program(22, program22, data),fn:self.noop,data:data};
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.id) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " href=\"";
  if (stack1 = helpers.href) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.href; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" media-type=\"";
  if (stack1 = helpers['media-type']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['media-type']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" ";
  options = {hash:{},inverse:self.noop,fn:self.program(24, program24, data),data:data};
  if (stack1 = helpers.properties) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.properties; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.properties) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "/>";
  return buffer;
  }
function program20(depth0,data) {
  
  var buffer = "";
  buffer += "id=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\"";
  return buffer;
  }

function program22(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "id=\"asset_";
  if (stack1 = helpers['i']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['i']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program24(depth0,data) {
  
  var buffer = "";
  buffer += "properties=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\"";
  return buffer;
  }

function program26(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<itemref idref=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>\n		";
  return buffer;
  }

  buffer += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<package xmlns=\"http://www.idpf.org/2007/opf\" version=\"3.0\" xml:lang=\"en\" dir=\"ltr\" unique-identifier=\"bookid\">\n	<metadata xmlns:dc=\"http://purl.org/dc/elements/1.1/\">\n		<meta property=\"dcterms:modified\">";
  if (stack1 = helpers.modified) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.modified; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</meta>\n		<meta name=\"cover\" content=\"cover-image\" />\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.languages) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.languages; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.languages) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		<dc:title id=\"title01\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dc:title>		\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  if (stack1 = helpers.subtitle) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.subtitle; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.subtitle) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  if (stack1 = helpers.isbn) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.isbn; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.isbn) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data};
  if (stack1 = helpers.uuid) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.uuid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.uuid) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data};
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.url) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data};
  if (stack1 = helpers.creators) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.creators; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.creators) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data};
  if (stack1 = helpers.contributors) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.contributors; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.contributors) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			\n    	<dc:date>";
  if (stack1 = helpers.date) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.date; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dc:date>\n    	<dc:description>";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dc:description>\n    	";
  options = {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data};
  if (stack1 = helpers.publishers) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.publishers; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.publishers) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    	<dc:rights>";
  if (stack1 = helpers.rights) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.rights; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dc:rights>\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(17, program17, data),data:data};
  if (stack1 = helpers.subjects) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.subjects; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.subjects) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</metadata>	\n	<manifest>\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(19, program19, data),data:data};
  if (stack1 = helpers.items) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.items; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.items) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</manifest>\n	<spine toc=\"ncx\">\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(26, program26, data),data:data};
  if (stack1 = helpers.itemrefs) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.itemrefs; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.itemrefs) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</spine>	\n</package>";
  return buffer;
  });

this["JST"]["templates/page.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<link rel=\"stylesheet\" href=\"";
  if (stack1 = helpers.href) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.href; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" type=\"text/css\"/>\n		";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<script src=\"";
  if (stack1 = helpers.href) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.href; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" type=\"text/javascript\"></script>\n		";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<meta name=\"viewport\" content=\"width=";
  if (stack1 = helpers['w']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['w']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ", height=";
  if (stack1 = helpers['h']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['h']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></meta>\n		";
  return buffer;
  }

  buffer += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE html>\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:epub=\"http:www.idpf.org/2007/ops\">\n	<head>\n		<title>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</title>\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.css) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.css; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.css) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  if (stack1 = helpers.js) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.js; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.js) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  stack1 = helpers['if'].call(depth0, depth0.fixedFormat, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		<meta charset=\"utf-8\"/>\n	</head>\n	<body>";
  if (stack1 = helpers.body) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.body; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</body>\n</html>\n<!-- Created with pe-epub http://thepeoplesebook.net -->";
  return buffer;
  });

this["JST"]["templates/toc.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<link rel=\"stylesheet\" href=\"";
  if (stack1 = helpers.href) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.href; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" type=\"text/css\"/>\n		";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li><a href=\"";
  if (stack1 = helpers.href) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.href; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></li>\n				";
  return buffer;
  }

  buffer += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE html>\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:epub=\"http://www.idpf.org/2007/ops\">\n	<head>\n		<title>Table of Contents</title>\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.css) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.css; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.css) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		<meta charset=\"utf-8\"/>\n	</head>\n	<body>\n		<nav epub:type=\"toc\">\n			<h1>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n			<ol>\n				";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  if (stack1 = helpers.tocPages) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.tocPages; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.tocPages) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</ol>	\n		</nav>\n	</body>\n</html>\n<!-- Created with pe-epub http://thepeoplesebook.net -->";
  return buffer;
  });

this["JST"]["templates/toc.ncx"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	<navPoint id=\"navPoint-";
  if (stack1 = helpers['i']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['i']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" playOrder=\"";
  if (stack1 = helpers['i']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['i']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"chapter\">   \n  		<navLabel><text>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</text></navLabel>\n		<content src=\"";
  if (stack1 = helpers.href) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.href; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>    \n	</navPoint>  \n";
  return buffer;
  }

  buffer += "<?xml version='1.0' encoding='utf-8'?>\n<ncx xmlns=\"http://www.daisy.org/z3986/2005/ncx/\" version=\"2005-1\">\n \n <head>\n    <meta name=\"dtb:uid\" content=\"9781234567890\"/>\n </head>\n \n <docTitle>\n    <text>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</text>\n </docTitle>\n\n<navMap>\n";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.tocPages) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.tocPages; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.tocPages) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</navMap>\n\n</ncx>\n\n<!-- Created with pe-epub at http://thepeoplesebook.net -->";
  return buffer;
  });

this["JST"]["templates/com.apple.ibooks.display-options.xml"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<display_options>\n    <platform name=\"*\">\n        <option name=\"fixed-layout\">true</option>\n        <option name=\"orientation-lock\">none</option>\n        <option name=\"open-to-spread\">true</option>\n    </platform>\n    <platform name=\"iphone\">\n        <option name=\"fixed-layout\">true</option>\n        <option name=\"orientation-lock\">none</option>\n        <option name=\"open-to-spread\">false</option>\n    </platform>\n</display_options>";
  });

if (typeof exports === 'object' && exports) {module.exports = this["JST"];}