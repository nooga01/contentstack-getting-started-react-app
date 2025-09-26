function getQuerystringParameterValue(key) {
    if (key) {
        key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + key + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    return "";
}

function onWindowResize() {
    let headerH = $("header").height();
    let alertH = $("#alert").height();
    let scrollPadding = headerH;
    if (alertH) scrollPadding += alertH;
    $("body").css("scroll-padding", scrollPadding);
}

$(window).on("resize", onWindowResize);




function trapFocus(container) {
    let focusable = $('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', container).filter(":visible");
    let FocusTrapStartElem = $(`<span tabindex="0" class="focusTrapElement"></span>`).focus(function () {
        // re-eval the focusable elements (as they may have changed)
        let focusable = $('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', container).not(".focusTrapElement").filter(":visible");
        if (focusable.length > 0) {
            // if there are elements in the container which are focusable (and not .focusTrapElement), then focus on the LAST one
            var lastFocusable = focusable[focusable.length - 1];
            lastFocusable.focus();
        } else {
            // otherwise focus on the dummy .focusTrapElement element before the FocusTrapEndElem
            FocusTrapEndElem.prev().focus();
        }
    });
    let FocusTrapEndElem = $(`<span tabindex="0" class="focusTrapElement"></span>`).focus(function () {
        // re-eval the focusable elements (as they may have changed)
        let focusable = $('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', container).not(".focusTrapElement").filter(":visible");
        if (focusable.length > 0) {
            // if there are elements in the container which are focusable (and not .focusTrapElement), then focus on the FIRST one
            var firstFocusable = focusable[0];
            firstFocusable.focus();
        } else {
            // otherwise focus on the dummy .focusTrapElement element after the FocusTrapStartElem
            FocusTrapStartElem.next().focus(); // foc
        }
    });
    container.prepend(FocusTrapStartElem);
    container.append(FocusTrapEndElem);

    // if there is no focusable elements in the container, then add in dummy ones so it'll still trap the focus
    if (focusable.length === 0) {
        FocusTrapStartElem.after(`<span tabindex="-1" class="focusTrapElement"></span>`);
        FocusTrapEndElem.before(`<span tabindex="-1" class="focusTrapElement"></span>`);
        // focus on the first dummy element
        FocusTrapStartElem.next().focus();
    } else {
        // focus on the first element
        focusable[0].focus();
    }
}

function unTrapFocus(container) {
    container.find(`.focusTrapElement`).remove();
}

$(document).ready(function () {
    $(document).ready(function () {
        $("[data-video-id]").modalVideo();
    });

    $("IFRAME[src*='youtube.com/embed/'], IFRAME[src*='youtube-nocookie.com/embed/'], IFRAME[src*='player.vimeo.com/video']").each(function () {
        // check that parent is NOT .responsive-embed
        if (!$(this).parent().hasClass("responsive-embed")) {
            $(this).wrap("<div class='responsive-embed widescreen'></div>");
        }
    });
});
