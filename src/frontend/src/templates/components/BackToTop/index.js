let visibleTriggerOffset = 0.25;    // % of document total scroll. Set to a number > 1 to treat it as a pixel offset
let stickyOffset = 50;

$(".BackToTop .BackToTop-Container").css("bottom", stickyOffset); // when NOT sticky, the CSS has a 0px !important anyway

$(document).ready(function () {
    function isElemVisible(element, offset = 0) {
        let viewPortHeight = $(window).height(); // Viewport Height
        let scrollTop = $(window).scrollTop(); // Scroll Top
        let elementTop = $(element).offset().top;
        return elementTop <= viewPortHeight + scrollTop - offset;
    }
    function handleScroll() {
        // if it's own outer most container is on screen (minus offset), then it should be NOT sticky (so it'll go back into it's container)
        if (isElemVisible($(".BackToTop"), stickyOffset)) {
            $(".BackToTop").removeClass("sticky");
            if (!$(".BackToTop .BackToTop-Container").hasClass("shown")) {
                $(".BackToTop .BackToTop-Container").addClass("shown");
            }
        } else {
            // it's container is offscreen, so it needs to be sticky.
            $(".BackToTop").addClass("sticky");

            let scrollPos = $(window).scrollTop();
            let visibleTriggerPos = visibleTriggerOffset;

            if (visibleTriggerOffset < 1) { // if it's less than 1, we're treating it as a % of total visible height
                let totalScrollDistance = $(document).height() - $(window).height();
                visibleTriggerPos = totalScrollDistance * visibleTriggerOffset;
            }

            //If scroll top has gone 1/4 way down the page
            if (scrollPos > visibleTriggerPos) {
                // needs to be visible
                if (!$(".BackToTop .BackToTop-Container").hasClass("shown")) {
                    $(".BackToTop .BackToTop-Container").addClass("shown");
                }
            } else {
                // needs to be hidden
                if ($(".BackToTop .BackToTop-Container").hasClass("shown")) {
                    $(".BackToTop .BackToTop-Container").removeClass("shown");
                }
            }
        }
    }
    // $(window).scroll(handleScroll);
    // handleScroll();
});
