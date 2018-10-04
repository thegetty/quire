/* 
	MediaSwipe Loader version 1.0.0
	Description: Simple loader aimed to create items lists and start MediaSwipe.
	License    : MIT license
	
	Copyright 2017 Joël VALLIER (joel.vallier@gmail.com)

	Permission is hereby granted, free of charge, to any person obtaining a copy 
	of this software and associated documentation files (the "Software"), to deal 
	in the Software without restriction, including without limitation the rights 
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
	of the Software, and to permit persons to whom the Software is furnished to do so, 
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all 
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
	INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
	PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// read debug level from URL
var url = new URL(location.href);
var debug = url.searchParams.get("debug") | 0;
if (debug) console.log('Debug level '+debug);

// Scan page to load links
var mswpScanPage = function(tag = 'mswp') {
	// create list and build DOM
	if (debug) console.log('Scan page using tag "'+tag+'"');
	var items = new Array();	
	jQuery(function($) {
		// extract items
		$("a[rel*='"+tag+"']").each(function() {
			var exp = new RegExp('('+tag+'|\[|\])', 'g');
			var rel = $(this).context.rel.replace(exp, '') || 0;
			if (!items[rel]) {
				if (debug) console.log('Create list '+rel);
				items[rel] = new Array();
			}
			width  = $(this).attr('width')  || 0;
			height = $(this).attr('height') || 0;
			
			// set item list
			var idx = items[rel].length;
			items[rel][idx] = { src: this.href, title: this.title, w: width, h: height};
			
			// bind click to PhotoSwipe
			$(this).unbind("click").click(function() {
				// log list of items
				if (debug) console.log('Items from list '+rel, items[rel]);
				
				// get element
				var element = document.querySelectorAll('.pswp')[0];
				
				// add support of videos
				var mswp = new MediaSwipe(element, PhotoSwipeUI_Default, items[rel], {index: idx, maxSpreadZoom: 4});
				
				// start MediaSwipe
				mswp.init();
 				
				// prevent event propagation
				return false;
			});
		});
		
		// add PhotoSwipe (.pswp) element to DOM
		$('body').append(
			$('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">').append(
				$('<div class="pswp__bg">'),
				$('<div class="pswp__scroll-wrap">').append(
					$('<div class="pswp__container">').append(
						$('<div class="pswp__item">'),
						$('<div class="pswp__item">'),
						$('<div class="pswp__item">')
					),
					$('<div class="pswp__ui pswp__ui--hidden">').append(
						$('<div class="pswp__top-bar">').append(
							$('<div class="pswp__counter">'),
							$('<button class="pswp__button pswp__button--close" title="Close (Esc)">'),
						  //$('<button class="pswp__button pswp__button--share" title="Share">'),
							$('<button class="pswp__button pswp__button--fs" title="Toggle fullscreen">'),
							$('<button class="pswp__button pswp__button--zoom" title="Zoom in/out">'),
							$('<div class="pswp__preloader">').append(
								$('<div class="pswp__preloader__icn">').append(
									$('<div class="pswp__preloader__cut">').append(
										$('<div class="pswp__preloader__donut">')
									)
								)
							)
						),
						$('<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">').append(
							$('<div class="pswp__share-tooltip">')
						),
						$('<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">'),
						$('<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">'),
						$('<div class="pswp__caption">').append(
							$('<div class="pswp__caption__center" style="text-align:center">')
						)
					)
				)
			)
		);
	});
}

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player) after the API code downloads.
function onYouTubeIframeAPIReady() {
	if (debug) console.log('onYouTubeIframeAPIReady');
	mswpScanPage();
}
