# StudentOS — RUAS Academic Hub

A mobile-first Progressive Web App for the 3rd-semester RUAS academic workflow.

## Included
- CSE Sections A–F
- AIML Sections A–C
- ISE Sections A–C
- Smart day/week timetable
- Live/next/completed class states
- Break and free-window awareness
- Personal attendance: Present / Absent / Not Recorded
- 75% attendance intelligence
- Assignment/task tracker
- Exam/event tracker
- Local academic assistant
- Profile + section personalization
- Dark mode
- Installable PWA / offline shell
- No individual faculty names in the public data model

## Data source
The section list and timetable content are based on the supplied **3rd Semester Time Table 2026-27** PDF. The PDF contains 12 pages and the public app intentionally omits faculty names.

## Important
Attendance is a **personal tracker**, not official college attendance. If a student does not record a class, it remains **Not Recorded**.

## Run locally
Open `index.html` through a local web server so the service worker can register, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Future backend
The UI is deliberately backend-ready. A production version can connect Supabase/Auth/Postgres for real student accounts, RLS, shared admin data, push notifications and verified attendance imports.
