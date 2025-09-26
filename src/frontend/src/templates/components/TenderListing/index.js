$(document).ready(function () {
    // Tender timeline slide init
    const $TenderTimeline = $(".TenderTimeline .milestones-wrapper");
    const $loadmoreBtn = $(".TenderListing-inner .loadmore");

    $TenderTimeline.on("init", function (event, slick) {
        slick.$prevArrow.css("display", "none");
        slick.$nextArrow.css("display", "inline-flex");
    });
    
    const $TenderDetails_Timeline = $(".TenderTimeline.tender-details-page .milestones-wrapper");
    $TenderDetails_Timeline.not(".slick-initialized").slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 6,
        adaptiveHeight: true,
        slidesToScroll: 1,
        prevArrow: '<button class="icon icon-chevron slick-prev" title="Previous"></button>',
        nextArrow: '<button class="icon icon-chevron slick-next" title="Next"></button>',
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1.3,
                },
            },
        ],
    });

    const $TenderListing_Timeline = $(".TenderDetailsTile .TenderTimeline .milestones-wrapper");
    $TenderListing_Timeline.each(function() {
        $(this)
            .not(".slick-initialized")
            .slick({
                dots: false,
                infinite: false,
                speed: 300,
                slidesToShow: 4,
                adaptiveHeight: true,
                slidesToScroll: 1,
                prevArrow: '<button class="icon icon-chevron slick-prev" title="Previous"></button>',
                nextArrow: '<button class="icon icon-chevron slick-next" title="Next"></button>',
                responsive: [
                    {
                        breakpoint: 1280,
                        settings: {
                            slidesToShow: 4,
                        },
                    },
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                        },
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1.3,
                        },
                    },
                ],
            });
    })

    // move pre button to be below the slides
    $TenderTimeline.on("afterChange", function (event, slick, currentSlide) {
        if (slick.$nextArrow.hasClass("slick-disabled")) {
            slick.$nextArrow.css("display", "none");
        } else {
            slick.$nextArrow.css("display", "inline-flex");
        }
        if (!slick.$prevArrow.hasClass("slick-disabled")) {
            slick.$prevArrow.css("display", "inline-flex");
        } else {
            slick.$prevArrow.css("display", "none");
        }
    });

    // To fix tender status tag alignement issue on iOS devices
    const $TenderStatusText = $(".tender-status-tag .tender-status-text, .TenderCTA .tender-cta-text");
    function isIOS() {
        return /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && !window.MSStream;
    }

    if (isIOS()) {
        $TenderStatusText.css("margin-top", "5px");
    } 

	$loadmoreBtn.on("click", function () {
		var tenderstatus = $('.TagTabs .tag-tab input[name="tenderstatus"]:checked').map(function() {
			return this.value;
		}).get().join('|');

		var scheme = $('.Filters input[name="scheme"]:checked').map(function() {
			return this.value;
		}).get().join('|');	

		var juristiction = $('.Filters input[name="juristiction"]:checked').map(function() {
			return this.value;
		}).get().join('|');	

		var tendertype = $('.Filters input[name="tendertype"]:checked').map(function() {
			return this.value;
		}).get().join('|');	
		
		var pagenum = $('.TenderListing').data('pagenum');
		var ajaxEndpointUrl = $('.TenderListing').data('loadmore-url');	
		ajaxEndpointUrl = ajaxEndpointUrl + '?pageNumber='+ pagenum +'&tenderstatus='+ tenderstatus +'&scheme='+ scheme +'&juristiction='+ juristiction +'&tendertype='+ tendertype;
		
		$.ajax({
			type: "get",
			url: ajaxEndpointUrl,
			dataType: "json",
		}).done(function(data) {
			
			// Increment page number
			$('.TenderListing').data('pagenum', $('.TenderListing').data('pagenum') + 1);
			
			for(var i=0; i < data.tenderItems.length; i++) {
				var clonedItem = $('.TenderListing').find('.TenderDetailsTile-template').clone();
				clonedItem.removeClass('TenderDetailsTile-template');
				clonedItem.addClass('TenderDetailsTile');
				
				var item = data.tenderItems[i];
				
				// Tender Details
				clonedItem.addClass(item.Scheme.CssClass);
				if(item.SchemeTenderRoundTitle != '' || item.SchemeTenderRoundTitle != '') {
					clonedItem.find('.tender-type').text(item.SchemeTenderRoundTitle);
				}
				
				clonedItem.find('.tender-status-dot').addClass(item.StatusClass);
				clonedItem.find('.tender-status-text').text(item.StatusClass);
				
				if(item.Title != '') {
					clonedItem.find('.infrastructure-type').text(item.Title);
				}
				else {
					clonedItem.find('.infrastructure-type').remove();
				}
				
				if (item.TimelineSummary != '' && item.TimelineItems != undefined && item.TimelineItems.length == 0) {
					clonedItem.find('.tender-blur').html('<p>'+ item.TimelineSummary +'</p>');
				}
				else {
					clonedItem.find('.tender-blur').remove();
				}
				
				// Timeline
				if (item.TimelineItems != undefined && item.TimelineItems.length > 0) {
					for(var j=0; j < item.TimelineItems.length; j++) {
						var clonedMilestone = $('.TenderListing').find('.milestone-item-template').clone();
						clonedMilestone.removeClass('milestone-item-template');
						clonedMilestone.addClass('milestone-item');
						clonedMilestone.attr('style', 'width: 100%; display: inline-block;');
						
						var timelineItem = item.TimelineItems[j];
						if (timelineItem.CssClass != undefined && timelineItem.CssClass != '')
							clonedMilestone.addClass(timelineItem.CssClass);
						if (timelineItem.IsPastClass != undefined && timelineItem.IsPastClass != '')
							clonedMilestone.addClass(timelineItem.IsPastClass);
						if (timelineItem.DateLabel != undefined && timelineItem.DateLabel != '')
							clonedMilestone.find('.date').text(timelineItem.DateLabel);
						if (timelineItem.Title != undefined && timelineItem.Title != '')
							clonedMilestone.find('.title').text(timelineItem.Title);
						
						clonedItem.find('.milestones-wrapper').append(clonedMilestone);
					}
				}
				else {
					clonedItem.find('.TenderTimeline').remove();
				}
				
				// Scheme & Juristiction
				if (item.Scheme.Title != '' || item.Scheme.IconUrl != '' || item.JuristictionText != '') {
					if (item.Scheme.IconUrl != '') {
						clonedItem.find('.tender-scheme .scheme-logo').attr('style', 'background-image: url(\''+ item.Scheme.IconUrl +'\')');
					}
					var clonedTooltip = $('.TenderListing').find('.Tooltip-template').clone();
					clonedTooltip.removeClass('Tooltip-template');
					clonedTooltip.addClass('Tooltip');					
					var tooltip = '';
					if (item.Scheme.Tooltip != '') {
						clonedTooltip.find('.tooltip-text').html(item.Scheme.Tooltip);
						tooltip = clonedTooltip[0].outerHTML;
					} else {
						tooltip = '';
					}
					if (item.Scheme.Title != '' || item.Scheme.IconUrl != '') {
						clonedItem.find('.tender-scheme .text-medium').html(item.Scheme.Title + tooltip);
					}
					if (item.Juristiction != '') {
						clonedItem.find('.tender-jurisdiction .text-medium').html(item.JuristictionText);
					}					
				}
				
				// Products 
				if (item.ProductItems != undefined && item.ProductItems.length > 0) {
					for(var k=0; k < item.ProductItems.length; k++) {
						var clonedProductItem = $('.TenderListing').find('.product-item-template').clone();
						clonedProductItem.removeClass('product-item-template');
						clonedProductItem.addClass('product-item');		
						
						var product = item.ProductItems[k];
						clonedProductItem.attr('href', product.LinkUrl);
						clonedProductItem.attr('title', product.Title);
						clonedProductItem.find('.product-name').text(product.Title);
						clonedProductItem.find('.product-category').text(product.Category);
						
						clonedItem.find('.product-list').append(clonedProductItem);
					}
				}
				else {
					clonedItem.find('.related-products').remove();
				}
				
				// CTA
				if (item.LinkUrl != '') {
					clonedItem.find('.tender-cta .button').attr('href', item.LinkUrl);
					clonedItem.find('.tender-cta .button').attr('Title', item.LinkText);
					clonedItem.find('.tender-cta .button').html('<span>'+ item.LinkText +'</span><span class="icon icon-arrow"></span>');
				}	
				
				$('.TenderListing').find('.tender-list-wrapper').append(clonedItem);
				
				var $milestonewrapper = clonedItem.find(".milestones-wrapper");
				$milestonewrapper.each(function () {
					$(this).not(".slick-initialized").slick({
						dots: false,
						infinite: false,
						speed: 300,
						slidesToShow: 4,
						adaptiveHeight: true,
						slidesToScroll: 1,
						prevArrow: '<button class="icon icon-chevron slick-prev" title="Previous"></button>',
						nextArrow: '<button class="icon icon-chevron slick-next" title="Next"></button>',
						responsive: [{
							breakpoint: 1280,
							settings: {
								slidesToShow: 4
							}
						}, {
							breakpoint: 1024,
							settings: {
								slidesToShow: 3
							}
						}, {
							breakpoint: 480,
							settings: {
								slidesToShow: 1.3
							}
						}]
					});
				});	
				
				clonedItem.find(".TenderTimeline .milestones-wrapper").each(function (event, slick, currentSlide) {
					var $nextArrow = $(slick)[0].slick.$nextArrow;
					var $prevArrow = $(slick)[0].slick.$prevArrow;
				  
					if ($nextArrow.hasClass("slick-disabled")) {
						$nextArrow.css("display", "none");
					} else {
						$nextArrow.css("display", "inline-flex");
					}

					if (!$prevArrow.hasClass("slick-disabled")) {
						$prevArrow.css("display", "inline-flex");
					} else {
						$prevArrow.css("display", "none");
					}
				});

				clonedItem.find(".Tooltip").each(function() {
					const _this = $(this);
					const $tooltipIcon = _this.find(".icon-help");
					const $tooltipInfo = _this.find(".tooltip-info");
					const $closeBtn = $tooltipInfo.find(".icon-close");
					$tooltipIcon.click(function () {
						$tooltipInfo.addClass("show");
					});
					$tooltipIcon.mouseover(function () {
						$tooltipInfo.addClass("show");
					});
					$closeBtn.click(function () {
						$tooltipInfo.removeClass("show");
					});
				});				
			}
			
			// Is more
			if (!data.isMore) {
				$('.TenderListing-inner .btn-loadmore').remove();
			}
			
			// Redo attachment
			const $TenderTimelineDynamic = $(".TenderTimeline .milestones-wrapper");
			$TenderTimelineDynamic.on("afterChange", function (event, slick, currentSlide) {
				if (slick.$nextArrow.hasClass("slick-disabled")) {
					slick.$nextArrow.css("display", "none");
				} else {
					slick.$nextArrow.css("display", "inline-flex");
				}

				if (!slick.$prevArrow.hasClass("slick-disabled")) {
					slick.$prevArrow.css("display", "inline-flex");
				} else {
					slick.$prevArrow.css("display", "none");
				}
			});			
		});
    });

	// Show/close Tooltip
	const $Tooltip = $(".Tooltip");
	if($Tooltip.length > 0) {
		$Tooltip.each(function() {
			const _this = $(this);
			const $tooltipIcon = _this.find(".icon-help");
            const $tooltipInfo = _this.find(".tooltip-info");
            const $closeBtn = $tooltipInfo.find(".icon-close");
            $tooltipIcon.click(function () {
                $tooltipInfo.addClass("show");
            });
            $tooltipIcon.mouseover(function () {
                $tooltipInfo.addClass("show");
            });
            $closeBtn.click(function () {
                $tooltipInfo.removeClass("show");
            });
		})
	}
});
