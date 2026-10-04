(function () {
  var toastTimeout;

  function trackEvent(eventName, eventParams) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, eventParams || {});
    }
  }

  function showToast(message) {
    var toast = document.getElementById("site-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "site-toast";
      toast.className = "toast";
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
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

  var navToggles = document.querySelectorAll(".nav-toggle");
  navToggles.forEach(function (toggle) {
    var navWrap = toggle.closest(".nav-wrap");
    var navLinks = navWrap ? navWrap.querySelector(".nav-links") : null;
    if (!navLinks) {
      return;
    }

    toggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (navLink) {
      navLink.addEventListener("click", function () {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  });

  var productButtons = document.querySelectorAll(".js-product-btn");
  productButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var productName = button.getAttribute("data-product-name") || "Unknown Product";
      showToast(productName + " selected. We'll share more details soon.");
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
