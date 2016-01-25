var ScrollSpeedMonitor = (function($) {
    var self = this;

    function ScrollSpeedMonitor(callbackMethod) {
        callback = callbackMethod;

        // top.window.addEventListener('touchmove', function(e) {
        //     e.preventDefault();
        //     var scrollTop = $(this).scrollTop();
        //     //fix for firefox
        //     e.timeStamp = new Date().getTime();
        //     didScroll(e.timeStamp, scrollTop);

        // }, true);

        // $(top.window).on("touchstart", function(ev) {
        //     var e = ev.originalEvent;
        //     e.preventDefault();
        //     var scrollTop = $(this).scrollTop();
        //     //fix for firefox
        //     e.timeStamp = new Date().getTime();
        //     didScroll(e.timeStamp, scrollTop);

        // });

        top.window.addEventListener('scroll', function(e) {
            e.preventDefault();
            var scrollTop = $(this).scrollTop();
            //fix for firefox
            e.timeStamp = new Date().getTime();
            didScroll(e.timeStamp, scrollTop);

        }, true);

        $(top.window).scroll(function(e) {
            var scrollTop = $(this).scrollTop();
            e.timeStamp = new Date().getTime();
            didScroll(e.timeStamp, scrollTop);
        });

        $(top.window).on("touchstart", function(e) {
            console.log(e.touches);
            var scrollTop = $(this).scrollTop();
            didScroll(e.timeStamp, scrollTop);
        });

        // top.window.addEventListener('scroll', function(e) {
        //     e.preventDefault();
        //     var scrollTop = $(this).scrollTop();
        //     //fix for firefox
        //     e.timeStamp = new Date().getTime();
        //     didScroll(e.timeStamp, scrollTop);

        // }, true);

    }

    var callback;
    var direction = 'unknown';
    var lastDate = -1;
    var lastScrollTop = -1;

    this.thisMinimumTrackingDelayInMs = 25;

    function didScroll(timeStamp, scrollTop) {
        if (lastDate + self.thisMinimumTrackingDelayInMs <= timeStamp) {
            var offset = Math.abs(scrollTop - lastScrollTop);
            var direction = getDirection(scrollTop);
            var delayInMs = timeStamp - lastDate;
            var speedInPxPerMs = offset / delayInMs;

            if (speedInPxPerMs > 0) {
                callback(speedInPxPerMs, timeStamp, direction);
            }

            lastDate = timeStamp;
        }
    };

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

    return ScrollSpeedMonitor;
}(top.jQuery));
