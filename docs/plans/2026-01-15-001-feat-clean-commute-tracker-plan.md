---
title: "feat: Clean Commute Challenge Tracker"
created: 2026-01-15
plan_type: feat
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
---

# Clean Commute Challenge Tracker

**Created:** 2026-01-15  
**Type:** Feature - New Application  
**Complexity:** Lightweight

---

## Goal Capsule

Build a simple web application for Ecologique India's October Clean Commute Challenge. Volunteers can scan QR codes at office locations, log their sustainable commute data (travel mode + kilometers), and organizers can view aggregated results—all with zero PII collection and free Vercel hosting.

---

## Summary

A mobile-first web app enabling employees to log daily commute data during a month-long sustainability challenge. The system uses QR codes for location identification, collects minimal non-personal data (date, office location, transport mode, distance), and provides a simple dashboard for tracking participation and impact metrics.

---

## Product Contract

### Requirements

**R1. QR-based location check-in**  
Each office location has a unique QR code. Scanning it opens the mobile entry form pre-filled with that location.

**R2. Simple commute logging**  
Users select travel mode (walk, bike, public transport, carpool, electric vehicle) and enter kilometers traveled.

**R3. Zero PII collection**  
No names, email addresses, employee IDs, or other personal identifiers are stored. Each entry is anonymous.

**R4. Central data aggregation**  
All entries are logged to a central database with: date, office location, transport mode, and kilometers.

**R5. Admin dashboard**  
Organizers can view real-time statistics: total entries, kilometers saved vs. driving alone, mode breakdown by location, and daily participation trends.

**R6. Free hosting**  
Application deploys to Vercel's free tier with a serverless database (Vercel Postgres or similar).

### Acceptance Examples

**AE1. Office employee scans QR**  
Location: Bangalore Office  
Scan → Mobile page loads → "Bangalore Office" pre-selected → User picks "Public Transport" + "15 km" → Submit → Success message → Entry logged with today's date.

**AE2. Organizer checks dashboard**  
Admin visits `/dashboard` → Sees: "127 entries this week, 1,843 km logged, Top mode: Public Transport (54%), Bangalore leads with 68 entries" → Filters by date range → Chart updates.

**AE3. Multiple entries same day**  
User logs morning commute (bike, 8 km) → Returns in evening, scans again → Logs return trip (bike, 8 km) → Both entries appear in database as separate records.

### Scope Boundaries

**In scope:**
- QR code generation for 3-5 office locations
- Mobile-responsive entry form
- Basic admin dashboard with charts
- Deployment to Vercel free tier
- CSV export of raw data

**Deferred to Follow-Up Work:**
- User authentication or profiles
- Gamification (leaderboards, badges)
- Push notifications or reminders
- Multi-language support
- Advanced analytics or CO₂ calculations

**Outside this product's identity:**
- Employee management systems
- Payroll or HR integrations
- Real-time location tracking
- Native mobile apps (iOS/Android)

---

## Planning Contract

### Key Technical Decisions

**KTD1. Next.js 14 with App Router**  
**Decision:** Use Next.js 14 App Router for server components, file-based routing, and API routes.  
**Rationale:** Vercel's native framework with zero-config deployment. Server components reduce client JavaScript. App Router is stable as of Next.js 13.4+ and the modern default.

**KTD2. Vercel Postgres for data storage**  
**Decision:** Use Vercel Postgres (serverless PostgreSQL) as the database.  
**Rationale:** Free tier includes 256 MB storage (~10,000+ entries), auto-scaling, zero ops. Native integration with Vercel projects. SQL queries are simple for this use case.

**KTD3. QR codes link to parameterized URLs**  
**Decision:** QR codes encode URLs like `https://app.vercel.app/log?location=bangalore-office`.  
**Rationale:** No backend lookup needed. QR generation is static. URL parameters populate the form.

**KTD4. Tailwind CSS for styling**  
**Decision:** Use Tailwind CSS with mobile-first responsive design.  
**Rationale:** Fast development, small bundle size, excellent mobile defaults. Common in volunteer/OSS projects.

**KTD5. Recharts for dashboard visualizations**  
**Decision:** Use Recharts library for bar/line charts.  
**Rationale:** React-native, composable, TypeScript support, good mobile rendering.

### System-Wide Impact

**Developer impact:**  
Volunteers need Node.js 18+, basic React/Next.js knowledge, and a Vercel account. Setup should take <10 minutes.

**Deployment impact:**  
Single-command deployment (`vercel --prod`). Database migrations run automatically via Vercel CLI or Next.js API route.

**Data privacy impact:**  
No GDPR concerns—zero PII collected. Database stores only: timestamp, location enum, mode enum, kilometers (float). Optional: session hash for duplicate detection (non-reversible).

**Scalability:**  
October challenge with ~200 employees × 20 working days × 2 trips/day = ~8,000 entries. Well within free tier limits.

---

## Implementation Units

### U1. Project scaffold and Vercel setup

**Goal:** Initialize Next.js project with TypeScript, Tailwind CSS, and Vercel Postgres connection.

