# NBIU First Convocation — Student Opinion Survey

Premium responsive HTML/CSS/JS starter website based on the supplied NBIU campus image and emblem.

## Files
- `index.html` — page structure and survey form
- `styles.css` — responsive premium navy / gold theme
- `app.js` — frontend behavior and Supabase configuration placeholders
- `assets/nbiu-campus.jpg` — supplied campus image
- `assets/nbiu-logo.jpg` — supplied university emblem

## Run locally
Open `index.html` in a browser, or use VS Code Live Server.

## Supabase integration (later)
Open `app.js` and fill in:
```js
const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const SUPABASE_TABLE = "convocation_survey_responses";
```
Then load the Supabase JavaScript client and replace the demo submit handler with a database insert.

**Security:** only use the Supabase anon/public key in browser code. Never expose a `service_role` key. Configure Row Level Security (RLS), validate submissions, and decide how to prevent duplicate or abusive responses before launch.

## Notes
- This is a UI starter; it does not save survey responses yet.
- Student ID and program fields are intentionally omitted.
- Name, department, batch, registration status, and venue preference are required.
- Contact and opinion are optional.
- Department options are sample values and should be replaced with NBIU's verified official list.
- The displayed date is currently set to 1 December 2026; confirm the official event year before publishing.
