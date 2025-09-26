$(document).ready(function () {
    initFeaturePanelSlide();    // will initialise all visible feature panels on the page
});

function initFeaturePanelSlide(tabPanel) {
    let $targetFeaturePanelSlide = tabPanel ? $(".FeaturePanel-slide", tabPanel) : $(".FeaturePanel-slide");
    $targetFeaturePanelSlide.each(function() {
        const ele = $(this);

        // if the element is already initialized, do not re-initialize, just skip forEach loop item
        // if ($(ele).hasClass("slick-initialized")) return;

        // if the element is not visible, do not initialize (inside a tab? - which is done by the showTabPanel function in src\templates\components\FeatureTab\index.js)
        if (!$(ele).is(":visible")) return;

        let FeaturePanel_itemNum = $(ele).parent().parent().parent().data("item-num");
        if (FeaturePanel_itemNum < 2) {
            FeaturePanel_itemNum = 2;
        }

        if ($(ele).hasClass('slick-initialized')) {
            $(ele).slick('unslick');
        }
        // slide init
        $(ele)
            .slick({
                dots: false,
                infinite: false,
                speed: 300,
                slidesToShow: FeaturePanel_itemNum <= 4 ? FeaturePanel_itemNum : 4.1,
                adaptiveHeight: true,
                slidesToScroll: 1,
                prevArrow: FeaturePanel_itemNum < 2 ? "" : '<button class="icon icon-arrow slick-prev" title="Previous"></button>',
                nextArrow: FeaturePanel_itemNum < 2 ? "" : '<button class="icon icon-arrow slick-next" title="Next"></button>',
                responsive: [
                    {
                        breakpoint: 1280,
                        settings: {
                            slidesToShow: FeaturePanel_itemNum <= 3 ? FeaturePanel_itemNum : 3.2,
                            prevArrow: FeaturePanel_itemNum < 4 ? "" : '<button class="icon icon-arrow slick-prev" title="Previous"></button>',
                            nextArrow: FeaturePanel_itemNum < 4 ? "" : '<button class="icon icon-arrow slick-next" title="Next"></button>',
                        },
                    },
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: FeaturePanel_itemNum <= 2 ? FeaturePanel_itemNum : 2.2,
                            prevArrow: FeaturePanel_itemNum < 3 ? "" : '<button class="icon icon-arrow slick-prev" title="Previous"></button>',
                            nextArrow: FeaturePanel_itemNum < 3 ? "" : '<button class="icon icon-arrow slick-next" title="Next"></button>',
                        },
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1.2,
                        },
                    },
                ],
            })

        // move pre button to below the slides
        const $slickPrevBtn = $(ele).find(".slick-prev.slick-arrow");
        const $slickNextBtn = $(ele).find(".slick-next.slick-arrow");
        let isPrevBtnBeforeNextBtn = true;
        if ($slickPrevBtn.get(0) && $slickNextBtn.get(0)) {
            isPrevBtnBeforeNextBtn = $($slickPrevBtn.get(0).nextSibling).get(0).className.indexOf("slick-prev") > 0;
        }
        if (!isPrevBtnBeforeNextBtn) $slickPrevBtn.insertBefore($slickNextBtn);
    })

    // Refesh Timeline elements in Feature Panel
    tabPanel.find(".TenderTimeline.tender-details-page .milestones-wrapper").each(function (event, slick, currentSlide) {
        $(slick).slick('refresh');
    });
}
