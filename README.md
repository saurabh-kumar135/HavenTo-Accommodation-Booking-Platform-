# HavenTo - Accommodation Booking Platform

A full-stack web application for booking accommodations, inspired by Airbnb. Built with modern web technologies including Node.js, Express, MongoDB, and React.

## 🌟 Features

### User Authentication

- Email-based registration with OTP verification
- Secure password hashing with bcrypt
- Session-based authentication
- Password reset functionality via email

### For Guests

- Browse available properties
- View detailed property information
- Add properties to favorites
- Book accommodations
- Manage bookings

### For Hosts

- List properties with multiple images
- Edit and manage listings
- Set pricing and availability
- View booking requests

### Core Functionality

- Image upload and management
- Search and filter properties
- Responsive design for all devices
- Real-time form validation

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: express-session
- **Email**: Nodemailer (Gmail SMTP)
- **File Upload**: Multer
- **Security**: bcryptjs for password hashing

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gmail account (for email functionality)

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/havento-booking-platform.git
cd havento-booking-platform
```

2. Install backend dependencies:

```bash
npm install
```

3. Create `.env` file in root directory:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-secret-key
```

4. Start MongoDB (if running locally):

```bash
mongod
```

5. Start the backend server:

```bash
npm start
```

Server will run on `http://localhost:3009`

### Frontend Setup

1. Navigate to client directory:

```bash
cd client
```

2. Install frontend dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Environment Variables

### Backend (.env)

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-session-secret
```

### Getting Gmail App Password

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account Settings → Security
3. Under "Signing in to Google", select "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in `GMAIL_APP_PASSWORD`

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
│   └── package.json
├── controllers/           # Route controllers
├── models/               # Mongoose models
├── routes/               # Express routes
├── utils/                # Utility functions
├── uploads/              # User uploaded images
├── app.js                # Express app setup
└── package.json
```

## 🚀 Usage

1. **Sign Up**: Create an account as a Guest or Host
2. **Verify Email**: Enter the OTP sent to your email
3. **Browse Properties**: Explore available accommodations
4. **Book**: Select dates and book a property (Guest)
5. **List Property**: Add your property for booking (Host)

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- Session-based authentication
- Email verification with OTP
- Password reset with secure tokens
- CORS protection
- Input validation and sanitization

## 📸 Screenshots

### Homepage

![Homepage](screenshots/homepage.png)
_Browse available properties with search and filter functionality_

### Sign Up

![Sign Up](screenshots/signup.png)
_Create an account as a Guest or Host with email verification_

### Email Verification

![Email Verification](screenshots/email-verification.png)
_Enter 6-digit OTP code sent to your email_

### Login

![Login](screenshots/login.png)
_Secure login with session-based authentication_

### Forgot Password

![Forgot Password](screenshots/forgot-password.png)
_Request password reset link via email_

### Password Reset Email

![Password Reset Email](screenshots/password-reset-email.png)
_Receive password reset link in your inbox_

### Property Details

![Property Details](screenshots/property-detail.png)
_View detailed property information with image gallery_

## 🤝 Contributing

This is a learning project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Saurabh Kumar**

- Email: saurabhrajput.25072005@gmail.com
- GitHub: [@student-cse-lab](https://github.com/student-cse-lab)

## 🙏 Acknowledgments

- Inspired by Airbnb
- Built as a learning project to understand full-stack development
- Thanks to the open-source community for amazing tools and libraries

## 📞 Support

For support, email saurabhrajput.25072005@gmail.com or open an issue in the repository.

---

**Note**: This is a learning project and not intended for production use without proper security audits and enhancements.
