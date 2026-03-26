# AfroLingo

AfroLingo is a full-stack language learning platform focused on African languages, with AI-assisted learning tools, quizzes, progress tracking, and premium subscription checkout via Interswitch.

This repository contains:

- `backend` - Express + TypeScript API
- `frontend` - Next.js + TypeScript web app

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, GSAP, Axios, Sonner
- **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), JWT auth
- **Integrations:** Interswitch (payments), Cloudinary (media), YarnGPT API (AI features)

## Team Contributions

### Daniel Komolafe (Backend Engineer & Project Lead)

- Architected and implemented the core backend system, including authentication (JWT-based signup/login), onboarding, and secure routing
- Designed and developed key application features: language/lesson management, phrase logic, quiz system (generation, submission, evaluation), and user progress tracking (stats, leaderboard, breakdowns)
- Built and optimized AI-powered services, including audio generation pipeline using YarnGPT with caching, and AI Voice Lab backend routes
- Integrated third-party services such as Cloudinary (media upload/management) and Interswitch (subscription payment initiation & verification)
- Established backend architecture: API structure (routes, controllers, models), environment configuration, error handling, and response utilities
- Improved system reliability and performance via enhanced error handling, Axios interceptors, and database seeding strategies
- Contributed across fullstack boundaries, ensuring smooth frontend–backend integration and alignment on infrastructure decisions
- Maintained developer experience and project health through tooling improvements, dependency management, build optimization, and codebase refactoring
- Led repository management, including pull request reviews, version control workflows, staging coordination, and documentation

### Oluwatobiloba Oni (Frontend Engineer & UI/UX Designer)

- Led design and development of core frontend pages: Learn, Practice, Premium, and AfroTTS (text-to-speech)
- Implemented recording and speech analysis features in the Practice module
- Designed and integrated reusable UI components (Navbar, Footer, LearnPath, etc.)
- Improved UI/UX across the app with responsive layouts and consistent branding
- Integrated navigation flows and enhanced user interaction patterns
- Updated AfroLingo branding across the platform (logo, typography, visual consistency)
- Built language selection UI and optimized learning pathways
- Refactored component structure for maintainability and cleaner code

### Boluwatife Oni (Frontend Engineer)

- Designed and implemented the landing page, onboarding flow, and overall design system
- Established visual identity (earth-toned palette, typography, component styling)
- Added animations using GSAP to enhance user experience
- Built and refined key UI pages including Premium and language selection screens
- Improved responsiveness and usability across multiple pages
- Integrated global UI features such as theme provider and toast notifications
- Continuously refined layout, spacing, and visual hierarchy across the app

## Project Structure

```text
afrolingo/
  backend/
    src/
      controllers/
      routes/
      models/
      middlewares/
      services/
  frontend/
    src/
      pages/
      components/
      lib/
      interfaces/
```

## Prerequisites

- Node.js 18+ (recommended)
- npm or yarn
- MongoDB instance (local or cloud)

## Getting Started

### 1) Clone and install dependencies

```bash
git clone https://github.com/khomohzie/afrolingo.git
cd afrolingo

cd backend && yarn
cd ../frontend && npm install
```

### 2) Configure environment variables

Create local env files from samples:

```bash
cp backend/.env.sample backend/.env
cp frontend/.env.sample frontend/.env.local
```

Fill in the required values.

#### Backend (`backend/.env`)

```env
NODE_ENV=
PORT=

# Database
MONGO_URI=
MONGO_URI_CLOUD=

# Product metadata
APP_NAME=
FRONTEND_URL=

# JWT
JWT_SECRET=
REFRESH_TOKEN_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN_DAY=
ACCESS_TOKEN_EXPIRES_IN=
ACCESS_TOKEN_EXPIRES_IN_DAY=

# YarnGPT
YARNGPT_BASE_URL=
YARNGPT_API_KEY=

# Cloudinary
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_URL=

# Subscription
SUBSCRIPTION_AMOUNT=

# Interswitch
INTERSWITCH_MERCHANT_CODE=
INTERSWITCH_PAY_ITEM_ID=
INTERSWITCH_CLIENT_ID=
INTERSWITCH_CLIENT_SECRET=
INTERSWITCH_BASE_URL=
```

#### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_MERCHANT_CODE=
NEXT_PUBLIC_PAY_ITEM_ID=
NEXT_PUBLIC_INTERSWITCH_MODE=
```

## Running the App

Run backend and frontend in separate terminals.

### Backend

```bash
cd backend
npm run dev
```

Default API base URL is typically `http://localhost:4000/api`.

### Frontend

```bash
cd frontend
npm run dev
```

Default app URL is usually `http://localhost:3000`.

## Build and Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run start
```

## API Overview

Main route groups are mounted under the backend API router:

- `/auth`
- `/user`
- `/ai`
- `/lessons`
- `/progress`
- `/quiz`
- `/payment`

Payment endpoints:

- `POST /payment/initiate` (authenticated)
- `POST /payment/verify` (authenticated)

## Authentication

- JWT-based authentication
- Protected endpoints use auth middleware (`requireSignin`)
- Frontend Axios client attaches `Authorization: Bearer <token>` from `localStorage`

## Premium Payment Flow (Interswitch)

1. Frontend calls `POST /payment/initiate`
2. Backend returns checkout payload (`txn_ref`, amount metadata, etc.)
3. Frontend opens Interswitch checkout via `window.webpayCheckout(...)`
4. On completion, frontend calls `POST /payment/verify`
5. Backend verifies payment and updates subscription state

## Notes

- Ensure frontend and backend env values match for Interswitch (`merchant_code`, `pay_item_id`, mode).
- Confirm CORS `FRONTEND_URL` matches your frontend origin in development/production.
- If your backend returns a non-2xx response (like 404), frontend error toasts can surface the backend `message` field.

## Available Scripts

### Backend (`backend/package.json`)

- `yarn dev` - start dev server with file watching
- `yarn build` - compile TypeScript
- `npm start` - run compiled server
- `npm test` - run tests with Jest

### Frontend (`frontend/package.json`)

- `npm run dev` - start Next.js dev server
- `npm run build` - build app
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Contributing

1. Create a feature branch
2. Make changes with clear commit messages
3. Run lint/tests before opening a PR

## License

ISC
