$(document).ready(() => {
    // Mailchimp form
    const formFields = $("#mc_embed_signup input:not(.button)");
    const requiredFields = $("#mc_embed_signup input.required");
    const selectField = $("#mc_embed_signup select");

    formFields.each(function () {
        $(this).attr("autocomplete", "off");
        const $formFieldLabel = $(this).siblings("label");
        
        if ($formFieldLabel[0]) {
            const placeholder = $formFieldLabel[0].firstChild.data;
            $(this).attr("placeholder", placeholder);
        }
    });
    requiredFields.each(function () {
        $(this).after("<span class='icon icon-required'></span>");
    });
    selectField.parent(".mc-field-group").addClass("select-field");
    selectField.siblings("label").addClass("about-us-select-label");
    selectField.on("change", (e)=>{
        if (e.target.value.length === 0) {
            selectField.siblings("label").attr("style", "display:inline-block");
        } else {
            selectField.siblings("label").attr("style", "display:none");
        }
    })

    $("#mc-embedded-subscribe").on("click", (event) => {
    });

    $("#mc_embed_signup input.required").on("blur", (event) => {
        if (event.target.value) {
            event.target.classList.remove("error");
        }
    });
    // Mailchimp form -- End
});
