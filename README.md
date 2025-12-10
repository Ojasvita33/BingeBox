# BingeBox 🎬

A modern Netflix-style streaming application built with Node.js, Express, Socket.io, and MongoDB. Watch movies together in real-time with watch parties, manage your profile, and enjoy a fully responsive design.

## Features ✨

### 🎥 Watch Parties
- Create and join real-time watch parties with friends
- Synchronized video playback across all participants
- Live chat functionality during watch parties
- End party button with confirmation modal
- Auto-redirect when party ends

### 👤 User Management
- User registration and authentication with JWT
- Profile page with user stats (favorites, watch history)
- Edit profile (name, email)
- Change password with bcrypt validation
- Admin-only access card visibility

### 🔐 Password Recovery
- Forgot password functionality
- Email-based password reset with 15-minute expiring tokens
- Secure token hashing before database storage
- Nodemailer integration with Gmail SMTP

### 🎨 UI/UX
- Netflix-themed modal popups (no browser alerts)
- Fully responsive mobile design (700px, 520px breakpoints)
- Hamburger navigation for mobile devices
- Dynamic carousel with clamp() height scaling
- Smooth animations and transitions

### 🍿 Movie Features
- Browse movies by genre
- Add movies to favorites
- View watch history
- Movie detail page with synopsis
- Admin panel for movie management (add/edit/delete)

## Tech Stack 🛠️

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **Authentication**: JWT (7-day expiry)
- **Password Hashing**: bcryptjs (10 salt rounds)
- **Email**: Nodemailer with Gmail SMTP
- **Templating**: EJS
- **Security**: crypto module for token generation/hashing

## Project Structure 📁

```
BingeBox/
├── config/
│   ├── db.js              # MongoDB connection
│   └── email.js           # Nodemailer SMTP setup
├── controllers/
│   ├── authController.js  # Login, register, password reset
│   ├── movieController.js # Movie CRUD operations
│   └── userController.js  # Profile management
├── middlewares/
│   └── authMiddleware.js  # JWT verification
├── models/
│   ├── Movie.js           # Movie schema
│   └── User.js            # User schema with reset token fields
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── appRoutes.js       # App feature endpoints
│   └── adminRoutes.js     # Admin endpoints
├── views/
│   ├── layout.ejs         # Master template with nav
│   ├── login.ejs          # Login page
│   ├── register.ejs       # Registration page
│   ├── dashboard.ejs      # Main movie feed
│   ├── movie.ejs          # Movie detail page
│   ├── party.ejs          # Watch party interface
│   ├── profile.ejs        # User profile with modals
│   ├── favorites.ejs      # User favorites
│   ├── history.ejs        # Watch history
│   ├── admin.ejs          # Admin panel
│   ├── forgot-password.ejs     # Password reset request
│   ├── reset-password.ejs      # Password reset form
│   └── footer.ejs         # Footer component
├── public/
│   └── styles.css         # Global styling with responsive breakpoints
├── server.js              # Express server setup with Socket.io
├── seed.js                # Database seeding script
├── package.json           # Dependencies
├── .env                   # Environment variables (local only)
└── .gitignore            # Git ignore file
```

## Installation 🚀

### Prerequisites
- Node.js (v14+)
- MongoDB
- Gmail account with app password

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Ojasvita33/BingeBox.git
cd BingeBox
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/bingebhox
JWT_SECRET=your_jwt_secret_here
PORT=3000

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=BingeBox <your_email@gmail.com>
```

**Note**: Use Gmail App Password, not your regular password:
- Go to https://myaccount.google.com/security
- Enable 2-Factor Authentication
- Generate "App Password" for Mail
- Copy the 16-digit password to `.env`

4. **Seed the database**
```bash
node seed.js
```

5. **Start the server**
```bash
npm start
```
The app will be available at `http://localhost:3000`

## Usage 💻

### User Features
1. **Register** - Create a new account
2. **Login** - Sign in with email/password
3. **Browse** - View movies on dashboard with genre filters
4. **Watch Party** - Click "Start Party" to create a watch party
5. **Profile** - View stats, edit profile, change password
6. **Favorites** - Add/remove movies from your favorites

### Admin Features
1. **Admin Panel** - Access at `/admin` (admin users only)
2. **Manage Movies** - Add, edit, or delete movies
3. **View Stats** - Monitor user activity

## API Endpoints 🔌

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/logout` - Logout user
- `GET /forgot-password` - Forgot password page
- `POST /forgot-password` - Send reset email
- `GET /reset-password/:token` - Reset password page
- `POST /reset-password` - Update password

### User
- `GET /profile` - Get user profile
- `POST /profile/update` - Update profile
- `POST /profile/change-password` - Change password

### Movies
- `GET /` - Dashboard with all movies
- `GET /movie/:id` - Movie detail page
- `POST /add-favorite` - Add to favorites
- `GET /favorites` - User's favorite movies
- `GET /history` - Watch history
- `POST /add-to-history` - Add to watch history

### Admin
- `GET /admin` - Admin dashboard
- `POST /admin/add-movie` - Add new movie
- `POST /admin/edit-movie/:id` - Edit movie
- `POST /admin/delete-movie/:id` - Delete movie

## Real-time Events (Socket.io) 🔄

### Party Events
- `join-party` - User joins a watch party
- `play-movie` - Sync movie playback
- `pause-movie` - Sync pause
- `end-party` - Host ends the party
- `send-message` - Send chat message
- `receive-message` - Receive chat message

## Security Features 🔒

- **JWT Authentication** - 7-day token expiry
- **Password Hashing** - bcryptjs with 10 salt rounds
- **Token Generation** - crypto.randomBytes() for reset tokens
- **Token Hashing** - sha256 before database storage
- **Environment Variables** - Sensitive data in `.env` (excluded from git)
- **CORS** - Configured for secure cross-origin requests

## Responsive Design 📱

### Breakpoints
- **Desktop** - Full layout with all features
- **Tablet** (max-width: 900px) - Optimized grid layout
- **Mobile** (max-width: 700px) - Hamburger navigation, stacked layout
- **Small Mobile** (max-width: 520px) - Compact design, optimized buttons

### Mobile Features
- Hamburger navigation menu
- Touch-friendly buttons and inputs
- Responsive carousel with dynamic height
- Optimized font sizes for readability
- Full-screen video player support

## Testing 🧪

### Manual Testing Checklist
- [ ] User registration
- [ ] User login
- [ ] Profile update
- [ ] Password change
- [ ] Forgot password flow
- [ ] Password reset with email
- [ ] Create watch party
- [ ] Join watch party
- [ ] End watch party
- [ ] Add to favorites
- [ ] Remove from favorites
- [ ] Mobile responsiveness

## Future Enhancements 🎯

- [ ] Email verification on signup
- [ ] Social login (Google, GitHub OAuth)
- [ ] Two-factor authentication (2FA)
- [ ] User preferences and settings
- [ ] Watch history pagination
- [ ] Movie recommendations
- [ ] Advanced search and filtering
- [ ] User notifications
- [ ] Streaming quality options
- [ ] Subscription plans

## Contributing 🤝

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Author ✍️

**Ojasvita** - [GitHub Profile](https://github.com/Ojasvita33)

## Support 💬

For support, email ojrn777@gmail.com or open an issue on GitHub.

---

**Made with ❤️ for streaming enthusiasts**
