# BingeBox 🎬

Netflix-style streaming app with real-time watch parties, user profiles, and password recovery.

## Features ✨

- 🎥 Real-time watch parties with live chat
- 👤 User authentication & profiles with JWT
- 🔐 Password reset via email (Nodemailer)
- 🎨 Netflix-themed UI with responsive design
- 🍿 Browse movies, add to favorites, watch history
- 👨‍💼 Admin panel for movie management

## Tech Stack 🛠️

Node.js • Express • MongoDB • Socket.io • JWT • bcryptjs • Nodemailer • EJS

## Quick Start 🚀

1. **Clone & Install**
```bash
git clone https://github.com/Ojasvita33/BingeBox.git
cd BingeBox
npm install
```

2. **Setup .env** (create in root directory)
```
MONGODB_URI=mongodb://localhost:27017/bingeBox
JWT_SECRET=your_secret_key
PORT=3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=BingeBox <your_email@gmail.com>
```

3. **Run**
```bash
npm start
```
Open http://localhost:3000

## Usage 💻

**User**: Register → Login → Browse Movies → Add Favorites → Create/Join Watch Party → Manage Profile

**Admin**: Create account → Promoted by admin → Access `/admin` → Add/Edit/Delete Movies

## Key Endpoints

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login |
| GET | `/profile` | User profile |
| POST | `/profile/update` | Update profile |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |
| GET | `/` | Movie dashboard |
| POST | `/add-favorite` | Add to favorites |
| GET | `/party/:id` | Join watch party |

## Security 🔒

- JWT authentication (7-day expiry)
- bcryptjs password hashing
- Secure token generation & hashing
- Environment variables for sensitive data
- CORS configured
