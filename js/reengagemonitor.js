var ReEngageMonitor = (function(window, $) {
    var callback;
    var direction = 'unknown';
    var lastDate = -1;
    var lastScrollTop = -1;
    var thisMinimumTrackingDelayInMs = 25;

    function init(callbackMethod) {
        callback = callbackMethod;

        window.addEventListener('scroll', function(e) {
            e.preventDefault();
            var scrollTop = $(this).scrollTop();
            //fix for firefox
            e.timeStamp = new Date().getTime();
            didScroll(e.timeStamp, scrollTop);

        }, true);

        $(window).scroll(function(e) {
            var scrollTop = $(this).scrollTop();
            e.timeStamp = new Date().getTime();
            didScroll(e.timeStamp, scrollTop);
        });

        $(window).on("touchstart", function(e) {
            console.log(e.touches);
            var scrollTop = $(this).scrollTop();
            didScroll(e.timeStamp, scrollTop);
        });
    }

    function didScroll(timeStamp, scrollTop) {
        if (lastDate + thisMinimumTrackingDelayInMs <= timeStamp) {
            var offset = Math.abs(scrollTop - lastScrollTop);
            var direction = getDirection(scrollTop);
            var delayInMs = timeStamp - lastDate;
            var speedInPxPerMs = offset / delayInMs;

            if (speedInPxPerMs > 0) {
                callback(speedInPxPerMs, timeStamp, direction);
            }

            lastDate = timeStamp;
        }
    }

    function getDirection(scrollTop) {
        var currentScrollTop = lastScrollTop;
        lastScrollTop = scrollTop;

        if (currentScrollTop > -1) {
            if (currentScrollTop >= scrollTop) {
                return 'up';
            }

            return 'down';
        }

        return 'unknown';
    }

    function reset() {
        direction = 'unknown';
        lastDate = -1;
        lastScrollTop = -1;
    }

    return {
        init: init
    };
}(top.window, top.jQuery));
