# PowerAlert Nepal — Frontend

React frontend for **PowerAlert Nepal**, a power-outage reporting and public
alert platform. Citizens can view outage/maintenance info and submit reports;
admins get a dedicated portal to manage reports, users, notices, and
announcements.

## Tech stack

- **React 18 + Vite** — app shell / dev server / build
- **React Router v6** — routing, protected routes
- **Tailwind CSS** — styling
- **Axios** — API client, with an interceptor that auto-refreshes the access
  token on 401 responses
- **react-hot-toast** — notifications

## Features

**Citizen**
- View public outage reports and maintenance notices
- Submit an outage report (with optional photo + geolocation)
- View their own submitted reports
- Fill out a report while logged out — sign-in is only required at submit time

**Admin**
- Dashboard overview with live stats
- Verify / resolve / reject / delete reports
- View and deactivate users
- Create / update / delete maintenance notices and announcements

## Project structure

```
src/
├── main.jsx                # App entry — mounts <App /> in the router
├── App.jsx                  # Route definitions, auth-aware redirects
├── context/
│   └── AuthContext.jsx        # Session state, token refresh, cross-tab sync
├── services/
│   ├── api.js                  # Axios instance + auth-refresh interceptor
│   ├── auth.service.js
│   ├── report.service.js
│   ├── notice.service.js
│   ├── stats.service.js
│   └── admin.service.js
├── components/
│   ├── Navbar.jsx / Footer.jsx / AuthShell.jsx
│   ├── OutageCard.jsx
│   ├── ProtectedRoute.jsx       # role-gated route wrapper
│   └── admin/                    # Admin portal building blocks
│       ├── AdminLayout.jsx, AdminSidebar.jsx, AdminHeader.jsx
│       ├── AdminOverview.jsx, AdminReports.jsx, AdminUsers.jsx
│       ├── AdminMaintenance.jsx, AdminAnnouncements.jsx
│       ├── ReportsTable.jsx, ReportDetailsModal.jsx, UsersTable.jsx
│       ├── NoticeManager.jsx, AnnouncementManager.jsx
│       └── AdminStatCard.jsx
├── pages/
│   ├── Home.jsx, Alerts.jsx, Calendar.jsx, About.jsx
│   ├── Report.jsx, MyReports.jsx
│   ├── Login.jsx, Signup.jsx, ForgotPassword.jsx
│   └── AdminDashboard.jsx        # Admin portal orchestrator
├── hooks/
│   └── useAdminDashboard.js       # Data + actions for the admin portal
├── constants/
│   └── report.js                    # Outage types, province/district data, etc.
└── utils/
    └── errorHandler.js               # Normalizes API errors for toasts/forms
```

## Prerequisites

- Node.js 18+
- The backend API running (see the `Backend` repo's README)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set your API URL (see Environment variables below)
echo "VITE_API_URL=http://localhost:3000" > .env.local

# 3. Run the dev server
npm run dev
```

Vite prints the local dev URL — by default `http://localhost:5173`.

## Available scripts

| Command           | Description                          |
|---------------------|-----------------------------------------|
| `npm run dev`      | Start the Vite dev server                |
| `npm run build`    | Production build → `dist/`                |
| `npm run preview`  | Preview the production build locally      |

## Environment variables

Create a `.env.local` file in the project root:

| Variable         | Description                     | Example                 |
|--------------------|------------------------------------|----------------------------|
| `VITE_API_URL`   | Base URL of the backend API       | `http://localhost:3000`   |

## Connecting to the backend

- The backend must have `CORS_ORIGIN` set to this app's exact origin (e.g.
  `http://localhost:5173`) — the API is called with credentials (cookies) for
  refresh-token support, which requires an explicit CORS allow-list rather
  than a wildcard.
- The access token is kept in memory (not `localStorage`); logging in on one
  tab syncs auth state to other open tabs of the same browser.

## Routing overview

| Route            | Access                | Notes                                              |
|--------------------|--------------------------|-------------------------------------------------------|
| `/`               | Public                  | Home — stats + latest outages                       |
| `/alerts`         | Public                  | Full outage report list                              |
| `/calendar`       | Public                  | Maintenance notices                                   |
| `/about`          | Public                  |                                                        |
| `/report`         | Public to view/fill     | Sign-in is only prompted when the form is submitted   |
| `/login`, `/register`, `/forgot-password` | Public (redirects away if already logged in) | |
| `/my-reports`     | Citizen (logged in)     | Redirects to `/login` if not authenticated            |
| `/admin`          | Admin only              | Redirects non-admins away; restores correctly on refresh |

## License

This project is open source and available under the [MIT License](LICENSE).
