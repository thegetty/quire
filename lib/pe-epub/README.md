# pe-epub

"pee pub" makes epubs better.  

Our goal is to make it as easy as possible to output a valid epub. It's used in production over at [The People's E-Book](http://thepeoplesebook.net)

## JSON > EPUB
Here's the bare minimum you need to make an epub

	{
		"title" : "The Peoples E-Book",
		"cover" : "http://placekitten.com/600/800",
		"pages" : [{
			"title" : "PE-EPUB",
			"body" : "Making ebooks better."
		}]
	}

pe-epub assumes your assets (images, video, audio, stylesheets, javascript) are online so it will get them for you.  Text assets like pages, css and js can also be passed in as strings

If you'd like to use local assets see the [pe-epub-fs](https://github.com/peoples-e/pe-epub-fs) module
	
## Install	
	npm install pe-pub
	
## Usage
	var Peepub   = require('pe-epub');
	var epubJson = require('your-epub.json'); // see examples/example.json for the specs
	var myPeepub = new Peepub(epubJson);

	myPeepub.create('/path/to/epub/and/fileName.epub')
		.then(function(filePath){
			console.log(filePath); // the same path to your epub file!
		});
	
or...

	myPeepub.create('/path/to/epub/')
		.then(function(filePath){
			console.log(filePath); // the same path but we made up a file name for u
		});




### Testing
	npm install -g jasmine-node
	jasmine-node spec