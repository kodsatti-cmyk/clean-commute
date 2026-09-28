# Clean Commute Challenge Tracker

A simple web application for tracking sustainable commute data during Ecologique India's October Clean Commute Challenge. Built with Next.js, TypeScript, and Tailwind CSS, designed to be deployed for free on Vercel.

## 🌟 Features

- **QR Code Check-in**: Generate QR codes for each office location
- **Mobile-First Entry Form**: Easy-to-use form for logging commute data
- **Zero PII**: No personal information collected - only date, location, mode, and distance
- **Real-Time Dashboard**: View statistics and charts showing participation and impact
- **CSV Export**: Download complete dataset for further analysis
- **Free Hosting**: Runs on Vercel's free tier with Vercel Postgres

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres (Serverless PostgreSQL)
- **Charts**: Recharts
- **QR Codes**: qrcode library
- **Deployment**: Vercel

## 🚀 Quick Start for Volunteers

### Prerequisites

- Node.js 18+ installed
- A Vercel account (free tier is sufficient)
- Git installed

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clean-commute-challenge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   
   For local development, you can use a placeholder:
   ```env
   POSTGRES_URL="postgres://placeholder"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   DASHBOARD_PASSWORD="replace-with-a-long-random-password"
   ```

   The dashboard, statistics API, and CSV export use this shared password. Set
   the same variable in Vercel under **Settings → Environment Variables** for
   deployments. Use a long, unique password and share it only with organizers.

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note**: Database features won't work until you set up Vercel Postgres (see deployment section).

## 📦 Deployment to Vercel

### Step 1: Deploy to Vercel

1. Push your code to a GitHub repository

2. Visit [vercel.com](https://vercel.com) and sign in

3. Click "Add New Project"

4. Import your GitHub repository

5. Vercel will auto-detect Next.js - click "Deploy"

### Step 2: Add Vercel Postgres

1. In your Vercel project dashboard, go to the "Storage" tab

2. Click "Create Database"

3. Select "Postgres" (Serverless SQL)

4. Choose a database name (e.g., "clean-commute-db")

5. Click "Create"

6. Vercel will automatically add the required environment variables to your project

### Step 3: Initialize the Database

1. Go to your deployed app's URL: `https://your-app.vercel.app`

2. Visit the setup endpoint to create tables:
   ```
   POST https://your-app.vercel.app/api/setup
   ```
   
   You can do this with `curl`:
   ```bash
   curl -X POST https://your-app.vercel.app/api/setup
   ```
   
   Or simply visit the URL in your browser (it will show a CORS error, but the tables will be created).

### Step 4: Update Environment Variables

1. In Vercel dashboard, go to Settings → Environment Variables

2. Add:
   ```
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

3. Redeploy the application

### Step 5: Generate QR Codes

1. Visit `https://your-app.vercel.app/admin/qr`

2. Download and print QR codes for each office location

3. Post them at the respective office locations

## 📱 Usage

### For Employees

1. Scan the QR code at your office location (or visit `/log` manually)
2. Select your travel mode (Walk, Bike, Public Transport, Carpool, Electric Vehicle)
3. Enter the distance traveled in kilometers
4. Click "Log Commute"

### For Organizers

- **View Dashboard**: Visit `/dashboard` to see real-time statistics
- **Export Data**: Click "Export CSV" on the dashboard to download all entries
- **Generate QR Codes**: Visit `/admin/qr` to generate/regenerate QR codes

## 🗂️ Project Structure

```
clean-commute-challenge/
├── app/
│   ├── api/
│   │   ├── entries/          # API route for logging entries
│   │   ├── export/           # CSV export endpoint
│   │   ├── setup/            # Database initialization
│   │   └── stats/            # Statistics endpoint
│   ├── admin/
│   │   └── qr/               # QR code generator page
│   ├── dashboard/            # Statistics dashboard
│   ├── log/                  # Entry form page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/
│   ├── CommuteForm.tsx       # Entry form component
│   ├── ModeChart.tsx         # Chart component
│   ├── QRGenerator.tsx       # QR code generator
│   └── StatsCard.tsx         # Statistics card component
├── lib/
│   ├── db.ts                 # Database client wrapper
│   ├── schema.sql            # Database schema (reference)
│   └── seed.ts               # Constants for locations and modes
├── docs/
│   └── plans/                # Planning documents
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

## 🛠️ Customization

### Adding Office Locations

Edit `lib/seed.ts` and add locations to the `OFFICE_LOCATIONS` array:

```typescript
export const OFFICE_LOCATIONS = [
  { id: "bangalore-office", name: "Bangalore Office" },
  { id: "your-new-office", name: "Your New Office" },
  // ... more locations
];
```

Then regenerate QR codes at `/admin/qr`.

### Changing Travel Modes

Edit `lib/seed.ts` to modify the `TRAVEL_MODES` array:

```typescript
export const TRAVEL_MODES = [
  { id: "walk", name: "Walk", icon: "🚶" },
  // ... more modes
];
```

## 🔒 Privacy & Data

This application is designed with privacy in mind:

- **No PII collected**: No names, email addresses, or employee IDs
- **Anonymous entries**: Each entry only records date, location, mode, and distance
- **No user accounts**: No login required
- **GDPR compliant**: Zero personal data means no GDPR concerns

## 🐛 Troubleshooting

### Database connection errors

- Ensure Vercel Postgres is set up in your project
- Check that environment variables are set correctly
- Try running the `/api/setup` endpoint again

### QR codes don't work

- Verify `NEXT_PUBLIC_BASE_URL` is set to your production URL
- Regenerate QR codes after updating the environment variable

### "npm install" fails with EACCES error

If you encounter permission errors during `npm install`, try:

```bash
# Clear npm cache
rm -rf ~/.npm/_cacache
npm install --legacy-peer-deps
```

If that doesn't work, you may need to fix npm permissions:
```bash
sudo chown -R $(whoami) ~/.npm
npm install
```

## 🤝 Contributing

This is a volunteer project for Ecologique India. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is built for Ecologique India's Clean Commute Challenge.

## 📞 Support

For questions or issues:
- Check the troubleshooting section above
- Open an issue on GitHub
- Contact the Ecologique India tech team

---

**Built with ❤️ by volunteers for a sustainable future** 🌱
# clean-commute
