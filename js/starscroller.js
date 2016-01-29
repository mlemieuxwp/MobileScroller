var StarScroller = (function(window, document, $) {
    var self = this;

    function StarScroller(clickThru, starOverlay) {
        self.jQueryElement = $(starOverlay);

        scrollSpeedMonitor = new ScrollSpeedMonitor(function(speedInPxPerMs, timeStamp, newDirection) {

            if (direction != newDirection) {
                self.jQueryElement
                    .removeClass('up down')
                    .addClass(newDirection);

                direction = newDirection;

            }

            var visible = self.jQueryElement.is(":visible");

            if (visible) {
                resetTimer();
            }

            if (self.requiredSpeedInPxPerMs <= speedInPxPerMs) {

                setStartTimestamp(timeStamp);

                var scrollTime = timeStamp - scrollStartTime;

                if (scrollStartTime > -1 && scrollTime > self.requiredScrollTimeInMs) {

                    if (!visible) {
                        startStarTimer();
                        resetTimer();

                        $('.js-re-engage-click').on('click', function(event) {
                            event.preventDefault();
                            window.open(clickThru);
                        });

                        self.jQueryElement.show();

                        $(window).scroll(function() {
                            fadeOnScroll(direction)
                        });

                    }
                }
            } else {
                setStartTimestamp(timeStamp, true);
            }
        });
    }

    var backgroundPositionY = 0;
    var direction = 'unknown';
    var jQueryElement = null;
    var scrollStartTime = -1;
    var scrollSpeedMonitor = null;
    var scrollStopTimer = null;
    var starTimer = null;

    var targetHeight = $(document).height();
    //var targetHeight = 500;

    this.animationSpeedInMs = 50;
    this.animationStepInPx = 10;
    this.requiredScrollTimeInMs = 100;
    this.requiredSpeedInPxPerMs = 2;
    this.timeoutInMs = 125;

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

    function fadeOnScroll(direction) {
        var scrollPercent = (targetHeight - window.pageYOffset) / targetHeight;
        var scrollRate = 0.02;
        if (scrollPercent >= 0 && self.jQueryElement.css('opacity') < 1) {

            self.jQueryElement.css('opacity', (Number(self.jQueryElement.css('opacity')) + scrollRate));

            // if (scrollPercent >= 0 && self.jQueryElement.css('opacity') < 1) {
            //     if (direction === 'down') {
            //         self.jQueryElement.css('opacity', 1 - scrollPercent);
            //     }

            //     if (direction === 'up') {
            //         self.jQueryElement.css('opacity', (Number(self.jQueryElement.css('opacity')) + 0.01));
            //     }

            // }

        }

    }

    function hideBigLogo() {
        $('.re-engage-ad-big').slideUp('slow', function() {
            $('.re-engage-ad-sm').slideDown('slow');
            self.jQueryElement.css('opacity', 1);
        });
    }

    function hideSmallLogo() {
        $('.re-engage-ad-sm').slideUp('slow', function() {
            $('.re-engage-ad-big').slideDown('slow');
            self.jQueryElement.css('opacity', 1);
        });
    }

    function resetTimer() {
        if (scrollStopTimer != null) {
            window.clearTimeout(scrollStopTimer);
            scrollStopTimer = null;
        }

        scrollStopTimer = window.setTimeout(function() {
            timeoutReached();
        }, self.timeoutInMs);
    }

    function setStartTimestamp(starTimestamp, force) {
        if (scrollStartTime == -1 || force) {
            scrollStartTime = starTimestamp;
        }
    }

    function startStarTimerTick() {

        // backgroundPositionY += self.animationStepInPx * (direction == 'down' ? 1 : -1);

        // self.jQueryElement.css('background-position', '0 ' + backgroundPositionY + 'px');
    }

    function startStarTimer() {
        if (starTimer == null) {
            starTimer = window.setInterval(function() {
                startStarTimerTick();
            }, self.animationSpeedInMs);
        }
    }

    function stopStarTimer() {
        if (starTimer != null) {
            window.clearInterval(starTimer);
            starTimer = null;
        }
    }

    function timeoutReached() {

        scrollStartTime = -1;

        // if (self.jQueryElement.is(":visible")) {
        //     self.jQueryElement.fadeOut(100, function() {
        //         stopStarTimer();
        //     });
        // }
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

    return StarScroller;
}(top.window, top.document, top.jQuery));
