/**
 *	JS to show ad after a period of inactivity.
 */

(function($) {
	var self = this;
	var idleTimeInMiliseconds = 180000;

	$(document).idle({
		onIdle: function() {
			var targetAdElement = $('#fade-scroll-wrapper');

			if (!targetAdElement.is(':visible')) {
				targetAdElement.css('opacity', 1);
				targetAdElement.fadeIn(1500);
			}
		},
		idle: idleTimeInMiliseconds
	});

}(top.jQuery));