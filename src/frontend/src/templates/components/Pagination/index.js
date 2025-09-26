$(document).ready(function() {
    const $pagination = $(".Pagination").not("[data-mode='javascript']");
    if ($pagination.length === 0) {
        return;
    }
    insertMorePageDots($(".Pagination-buttons.Desktop", $pagination));
    insertMorePageDots($(".Pagination-buttons.Mobile", $pagination));

    // $(".Pagination a").each(function () {
    //     let href = $(this).attr("href");
    //     if (location.hash) {
    //         href += location.hash;
    //     }
    //     $(this).attr("href", href);
    // });

    // TODO: Need to scrol this to the container, but keep in mind if it's inside a tab.
    // if (location.href.indexOf("page=") >= 0) {
    //     let scrollTop = $(".ResourceFilter-Container").offset().top;
    //     console.log("🚀 ~ $ ~ scrollTop:", scrollTop);

    //     $([document.documentElement, document.body]).animate(
    //         {
    //             scrollTop,
    //         },
    //         2000
    //     );
    // }
});

function insertMorePageDots($pagination) {
    const hasPagination = $pagination.length > 0;
    const $paginationPreBtn = hasPagination ? $pagination.find(".PagedList-skipToPrevious") : [];
    const $paginationNextBtn = hasPagination ? $pagination.find(".PagedList-skipToNext") : [];
    const morePagesDotsEle = "<li class='more-pages-dots-placeholder'></li>";
    if ($paginationPreBtn.length == 1) {
        $(morePagesDotsEle).insertAfter($paginationPreBtn);
    }
    if ($paginationNextBtn.length == 1) {
        $(morePagesDotsEle).insertBefore($paginationNextBtn);
    }
}