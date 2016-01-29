var ReEngageScroller = (function(window, document, $) {
    var direction = 'unknown';
    var jQueryElement = null;
    var targetHeight = $(document).height();
    var requiredSpeedInPxPerMs = 2;

    function init(clickThru, starOverlay) {
        jQueryElement = $(starOverlay);

        /* Event handlers for highlights and recommended-post templates */
        $(document).on('click', '.re-engage-close', function(event) {
            shrinkScroller();
        });

        $(document).on('click', '.js-re-engage-sm', function(event) {
            growScroller();
        });

        /* Separate event handlers for the ad template since ads fully collapse/expand */
        $(document).on('click', '.re-engage-ad-close', function(event) {
            hideBigLogo();
        });

        $(document).on('click', '.re-engage-ad-sm', function(event) {
            hideSmallLogo();
        });

        ReEngageMonitor.init(function(speedInPxPerMs, timeStamp, newDirection) {

            if (direction != newDirection) {
                jQueryElement
                    .removeClass('up down')
                    .addClass(newDirection);

                direction = newDirection;
            }

            var visible = jQueryElement.is(":visible");

            if (requiredSpeedInPxPerMs <= speedInPxPerMs) {
                if (!visible) {
                    $('.js-re-engage-click').on('click', function(event) {
                        event.preventDefault();
                        window.open(clickThru);
                    });

                    jQueryElement.show();

                    $(window).scroll(function() {
                        fadeOnScroll(direction)
                    });
                }
            }
        });
    }

    function fadeOnScroll(direction) {
        var scrollPercent = (targetHeight - window.pageYOffset) / targetHeight;
        var scrollRate = 0.02;
        if (scrollPercent >= 0 && jQueryElement.css('opacity') < 1) {
            jQueryElement.css('opacity', (Number(jQueryElement.css('opacity')) + scrollRate));
        }
    }

    function shrinkScroller() {
        var min_height = $('.re-engage-big').data('min-height');
        $('.re-engage-big').animate({
                height: min_height + 'px'
            },
            function() {
                $(this).addClass('js-re-engage-sm');
            }
        );
    }

    function growScroller() {
        var max_height = $('.re-engage-big').data('max-height');
        $('.re-engage-big').animate({
                height: max_height + 'px'
            },
            function() {
                $(this).removeClass('js-re-engage-sm');
            }
        );
    }

    function hideBigLogo() {
        $('.re-engage-ad-big').slideUp('slow', function() {
            $('.re-engage-ad-sm').slideDown('slow');
            jQueryElement.css('opacity', 1);
        });
    }

    function hideSmallLogo() {
        $('.re-engage-ad-sm').slideUp('slow', function() {
            $('.re-engage-ad-big').slideDown('slow');
            jQueryElement.css('opacity', 1);
        });
    }

    return {
        init: init
    };
}(top.window, top.document, top.jQuery));
