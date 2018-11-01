import DeepZoom from './deepzoom.js'
import Map from './map.js'
import 'magnific-popup/dist/magnific-popup.css'
require('magnific-popup')

export default function (gallerySelector) {

    $(gallerySelector).magnificPopup({
        delegate: 'a.popup',
        type: 'image',
        closeBtnInside: false,
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 2], // read about this option in next Lazy-loading section
            navigateByImgClick: true,
            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', // markup of an arrow button
            tPrev: 'Previous (Left arrow key)', // title for left button
            tNext: 'Next (Right arrow key)', // title for right button
            tCounter: ''
        },
        callbacks: {
            beforeOpen: function () {
                console.log('Start of popup initialization');
                this.current = this.index + 1
                this.total = this.items.length - 1
                this.counter = `<span class="counter">${this.current} of ${this.items.length}</span>`
                this.cont = `<div class="quire-modal-container">${this.counter}</div>`
            },
            elementParse: function (item) {
                console.log('Parsing content. Item object that is being parsed:', item.el[0].getAttribute('data-type'));
                if (item.el[0].getAttribute('data-type') === 'video') {
                    item.type = 'iframe',
                        item.iframe = {
                            patterns: {
                                youtube: {
                                    index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

                                    id: 'v=', // String that splits URL in a two parts, second part should be %id%
                                    // Or null - full URL will be returned
                                    // Or a function that should return %id%, for example:
                                    // id: function(url) { return 'parsed id'; } 

                                    src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe. 
                                },
                                vimeo: {
                                    index: 'vimeo.com/',
                                    id: '/',
                                    src: '//player.vimeo.com/video/%id%?autoplay=1'
                                },
                                gmaps: {
                                    index: '//maps.google.',
                                    src: '%id%&output=embed'
                                }
                            }
                        }
                } else if (item.el[0].getAttribute('data-type') === 'inline') {
                    item.type = 'inline'
                } else {
                    item.type = 'image',
                        item.tLoading = 'Loading image #%curr%...',
                        item.mainClass = 'mfp-img-mobile',
                        item.image = {
                            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
                        }
                }

            },
            change: function () {
                console.log('Content changed');
                console.log(this)
                this.current = this.index + 1
                if (document.querySelector('.counter')) {
                    document.querySelector('.counter').innerHTML = `${this.current} of ${this.items.length}`
                }
                let id = this.content.children()[0].id
                let waitForDOMUpdate = 100
                if (id !== '' || id !== undefined) {
                    if (id.indexOf('map') !== -1) {
                        setTimeout(() => {
                            new Map(id)
                        }, waitForDOMUpdate)
                    }
                    if (id.indexOf('deepzoom') !== -1) {

                        setTimeout(() => {
                            new DeepZoom(id)
                        }, waitForDOMUpdate)
                    }
                    if (id.indexOf('iiif') !== -1) {
                        setTimeout(() => {
                            new DeepZoom(id)
                        }, waitForDOMUpdate)
                    }

                }

            },
            resize: function () {
                console.log('Popup resized');
                // resize event triggers only when height is changed or layout forced
            },
            open: function () {
                console.log('Popup is opened');
                $('.mfp-wrap').append(this.cont)
            },

            beforeClose: function () {
                // Callback available since v0.9.0
                console.log('Popup close has been initiated');
                $('.quire-modal-container').remove()
            },
            close: function () {
                console.log('Popup removal initiated (after removalDelay timer finished)');
            },
            afterClose: function () {
                console.log('Popup is completely closed');
            },

            markupParse: function (template, values, item) {
                // Triggers each time when content of popup changes
                // console.log('Parsing:', template, values, item);
            },
            updateStatus: function (data) {
                console.log('Status changed', data);
                // "data" is an object that has two properties:
                // "data.status" - current status type, can be "loading", "error", "ready"
                // "data.text" - text that will be displayed (e.g. "Loading...")
                // you may modify this properties to change current status or its text dynamically
            },
            imageLoadComplete: function () {
                // fires when image in current popup finished loading
                // avaiable since v0.9.0
                console.log('Image loaded');
            },


            // Only for ajax popup type
            parseAjax: function (mfpResponse) {
                // mfpResponse.data is a "data" object from ajax "success" callback
                // for simple HTML file, it will be just String
                // You may modify it to change contents of the popup
                // For example, to show just #some-element:
                // mfpResponse.data = $(mfpResponse.data).find('#some-element');

                // mfpResponse.data must be a String or a DOM (jQuery) element

                console.log('Ajax content loaded:', mfpResponse);
            },
            ajaxContentAdded: function () {
                // Ajax content is loaded and appended to DOM
                console.log(this.content);
            }
        }
    });
}