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

    $(document).on('click', '.js-fade-scroll-click', function(event) {
        event.preventDefault();
        window.open(clickThru);
    });

    $(document).on('click', 'div#fade-scroll-sm', function(event) {
        event.preventDefault();
        hideSmallLogo();
    });

    $(document).on('click', 'div#fade-scroll-close', function(event) {
        //event.preventDefault();
        //hideBigLogo();
        shrinkScroller();
    });

    $(document).on('click', '.js-fade-scroll-sm', function(event) {
        growScroller();
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
        $('#fade-scroll-big').slideUp('slow', function() {
            $('#fade-scroll-sm').slideDown('slow');
            self.jQueryElement.css('opacity', 1);
        });
        //$(window).unbind("scroll", fadeOnScroll);
    }

    function hideSmallLogo() {
        $('#fade-scroll-sm').slideUp('slow', function() {
            $('#fade-scroll-big').slideDown('slow');
            self.jQueryElement.css('opacity', 1);
        });
        //$(window).unbind("scroll", fadeOnScroll);
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
        $('#fade-scroll-big').animate({
                height: '60px'
            },
            function() {
                $(this).addClass('js-fade-scroll-sm');
            });
    }

    function growScroller() {
        $('#fade-scroll-big').animate({
                height: '167px'
            },
            function() {
                $(this).removeClass('js-fade-scroll-sm');
            });
    }


    return StarScroller;
}(top.window, top.document, top.jQuery));
