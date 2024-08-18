if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const ejsMate = require('ejs-mate');
const MongoStore = require("connect-mongo")
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const dbUrl = process.env.MONGO_URI;
mongoose.connect(dbUrl)
.then(() => {
    console.log('Mongo connection open');
})
.catch(err => {
    console.error('Mongo connection error:', err);
});

const app = express();

app.use(express.static('public'));


// Set up EJS with EJS Mate

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(helmet({contentSecurityPolicy:false}));


// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Method override for form submissions
app.use(methodOverride('_method'));

// Sanitize data to prevent MongoDB Operator Injection
app.use(mongoSanitize());



// Session setup
const secret = process.env.SESSION_SECRET || 'thisshouldbeabettersecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    collectionName: 'sessions', // Ensure correct collection name
    ttl: 60 * 60 * 24, // 1 day in seconds
    autoRemove: 'native', // Automatically remove expired sessions
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // Helps protect against cross-site scripting (XSS) attacks
        secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week in milliseconds
    }
};
app.use(session(sessionConfig));

// Flash messages
app.use(flash());

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());
// Configure Passport to use the User model for local authentication
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to make flash messages and current user available to all views
app.use((req, res, next) => {

    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;

    next();
});


//routes
const homePageRoutes = require('./routes/homePage');
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/ServiceRoutes')
const postariRoutes = require('./routes/postari')
const carRoutes = require('./routes/car')
const AnRoutes = require('./routes/angajati')
const programRoute = require('./routes/programari')

app.use('/',homePageRoutes)
app.use('/',authRoutes)
app.use('/',programRoute)
app.use('/services',serviceRoutes)
app.use('/postari',postariRoutes)
app.use('/cars',carRoutes)
app.use('/angajati',AnRoutes)


//404 handler
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Global error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});