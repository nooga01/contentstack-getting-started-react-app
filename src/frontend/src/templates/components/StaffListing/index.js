$(document).ready(() => {
    const StaffTileBtn = $(".StaffListing .StaffTile .button"); // read more staff biography btn
    StaffTileBtn.each((index, ele) => {
        const isLink = ele.nodeName === "A";
        const StaffBiography = $(ele).parent().siblings(".staff-biography");
        const CurrentBtnTextSpan = $(ele).children("span:not(.icon)");
        if (isLink) {
            StaffBiography.removeClass("collapsed");
        } else {
            $(ele).click(function () {
                StaffBiography.toggleClass("collapsed");
                if (StaffBiography.hasClass("collapsed")) {
                    CurrentBtnTextSpan.text("read more");
                    $(ele).attr("title", "Read More");
                } else {
                    CurrentBtnTextSpan.text("close");
                    $(ele).attr("title", "Close");
                }
            });
        }
    });
});
