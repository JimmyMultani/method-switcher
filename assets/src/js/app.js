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
		return {
			init: function(media) {
				console.log('accordion.init');

				$('.accordion--' + media).accordion({
					active: false,
					heightStyle: 'content',
					collapsible: true
				});
			},
			destroy: function(media) {
				// check if instance object exists to avoid console errors
				if($('.accordion--' + media).accordion('instance')) {
					$('.accordion--' + media).accordion('destroy');
				}
			}
		};
	})();

	// Common to the whole app/site
	MYAPP.common = (function() {
		var init = function() {
			console.log('common.init');

			$(window).on('resize', function() {
				var windowWidth = window.innerWidth;

				console.log(windowWidth);
				if(windowWidth >= 1024) {
					// destroy first, init after
					MYAPP.accordion.destroy('mobile');
					MYAPP.accordion.init('desktop');
				} else {
					MYAPP.accordion.destroy('desktop');
					MYAPP.accordion.init('mobile');
				}
			}).resize();
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