**Requirements:** R6 (free hosting), foundational infrastructure for R1-R5.

**Dependencies:** None.

**Files:**
- `package.json`
- `next.config.mjs`
- `tsconfig.json`
- `tailwind.config.ts`
- `.env.local.example`
- `.gitignore`
- `lib/db.ts` (Postgres client wrapper)

**Approach:**  
Run `npx create-next-app@latest` with TypeScript + Tailwind + App Router options. Install `@vercel/postgres` package. Create `.env.local.example` with `POSTGRES_URL` placeholder. Write a thin `lib/db.ts` wrapper exporting a configured SQL client. Add Vercel Postgres to project via Vercel dashboard (or CLI during first deploy).

**Patterns to follow:**  
Standard Next.js 14 App Router structure. Environment variables via `.env.local` (ignored by git).

**Test scenarios:**
- `npm run dev` starts dev server on port 3000
- Tailwind classes render correctly in a test component
- `lib/db.ts` exports a `sql` function (integration test deferred until U2)

**Verification:**  
Dev server runs without errors. Tailwind utility classes apply styles. Database client imports without throwing.

---

### U2. Database schema and seed data

**Goal:** Create the `commute_entries` table and seed office location reference data.

**Requirements:** R3 (zero PII), R4 (central aggregation).

**Dependencies:** U1.

**Files:**
- `lib/schema.sql` (table DDL for reference)
- `app/api/setup/route.ts` (one-time setup endpoint)
- `lib/seed.ts` (office location constants)

**Approach:**  
Define `commute_entries` table:
```sql
CREATE TABLE commute_entries (
  id SERIAL PRIMARY KEY,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  office_location VARCHAR(50) NOT NULL,
  travel_mode VARCHAR(30) NOT NULL,
  kilometers DECIMAL(5,2) NOT NULL
);
```

Create `/api/setup` route that runs the DDL when called (idempotent—check if table exists first). Store office locations as constants in `lib/seed.ts` (e.g., `["bangalore-office", "mumbai-office", "delhi-office"]`).

**Patterns to follow:**  
SQL DDL in separate `.sql` file for documentation. API route uses `sql` tagged template from `@vercel/postgres`.

**Test scenarios:**
- POST to `/api/setup` creates table successfully
- Second POST to `/api/setup` returns 200 without error (idempotent)
- `commute_entries` table has correct columns and types (query `information_schema`)
- Office location constants export as array of strings

**Verification:**  
Table visible in Vercel Postgres dashboard. Setup route completes without errors. Schema matches design.

---

### U3. Mobile entry form with QR parameter handling

**Goal:** Build the `/log` page that reads `?location=` from URL and renders a mobile-optimized form.

**Requirements:** R1 (QR-based location), R2 (simple logging).

**Dependencies:** U1, U2.

**Files:**
- `app/log/page.tsx`
- `components/CommuteForm.tsx`
- `app/api/entries/route.ts` (POST handler)

**Approach:**  
`/log` page reads `searchParams.location` and passes it to `<CommuteForm>`. Form has:
- Hidden input for office location (pre-filled from param)
- Radio buttons or select for travel mode (Walk, Bike, Public Transport, Carpool, EV)
- Number input for kilometers (0.1 step, required)
- Submit button

On submit, POST to `/api/entries` with `{ office_location, travel_mode, kilometers }`. API route inserts into `commute_entries` table and returns 201.

**Patterns to follow:**  
Server component for page, client component (`"use client"`) for form (needs `useState` for controlled inputs). Use Next.js `useRouter` for post-submit navigation.

**Test scenarios:**
- Visit `/log?location=bangalore-office` → form shows "Bangalore Office" pre-selected
- Submit form with valid data → 201 response, entry appears in database
- Submit without kilometers → validation error (HTML5 `required`)
- Visit `/log` without `?location` → shows dropdown to manually select location
- Form is touch-friendly on mobile (large tap targets, proper input types)

**Verification:**  
Form submission creates database record with correct values. Success message appears. Form resets after submit.

---

### U4. Admin dashboard with aggregate statistics

**Goal:** Display real-time statistics and charts on `/dashboard` page.

**Requirements:** R5 (admin dashboard).

**Dependencies:** U1, U2, U3.

**Files:**
- `app/dashboard/page.tsx`
- `components/StatsCard.tsx`
- `components/ModeChart.tsx`
- `app/api/stats/route.ts`

**Approach:**  
`/dashboard` page fetches from `/api/stats`, which returns:
- Total entries
- Total kilometers
- Breakdown by travel mode (count + percentage)
- Breakdown by office location (count)
- Entries by day (last 30 days)

Render:
- `<StatsCard>` components for headline numbers
- `<ModeChart>` using Recharts bar chart for mode breakdown
- Simple table for location breakdown

**Patterns to follow:**  
Server component fetches data, passes to client components for interactivity. SQL aggregation queries use `GROUP BY` and `SUM`.

