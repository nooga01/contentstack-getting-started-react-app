$(document).ready(()=> {
    // Contact form
    const $contactForm = $(".custom-form");
    if($contactForm.length > 0) {
       $contactForm.wrap('<div class="ContactForm content-wrapper"></div>').wrap('<div class="grid-container"></div>').wrap('<div class="ContactForm-inner"></div>'); 
    }
})

