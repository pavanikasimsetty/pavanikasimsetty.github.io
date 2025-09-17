document.addEventListener("DOMContentLoaded", function() {
  "use strict";

  const form = document.querySelector(".php-email-form");

  if (!form) return;

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const loading = form.querySelector(".loading");
    const sent = form.querySelector(".sent-message");
    const error = form.querySelector(".error-message");

    // Reset messages
    loading.style.display = "none";
    sent.style.display = "none";
    error.style.display = "none";

    // Form validation
    let ferror = false;

    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach(input => {
      const rule = input.getAttribute("data-rule");
      if (!rule) return;

      let ierror = false;
      let exp = null;
      let pos = rule.indexOf(":");
      let ruleName = rule;

      if (pos >= 0) {
        exp = rule.substr(pos + 1);
        ruleName = rule.substr(0, pos);
      }

      switch (ruleName) {
        case "required":
          if (input.value.trim() === "") ierror = true;
          break;
        case "minlen":
          if (input.value.trim().length < parseInt(exp)) ierror = true;
          break;
        case "email":
          const emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;
          if (!emailExp.test(input.value.trim())) ierror = true;
          break;
      }

      // Show error message
      const msg = input.getAttribute("data-msg") || "Invalid input";
      const validateEl = input.nextElementSibling;
      if (ierror) {
        ferror = true;
        if (validateEl) validateEl.innerHTML = msg;
      } else {
        if (validateEl) validateEl.innerHTML = "";
      }
    });

    if (ferror) return;

    // Show loading
    loading.style.display = "block";

    // Submit using fetch
    const formData = new FormData(form);

    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: { "Accept": "application/json" }
    })
      .then(response => {
        loading.style.display = "none";
        if (response.ok) {
          sent.style.display = "block";
          form.reset();
        } else {
          response.json().then(data => {
            error.textContent = data.error || "Oops! There was a problem.";
            error.style.display = "block";
          });
        }
      })
      .catch(() => {
        loading.style.display = "none";
        error.textContent = "Oops! There was a problem.";
        error.style.display = "block";
      });
  });
});
