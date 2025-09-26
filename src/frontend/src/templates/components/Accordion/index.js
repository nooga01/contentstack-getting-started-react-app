$(document).ready(function () {
    if ($(".Accordion").length === 0) return;
    $(".Accordion li").find(" > .accordion-content").hide();

    // add triggers to group headers to expand/collapse them
    $(".Accordion .accordion-tab").click(function (e) {
        e.preventDefault();

        let $li = $(this).parent();
        if ($li.hasClass("open")) {
            $li.removeClass("open");
        } else {
            $(".accordion-item.open").children(".accordion-content").slideToggle();
            $(".Accordion ul").find("> li.open").removeClass("open");
            $li.addClass("open");
        }
        $li.find(" > .accordion-content").slideToggle(200, function () {
            let header = $li.find(" > .accordion-tab");
            let panelName = $li.data("panel");

            if (header.attr("aria-expanded") === "false") {
                header.attr("aria-expanded", "true");

                window.history.pushState({}, "", "#" + panelName);
            } else {
                header.attr("aria-expanded", "false");

                if ($(".Accordion").parent(":not(.accordion-inside)").find("> .Accordion > ul > li.open").length) {
                    $(".Accordion")
                        .parent(":not(.accordion-inside)")
                        .find("> .Accordion > ul > li.open")
                        .each(function () {
                            window.history.pushState({}, "", "#" + $(this).data("panel"));
                        });
                } else {
                    window.history.pushState("", document.title, window.location.pathname);
                }
            }
        });
    });

    // scroll to accordion panel on page load
    function urlHashAccordionJump() {
        if (location.hash.length > 0) {
            const urlHash = location.hash;
            const indexOfHash = urlHash.indexOf("#", 1);
            const indexOfQuery = urlHash.indexOf("?", 1);
            let cleanHash,
                t = urlHash;

            indexOfHash > -1 && (t = urlHash.substring(0, indexOfHash));
            indexOfQuery > -1 && (t = urlHash.substring(0, indexOfQuery));
            cleanHash = t.substring(1);

            if (cleanHash) {
                const accordionPanel = $("li[data-panel='" + cleanHash + "']");
                if (!accordionPanel.length) return;

                $(".Accordion li.open").removeClass(".open").children(".accordion-tab").attr("aria-expanded", "false");
                $(".Accordion li").find(" > .accordion-content").hide();

                accordionPanel.children(".accordion-tab").trigger("click");

                if (accordionPanel.parents(".accordion-inside").length) {
                    accordionPanel.parents("li").children(".accordion-tab").trigger("click");
                }

                if (accordionPanel.find(".accordion-inside").length) {
                    accordionPanel.find(".accordion-inside li .accordion-tab").first().trigger("click");
                }

                setTimeout(function () {
                    // scroll to panel
                    $("html, body").animate(
                        {
                            scrollTop: accordionPanel.offset().top,
                        },
                        500
                    );
                }, 750);
            }
        }
    }

    // init url hash jump to accordion
    urlHashAccordionJump();
});