**Test scenarios:**
- Dashboard loads with zero entries → shows "No data yet"
- Dashboard with 10 entries → shows correct totals and percentages
- Mode chart renders bars for each travel mode
- Clicking date range filter (future enhancement placeholder)
- Dashboard is responsive on mobile (stacked cards)

**Verification:**  
Dashboard displays accurate counts. Charts render without errors. Mobile layout is readable.

---

### U5. QR code generation tool

**Goal:** Generate printable QR codes for each office location.

**Requirements:** R1 (QR-based location).

**Dependencies:** U3 (needs entry form URL).

**Files:**
- `app/admin/qr/page.tsx`
- `lib/qr-generator.ts` (uses `qrcode` npm package)

**Approach:**  
Admin-only page at `/admin/qr` that lists each office location and generates a QR code encoding `https://<deployed-url>/log?location=<location-slug>`. Use `qrcode` package to render QR as SVG or PNG. Provide download button for each code. Include printable CSS (high contrast, label below QR).

**Patterns to follow:**  
Client-side QR generation (runs in browser). SVG output for crisp printing.

**Test scenarios:**
- Visit `/admin/qr` → shows QR codes for all office locations
- Scan QR with phone → opens `/log?location=bangalore-office` correctly
- Download button saves PNG/SVG file
- Print preview shows clean, high-contrast codes with labels

**Verification:**  
Generated QR codes scan correctly on mobile devices. Downloaded images are print-ready.

---

### U6. CSV export for raw data

**Goal:** Allow admins to download all entries as CSV.

**Requirements:** R4 (central data aggregation), admin need for raw exports.

**Dependencies:** U2.

**Files:**
- `app/api/export/route.ts`
- `app/dashboard/page.tsx` (add export button)

**Approach:**  
Create `/api/export` GET endpoint that queries all `commute_entries`, formats as CSV with headers: `Date,Office Location,Travel Mode,Kilometers`. Set `Content-Type: text/csv` and `Content-Disposition: attachment; filename=commute-data.csv`. Add "Export CSV" button to dashboard.

**Patterns to follow:**  
Streaming response for large datasets (though unlikely with <10k entries). Use `Array.map().join(',')` for CSV formatting.

**Test scenarios:**
- Click "Export CSV" on dashboard → downloads `commute-data.csv`
- Open CSV in Excel/Sheets → columns align correctly, no escaping issues
- Export with special characters in location name → properly quoted
- Export with zero entries → returns CSV with headers only

**Verification:**  
Downloaded CSV opens cleanly in spreadsheet software. All entries present.

---

### U7. Deployment configuration and README

**Goal:** Document deployment steps and provide volunteer onboarding guide.

**Requirements:** R6 (free hosting), volunteer developer experience.

**Dependencies:** U1-U6.

**Files:**
- `README.md`
- `vercel.json` (optional build config)
- `.env.local.example` (already created in U1, validate completeness)

**Approach:**  
Write README with:
- Project overview and purpose
- Tech stack
- Local development setup (clone, `npm install`, set env vars, `npm run dev`)
- Database setup (link Vercel Postgres, run `/api/setup`)
- Deployment steps (`vercel --prod`)
- QR code generation instructions
- Volunteer contribution guidelines

Create `vercel.json` if needed (default config usually sufficient). Ensure `.env.local.example` has all required vars.

**Test expectation:** none -- documentation/config only.

**Verification:**  
A new volunteer can follow README and deploy the app in <15 minutes. No steps missing.

---

## Verification Contract

**Pre-launch checklist:**
- [ ] Scan test QR code on mobile → form loads with correct location
- [ ] Submit 10+ test entries with varied modes/locations → all appear in database
- [ ] Dashboard shows accurate totals and percentages
- [ ] CSV export downloads complete dataset
- [ ] Deployed app loads on Vercel public URL
- [ ] No PII fields present in database schema or forms
- [ ] Mobile responsiveness tested on iPhone and Android

**Success metrics:**
- App deployed to Vercel free tier (zero cost)
- New volunteer can contribute after <30 min onboarding
- Entry form completes in <15 seconds on mobile
- Dashboard loads in <2 seconds with 1000+ entries

---

## Definition of Done

- All implementation units (U1-U7) completed and verified
- Application deployed to production Vercel URL
- Database schema created in Vercel Postgres
- QR codes generated and tested on mobile devices
- README published with setup instructions
- Zero PII present in code, database, or forms
- CSV export functionality tested with sample data
- Volunteer contributor guide added to README
- Demo video or screenshots prepared for Ecologique team

---

## Open Questions

None—all planning questions resolved. Execution will determine:
- Exact office location names (to be provided by Ecologique organizers)
- Production domain name (Vercel auto-generates, can add custom domain later)
- Optional: session deduplication strategy if users accidentally double-submit

---

## Sources & Research

**Technology choices:**
- Next.js 14 App Router: Official Vercel recommendation for new projects
- Vercel Postgres: Free tier supports ~10k entries, auto-scaling
- Tailwind CSS: Industry standard for rapid mobile-first development
- Recharts: Popular React charting library with good mobile support

**No external research conducted** (straightforward greenfield app, established patterns).
