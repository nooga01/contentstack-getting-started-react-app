$(document).ready(function () {
    // slide init
    $(".ResourceSection-slide")
        .not(".slick-initialized")
        .slick({
            dots: false,
            infinite: false,
            speed: 300,
            slidesToShow: 3.1,
            adaptiveHeight: true,
            slidesToScroll: 1,
            prevArrow: '<button class="icon icon-arrow slick-prev" title="Previous"></button>',
            nextArrow: '<button class="icon icon-arrow slick-next" title="Next"></button>',
            responsive: [
                {
                    breakpoint: 1440,
                    settings: {
                        slidesToShow: 2.9, // breakpoint > 1440 will be 3.1,
                    },
                },
                {
                    breakpoint: 1300,
                    settings: {
                        slidesToShow: 2.9,
                    },
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2.1,
                    },
                },
                {
                    breakpoint: 820,
                    settings: {
                        slidesToShow: 1.9,
                    },
                },
                {
                    breakpoint: 730,
                    settings: {
                        slidesToShow: 1.1,
                    },
                },
                {
                    breakpoint: 680,
                    settings: {
                        slidesToShow: 0.93,
                    },
                },
            ],
        });
        

    // move pre button to be below the slides
    const $ResourceSection = $(".ResourceSection-slide");
    const $slickPrevBtn = $ResourceSection.find(".slick-prev.slick-arrow");
    const $slickNextBtn = $ResourceSection.find(".slick-next.slick-arrow");
    $slickPrevBtn.insertBefore($slickNextBtn);

});

$(window).resize(function () {
    // move pre button to be below the slides
    const $ResourceSection = $(".ResourceSection-slide");
    const $slickPrevBtn = $ResourceSection.find(".slick-prev.slick-arrow");
    const $slickNextBtn = $ResourceSection.find(".slick-next.slick-arrow");
    $slickPrevBtn.insertBefore($slickNextBtn);
});
