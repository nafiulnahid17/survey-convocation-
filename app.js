
(() => {
  "use strict";

  const config = window.NBIU_SURVEY_CONFIG || {};

  const SUPABASE_URL =
    config.SUPABASE_URL ||
    "https://pkbbqmpxooepcnocyzou.supabase.co";

  const SUPABASE_ANON_KEY =
    config.SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYmJxbXB4b29lcGNub2N5em91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MjAwNTksImV4cCI6MjEwODQ5NjA1OX0.4EAqc0xoXxwFpBfbP5NT579g2YyiPfx15r9f7oaiTGM";

  const TABLE_NAME = config.TABLE_NAME || "convocation_survey";

  const form = document.querySelector("#survey-form");

  if (!form) {
    console.error(
      "Survey form not found. Expected an element with id='survey-form'."
    );
    return;
  }

  const suggestedWrap = document.querySelector("#suggested-wrap");
  const suggestedVenue = document.querySelector("#suggested_venue");
  const contactType = document.querySelector("#contact_type");
  const contactValue = document.querySelector("#contact_value");
  const opinion = document.querySelector("#opinion_suggestions");
  const count = document.querySelector("#count");
  const status = document.querySelector("#status");
  const submitBtn = document.querySelector("#submit-btn");
  const success = document.querySelector("#success");
  const backBtn = document.querySelector("#back");

  function showStatus(message, type = "error") {
    if (!status) {
      alert(message);
      return;
    }

    status.textContent = message;
    status.dataset.type = type;
    status.hidden = false;
  }

  function hideStatus() {
    if (!status) return;

    status.textContent = "";
    status.hidden = true;
  }

  function getSelectedVenue() {
    const selected = form.querySelector(
      'input[name="preferred_venue"]:checked'
    );

    return selected ? selected.value.trim() : "";
  }

  function updateSuggestionVisibility() {
    const venue = getSelectedVenue();
    const needsSuggestion = venue.toLowerCase() === "others";

    if (suggestedWrap) {
      suggestedWrap.hidden = !needsSuggestion;
    }

    if (suggestedVenue) {
      suggestedVenue.required = needsSuggestion;
    }
  }

  function updateOpinionCount() {
    if (count && opinion) {
      count.textContent = String(opinion.value.length);
    }
  }

  function validateContact() {
    if (!contactType || !contactValue) return true;

    const value = contactValue.value.trim();

    // Contact information is optional.
    if (!value) return true;

    if (contactType.value === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(value)) {
        showStatus("Please enter a valid email address.");
        contactValue.focus();
        return false;
      }
    }

    if (contactType.value === "phone") {
      const digits = value.replace(/\D/g, "");

      if (digits.length < 7 || digits.length > 15) {
        showStatus("Please enter a valid phone number.");
        contactValue.focus();
        return false;
      }
    }

    return true;
  }

  function getFormPayload() {
    const data = new FormData(form);
    const venue = getSelectedVenue();

    return {
      full_name: String(data.get("full_name") || "").trim(),
      department: String(data.get("department") || "").trim(),
      batch: String(data.get("batch") || "").trim(),

      contact_type: contactType
        ? contactType.value
        : "",

      contact_value: contactValue
        ? contactValue.value.trim()
        : "",

      registration_status: String(
        data.get("registration_status") || ""
      ).trim(),

      preferred_venue: venue,

      suggested_venue:
        venue.toLowerCase() === "others" && suggestedVenue
          ? suggestedVenue.value.trim()
          : null,

      opinion_suggestions: opinion
        ? opinion.value.trim()
        : ""
    };
  }

  async function submitToSupabase(payload) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error(
        "Supabase settings are missing. Please check config.js."
      );
    }

    const baseUrl = SUPABASE_URL.replace(/\/+$/, "");
    const endpoint =
      `${baseUrl}/rest/v1/${encodeURIComponent(TABLE_NAME)}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");

      console.error(
        "Supabase submission error:",
        response.status,
        details
      );

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Supabase denied the submission. Please check your database permissions and Row Level Security policy."
        );
      }

      if (response.status === 404 || response.status === 400) {
        throw new Error(
          "The database table or its columns may not match the website. Check the table name and database schema."
        );
      }

      throw new Error(
        "Your response could not be submitted. Please try again."
      );
    }
  }

  // Show or hide the suggested venue field.
  form
    .querySelectorAll('input[name="preferred_venue"]')
    .forEach((input) => {
      input.addEventListener(
        "change",
        updateSuggestionVisibility
      );
    });

  // Character counter for the optional suggestions field.
  if (opinion) {
    opinion.addEventListener("input", updateOpinionCount);
  }

  // Contact type selector.
  if (contactType && contactValue) {
    contactType.addEventListener("change", () => {
      if (contactType.value === "email") {
        contactValue.type = "email";
        contactValue.placeholder = "Enter your email address";
      } else {
        contactValue.type = "tel";
        contactValue.placeholder = "Enter your phone number";
      }
    });
  }

  // Return from the success screen, if the HTML includes a Back button.
  if (backBtn && success) {
    backBtn.addEventListener("click", () => {
      success.hidden = true;
      form.hidden = false;
      hideStatus();
    });
  }

  // Submit survey.
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideStatus();
    updateSuggestionVisibility();

    if (!form.reportValidity()) return;
    if (!validateContact()) return;

    const payload = getFormPayload();

    if (
      !payload.full_name ||
      !payload.department ||
      !payload.batch ||
      !payload.registration_status ||
      !payload.preferred_venue
    ) {
      showStatus("Please complete all required fields.");
      return;
    }

    if (
      payload.preferred_venue.toLowerCase() === "others" &&
      !payload.suggested_venue
    ) {
      showStatus("Please enter your suggested venue.");

      if (suggestedVenue) {
        suggestedVenue.focus();
      }

      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
    }

    try {
      await submitToSupabase(payload);

      form.reset();
      updateSuggestionVisibility();
      updateOpinionCount();

      if (success) {
        form.hidden = true;
        success.hidden = false;
      } else {
        showStatus(
          "Your response was submitted successfully. Thank you!",
          "success"
        );
      }
    } catch (error) {
      console.error(error);

      showStatus(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Survey";
      }
    }
  });

  updateSuggestionVisibility();
  updateOpinionCount();
})();
