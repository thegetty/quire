# pe-epub-fs

Extends [pe-epub](https://github.com/peoples-e/pe-epub) so you can import local assets from your filesystem rather than from the web

 	<img src="file:///path/to/image.jpg" />

Import local HTML files for the body of a page

	{
		"title" : "The Peoples E-Book",
		"cover" : "file:///path/to/local/image.jpg",
		"pages" : [{
			"title" : "My Local Page",
			"body" : "file:///path/to/local/page.html"
		}]
	}
	
## Install	
	npm install pe-pub pe-epub-fs
	
## Usage
	var Peepub   = require('pe-epub-fs')(require('pe-epub'));
	var epubJson = require('your-epub.json'); // see examples/example.json for the specs
	var myPeepub = new Peepub(epubJson);

	myPeepub.create('/path/to/epub/and/fileName.epub')
		.then(function(filePath){
			console.log(filePath); // the same path to your epub file!
		});
	

### Testing
	npm install -g jasmine-node
	jasmine-node spec