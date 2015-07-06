/* global MYAPP */

'use strict';

/*
  Markup-based means of executing JavaScript on page load (using jQuery)

  How to use:

  Add this to your <body>
  <body id="myapp" data-controller="module" data-action="action1 action2">

  Replace "myapp" to match what you put as
  the body ID (use something meaningful and short for the project)

  Replace "MYAPP" to match what you put as the body ID (but capitalized)
*/

(function($, window, document, undefined) {

	var MYAPP = window.MYAPP = window.MYAPP || {};

	MYAPP.util = {
		exec: function(controller, action) {
			var ns = MYAPP,
				act = (action === undefined) ? 'init' : action;

			if (controller !== '' && ns[controller] && typeof ns[controller][act] === 'function') {
				ns[controller][act]();
			}
		},
		init: function() {
			var el = document.getElementById('myapp'), // Update the body ID here
				controller = el.getAttribute('data-controller'),
				actions = el.getAttribute('data-action');

			MYAPP.util.exec('common');
			MYAPP.util.exec(controller);

			// do all the actions too.
			$.each(actions.split(/\s+/), function(i, action){
				MYAPP.util.exec(controller, action);
			});
		}
	};

	MYAPP.helper = (function(){
	    return {
	        /*  fn: {function}, wait : {int}, immediate : {bool}
	            triggers the function on the leading edge instead of the trailing
	            example usage: debounce(function() {}, 250) */
	        debounce: function(fn, wait, immediate) {
	            var timeout; wait = wait || 250;

	            return function() {
	                var args = arguments;

	                var later = function() {
	                    timeout = null;
	                    if (!immediate) { fn.apply(this, args); }
	                }.bind(this);

	                var callNow = immediate && !timeout;
	                clearTimeout(timeout);
	                timeout = setTimeout(later, wait);
	                if (callNow) { fn.apply(this, args); }
	            };
	        }
	    };
	}());

	// Example module for the homepage
	MYAPP.accordion = (function() {
		var windowWidth = window.innerWidth;

		return {
			init: function(media) {
				console.log('accordion.init');

				if (typeof media === undefined) { media = 'desktop'; }

				this.create(media);
				this.addListeners();
				this.updateAccordion();
			},
			create: function(media) {
				// check if instance object exists to avoid console errors
				if(!$('.accordion--' + media).accordion('instance')) {
					$('.accordion--' + media).accordion({
						active: false,
						heightStyle: 'content',
						collapsible: true
					});
				}
			},
			destroy: function(media) {
				// check if instance object exists to avoid console errors
				if($('.accordion--' + media).accordion('instance')) {
					$('.accordion--' + media).accordion('destroy');
				}
			},
			addListeners: function() {
				$(window).on('resize', this.updateAccordion);
			},
			updateAccordion: MYAPP.helper.debounce(function() {
				windowWidth = window.innerWidth;
				console.log(windowWidth);

				if(windowWidth >= 1024) {
					// destroy first, init after
					MYAPP.accordion.destroy('mobile');
					MYAPP.accordion.create('desktop');
				} else {
					MYAPP.accordion.destroy('desktop');
					MYAPP.accordion.create('mobile');
				}
			})
		};
	})();

	MYAPP.tabs = (function() {
		return {
			init: function() {
				console.log('tabs.init');

				// if (typeof media === 'undefined') { media = 'mobile'; }

				this.create();
				this.addListeners();
				this.updateTabs();
			},
			create: function() {
				$('.tabs').tabs();
			},
			destroy: function() {
				$('.tabs').tabs('destroy');
			},
			addListeners: function() {
				$(window).on('resize', this.updateTabs);
			},
			updateTabs: MYAPP.helper.debounce(function() {
				windowWidth = window.innerWidth;
				console.log(windowWidth);

				if(windowWidth >= 1024) {
					if(!$('[data-break-mobile]').tabs('instance')) {
						$('[data-break-mobile]').tabs();
					}
				} else {
					// console.log($('[data-break-mobile]'));
					if($('[data-break-mobile]').tabs('instance')) {
						$('[data-break-mobile]').tabs('destroy');
					}
				}
			})
		};
	})();

	MYAPP.slider = (function() {
		return {
			init: function() {
				console.log('slider.init');

				this.create();
			},
			create: function() {
				$('.slider').slick({
					slidesToShow: 3,
  					slidesToScroll: 3,
					responsive: [
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 1,
								slidesToScroll: 1,
								infinite: true
							}
						}
					]
				});
			},
			destroy: function() {
				$('.slider').unslick();
			}
		};
	})();

	// Common to the whole app/site
	MYAPP.common = (function() {
		var init = function() {
			console.log('common.init');

			MYAPP.accordion.init();
			MYAPP.slider.init();
			MYAPP.tabs.init();
		};

		return {
			init: init
		};
	})();


	// Example module for the homepage
	MYAPP.module = (function() {
		var init = function() { console.log('module.init'); };

		return {
			init: init
		};
	})();


})(jQuery, window, document);

$(document).ready(MYAPP.util.init);
