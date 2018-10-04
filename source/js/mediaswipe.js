/* 	
	MediaSwipe - Eric Winterstine
	v.12.04.2017
*/
var MediaSwipe = (function() {
	var screenWidth;
	var screenHeight;
	
	var gallery;
	var galleryLength;
	var isActive;
	var currentIndex;
	var isFullScreen;
	
	var slidesAwaitingAPI;
	
	var $mediaSwipe;
	var $mediaSwipeTouchpad;
	var $currentSlide;
	var $currentSlideContainer;
	var $previousSlide;
	var $previousSlideContainer;
	var $nextSlide;
	var $nextSlideContainer;
	var $futureSlide;
	var $slideIndexes;
	var $slideCaption;
	
	var animator = {};
	var pointerHandler = {};
	
	var oldResizeFunc = window.onresize;
	
	/*
		init
		-------------------------------------------------------------------------
		Instantiates the gallery properties, grabs the required DOM elements, 
		and sets mouse/mobile events.
		-------------------------------------------------------------------------
	*/
	var init = function() {
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;
		
		isFullScreen = false;
		
		isActive = false;
		slidesAwaitingAPI = [];
		
		$mediaSwipe = document.getElementById('mediaswipe-container');
		// If MediaSwipe dom isn't present, create it
		if ( !$mediaSwipe ) {
			appendMediaSwipeDOM();
			$mediaSwipe = document.getElementById('mediaswipe-container');
		}
		
		$mediaSwipeTouchpad = document.getElementById('mediaswipe-touchpad');
		$currentSlide = document.getElementById('mediaswipe-slide1');
		$currentSlideContainer = document.getElementById('mediaswipe-slide1-container');
		$previousSlide = document.getElementById('mediaswipe-slide2');
		$previousSlideContainer = document.getElementById('mediaswipe-slide2-container');
		$nextSlide = document.getElementById('mediaswipe-slide3');
		$nextSlideContainer = document.getElementById('mediaswipe-slide3-container');
		$futureSlide = false;
		$slideIndexes = document.getElementById('mediaswipe-gallery-indexes');
		$slideCaption = document.getElementById('mediaswipe-slide-caption');
		
		animator = {
			currentTime : 0,
			previousTime : getTheTime(),
			deltaTime : 0,
			animations : [],
			foundAnimation : false
		};
		
		pointerHandler = {
			vX : 0,
			vY : 0,
			start : 			{ x:0, y:0, time:-1 },
			end : 			{ x:0, y:0, time:-1 },
			secondStart : 	{ x:0, y:0, time:-1 },
			secondEnd : 		{ x:0, y:0, time:-1 },
			lastPosition : 	{ x:0, y:0, time:-1 },
			mouseDown : false,
			swiping : false,
			panning : false,
			zooming : false
		};
		
		initiateListeners();
		render();
		
		// Check if there is a hashtag to popup a gallery on page load
		if ( window.location && window.location.hash && window.location.hash.length > 0 ) {
			var filter = /\#view\=([\w\d])+(\,[\w\d])*/;
			if ( filter.test(window.location.hash) ) {
				var galleryIndex = 0;
				var galleryRel = "";
				var galleryHash = window.location.hash.replace('#view=','');
				var galleryArr = galleryHash.split(',');
				galleryRel = galleryArr[0];
				if ( galleryArr.length === 2 && galleryArr[1] !== "" && !isNaN(galleryArr[1]) ) {
					galleryIndex = parseInt(galleryArr[1]);
				}
				var els = document.getElementsByClassName('js-mediaSwipe');
				var foundCount = -1;
				for ( var i = 0; i < els.length; i++ ) {
					if ( typeof els[i].getAttribute('data-rel') !== 'undefined' && els[i].getAttribute('data-rel') === galleryRel ) {
						foundCount++;
						if ( foundCount === galleryIndex ) {
							gatherMedia( els[i] );
							launch();
							break;
						}
					}
				}
				if ( foundCount < 0 ) {
					console.warn("MediaSwipe: Could not find gallery or image in the fragment identifier.");
				}
			}
		}
	};
	
	/*
		launch
		-------------------------------------------------------------------------
		Sets the gallery to be visible and hides/shows the gallery arrows.
		-------------------------------------------------------------------------
	*/
	var launch = function() {
		isActive = true;
		addClass($mediaSwipe,'on');
		$futureSlide = false;
		if ( gallery.length > 1 ) {
			addClass($mediaSwipe,'mediaswipe-allow-arrows');
		} else {
			removeClass($mediaSwipe,'mediaswipe-allow-arrows');
		}
		setSlides( currentIndex );
		
		// Prevent site scrolling
		addClass(document.getElementsByTagName('body')[0],'ms-prevent-scroll');
	};
	
	/*
		closeGallery
		-------------------------------------------------------------------------
		Either exits full screen or completely hides MediaSwipe
		-------------------------------------------------------------------------
	*/
	var closeGallery = function() {
		// If we're in full screen mode...
		if ( hasClass($mediaSwipe,'ms-full-screen') ) {
			closeFullScreen();
			return false;
		}
		
		isActive = false;
		clearAnimations();
		removeClass($mediaSwipe,'on');
		removeClass($mediaSwipe,'mediaswipe-allow-arrows');
		resetSlides();
		removeClass(document.getElementById('mediaswipe-share-nav'),'on');
		// Enable site scrolling
		removeClass(document.getElementsByTagName('body')[0],'ms-prevent-scroll');
	};
	
	/*
		goFullScreen
		-------------------------------------------------------------------------
		Requests the window to go full screen
		-------------------------------------------------------------------------
	*/
	var goFullScreen = function() {
		isFullScreen = true;
		addClass( $mediaSwipe, 'ms-full-screen' );
		
		// Supports most browsers and their versions.
		var element = document.body;
		var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
		if (requestMethod) { // Native full screen.
			requestMethod.call(element);
		} else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript !== null) {
				wscript.SendKeys("{F11}");
			}
		}
	};
	
	/*
		closeFullScreen
		-------------------------------------------------------------------------
		Requests the window to exit full screen mode
		-------------------------------------------------------------------------
	*/
	var closeFullScreen = function() {
		isFullScreen = false;
		removeClass( $mediaSwipe, 'ms-full-screen' );
		var element = document;
		var requestMethod = element.exitFullScreen || element.webkitExitFullscreen || element.mozCancelFullScreen || element.msExitFullScreen;
		if (requestMethod) { // Native full screen.
			requestMethod.call(element);
		} else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript !== null) {
				wscript.SendKeys("{F11}");
			}
		}
	};
	
	
	/*
		setSlides
		-------------------------------------------------------------------------
		Sets the previous, current, and next slides and resets the views to
		accommodate the current media slide.
		
		@param index - The index of the next item to show in the gallery[] array.
		-------------------------------------------------------------------------
	*/
	var setSlides = function( index ) {
		gallery[currentIndex].active = false;
		gallery[getNextIndex( -1 )].active = false;
		gallery[getNextIndex( 1 )].active = false;
		currentIndex = index;
		
		// Hide/Show Captions
		$slideIndexes.innerHTML = ( galleryLength > 1 ) ? gallery[currentIndex].displayIndex + " / " + galleryLength : "";
		if ( gallery[currentIndex].caption !== false && gallery[currentIndex].caption !== "" ) {
			$slideCaption.innerHTML = gallery[currentIndex].caption;
			addClass($slideCaption,'on');
		} else {
			removeClass($slideCaption,'on');
		}
		
		var previousIndex = getNextIndex( -1 );
		var nextIndex = getNextIndex( 1 );
		
		removeClass($mediaSwipe,'ms-zoom-in');
		removeClass($mediaSwipe,'ms-zoom-out');
		removeClass($mediaSwipe,'ms-grabbing');
		removeClass($mediaSwipe,'ms-grab');
		
		// Enable/disable the touchpad
		if ( gallery[ currentIndex ].disableTouchpad && !hasClass($mediaSwipe,'disable-touchpad') && gallery[ currentIndex ].type !== 'youtube' ) {
			addClass($mediaSwipe,'disable-touchpad');
		} else if ( !gallery[ currentIndex ].disableTouchpad && hasClass($mediaSwipe,'disable-touchpad') ) {
			removeClass($mediaSwipe,'disable-touchpad');
		} else if ( gallery[ currentIndex ].type === 'youtube' ) {
			removeClass($mediaSwipe,'disable-touchpad');
		}
		
		// Stop a YouTube video play of previous/next items
		if ( typeof gallery[ previousIndex ].youTubeObject !== 'undefined' && typeof gallery[ previousIndex ].youTubeObject.getPlayerState === 'function' && gallery[ previousIndex ].youTubeObject.getPlayerState() === 1 ) {
			gallery[ previousIndex ].youTubeObject.pauseVideo();
		}
		if ( typeof gallery[ nextIndex ].youTubeObject !== 'undefined' && typeof gallery[ nextIndex ].youTubeObject.getPlayerState === 'function' && gallery[ nextIndex ].youTubeObject.getPlayerState() === 1 ) {
			gallery[ nextIndex ].youTubeObject.pauseVideo();
		}
		
		// Swap previous/current/next slides
		if ( $futureSlide === false ) {
			resetSlides(); 
			gallery[ currentIndex ].domSlide = $currentSlide;
			gallery[ currentIndex ].domContainer = $currentSlideContainer;
			insertMedia( gallery[ currentIndex ] );
			
			if ( gallery.length > 1 ) {
				gallery[ previousIndex ].domContainer = $previousSlideContainer;
				gallery[ previousIndex ].domSlide = $previousSlide;
				gallery[ nextIndex ].domContainer = $nextSlideContainer;
				gallery[ nextIndex ].domSlide = $nextSlide;
				insertMedia( gallery[ previousIndex ] );
				insertMedia( gallery[ nextIndex ] );
			}
		} else {
			if ( hasClass($futureSlide, 'mediaswipe-previous-slide') ) {
				var $futureContainer = $previousSlideContainer;
				$previousSlide = $nextSlide;
				$previousSlideContainer = $nextSlideContainer;
				$nextSlide = $currentSlide;
				$nextSlideContainer = $currentSlideContainer;
				$currentSlide = $futureSlide;
				$currentSlideContainer = $futureContainer;
				
				// Only change the 'previous' slide's content & position
				gallery[ previousIndex ].domContainer = $previousSlideContainer;
				gallery[ previousIndex ].domSlide = $previousSlide;
				resetSlide(gallery[ previousIndex ]);
				insertMedia( gallery[ previousIndex ] );
				fitMedia( gallery[ nextIndex ] );
			} else if ( hasClass($futureSlide, 'mediaswipe-next-slide') ) {
				var $futureContainer = $nextSlideContainer;
				$nextSlide = $previousSlide;
				$nextSlideContainer = $previousSlideContainer;
				$previousSlide = $currentSlide;
				$previousSlideContainer = $currentSlideContainer;
				$currentSlide = $futureSlide;
				$currentSlideContainer = $futureContainer;
				
				// Only change the 'next' slide's content & position
				gallery[ nextIndex ].domContainer = $nextSlideContainer;
				gallery[ nextIndex ].domSlide = $nextSlide;
				resetSlide(gallery[ nextIndex ]);
				insertMedia( gallery[ nextIndex ] );
				fitMedia( gallery[ previousIndex ] );
			}
			
			// Position the slides
			moveSlides(0);
			
			// Reset all DOM classes
			removeClass( $currentSlide, 'mediaswipe-previous-slide' );
			removeClass( $currentSlide, 'mediaswipe-next-slide' );
			addClass( $currentSlide, 'mediaswipe-current-slide' );
			removeClass( $previousSlide, 'mediaswipe-current-slide' );
			removeClass( $previousSlide, 'mediaswipe-next-slide' );
			addClass( $previousSlide, 'mediaswipe-previous-slide' );
			removeClass( $nextSlide, 'mediaswipe-previous-slide' );
			removeClass( $nextSlide, 'mediaswipe-current-slide' );
			addClass( $nextSlide, 'mediaswipe-next-slide' );
		}
	};
	
	/*
		moveSlide
		-------------------------------------------------------------------------
		Moves a particular slide by x/y coordinates
		-------------------------------------------------------------------------
	*/
	var moveSlide = function( xpos, ypos, slide ) {
		slide.style.webkitTransform = "translate("+xpos+"px,"+ypos+"px)";
		slide.style.MozTransform = "translate("+xpos+"px,"+ypos+"px)";
		slide.style.msTransform = "translate("+xpos+"px,"+ypos+"px)";
		slide.style.OTransform = "translate("+xpos+"px,"+ypos+"px)";
		slide.style.transform = "translate("+xpos+"px,"+ypos+"px)";
	};
	
	/*
		moveSlides
		-------------------------------------------------------------------------
		Moves all slides along the x-axis
		-------------------------------------------------------------------------
	*/
	var moveSlides = function( xpos ) {
		moveSlide( xpos, 0, $currentSlide );
		moveSlide( xpos, 0, $previousSlide );
		moveSlide( xpos, 0, $nextSlide );
	};
	
	/*
		resetSlide
		-------------------------------------------------------------------------
		Sets a galleryItem's slide to be hidden and ignores any image onload
		events to be fired. Also removes the inside contents of the slide.
		
		@param galleryItem - The galleryItem's slide to be reset
		-------------------------------------------------------------------------
	*/
	var resetSlide = function( galleryItem ) {
		galleryItem.active = false;
		if ( galleryItem.type === 'image' && galleryItem.domObject !== false && typeof galleryItem.domObject.ignoreOnLoad !== 'undefined' ) {
			galleryItem.domObject.ignoreOnLoad = true;
		}
		removeClass(galleryItem.domSlide,'loaded');
		galleryItem.domContainer.innerHTML = '';
	};
	
	/*
		resetSlides
		-------------------------------------------------------------------------
		Resets all slides to their ready state.
		-------------------------------------------------------------------------
	*/
	var resetSlides = function() {
		// Loop through each gallery object and prevent any existing onload events
		for ( var i = 0; i < gallery.length; i++ ) {
			gallery[i].active = false;
			if ( gallery[i].type === 'image' && gallery[i].domObject !== false && typeof gallery[i].domObject.ignoreOnLoad !== 'undefined' ) {
				gallery[i].domObject.ignoreOnLoad = true;
			}
		}
		
		removeClass($currentSlide,'loaded');
		removeClass($previousSlide,'loaded');
		removeClass($nextSlide,'loaded');
		$currentSlideContainer.innerHTML = '';
		$previousSlideContainer.innerHTML = '';
		$nextSlideContainer.innerHTML = '';
		
		// Set all slides to their correct positions
		moveSlides(0);
	};
	
	/*
		insertMedia
		-------------------------------------------------------------------------
		Inserts a 'galleryItem' into it's corresponding DOM element 'domContainer'.
		Before inserting, it will preload any required API or image it contains.
		
		@param galleryItem - The media item (object) to be placed into the DOM.
		-------------------------------------------------------------------------
	*/
	var insertMedia = function( galleryItem ) {
		if ( galleryItem.type === 'image' ) {
			var imageObj = new Image();
			imageObj.ignoreOnLoad = false;
			galleryItem.active = true;
			// Preload...
			if ( galleryItem.width === 0 ) {
				imageObj.galleryIndex = galleryItem.index;
				imageObj.parent = galleryItem.domSlide;
				imageObj.onerror = function() {
					console.warn("MediaSwipe: Could not load " + this.src);
				};
				imageObj.onabort = function() {
					console.warn("MediaSwipe: Could not load " + this.src);
				};
				imageObj.onload = function() {
					if ( this.ignoreOnLoad === false ) {
						addClass( this.parent, 'loaded' );
						gallery[this.galleryIndex].width = this.naturalWidth || this.width;
						gallery[this.galleryIndex].height = this.naturalHeight || this.height;
						fitMedia( gallery[this.galleryIndex] );
					}
				};
				imageObj.src = galleryItem.src;
				// check if cached...
				if ( imageObj.complete ) {
					imageObj.ignoreOnLoad = true;
					galleryItem.domObject = imageObj;
					addClass( galleryItem.domSlide, 'loaded' );
					gallery[imageObj.galleryIndex].width = imageObj.naturalWidth || imageObj.width;
					gallery[imageObj.galleryIndex].height = imageObj.naturalHeight || imageObj.height;
					fitMedia( gallery[imageObj.galleryIndex] );
				}
				galleryItem.domContainer.appendChild(imageObj);
				galleryItem.domObject = imageObj; 
			} else {
				imageObj.src = galleryItem.src;
				galleryItem.domContainer.appendChild(imageObj);
				galleryItem.domObject = imageObj;
				addClass( galleryItem.domSlide, 'loaded' );
				fitMedia( galleryItem );
			}
		} else if ( galleryItem.type === 'youtube' ) {
			galleryItem.active = true;
			// Append our div (will be replaced by iframe tag)
			var div = document.createElement('div');
			div.id = "youtube"+galleryItem.index;
			div.style.width = galleryItem.width;
			div.style.height = galleryItem.height;
			galleryItem.domContainer.appendChild(div);
			galleryItem.domObject = div;
			
			// Async the YouTube IFrame API (if not available yet!)
			if ( typeof window.YT === 'undefined' ) {
				if ( typeof window.mediaSwipeCalledYTAPI === 'undefined' ) {
					window.mediaSwipeCalledYTAPI = true;
					var tag = document.createElement('script');
					tag.src = "https://www.youtube.com/iframe_api";
					var firstScriptTag = document.getElementsByTagName('script')[0];
					firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
				}
				// Push the galleryItem to wait for the API to load...
				slidesAwaitingAPI.push( galleryItem );
			} else {
				// YouTube API is ready...just insert the item...
				insertYouTubeObject( galleryItem );
			}
		} else if ( galleryItem.type === 'iframe' ) {
			var iframe = document.createElement('iframe');
			iframe.src = galleryItem.src;
			iframe.width = galleryItem.width;
			iframe.height = galleryItem.height;
			iframe.style.overflow = 'hidden';
			iframe.style.overflowY = 'scroll';
			galleryItem.domContainer.appendChild(iframe);
			galleryItem.domObject = iframe;
			fitMedia(galleryItem);
			addClass(galleryItem.domSlide,'loaded');
		}
	};
	
	/*
		insertYouTubeObject
		-------------------------------------------------------------------------
		Inserts a youtube iframe
		-------------------------------------------------------------------------
	*/
	var insertYouTubeObject = function( galleryItem ) {
		var previousIndex = getNextIndex( -1 );
		var nextIndex = getNextIndex( 1 ); 
		
		// Make sure the YouTube video is still part of our 3 active slides
		// (could happen if the user is swiping fast!)
		if ( galleryItem.index !== currentIndex && galleryItem.index !== previousIndex && galleryItem.index !== nextIndex ) {
			return false;
		}
		
		galleryItem.youTubeObject = new YT.Player( "youtube"+galleryItem.index, {
			height: galleryItem.height,
			width: galleryItem.width,
			videoId: galleryItem.src,
			playerVars: {
				modestbranding: true,
				rel: false
			},
			events: {
				'onReady' : function(e) {
					var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
	        		var match = e.target.getVideoUrl().match(regExp);
	        		var vId;
	        		if (match && match[2].length == 11) {
						vId = match[2];
						for ( var i = 0; i < gallery.length; i++ ) {
							if ( vId === gallery[i].src ) {
								gallery[i].domObject = document.getElementById('youtube'+gallery[i].index);
								fitMedia( gallery[i] );
								addClass( gallery[i].domSlide, 'loaded' );
								// autoplay the video if it's the only item in the gallery
								if ( gallery.length === 1 && screenWidth > 1100 ) {
									addClass($mediaSwipe,'disable-touchpad');
									gallery[i].youTubeObject.playVideo();
									// Push Tracking
									if ( typeof dataLayer !== 'undefined' && typeof dataLayer.push !== 'undefined' && typeof gallery[currentIndex].eventName !== 'undefined' && typeof gallery[currentIndex].eventName !== '' ) {
										dataLayer.push({'event':gallery[currentIndex].eventName});
									}
								}
							}
						}
					} else {
						console.warn("MediaSwipe: Could not parse YouTube video URL correctly.");
					}
				}
			}
		});
	};
	
	/*
		youTubeAPIReady
		-------------------------------------------------------------------------
		Attempt to insert any waiting YouTube slides once the API is ready...
		-------------------------------------------------------------------------
	*/
	var youTubeAPIReady = function() {
		for ( var i = 0; i < slidesAwaitingAPI.length; i++ ) {
			if ( slidesAwaitingAPI[i].type === 'youtube' ) {
				insertYouTubeObject( slidesAwaitingAPI[i] );
			}
		}
	}
	
	/*
		fitMedia
		-------------------------------------------------------------------------
		Transforms & translates the current media to fit perfectly within the
		frame's viewport.
		-------------------------------------------------------------------------
	*/
	var fitMedia = function( galleryItem ) {
		var bounds = getFitDimensions( galleryItem );
		
		galleryItem.virtualWidth = bounds.virtualWidth;
		galleryItem.virtualHeight = bounds.virtualHeight;
		galleryItem.virtualXPos = bounds.virtualXPos;
		galleryItem.virtualYPos = bounds.virtualYPos;
		galleryItem.virtualXOffset = 0;
		galleryItem.virtualYOffset = 0;
		galleryItem.isZoomed = false;
		
		if ( galleryItem.type === 'image' ) {
			galleryItem.scale = bounds.scale;
			galleryItem.minScale = bounds.scale;
			galleryItem.xPos = bounds.xPos;
			galleryItem.yPos = bounds.yPos;
			galleryItem.domObject.style.width = Math.ceil(galleryItem.width+1) + "px";
			galleryItem.domObject.style.height = Math.ceil(galleryItem.height+1) + "px";
		} else if ( galleryItem.type === 'iframe' || galleryItem.type === 'youtube' ) {
			galleryItem.scale = 1;
			galleryItem.xPos = bounds.virtualXPos;
			galleryItem.yPos = bounds.virtualYPos;
			galleryItem.domObject.width = Math.ceil(bounds.virtualWidth+1) + "px";
			galleryItem.domObject.height = Math.ceil(bounds.virtualHeight+1) + "px";
		}
		
		galleryItem.domObject.style.position = 'absolute';
		galleryItem.domObject.style.left = Math.floor(galleryItem.xPos) + "px";
		galleryItem.domObject.style.top = Math.floor(galleryItem.yPos) + "px";	
		transformMedia( galleryItem );
	};
	
	/*
		getFitDimensions
		-------------------------------------------------------------------------
		Returns the galleryItem's dimensions and scale to perfectly fit inside the
		frame's viewport.
		
		@param galleryItem
		-------------------------------------------------------------------------
	*/
	var getFitDimensions = function( galleryItem ) {
		var canvasOffset = ( screenWidth > 799 ) ? 80 : 10; // padding around viewport
		var mediaParent = galleryItem.domContainer;
		var mediaWidth = galleryItem.width || galleryItem.videoWidth || galleryItem.offsetWidth;
		var mediaHeight = galleryItem.height || galleryItem.videoHeight || galleryItem.offsetHeight;
		var mediaRatio = mediaWidth / mediaHeight;
		var containerWidth = mediaParent.offsetWidth - canvasOffset*2;
		var containerHeight = mediaParent.offsetHeight - canvasOffset*2;
		var containerRatio = containerWidth / containerHeight;
		var newMediaWidth,newMediaHeight,newXPosition,newYPosition,viewportX,viewportY;
		
		// Contain & resize the media if it is too large
		if ( mediaWidth > containerWidth || mediaHeight > containerHeight ) {
			if ( mediaRatio > containerRatio ) {
				newMediaWidth = containerWidth;
				newMediaHeight = containerWidth / mediaRatio;
				newXPosition = -(mediaWidth - newMediaWidth - canvasOffset*2) / 2;
				newYPosition = (containerHeight - mediaHeight + canvasOffset*2) / 2;
				viewportX = canvasOffset;
				viewportY = (containerHeight - newMediaHeight) * 0.5 + canvasOffset;
			} else {
				newMediaWidth = containerHeight * mediaRatio;
				newMediaHeight = containerHeight;
				newXPosition = (containerWidth - mediaWidth + canvasOffset*2) / 2; 
				newYPosition = -(mediaHeight - newMediaHeight - canvasOffset*2) / 2;
				viewportX = (containerWidth - newMediaWidth) * 0.5 + canvasOffset;
				viewportY = canvasOffset;
			}
		// Media is too small, so just center it
		} else {
			newXPosition = (containerWidth - mediaWidth) * 0.5 + canvasOffset;
			newYPosition = (containerHeight - mediaHeight) * 0.5 + canvasOffset;
			newMediaWidth = mediaWidth;
			newMediaHeight = mediaHeight;
			viewportX = newXPosition;
			viewportY = newYPosition;
		}
		
		return {
			xPos : newXPosition,
			yPos : newYPosition,
			virtualWidth : newMediaWidth,
			virtualHeight : newMediaHeight,
			virtualXPos : viewportX,
			virtualYPos : viewportY,
			scale : newMediaWidth / mediaWidth,
		};
	};
	
	/*
		transformMedia
		-------------------------------------------------------------------------
		Transforms a galleryItem's DOM element by scale & position
		-------------------------------------------------------------------------
	*/
	var transformMedia = function( galleryItem, scale, xPos, yPos ) {
		var transformProperties;
		
		// Set Scale Bounds
		if ( typeof galleryItem.minScale !== 'undefined' ) {
			if ( scale !== false && scale < galleryItem.minScale ) {
				scale = galleryItem.minScale;
			} else if ( scale !== false && scale > 1.3 ) {
				scale = 1.3;
			}
		}
		
		if ( typeof scale !== 'undefined' ) {
			scale = scale || galleryItem.scale || 1;
			
			xPos = xPos || 0;
			xPos += galleryItem.lastVirtualXOffset || 0;
			yPos = yPos || 0;
			yPos += galleryItem.lastVirtualYOffset || 0;
			
			var boundPadding = 80;
			
			// Keep image within bounds
			if ( galleryItem.isZoomed && galleryItem.virtualXOffset > xPos && galleryItem.virtualXOffset + galleryItem.virtualXPos < 0 && galleryItem.virtualXOffset + galleryItem.virtualXPos + galleryItem.virtualWidth < screenWidth - boundPadding ) {
				xPos = galleryItem.virtualXOffset;
			} else if ( galleryItem.isZoomed && galleryItem.virtualXOffset < xPos && galleryItem.virtualXOffset + galleryItem.virtualXPos > boundPadding && galleryItem.virtualXOffset + galleryItem.virtualXPos + galleryItem.virtualWidth > screenWidth ) {
				xPos = galleryItem.virtualXOffset;
			}
			if ( galleryItem.isZoomed && galleryItem.virtualYOffset > yPos && galleryItem.virtualYOffset + galleryItem.virtualYPos < 0 && galleryItem.virtualYOffset + galleryItem.virtualYPos + galleryItem.virtualHeight < screenHeight - boundPadding ) {
				yPos = galleryItem.virtualYOffset;
			} else if ( galleryItem.isZoomed && galleryItem.virtualYOffset < yPos && galleryItem.virtualYOffset + galleryItem.virtualYPos > boundPadding && galleryItem.virtualYOffset + galleryItem.virtualYPos + galleryItem.virtualHeight > screenHeight ) {
				yPos = galleryItem.virtualYOffset;
			}
			transformProperties = "translate("+xPos+"px,"+yPos+"px) scale("+scale+")";
			if ( typeof galleryItem.domObject !== 'undefined' ) {
				galleryItem.scale = scale;
				galleryItem.virtualXOffset = xPos;
				galleryItem.virtualYOffset = yPos;
				galleryItem.virtualWidth = galleryItem.width * scale;
				galleryItem.virtualHeight = galleryItem.height * scale;
				galleryItem.virtualXPos = galleryItem.xPos + ( galleryItem.width - galleryItem.virtualWidth ) / 2;
				galleryItem.virtualYPos = galleryItem.yPos + ( galleryItem.height - galleryItem.virtualHeight ) / 2;
			}
		} else {
			transformProperties = "translate("+galleryItem.virtualXOffset+"px,"+galleryItem.virtualYOffset+"px) scale("+galleryItem.scale+")";
		}
		
		// If we are animating an image from the gallery or another dom object
		if ( typeof galleryItem.domObject !== 'undefined' ) {
			galleryItem.domObject.style.webkitTransform = transformProperties;
			galleryItem.domObject.style.MozTransform = transformProperties;
			galleryItem.domObject.style.msTransform = transformProperties;
			galleryItem.domObject.style.OTransform = transformProperties;
			galleryItem.domObject.style.transform = transformProperties;
		} else {
			galleryItem.style.webkitTransform = transformProperties;
			galleryItem.style.MozTransform = transformProperties;
			galleryItem.style.msTransform = transformProperties;
			galleryItem.style.OTransform = transformProperties;
			galleryItem.style.transform = transformProperties;
		}
	};
	
	/*
		gatherMedia
		-------------------------------------------------------------------------
		Searches the document for all 'js-mediaSwipe' dom elements that are 
		related to the 'domItem' and populates the gallery array.
		
		@param domItem - the dom element with class js-mediaSwipe
		that was first clicked on to launch mediaSwipe.
		-------------------------------------------------------------------------
	*/
	var gatherMedia = function( domItem ) {
		var addedItems = [];
		var domMediaProperties = getMediaProperties( domItem );
		var documentItems = document.getElementsByClassName('js-mediaSwipe');
		var documentItems2 = document.getElementsByClassName('js-mediaswipe');
		var newDomItem;
		gallery = new Array();
		var tempGallery = new Array();
		currentIndex = 0;
		if ( documentItems.length ) {
			for ( var i = 0; i < documentItems.length; i++ ) {
				newDomItem = getMediaProperties( documentItems[i] );
				if ( (domMediaProperties === false && newDomItem !== false && typeof addedItems[ newDomItem.src ] === 'undefined') || (newDomItem !== false && typeof addedItems[ newDomItem.src ] === 'undefined' && newDomItem.category === domMediaProperties.category) ) {
					addedItems[ newDomItem.src ] = true;
					newDomItem.index = gallery.length;
					newDomItem.displayIndex = gallery.length + 1;
					gallery.push( newDomItem );
					tempGallery.push( newDomItem );
					if ( currentIndex === 0 && newDomItem.src === domMediaProperties.src ) {
						currentIndex = gallery.length - 1;
					}
				}
			}
		}
		if ( documentItems2.length ) {
			for ( var i = 0; i < documentItems2.length; i++ ) {
				newDomItem = getMediaProperties( documentItems2[i] );
				if ( (domMediaProperties === false && newDomItem !== false && typeof addedItems[ newDomItem.src ] === 'undefined') || (newDomItem !== false && typeof addedItems[ newDomItem.src ] === 'undefined' && newDomItem.category === domMediaProperties.category) ) {
					addedItems[ newDomItem.src ] = true;
					newDomItem.index = gallery.length;
					newDomItem.displayIndex = gallery.length + 1;
					gallery.push( newDomItem );
					tempGallery.push( newDomItem );
					if ( currentIndex === 0 && newDomItem.src === domMediaProperties.src ) {
						currentIndex = gallery.length - 1;
					}
				}
			}
		}
		// There is a bug with only 2 gallery items. Since there are 3 active slides, it creates
		// a mess. So - we just make the gallery 4 items instead!
		if ( gallery.length === 2 ) {
			var newIndex = gallery.length;
			var newDisplayIndex = 1;
			if ( documentItems.length ) {
				for ( var i = 0; i < documentItems.length; i++ ) {
					newDomItem = getMediaProperties( documentItems[i] );
					if ( (domMediaProperties === false && newDomItem !== false ) || (newDomItem !== false && newDomItem.category === domMediaProperties.category) ) {
						newDomItem.index = newIndex;
						newDomItem.displayIndex = newDisplayIndex;
						gallery.push( newDomItem );
						newIndex++;
						newDisplayIndex++;
					}
				}
			}
			if ( documentItems2.length ) {
				for ( var i = 0; i < documentItems2.length; i++ ) {
					newDomItem = getMediaProperties( documentItems[i] );
					if ( (domMediaProperties === false && newDomItem !== false ) || (newDomItem !== false && newDomItem.category === domMediaProperties.category) ) {
						newDomItem.index = newIndex;
						newDomItem.displayIndex = newDisplayIndex;
						gallery.push( newDomItem );
						newIndex++;
						newDisplayIndex++;
					}
				}
			}
			
			galleryLength = 2;
		} else {
			galleryLength = gallery.length;
		}	
	};
	
	/*
		animateSwipe
		-------------------------------------------------------------------------
		Prepares to animate all the slides in a swiping direction from startX
		to the edge of the screen at a direction, dir.
		-------------------------------------------------------------------------
	*/
	var animateSwipe = function( dir, startX ) {
		// If we are already animating, set all slides to 0 position, clear the old
		// animations, and set new ones
		if ( animator.animations.length ) {
			setSlides( currentIndex );
			clearAnimations();
		}
		
		var nextSlideItem = ( dir < 0 ) ? $previousSlide : $nextSlide;
		$futureSlide = nextSlideItem;
		currentIndex = getNextIndex( dir );
		
		animator.animations.push({
			domObject : $currentSlide,
			time : 270,
			xStart : startX,
			xEnd : screenWidth * dir * -1,
			callback : function() {
				setSlides( currentIndex );
				clearAnimations();
			}
		});
		animator.animations.push({
			domObject : nextSlideItem,
			time : 270,
			xStart : startX,
			xEnd : screenWidth * dir * -1,
		});
	};
	
	/*
		getMediaProperties
		-------------------------------------------------------------------------
		Sets a single 'galleryItem' object with required properties by examining
		and parsing a single domItem.
		
		@param domItem - the dom element with class js-mediaSwipe that will be
		added to the gallery array
		-------------------------------------------------------------------------
	*/
	var getMediaProperties = function( domItem ) {
		var attrName = "";
		var attrValue = "";
		var mediaObject = {
			active : false,
			index : 0,
			type : false, 
			src : false, 
			caption : false, 
			category : false,
			width : 0, 
			height : 0, 
			xPos : 0, 
			yPos : 0, 
			scale : 1,
			minScale : 1,
			isZoomed : false, 
			disableTouchpad : false,
			virtualHeight : 0, 
			virtualWidth : 0, 
			virtualXPos : 0, 
			virtualYPos : 0, 
			virtualXOffset : 0, 
			virtualYOffset : 0,
			lastVirtualXOffset : 0,
			lastVirtualYOffset : 0,
			domSlide : false, 
			domContainer : false, 
			domObject : false
		};
		for ( var i = 0; i < domItem.attributes.length; i++ ) {
			attrName = domItem.attributes[i].nodeName;
			attrValue = domItem.getAttribute( attrName );
			if ( attrName === "data-largeimg" || attrName === "data-img" || attrName === "data-image" || attrName === "href" ) {
				mediaObject.src = attrValue;
			}
			else if ( attrName === "data-caption" || attrName === "data-title" || attrName === "data-description" ) {
				mediaObject.caption = attrValue;
			}
			else if ( attrName === "data-rel" || attrName === "data-category" || attrName === "data-type" ) {
				mediaObject.category = attrValue;
			}
			else if ( (attrName === "data-w" || attrName === "data-width") && !isNaN(attrValue) ) {
				mediaObject.width = parseInt(attrValue);
			}
			else if ( (attrName === "data-h" || attrName === "data-height") && !isNaN(attrValue) ) {
				mediaObject.height = parseInt(attrValue);
			}
		}
		if ( mediaObject.src !== false && mediaObject.src !== "" ) {
			if (/\.(jpg|png|gif)$/.test(mediaObject.src.toLowerCase()) && typeof mediaObject.mmid === 'undefined' ) { 
				mediaObject.type = "image";
			} else if (/\.(mp4)$/.test(mediaObject.src.toLowerCase())) { 
				mediaObject.type = "mp4";
			} else if ( mediaObject.src.indexOf('youtube.com') > -1 || mediaObject.src.indexOf('/embed/') > -1 ) { 
				mediaObject.type = "youtube";
				mediaObject.disableTouchpad = true;
				// Set special width and height for YouTube videos:
				mediaObject.width = mediaObject.width || 1200;
				mediaObject.height = mediaObject.height || 675;
				// Extract video id
				var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        			var match = mediaObject.src.match(regExp);
        			if (match && match[2].length == 11) {
					mediaObject.src = match[7];
				} else {
					return false;
				}
			} else {
				mediaObject.type = "iframe";
				mediaObject.disableTouchpad = true;
				mediaObject.width = mediaObject.width || 920;
				mediaObject.height = mediaObject.height || 614;
			}
			return mediaObject;
		} else {
			// Invalid media object of some sort or a file path was not given
			console.warn("MediaSwipe: Could not open file because 'href' or 'data-image' attributes were not specified on the js-mediaSwipe element.");
			return false;
		}
	};
	
	/*
		getNextIndex
		-------------------------------------------------------------------------
		Returns a valid index value for our gallery array from the current index.
		-------------------------------------------------------------------------
	*/
	var getNextIndex = function( direction ) {
		var nextIndex = currentIndex + direction;
		if ( nextIndex >= gallery.length ) {
			return 0;
		} else if ( nextIndex < 0 ) {
			return gallery.length - 1;
		}
		return nextIndex;
	};
	
	/*
		addClass
		-------------------------------------------------------------------------
		Adds a class name to a dom element
		-------------------------------------------------------------------------
	*/
	var addClass = function( $domItem, className ) {
		$domItem.className = $domItem.className.replace(/^\s\s*/g, '').replace(/\s\s*$/g, '').replace(/\s\s+/g, ' ') + " " + className;
	};
	
	/*
		removeClass
		-------------------------------------------------------------------------
		Removes the class name from a dom element
		-------------------------------------------------------------------------
	*/
	var removeClass = function( $domItem, className ) {
		$domItem.className = $domItem.className.replace(new RegExp(className, 'g'), '').replace(/^\s\s*/g, '').replace(/\s\s*$/g, '').replace(/\s\s+/g, ' ');
	};
	
	/*
		hasClass
		-------------------------------------------------------------------------
		Returns true/false if the dom element contains a class name
		-------------------------------------------------------------------------
	*/
	var hasClass = function( $domItem, className ) {
		var itemClasses = $domItem.className;
		var classList = itemClasses.replace(/^\s\s*/g, '').replace(/\s\s*$/g, '').replace(/\s\s+/g, ' ').split(' ');
		for ( var i = 0; i < classList.length; i++ ) {
			if ( classList[i] === className ) {
				return true;
			}
		}
		return false;
	};
	
	/*
		containsMediaClass
		-------------------------------------------------------------------------
		Checks to see if an element (domItem) has class js-mediaSwipe and prevents
		an event.
		-------------------------------------------------------------------------
	*/
	var containsMediaClass = function(domItem,e) {
		if ( domItem.getAttribute('class') && typeof domItem.getAttribute('class') !== 'undefined' && domItem.getAttribute('class').toLowerCase().indexOf('js-mediaswipe') !== -1 ) {
			e.preventDefault();
			gatherMedia( domItem );
			launch();
			return true;
		}
		return false;
	};
	
	/*
		appendMediaSwipeDOM
		-------------------------------------------------------------------------
		Appends the required gallery containers to the DOM
		-------------------------------------------------------------------------
	*/
	var appendMediaSwipeDOM = function() {
		var mediaDIV = document.createElement('div');
		mediaDIV.id = "mediaswipe-container";
		
		var mediaHTML = "";
		mediaHTML += '<div id="mediaswipe-touchpad" class="mediaswipe-slides-container">';
		mediaHTML += 	'<div id="mediaswipe-slide1" class="mediaswipe-slide mediaswipe-current-slide">';
		mediaHTML +=			'<div id="mediaswipe-slide1-container" class="mediaswipe-slide-container mediaswipe-op-transition"></div>';
		mediaHTML +=		'</div>';
		mediaHTML += 	'<div id="mediaswipe-slide2" class="mediaswipe-slide mediaswipe-previous-slide">';
		mediaHTML +=			'<div id="mediaswipe-slide2-container" class="mediaswipe-slide-container mediaswipe-op-transition"></div>';
		mediaHTML +=		'</div>';
		mediaHTML += 	'<div id="mediaswipe-slide3" class="mediaswipe-slide mediaswipe-next-slide">';
		mediaHTML +=			'<div id="mediaswipe-slide3-container" class="mediaswipe-slide-container mediaswipe-op-transition"></div>';
		mediaHTML +=		'</div>';
		mediaHTML +=		'<div class="mediaswipe-invisible-overlay"></div>';
		mediaHTML +=	 '</div>';
		mediaHTML += '<div class="mediaswipe-top-bar">';
		mediaHTML += 	'<div id="mediaswipe-gallery-indexes"></div>';
		mediaHTML +=		'<button type="button" id="mediaswipe-share-button" class="mediaswipe-share-button mediaswipe-op-transition" title="Share"><span></span></button>';
		mediaHTML +=		'<button type="button" id="mediaswipe-fullscreen-button" class="mediaswipe-fullscreen-button mediaswipe-op-transition"><span></span></button>';
		mediaHTML += 	'<button type="button" id="mediaswipe-close-button" class="mediaswipe-close-button mediaswipe-op-transition"></button>';
		mediaHTML +=		'<div id="mediaswipe-share-nav">';
		mediaHTML +=			'<button type="button" id="mediaswipe-facebook-share" class="mediaswipe-op-transition">Share on Facebook</button>';
		mediaHTML +=			'<button type="button" id="mediaswipe-twitter-share" class="mediaswipe-op-transition">Tweet</button>';
		mediaHTML +=			'<button type="button" id="mediaswipe-pinterest-share" class="mediaswipe-op-transition">Pin it</button>';
		mediaHTML +=		'</div>';
		mediaHTML += '</div>';
		mediaHTML += '<div class="mediaswipe-bottom-bar">';
		mediaHTML += 	'<div id="mediaswipe-slide-caption"></div>';
		mediaHTML += '</div>';
		mediaHTML += '<button type="button" id="mediaswipe-left-arrow" class="mediaswipe-arrow mediaswipe-left-arrow mediaswipe-all-transition"><span></span></button>';
		mediaHTML += '<button type="button" id="mediaswipe-right-arrow" class="mediaswipe-arrow mediaswipe-right-arrow mediaswipe-all-transition"><span></span></button>';
		mediaHTML += '<div class="mediaswipe-overlay mediaswipe-op-transition"></div>';
		
		mediaDIV.innerHTML = mediaHTML;
		document.getElementsByTagName('body')[0].appendChild(mediaDIV);
	};
	
	/*
		initiateListeners
		-------------------------------------------------------------------------
		Sets all event listeners for the document.
		-------------------------------------------------------------------------
	*/
	var initiateListeners = function() {
		// Open MediaSwipe Event
		document.addEventListener('click', function(e) {
			if ( (isActive === false && typeof e.button !== 'undefined' && e.button < 2) || (isActive === false && typeof e.button == 'undefined') ) {
				var domItem = e.target;
				while( domItem.parentNode && !containsMediaClass(domItem,e) ) {
					domItem = domItem.parentNode;
				}
			}
		});
		
		// Event for leaving the window
		document.addEventListener('mouseout', function(e) {
			e = e ? e : window.event;
			var f = e.relatedTarget || e.toElement;
			if ( (!f || f.nodeName === 'HTML') && pointerHandler.mouseDown ) {
				doMouseUp(e);
			}
		});
		
		// Event for mouse or finger leaving the slide while swiping or panning
		$mediaSwipeTouchpad.addEventListener('mouseout', function(e) {
			if ( pointerHandler.swiping || pointerHandler.panning ) {	
				e = e ? e : window.event;
				doMouseUp(e);
			}
		});
		
		// Mobile finger touch start event
		$mediaSwipeTouchpad.addEventListener('touchstart', function(e) {
			e = e ? e : window.event;
			if ( isActive && gallery[ currentIndex ].type !== 'html' && gallery[ currentIndex ].type !== 'iframe' ) {
				e.preventDefault();
			}
			if ( e.targetTouches.length === 1 ) {
				doMouseDown(e.targetTouches[0]);
			} else {
				pointerHandler.zooming = false;
				doMouseDown(e.targetTouches[0]);
				getEvent(e.targetTouches[1], pointerHandler.secondStart);
			}
		});
		
		// Mobile panning/zooming/swiping
		$mediaSwipeTouchpad.addEventListener('touchmove', function(e) {
			e = e ? e : window.event;
			if ( isActive && gallery[ currentIndex ].type !== 'html' && gallery[ currentIndex ].type !== 'iframe' ) {
				e.preventDefault();
			}
			if ( e.targetTouches.length === 1 && !pointerHandler.zooming ) {
				doMouseMove(e.targetTouches[0]);
			} else if ( e.targetTouches.length >= 1 && gallery[ currentIndex ].disableTouchpad === false ) {
				if ( pointerHandler.zooming !== true ) {
					getEvent(e.targetTouches[0],pointerHandler.start);
					pointerHandler.zooming = true;
					gallery[ currentIndex ].startZoomWidth = gallery[ currentIndex ].virtualWidth;
					gallery[ currentIndex ].isZoomed = true;
					gallery[currentIndex].lastVirtualXOffset = gallery[currentIndex].virtualXOffset;
					gallery[currentIndex].lastVirtualYOffset = gallery[currentIndex].virtualYOffset;
				}
				// Multitouch drag & zoom
				getEvent(e.targetTouches[0], pointerHandler.end);
				getEvent(e.targetTouches[1], pointerHandler.secondEnd);
				var startDistance = Math.sqrt(Math.pow(pointerHandler.secondStart.y-pointerHandler.start.y,2)+Math.pow(pointerHandler.secondStart.x-pointerHandler.start.x,2));
				var endDistance = Math.sqrt(Math.pow(pointerHandler.secondEnd.y-pointerHandler.end.y,2)+Math.pow(pointerHandler.secondEnd.x-pointerHandler.end.x,2));
				var deltaX = (pointerHandler.secondEnd.x-pointerHandler.secondStart.x) + (pointerHandler.end.x-pointerHandler.start.x) / 2;
				var deltaY = (pointerHandler.secondEnd.y-pointerHandler.secondEnd.y) + (pointerHandler.end.y-pointerHandler.start.y) / 2;
				var newRatio = ((endDistance - startDistance) * 4 + gallery[ currentIndex ].startZoomWidth) / gallery[ currentIndex ].width;
				transformMedia( gallery[ currentIndex ], newRatio, deltaX, deltaY );
			}
		});
		
		// Mobile finger up event
		$mediaSwipeTouchpad.addEventListener('touchend', function(e) {
			e = e ? e : window.event;
			if ( isActive ) {
				e.preventDefault();
			}
			if ( e.targetTouches.length === 0 && pointerHandler.zooming === false ) {
				doMouseUp(e.changedTouches[0]);
			} else if ( e.targetTouches.length === 0 && pointerHandler.zooming ) {
				pointerHandler.zooming = false;
			} else if ( e.targetTouches.length === 1 && pointerHandler.zooming ) {
				doMouseDown(e.targetTouches[0]);
				gallery[currentIndex].lastVirtualXOffset = gallery[currentIndex].virtualXOffset;
				gallery[currentIndex].lastVirtualYOffset = gallery[currentIndex].virtualYOffset;
			}
		});
		
		
		// Touchpad Mouse Events for Desktop
		$mediaSwipeTouchpad.addEventListener('mousedown', function(e) {
			e = e ? e : window.event;
			doMouseDown(e);
		});
		$mediaSwipeTouchpad.addEventListener('mouseup', function(e) {
			e = e ? e : window.event;
			doMouseUp(e);
		});
		$mediaSwipeTouchpad.addEventListener('mousemove', function(e) {
			e = e ? e : window.event;
			doMouseMove(e);
		});
		
		// Close Click Events
		document.getElementById('mediaswipe-close-button').addEventListener('click', function(e) {
			e = e || window.event;
			e.preventDefault();
			closeGallery();
		});
		
		// Full Screen Click Events
		document.getElementById('mediaswipe-fullscreen-button').addEventListener('click', function(e) {
			e = e || window.event;
			e.preventDefault();
			
			if ( hasClass($mediaSwipe,'ms-full-screen') ) {
				closeFullScreen();
			} else {
				goFullScreen();
			}
		});
		
		// Toggle Social Share Nav
		document.getElementById('mediaswipe-share-button').addEventListener('click', function(e) {
			e = e || window.event;
			e.preventDefault();
			var $socialNav = document.getElementById('mediaswipe-share-nav')
			if ( hasClass($socialNav, 'on') ) {
				removeClass($socialNav,'on');
			} else {
				addClass($socialNav,'on');
			}
		});
		
		// Facebook Share
		document.getElementById('mediaswipe-facebook-share').addEventListener('click', function(e) {
			e = e || window.event;
			e.preventDefault();
			var imageSrc = gallery[ currentIndex ].domObject.src;
			var imageDesc = gallery[ currentIndex ].caption || "";
			window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(imageSrc)+'&t='+encodeURIComponent(imageDesc),'sharer','toolbar=0,status=0,width=626,height=436');
			removeClass(document.getElementById('mediaswipe-share-nav'),'on');
			return false;
		});
		
		// Twitter Share
		document.getElementById('mediaswipe-twitter-share').addEventListener('click', function(e) {
			e = e || window.event;
			e.preventDefault();
			var imageSrc = gallery[ currentIndex ].domObject.src;
			var imageDesc = gallery[ currentIndex ].caption || "";
			window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(imageDesc)+'&url='+encodeURIComponent(imageSrc),'sharer','toolbar=0,status=0,width=626,height=436');
			removeClass(document.getElementById('mediaswipe-share-nav'),'on');
			return false;
		});
		
		// Pinterest Share
		document.getElementById('mediaswipe-pinterest-share').addEventListener('click', function(e) {
			e = e || window.event;
			e.preventDefault();
			var imageSrc = gallery[ currentIndex ].domObject.src;
			var imageDesc = gallery[ currentIndex ].caption || "";
			window.open('http://www.pinterest.com/pin/create/button/?url='+encodeURIComponent(imageSrc)+'&description='+encodeURIComponent(imageDesc),'sharer','toolbar=0,status=0,width=626,height=436');
			removeClass(document.getElementById('mediaswipe-share-nav'),'on');
			return false;
		});
	
		// Arrow Click Events
		document.getElementById('mediaswipe-left-arrow').addEventListener('click', function(e) {
			e = e || window.event;
			e.preventDefault();
			if ( isActive && galleryLength > 1 ) {
				animateSwipe( -1, 0 );
			}
		});
		document.getElementById('mediaswipe-right-arrow').addEventListener('click', function(e) {
			e = e || window.event;
			e.preventDefault();
			if ( isActive && galleryLength > 1 ) {
				animateSwipe( 1, 0 );
			}
		});
		
		// Keyboard events - left, right, escape
		document.onkeydown = function(e) {
			if ( isActive ) {
				e = e || window.event;
				switch(e.which || e.keyCode) {
					case 39:		// right arrow press
						if ( galleryLength > 1 ) {
							animateSwipe( 1, 0 );
						}
						break;
					case 37:		// left arrow press
						if ( galleryLength > 1 ) {
							animateSwipe( -1, 0 );
						}
						break;
					case 27:		// escape!
						closeGallery();
						break;
				}
			}
		};
	
		// Window resize event
		window.onresize = function() {
			doResize();
		};
	};
	
	/*
		doResize
		-------------------------------------------------------------------------
		Resizes the viewport on window.onresize and calls any other onresize 
		events that were already instantiated.
		-------------------------------------------------------------------------
	*/
	var doResize = function() {
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;
		
		if ( isActive ) {
			var previousIndex = getNextIndex( -1 );
			var nextIndex = getNextIndex( 1 );
			var galleryIndexes = [ currentIndex, previousIndex, nextIndex ];
		
			for ( var i = 0; i < galleryIndexes.length; i++ ) {
				fitMedia( gallery[galleryIndexes[i]] );
				if ( gallery.length < 2 ) break;
			}
		}
		if ( typeof oldResizeFunc === 'function' ) {
			oldResizeFunc();
		}
	};
	
	/*
		getEvent
		-------------------------------------------------------------------------
		Gets the x,y and current time of an event (like mouse click, move, etc.)
		-------------------------------------------------------------------------
	*/
	var getEvent = function(e, properties) {
		properties.x = e.clientX;
		properties.y = e.clientY;
		properties.time = parseInt( new Date().getTime() );
	};
	
	/*
		doMouseDown
		-------------------------------------------------------------------------
		Handles a mouse down event and sets the start pointerHandler x,y coords
		-------------------------------------------------------------------------
	*/
	var doMouseDown = function(e) {
		if ( isActive ) {
			getEvent(e, pointerHandler.start);
			pointerHandler.mouseDown = true;
		}
	};
	
	/*
		doMouseUp
		-------------------------------------------------------------------------
		Handles a mouse move event
		-------------------------------------------------------------------------
	*/
	var doMouseUp = function(e) {
		if ( isActive ) {
			pointerHandler.mouseDown = false;
			getEvent(e, pointerHandler.end);
			
			if ( pointerHandler.swiping ) {
				var dis = pointerHandler.end.x - pointerHandler.start.x;
				// Perform swipe animation
				if ( Math.abs(dis) > 100 ) {
					var dir = ( dis > 0 ) ? -1 : 1;
					animateSwipe( dir, dis );
				}
				// Set the item back to it's position
				else {
					var dir = ( dis > 0 ) ? -1 : 1;
					var nextSlideItem = ( dis > 0 ) ? $previousSlide : $nextSlide;
					animator.animations.push({
						domObject : $currentSlide,
						time : 270,
						xStart : dis,
						xEnd : 0,
						callback : function() {
							clearAnimations();
							removeClass($mediaSwipe,'ms-grabbing');
							removeClass($mediaSwipe,'ms-grab');
						}
					});
					animator.animations.push({
						domObject : nextSlideItem,
						time : 270,
						xStart : dis,
						xEnd : 0,
					});
				}
				
				pointerHandler.swiping = false;
			} else if ( pointerHandler.panning ) {
				// Release after panning
				pointerHandler.panning = false;
				removeClass($mediaSwipe,'ms-grabbing');
				addClass($mediaSwipe,'ms-zoom-out');
				
				// A hard panning motion is a swipe motion
				if ( Math.abs(pointerHandler.vX) > 25 && gallery.length > 1 ) {
					pointerHandler.panning = false;
					var dis = pointerHandler.end.x - pointerHandler.start.x;
					// Perform swipe animation
					if ( Math.abs(dis) > 100 ) {
						var dir = ( dis > 0 ) ? -1 : 1;
						animateSwipe( dir, dis );
					}
					// Set the item back to it's position
					else {
						var dir = ( dis > 0 ) ? -1 : 1;
						var nextSlideItem = ( dis > 0 ) ? $previousSlide : $nextSlide;
						animator.animations.push({
							domObject : $currentSlide,
							time : 270,
							xStart : dis,
							xEnd : 0,
							callback : function() {
								clearAnimations();
								removeClass($mediaSwipe,'ms-grabbing');
								removeClass($mediaSwipe,'ms-grab');
							}
						});
						animator.animations.push({
							domObject : nextSlideItem,
							time : 270,
							xStart : dis,
							xEnd : 0,
						});
					}
					
				} else if ( Math.abs(pointerHandler.vX) > 8 || Math.abs(pointerHandler.vY) > 8 ) {
					// Set a panning movement
					animator.animations.push({
						domObject : gallery[ currentIndex ],
						time : 330,   
						xStart : 0,
						xEnd : pointerHandler.vX * 6,
						yStart : 0,
						yEnd : pointerHandler.vY * 6,
						callback : function() {
							clearAnimations();
							removeClass($mediaSwipe,'ms-grabbing');
							removeClass($mediaSwipe,'ms-grab');
							gallery[currentIndex].lastVirtualXOffset = gallery[currentIndex].virtualXOffset;
							gallery[currentIndex].lastVirtualYOffset = gallery[currentIndex].virtualYOffset;
						}
					});
				}
				
				
				
				gallery[currentIndex].lastVirtualXOffset = gallery[currentIndex].virtualXOffset;
				gallery[currentIndex].lastVirtualYOffset = gallery[currentIndex].virtualYOffset;
			} else {
				var withinBounds = withinImageBounds(e);
				
				// Clicked to close share navigation
				var $socialNav = document.getElementById('mediaswipe-share-nav')
				if ( hasClass($socialNav, 'on') ) {
					removeClass($socialNav,'on');
					if ( !withinBounds ) {
						return false; // exit early
					}
				}
				
				// Just a click, check if we clicked out of bounds to close the gallery
				if ( !withinBounds ) {
					closeGallery();
				}
				
				// If we clicked on a video that isn't playing yet...
				if ( withinBounds && typeof gallery[ currentIndex ].youTubeObject !== 'undefined' && gallery[ currentIndex ].youTubeObject.getPlayerState() !== 1 ) {
					// Disable the touchpad...
					addClass($mediaSwipe,'disable-touchpad');
					gallery[ currentIndex ].youTubeObject.playVideo();
				} 
				
				// Clicked to zoom-in
				if ( withinBounds && gallery[ currentIndex ].scale < 1 && gallery[ currentIndex ].isZoomed === false && gallery[ currentIndex ].disableTouchpad === false ) {
					animator.animations.push({
						domObject : gallery[ currentIndex ],
						time : 170,
						scaleStart : gallery[ currentIndex ].scale,
						scaleEnd : 1,
						callback : function() {
							clearAnimations();
							removeClass($mediaSwipe,'ms-zoom-in');
							addClass($mediaSwipe,'ms-zoom-out');
							gallery[currentIndex].isZoomed = true;
						}
					});
				}
				// Clicked to zoom-out
				if ( withinBounds && gallery[ currentIndex ].isZoomed === true ) {
					var fitBounds = getFitDimensions( gallery[ currentIndex ] );
					gallery[currentIndex].lastVirtualXOffset = 0;
					gallery[currentIndex].lastVirtualYOffset = 0;
					animator.animations.push({
						domObject : gallery[ currentIndex ],
						time : 170,
						scaleStart : gallery[ currentIndex ].scale,
						scaleEnd : fitBounds.scale,
						xStart : gallery[ currentIndex ].virtualXOffset,
						xEnd : 0,
						yStart : gallery[ currentIndex ].virtualYOffset,
						yEnd : 0,
						callback : function() {
							clearAnimations();
							removeClass($mediaSwipe,'ms-zoom-out');
							addClass($mediaSwipe,'ms-zoom-in');
							gallery[currentIndex].isZoomed = false;
						}
					});
				}
			}
		}
	};
	
	/*
		doMouseMove
		-------------------------------------------------------------------------
		Handles mouse movement events
		-------------------------------------------------------------------------
	*/
	var doMouseMove = function(e) {
		if ( isActive ) {
			if ( pointerHandler.mouseDown ) {
				var mDistance = Math.sqrt(Math.pow(e.clientY-pointerHandler.start.y,2)+Math.pow(e.clientX-pointerHandler.start.x,2));
				
				if ( mDistance > 10 ) {
					if ( gallery.length > 1 && pointerHandler.swiping === false && gallery[ currentIndex ].isZoomed === false ) {
						pointerHandler.swiping = true;
					}
					else if ( gallery[ currentIndex ].isZoomed === true ) {
						pointerHandler.panning = true;
					}
					
					if ( pointerHandler.swiping ) {
						moveSlides( e.clientX - pointerHandler.start.x );
						// Remove grab cursor
						if ( hasClass($mediaSwipe,'ms-grab') ) {
							removeClass($mediaSwipe,'ms-grab');
						}
						// Add grabbing cursor
						if ( !hasClass($mediaSwipe,'ms-grabbing') ) {
							addClass($mediaSwipe,'ms-grabbing');
						}
					}
					else if ( pointerHandler.panning ) {
						var mousePos = { x:0, y:0, time:-1 };
						getEvent(e, mousePos);
						
						pointerHandler.vX = mousePos.x - pointerHandler.lastPosition.x;
						pointerHandler.vY = mousePos.y - pointerHandler.lastPosition.y;
						pointerHandler.lastPosition = mousePos;
						
						transformMedia( gallery[currentIndex], false, (mousePos.x - pointerHandler.start.x), (mousePos.y - pointerHandler.start.y) );
						if ( hasClass($mediaSwipe,'ms-zoom-out') ) {
							removeClass($mediaSwipe,'ms-zoom-out');
						}
						// Add grabbing cursor
						if ( !hasClass($mediaSwipe,'ms-grabbing') ) {
							addClass($mediaSwipe,'ms-grabbing');
						}
					}
					
				}
			} else {
				// Just hovering over or off an image
				var withinBounds = withinImageBounds(e);
				if ( withinBounds ) {
					if ( gallery[ currentIndex ].scale < 1 && gallery[ currentIndex ].disableTouchpad === false && !hasClass($mediaSwipe,'ms-zoom-in') ) {
						// Show zoom-in cursor
						addClass($mediaSwipe,'ms-zoom-in');
					} else if ( gallery[ currentIndex ].scale >= 1 && gallery[ currentIndex ].disableTouchpad === false && gallery[ currentIndex ].isZoomed && !hasClass($mediaSwipe,'ms-zoom-out') ) {
						// Show zoom-out cursor
						addClass($mediaSwipe,'ms-zoom-out');
					} else if ( galleryLength > 1 && gallery[ currentIndex ].scale === 1 && !gallery[ currentIndex ].disableTouchpad && !gallery[ currentIndex ].isZoomed && !hasClass($mediaSwipe,'ms-grab') ) {
						// Show grab cursor
						addClass($mediaSwipe,'ms-grab');
					}
				} else {
					// Remove zoom-in cursor
					if ( hasClass($mediaSwipe,'ms-zoom-in') ) {
						removeClass($mediaSwipe,'ms-zoom-in');
					}
					// Remove zoom-out cursor
					if ( hasClass($mediaSwipe,'ms-zoom-out') ) {
						removeClass($mediaSwipe,'ms-zoom-out');
					}
					// Remove grab cursor
					if ( hasClass($mediaSwipe,'ms-grab') ) {
						removeClass($mediaSwipe,'ms-grab');
					}
				}
			}
		}
	};
	
	/*
		withinImageBounds
		-------------------------------------------------------------------------
		Returns true if the cursor or touch event is within the viewport of the
		current media slide.
		-------------------------------------------------------------------------
	*/
	var withinImageBounds = function(e) {
		var mousePos = {x:0,y:0,time:0};
		getEvent(e,mousePos);
		if ( 
			mousePos.x >= gallery[ currentIndex ].virtualXPos + gallery[ currentIndex ].virtualXOffset &&
			mousePos.x <= gallery[ currentIndex ].virtualXPos + gallery[ currentIndex ].virtualXOffset + gallery[ currentIndex ].virtualWidth &&
			mousePos.y >= gallery[ currentIndex ].virtualYPos + gallery[ currentIndex ].virtualYOffset &&
			mousePos.y <= gallery[ currentIndex ].virtualYPos + gallery[ currentIndex ].virtualYOffset + gallery[ currentIndex ].virtualHeight
		) {
			return true;
		} else {
			return false;
		}
	};
	
	/*
		getTheTime
		-------------------------------------------------------------------------
		Returns the current time in milliseconds
		-------------------------------------------------------------------------
	*/
	var getTheTime = function() {
		return parseInt(new Date().getTime());
	};
	
	/*
		clearAnimations
		-------------------------------------------------------------------------
		Empties the animations array
		-------------------------------------------------------------------------
	*/
	var clearAnimations = function() {
		animator.animations = new Array();
	};

	/*
		render
		-------------------------------------------------------------------------
		Positions all items that are currently in the animations array.
		-------------------------------------------------------------------------
	*/
	var render = function() {
		animator.currentTime = getTheTime();
		animator.deltaTime = animator.currentTime - animator.previousTime; 
		for ( var i = 0; i < animator.animations.length; i++ ) {
			if ( typeof animator.animations[i].animating === 'undefined' ) {
				animator.animations[i].animating = true;
			}
			if ( animator.animations[i].animating ) {
				animator.foundAnimation = true;
				if ( typeof animator.animations[i].deltaTime === 'undefined' ) {
					animator.animations[i].deltaTime = 0;
				}
				if ( typeof animator.animations[i].scaleStart === 'undefined' ) {
					animator.animations[i].scaleStart = false;
					animator.animations[i].scaleEnd = false;
				}
				if ( typeof animator.animations[i].xStart === 'undefined' ) {
					animator.animations[i].xStart = false;
					animator.animations[i].xEnd = false;
				}
				if ( typeof animator.animations[i].yStart === 'undefined' ) {
					animator.animations[i].yStart = false;
					animator.animations[i].yEnd = false;
				}
				
				var animationProgress = animator.animations[i].deltaTime / animator.animations[i].time;
				var deltaScale, deltaX, deltaY;
				
				if ( animator.animations[i].deltaTime > animator.animations[i].time ) {
					animator.animations[i].animating = false;
					animationProgress = 1;
					deltaScale = ( animator.animations[i].scaleStart !== false )
								?  	animator.animations[i].scaleEnd
								:	false;
					deltaX = ( animator.animations[i].xStart !== false )
								?  	animator.animations[i].xEnd
								:	false;					
					deltaY = ( animator.animations[i].yStart !== false ) 
								?  	animator.animations[i].yEnd
								:	false;	
				} else {
					deltaScale = ( animator.animations[i].scaleStart !== false )
								?  	easeOut( animator.animations[i].deltaTime, animator.animations[i].scaleStart, (animator.animations[i].scaleEnd - animator.animations[i].scaleStart), animator.animations[i].time)
								:	false;
					deltaX = ( animator.animations[i].xStart !== false )
								?  	easeOut( animator.animations[i].deltaTime, animator.animations[i].xStart, (animator.animations[i].xEnd - animator.animations[i].xStart), animator.animations[i].time)
								:	false;					
					deltaY = ( animator.animations[i].yStart !== false ) 
								?  	easeOut( animator.animations[i].deltaTime, animator.animations[i].yStart, (animator.animations[i].yEnd - animator.animations[i].yStart), animator.animations[i].time)
								:	false;	
				}
				
				transformMedia( animator.animations[i].domObject, deltaScale, deltaX, deltaY );
				
				if ( animator.animations[i].deltaTime > animator.animations[i].time && typeof animator.animations[i].callback !== 'undefined' ) {
					animator.animations[i].callback();
				} else {
					animator.animations[i].deltaTime += animator.deltaTime;
				}
			}
		}
		
		animator.previousTime = animator.currentTime;
		animator.foundAnimation = false;
		requestNextRender();
	};
	
	/*
		requestNextRender
		-------------------------------------------------------------------------
		Waits for the window to be ready for another animation frame to render
		-------------------------------------------------------------------------
	*/
	var requestNextRender = function() {
		if (window.requestAnimationFrame)
			window.requestAnimationFrame( render );
		else if (window.msRequestAnimationFrame)
			window.msRequestAnimationFrame( render );
		else if (window.webkitRequestAnimationFrame)
			window.webkitRequestAnimationFrame( render );
		else if (window.mozRequestAnimationFrame)
			window.mozRequestAnimationFrame( render );
		else if (window.oRequestAnimationFrame)
			window.oRequestAnimationFrame( render );
		else if (typeof window.requestNextFrame === 'undefined' )  {	
			window.requestNextFrame = setInterval(function() {
				render();
			},18);
		}
	};
	
	/*
		easeOut
		-------------------------------------------------------------------------
		Provides an ease-out affect on movement based on time, starting positions,
		distance traveled, other stuff...
		-------------------------------------------------------------------------
	*/
	var easeOut = function( t, b, c, d ) {
		t /= d;
		return -c * t*(t-2) + b;
	};
	
	return { init : init, youTubeAPIReady:youTubeAPIReady };
	
})();
MediaSwipe.init();
window.onYouTubeIframeAPIReady=function(){MediaSwipe.youTubeAPIReady();};
