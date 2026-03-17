# RideApp

A full-stack ride-booking web application inspired by Uber, built with Next.js App Router, MongoDB, and NextAuth.

## Features

- OTP-based signup/login flow with email verification
- OAuth login with Google and GitHub via NextAuth
- Role-based experience for riders and captains
- Protected route handling for rider and captain dashboards
- User profile update with optional password change
- Captain profile onboarding (vehicle and license details)
- Forgot-password flow using expiring token links
- Cloudinary image upload for profile photos
- Contact form email delivery via Nodemailer

## Tech Stack

- Framework: Next.js 16 (App Router)
- UI: React 19, Tailwind CSS 4
- Auth: NextAuth + custom cookie-based OTP session model
- Database: MongoDB + Mongoose
- Security: Argon2 password hashing, token/OTP expiry handling
- Media: Cloudinary
- Email: Nodemailer (Gmail SMTP)

## Project Structure

```text
Ride-App/
├── README.md
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── proxy.js
├── actions/
│   └── useractions.js
├── app/
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   ├── (captianProtected)/
│   │   ├── layout.js
│   │   ├── captain-home/
│   │   │   └── page.js
│   │   ├── captain-payment/
│   │   │   └── page.js
│   │   ├── captain-profile/
│   │   │   └── page.js
│   │   └── captain-rides/
│   │       └── page.js
│   ├── (userProtected)/
│   │   ├── layout.js
│   │   ├── user-home/
│   │   │   ├── page.js
│   │   │   ├── captain-assigned/
│   │   │   │   └── page.js
│   │   │   ├── captain-searching/
│   │   │   │   └── page.js
│   │   │   ├── ride/
│   │   │   │   └── page.js
│   │   │   ├── ride-completion/
│   │   │   │   └── page.js
│   │   │   └── ride-selection/
│   │   │       └── page.js
│   │   ├── user-payment/
│   │   │   └── page.js
│   │   ├── user-profile/
│   │   │   └── page.js
│   │   └── user-rides/
│   │       └── page.js
│   ├── about/
│   │   └── page.js
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.js
│   │   ├── captainProfileUpdate/
│   │   │   └── route.js
│   │   ├── uploadImage/
│   │   │   └── route.js
│   │   └── userProfileUpdate/
│   │       └── route.js
│   ├── contact/
│   │   └── page.js
│   ├── forgot-password/
│   │   └── page.js
│   ├── login/
│   │   └── page.js
│   ├── otp/
│   │   └── page.js
│   ├── privacy-policy/
│   │   └── page.js
│   ├── signup/
│   │   └── page.js
│   └── terms-of-service/
│       └── page.js
├── components/
│   ├── AssignedCaptainScreen.js
│   ├── CaptainNavbar.js
│   ├── CaptainSearchingPage.js
│   ├── DuringRideScreen.js
│   ├── Footer.js
│   ├── Navbar.js
│   ├── RideCompletionPage.js
│   ├── RideSelectionPage.js
│   ├── SessionWrapper.js
│   └── UserNavbar.js
├── db/
│   └── connectDB.js
├── lib/
│   ├── cloudinary.js
│   ├── mailer.js
│   ├── mailerContact.js
│   └── otpEmail.js
├── models/
│   ├── otpStore.js
│   ├── passwordReset.js
│   ├── Session.js
│   └── User.js
└── utils/
    └── generateOtp.js

```

## Environment Variables

Create a `.env.local` file in project root:

```env
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_ID=
GOOGLE_SECRET=
MONGO_URI=
NEXTAUTH_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
CLOUDINARY_URL=
```

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server

## Main API Routes

- `POST /api/auth/[...nextauth]` - OAuth auth handlers
- `POST /api/userProfileUpdate` - Update rider profile/password
- `POST /api/captainProfileUpdate` - Update captain profile/password
- `POST /api/uploadImage` - Upload and store user image

## Notes

- OTP/session logic lives in `actions/useractions.js` and `models/otpStore.js`/`models/Session.js`.
- Protected route matching is configured in `proxy.js`.
- Folder name `(captianProtected)` appears to be intentionally used in routes (spelling kept as in codebase).
