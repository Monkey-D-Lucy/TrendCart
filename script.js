(function () {
  function trackEvent(eventName, eventParams) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, eventParams || {});
    }
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var ctaLinks = document.querySelectorAll(".js-cta");
  ctaLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      var ctaName = link.getAttribute("data-cta-name") || "unknown_cta";
      trackEvent("cta_click", {
        cta_name: ctaName,
        page_path: window.location.pathname
      });
    });
  });

  var productButtons = document.querySelectorAll(".js-product-btn");
  productButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var productName = button.getAttribute("data-product-name") || "Unknown Product";
      alert(productName + " selected. We'll share more details soon.");
      trackEvent("product_click", {
        product_name: productName
      });
    });
  });

  var contactForm = document.getElementById("contact-form");
  var feedbackEl = document.getElementById("form-feedback");

  if (contactForm && feedbackEl) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = contactForm.name.value.trim();
      var email = contactForm.email.value.trim();
      var subject = contactForm.subject.value.trim();
      var message = contactForm.message.value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !subject || !message) {
        feedbackEl.textContent = "Please complete all fields before submitting.";
        feedbackEl.className = "form-feedback error";
        return;
      }

      if (!emailPattern.test(email)) {
        feedbackEl.textContent = "Please enter a valid email address.";
        feedbackEl.className = "form-feedback error";
        return;
      }

      feedbackEl.textContent = "Thank you! Your message has been received.";
      feedbackEl.className = "form-feedback success";

      trackEvent("contact_form_submission", {
        form_name: "contact_form",
        contact_subject: subject
      });

      contactForm.reset();
    });
  }
})();
