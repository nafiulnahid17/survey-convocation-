NBIU CONVOCATION SURVEY — PRODUCTION PATCH

COMPATIBILITY: This is a standalone static HTML/CSS/JS replacement. Since the original repository source was not provided, the installer backs up and replaces root index.html, styles.css, app.js and config.js. Do not use it unchanged for React/Vite/Next.js or another build system; integrate its UI and logic into your app instead.

INSTALL
1. Extract ZIP into a NEW folder.
2. Run apply_patch.bat and enter the full path to the EXISTING static website root (the folder containing index.html).
3. Check the path and type YES to confirm. A timestamped backup is created first.
4. Edit config.js in the target folder with your Supabase project URL and public anon/publishable key. Never use service_role/secret keys in browser code.
5. Run supabase-schema.sql in Supabase SQL Editor; confirm table is named convocation_survey.
6. Deploy the website, then submit test responses and confirm rows in Supabase Table Editor.

FEATURES: premium responsive design; Home/About/Contact; 3 venue options; “Others” opens a required suggested_venue field; opinion_suggestions remains separate and optional; validation; actual Supabase insert; success/error states; no preview-only success claim; student-forum disclaimer.

IMPORTANT: Department choices are starter placeholders; replace them with the correct current list. Campus/venue imagery uses remote Unsplash URLs and needs review/replacement with approved assets for dependable production. The SQL allows public INSERT only, not public reads. Admin dashboard needs Supabase Auth and an admin-only SELECT policy; this patch does not connect the separate admin panel. No live integration can be confirmed until your real Supabase URL/key and project schema are configured.

CHECKLIST: test all 3 venue options; verify Others requires location; verify opinion field is separate; test invalid email/phone; verify actual row in Supabase; confirm RLS; verify admin data access is private; review privacy/data-retention approach.
