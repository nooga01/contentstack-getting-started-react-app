function toggleButtonAriaExpandedAndLabel(elem, expanded) {
    let currentAriaLabel = elem.attr("aria-label");
    elem.attr("aria-expanded", expanded ? "true" : "false");
    elem.attr("aria-label", expanded ? currentAriaLabel.replace("Open", "Close") : currentAriaLabel.replace("Close", "Open"));
}

const openSidePanel = (id) => {
    closeSidePanels();
    let elem = $(`#${id}.SidePanel`);
    if (!elem.length) return;

    $("body").addClass("SidePanel-Open");
    elem.addClass("open");
    enableSidePanel(elem);
    if (elem.attr("id") === "SideMenu") {
        toggleButtonAriaExpandedAndLabel($("header .btn-mobile-menu"), true);
    }
};

const closeSidePanels = (id) => {
    if (id) {
        // close specific panel
        let elem = $(`#${id}.SidePanel`);
        if (!elem.length) return;

        $(elem).removeClass("open");
        disableSidePanel(elem);
    } else {
        // close them all
        $(`.SidePanel`).removeClass("open");
        disableSidePanel($(".SidePanel"));
    }
    toggleButtonAriaExpandedAndLabel($("header .btn-mobile-menu"), false);
    $("body").removeClass("SidePanel-Open");
};

const disableSidePanel = (elem) => {
    elem.attr("aria-hidden", true);
    $("a, button", elem).attr("tabindex", -1).attr("aria-hidden", true).attr("aria-disabled", true);
    unTrapFocus($(".SidePanel-Container", elem));
};
const enableSidePanel = (elem) => {
    elem.attr("aria-hidden", false);
    $("a, button", elem).each(function () {
        $(this).removeAttr("tabindex").removeAttr("aria-hidden").removeAttr("aria-disabled").attr("tabindex", $(this).attr("tabindex-orig"));
    });
    trapFocus($(".SidePanel-Container", elem));
};

const toggleMobileSubmenu = (e) => {
    // $(this) is not working, using $(e.target) instead
    let currentSubmenu;
    if ($(e.target)[0].className.includes("icon") | $(e.target)[0].className.includes("primary-nav-item-title")) {
        currentSubmenu = $(e.target).parent().siblings(".SubMenu")
    } else if ($(e.target)[0].className.includes("primary-nav-item")) {
        currentSubmenu = $(e.target).siblings(".SubMenu");
    }
    
    currentSubmenu.toggleClass("open");
    
    const currentExpandBtn = ($(e.target)[0].className.includes("icon") | $(e.target)[0].className.includes("primary-nav-item-title")) ? $(e.target).parent() : $(e.target);
    currentSubmenu.hasClass("open") ? currentExpandBtn.attr("aria-expanded", "true") : currentExpandBtn.attr("aria-expanded", "false");
};

$(document).keyup(function (e) {
    if (e.key === "Escape") {
        closeSidePanels();
    }
});

// attach a click listener to ANYTHING which has a "data-side-panel-id" attribute;
$("[data-side-panel-id]").click(function () {
    let panelId = $(this).attr("data-side-panel-id");
    openSidePanel(panelId);
});

$(document).ready(() => {
    setTimeout(() => {
        // delayed to ensure ALL other JS scripts which might create SidePanels would've added them to the DOM.
        $(".SidePanel .SidePanel-Header .btn-close, .SidePanel .SidePanel-Header .SidePanel-Title, .SidePanel .SidePanel-Blocker").click(function () {
            closeSidePanels();
        });

        $(".SidePanel button, .SidePanel a").each(function () {
            $(this).attr("tabindex-orig", $(this).attr("tabindex"));
        });
        disableSidePanel($(".SidePanel"));
    }, 10);

    $(".SidePanel .primary-nav-item, footer .primary-nav-item").click((e) => {
        console.log("clicked...")
        toggleMobileSubmenu(e);
    });

    $(".SidePanel .primary-nav-item").keydown((e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            toggleMobileSubmenu(e);
        }
    });
});
