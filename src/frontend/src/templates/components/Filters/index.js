$(document).ready(function () {
    if ($(".Filters").length === 0) return;
    const $openFilterBtn = $(".Filters .btn-open-filter");
    const $filtersInner = $(".Filters .Filters-inner");
    const $closeFilterBtn = $(".Filters .btn-close-filter");
    const $categoryHeader = $(".Filters .category-wrapper .field-label");
    const $clearFilterBtn = $(".Filters .clear-filter");
    const $applyFilterBtn = $(".Filters .apply-filter");
    const $tagTabs = $('.TagTabs .tag-tab');
    const $sortBy = $('.resource-cards-section select');

    // Filters open/close
    $openFilterBtn.on("click", function () {
        if ($filtersInner) $filtersInner.addClass("show-on-mobile");
        $("body").addClass("filter-open");
    });
    $closeFilterBtn.on("click", function () {
        if ($filtersInner) $filtersInner.removeClass("show-on-mobile");
        $("body").removeClass("filter-open");
    });
    if ($(window).width() >= 999 && $filtersInner && $filtersInner.hasClass("show-on-mobile")) {
        $filtersInner.removeClass("show-on-mobile");
        $("body").removeClass("filter-open");
    }

    // Filters accordion
    $categoryHeader.each(function () {
        const _this = $(this);
        const $categoryWrapper = _this.parent(".category-wrapper");
        const $categoryOptions = _this.siblings(".category-options");

        _this.on("click", function (e) {
            e.preventDefault();
            $categoryOptions.slideToggle(200, function () {
                $categoryWrapper.toggleClass("open");
            });
        });
    });

    // Clear Filters
    $clearFilterBtn.on("click", function () {       
        // Clear radio
        $('.TagTabs .tag-tab input[name="tenderstatus"]:first').prop('checked', true);
        $('.TagTabs .tag-tab input[name="audience"]:first').prop('checked', true);
        $('.TagTabs .tag-tab input[name="mediacategory"]:first').prop('checked', true);
        
        // Clear Select
        $('.resource-cards-section select option:first').prop('selected', true);
        
        // Clear Checkbox
        $('.Filters :checkbox').prop('checked', false);
          
        var filters = {}; // Get URL

        var url = getUrl(filters);
        location.href = url;
    });

    // Apply Filters
    $applyFilterBtn.on("click", function () {   
        var filters = {
            tenderstatus: getFilterValues('.TagTabs .tag-tab input[name="tenderstatus"]'),
            audience: getFilterValues('.TagTabs .tag-tab input[name="audience"]'),
            mediacategory: getFilterValues('.TagTabs .tag-tab input[name="mediacategory"]'),
            juristiction: getFilterValues('.Filters input[name="juristiction"]'),
            tendertype: getFilterValues('.Filters input[name="tendertype"]'),
            scheme: getFilterValues('.Filters input[name="scheme"]'),
            tenderround: getFilterValues('.Filters input[name="tenderround"]'),
            resourcetype: getFilterValues('.Filters input[name="resourcetype"]'),
            location: getFilterValues('.Filters input[name="location"]'),
            division: getFilterValues('.Filters input[name="division"]'),
            rolestatus: getFilterValues('.Filters input[name="rolestatus"]'),
            sort: $('.resource-cards-section select').val()
        };

        // Get URL
        var url = getUrl(filters);
        location.href = url;
    });

    // Tag Tabs
    $tagTabs.on("click", function () {
        // Tender Status, Audience, Media Category
        let tenderstatus = '';
        let audience = '';
        let mediacategory = '';
        if ($(this).find("input")[0] != undefined){
            if ($(this).find("input")[0].name != undefined && $(this).find("input")[0].name === 'tenderstatus')
                tenderstatus = $(this).find("input")[0].value;
            
            if ($(this).find("input")[0].name != undefined && $(this).find("input")[0].name === 'audience')
                audience = $(this).find("input")[0].value;

            if ($(this).find("input")[0].name != undefined && $(this).find("input")[0].name === 'mediacategory')
                mediacategory = $(this).find("input")[0].value;     
        }
        
        var filters = {};
        if ((tenderstatus === undefined || tenderstatus === '') && (audience === undefined || audience === '') && (mediacategory === undefined || mediacategory === '')) {
            // Clear Select
            $('.resource-cards-section select option:first').prop('selected', true);

            // Clear Checkbox
            $('.Filters :checkbox').prop('checked', false);

            filters = {};
        }
        else {
            filters = {
                tenderstatus: tenderstatus,
                audience: audience,
                mediacategory: mediacategory,
                juristiction: getFilterValues('.Filters input[name="juristiction"]'),
                tendertype: getFilterValues('.Filters input[name="tendertype"]'),
                scheme: getFilterValues('.Filters input[name="scheme"]'),
                tenderround: getFilterValues('.Filters input[name="tenderround"]'),
                resourcetype: getFilterValues('.Filters input[name="resourcetype"]'),
                location: getFilterValues('.Filters input[name="location"]'),
                division: getFilterValues('.Filters input[name="division"]'),
                rolestatus: getFilterValues('.Filters input[name="rolestatus"]'),
                sort: $('.resource-cards-section select').val()
            };
        }

        // Get URL
        var url = getUrl(filters);
        location.href = url;
    });

    // Sort By
    $sortBy.on("change", function () {
        // Sort By
        let sort = "";
        sort = this.value;

        var filters = {
            tenderstatus: getFilterValues('.TagTabs .tag-tab input[name="tenderstatus"]'),
            audience: getFilterValues('.TagTabs .tag-tab input[name="audience"]'),
            mediacategory: getFilterValues('.TagTabs .tag-tab input[name="mediacategory"]'),
            juristiction: getFilterValues('.Filters input[name="juristiction"]'),
            tendertype: getFilterValues('.Filters input[name="tendertype"]'),
            scheme: getFilterValues('.Filters input[name="scheme"]'),
            tenderround: getFilterValues('.Filters input[name="tenderround"]'),
            resourcetype: getFilterValues('.Filters input[name="resourcetype"]'),
            location: getFilterValues('.Filters input[name="location"]'),
            division: getFilterValues('.Filters input[name="division"]'),
            rolestatus: getFilterValues('.Filters input[name="rolestatus"]'),
            sort: sort
        };

        // Get URL
        var url = getUrl(filters);
        location.href = url;
    }); 

    function getFilterValues(selector) {
        return $(selector + ':checked').map(function() {
            return this.value;
        }).get().join('|');
    }

    function getUrl(filters) {
        var url = '?filters=on';
        for (var key in filters) {
            if (filters[key] !== undefined && filters[key] !== '') {
                url += '&'+ key +'='+ filters[key]; 
            }
        }
        url += '#filters';  
        return url;
    }
});
