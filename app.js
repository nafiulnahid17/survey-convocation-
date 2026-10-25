/*
 * NBIU Convocation Survey — Supabase integration placeholder
 *
 * Later setup:
 * 1. Create a Supabase project.
 * 2. Add your project URL and anon/public key below (never put a service_role key in frontend code).
 * 3. Create a `convocation_survey_responses` table with suitable Row Level Security policies.
 * 4. Add the Supabase JS client and replace the demo submit handler with an insert.
 *
 * Example path/config:
 *   const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
 *   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
 *   const SUPABASE_TABLE = "convocation_survey_responses";
 *
 * No data is sent or stored by this starter version.
 */

const SUPABASE_URL = "https://pkbbqmpxooepcnocyzou.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYmJxbXB4b29lcGNub2N5em91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MjAwNTksImV4cCI6MjEwODQ5NjA1OX0.4EAqc0xoXxwFpBfbP5NT579g2YyiPfx15r9f7oaiTGM";
const SUPABASE_TABLE = "survey_responses";

const form = document.getElementById("surveyForm");
const contactValue = document.getElementById("contactValue");
const formMessage = document.getElementById("formMessage");
const contactTypeInputs = document.querySelectorAll('input[name="contactType"]');

function updateContactInput() {
  const selected = document.querySelector('input[name="contactType"]:checked')?.value || "phone";
  contactValue.type = selected === "email" ? "email" : "tel";
  contactValue.placeholder = selected === "email" ? "Enter your email address" : "Enter your mobile number";
  contactValue.autocomplete = selected === "email" ? "email" : "tel";
}
contactTypeInputs.forEach(input => input.addEventListener("change", updateContactInput));
updateContactInput();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  // Frontend preview only: Supabase is intentionally not connected yet.
  const selectedVenue = form.querySelector('input[name="venuePreference"]:checked')?.value;
  if (!selectedVenue) {
    formMessage.textContent = "Please select your preferred venue.";
    return;
  }
  formMessage.textContent = "Preview only — your response has not been saved. Supabase integration will be connected later.";
  formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// Future integration sketch (after installing @supabase/supabase-js):
// const { createClient } = supabase;
// const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// const payload = { full_name, department, batch, contact_type, contact_value,
//                   registration_status, venue_preference, opinion };
// await supabaseClient.from(SUPABASE_TABLE).insert(payload);
