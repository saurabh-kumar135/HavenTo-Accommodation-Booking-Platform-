// Core Module
const path = require('path');
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { default: mongoose } = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const DB_PATH = process.env.MONGODB_URI || "mongodb://localhost:27017/havento";

const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const authRouter = require("./routes/authRouter")
const passwordResetRouter = require("./routes/passwordResetRoutes")
const emailVerificationRouter = require("./routes/emailVerificationRoutes") 
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', 
  'http://localhost:5175',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
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

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(multer(multerOptions).array('photos', 5)); 
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



app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn
  next();
})

app.use('/api/', apiLimiter);

app.get('/test-smtp', async (req, res) => {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
  
  try {
    await transporter.verify();
    res.json({ success: true, message: '✅ SMTP is working on Render!' });
  } catch (error) {
    res.json({ success: false, message: '❌ SMTP blocked on Render', error: error.message, code: error.code });
  }
});

app.use(authRouter);
app.use('/api/password-reset', passwordResetRouter);
app.use('/api/verify-email', emailVerificationRouter);
 
app.use(storeRouter);
app.use(hostRouter);

app.use(errorsController.pageNotFound);

const PORT = process.env.PORT || 3009;

mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error while connecting to Mongo: ', err);
});
