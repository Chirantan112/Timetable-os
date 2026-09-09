# StudentOS — RUAS Academic Hub

A mobile-first academic companion for the RUAS 3rd-semester timetable.

## Current scope
- CSE A–F, AIML A–C, ISE A–C section selection
- Exact period-based timetable model
- **Period 1:** 8:15–9:05 AM
- **Period 2:** 9:05–9:55 AM
- **Period 3:** 9:55–10:45 AM
- **Tea Break:** 10:45–11:15 AM
- **Period 4:** 11:15 AM–12:05 PM
- **Period 5:** 12:05–12:55 PM
- **Period 6:** 12:55–1:45 PM
- **Lunch Break:** 1:45–2:30 PM
- **Period 7:** 2:30–3:20 PM
- **Period 8:** 3:20–4:10 PM
- **Period 9:** 4:10–5:00 PM
- Live / next / completed class states
- Room and lab-batch information
- Contact Hour indicators from the timetable source
- Personal attendance: Present / Absent / Not Recorded
- 75% attendance intelligence
- Assignment/task tracker
- **Internal Assessment 1**
- **Internal Assessment 2**
- **SEE (Semester End Examination)**
- Profile and personalization
- Dark mode and installable PWA shell

## Academic assessment model
The app treats the semester assessment structure as three separate events: **IA-1, IA-2 and SEE**. Exact examination dates should only be added when the official academic/examination calendar provides them; they are not guessed from the timetable.

## Source
Timetable content is based on the supplied **3rd Semester Time Table 2026-27** PDF. The PDF contains 12 timetable pages. fileciteturn31file0L2-L13

## Attendance note
Attendance is a personal tracker. Unrecorded sessions remain **Not Recorded** and are never silently counted as Present.

## Run locally
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Future backend
A production version can connect Supabase/Auth/Postgres for real student accounts, RLS, shared admin data, push notifications and verified attendance imports.
