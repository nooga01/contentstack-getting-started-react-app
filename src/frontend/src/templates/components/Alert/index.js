$("#alert .btn-close").click(function () {
    // set the Cookie so it wont show this alertBar (by "refid") again for 365 days
    let alertRefId = $("#alert").data("refid");
    Cookies.set("alertBar-" + alertRefId, "true", { expires: 1 });

    // animate the alertBar
    $("#alert").slideUp(200, function () {
        $("body").removeClass("alert-visible");
        $("#alert").remove(); // so it'll now resize when the browser changes if needed.
        $(window).resize(); // trigger the page resize so the sticky will re-calculate if needed
    });
});
$(document).ready(function () {
    // Hide the alert initially
    $("#alert").hide();
    let alertRefId = $("#alert").data("refid");
    if (!Cookies.get("alertBar-" + alertRefId)) {
        $("#alert").slideDown(200, function () {
            $("body").addClass("alert-visible");
            $(window).resize(); // trigger the page resize so the sticky will re-calculate if needed
        });
    } else {
        $("#alert").remove();
    }
});
