# EPUB Transform

The transform function is called for each template, with the output HTML and output path as arguments, at the end of the build step before the individual page content is written to file on disk. The EPUB transform intercepts the HTML content, creates a JSDOM instance, removes html- or pdf-only elements, and then writes the file to the output directory (`_site/epub/<sequence>_<filename>`). 
