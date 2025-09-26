$(document).ready(function () {
    const ACTIVE_CLASSNAME = "is-active";

    $(".TabsContent-container").each(function () {
        const $tabContainer = $(this);

        const showTabPanel = (panelId) => {
            const $targetButton = $(`.tabs .tabs-title .tabs-btn[data-tabs-target='${panelId}']`, $tabContainer);
            const $targetPanel = $(`.tabs-content .tabs-panel[data-tabs-panel='${panelId}']`, $tabContainer);

            // if a matching tab is not found, stop.
            if ($targetButton.length === 0) return;

            $(".tabs .tabs-title", $tabContainer).removeClass(ACTIVE_CLASSNAME);
            $(".tabs-content .tabs-panel", $tabContainer).removeClass(ACTIVE_CLASSNAME);

            $targetPanel.addClass(ACTIVE_CLASSNAME);
            $targetButton.parent().addClass(ACTIVE_CLASSNAME);

            // add the hash to the URL (but replace state, so it doesn't effect the back/forward buttons)
            history.replaceState(null, null, `#${panelId}`);

            initFeaturePanelSlide($targetPanel);
        };

        $(".tabs .tabs-title .tabs-btn", $tabContainer).click(function () {
            showTabPanel($(this).data("tabsTarget"));
        });

        // Get the hash from the URL without the # symbol
        const hash = window.location.hash.substring(1);

        // call the function to show the panel. If it doesn't exist, it'll do nothing.
        showTabPanel(hash);
    });
});
