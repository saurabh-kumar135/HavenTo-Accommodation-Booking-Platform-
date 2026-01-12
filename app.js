// Core Module
const path = require('path');
require('dotenv').config();

// External Module
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { default: mongoose } = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const DB_PATH =  "mongodb+srv://CRUDABC:CRUDABC@cluster1.vzxjvpm.mongodb.net/HavenTo?appName=cluster1";

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const authRouter = require("./routes/authRouter")
const passwordResetRouter = require("./routes/passwordResetRoutes")
const emailVerificationRouter = require("./routes/emailVerificationRoutes")
const phoneVerificationRouter = require("./routes/phoneVerificationRoutes")
const googleAuthRouter = require("./routes/googleAuth")
const passport = require('./config/passport'); // Passport configuration
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");

const app = express();

// CORS configuration for React frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // Vite dev server (multiple ports)
  credentials: true // Allow cookies/sessions
}));

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions'
});

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const multerOptions = {
  storage, fileFilter
};

app.use(express.json()); // Parse JSON data from React frontend
app.use(express.urlencoded({ extended: true }));
app.use(multer(multerOptions).array('photos', 5)); // Allow up to 5 photos
app.use(express.static(path.join(rootDir, 'public')))
app.use("/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/host/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/homes/uploads", express.static(path.join(rootDir, 'uploads')))

app.use(session({
  secret: "KnowledgeGate AI with Complete Coding",
  resave: false,
  saveUninitialized: true,
  store
}));

// Initialize Passport.js for Google OAuth
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn
  next();
})

app.use(authRouter);
app.use('/api/password-reset', passwordResetRouter);
app.use('/api/verify-email', emailVerificationRouter);
app.use('/api/verify-phone', phoneVerificationRouter); // Phone verification routes
app.use('/api/auth', googleAuthRouter); // Google OAuth routes
app.use(storeRouter);
app.use(hostRouter);


app.use(errorsController.pageNotFound);

const PORT = 3009;

mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error while connecting to Mongo: ', err);
});
