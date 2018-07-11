var htmlEntities = require('./libs/html-entities');


function s4() {
  return (Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
}

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


function falseString(str){
  return !str || str === '';
}

function cheerioCleanup(body){
  // self-close img tags at the last minute because they get removed by cheerio
  // valid html5 but not epub
  body = body.replace(new RegExp('(<img[^>]+)>', 'g'), '$1/>'); 

  // Text anchors should be self-closing tags <a id="bespoke" /> 
  // otherwise show up as regular, but non-functioning links in e-readers.
  body = body.replace(new RegExp('(<a[^>]+)></a>', 'g'), '$1/>');

  // self close hr
  body = body.replace(new RegExp('<hr>', 'g'), '<hr />'); 

  // self close br
  body = body.replace(new RegExp('<br>', 'g'), '<br />'); 

  // convert to entity number
  body = htmlEntities.convert(body);

  return body;
}

module.exports = {
  guid : guid,
  falseString : falseString,
  cheerioCleanup : cheerioCleanup
}