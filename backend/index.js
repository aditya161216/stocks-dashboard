require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const session = require('express-session');
// const { google } = require('google-auth-library');
const cookieParser = require('cookie-parser');
const { google } = require('googleapis');

const PORT = 3001;
const API_KEY = process.env.API_KEY


// setup app
const app = express();
app.use(
    cors({
        origin: 'http://localhost:3000', // allow frontend origin
        credentials: true, // allow cookies
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Set to true if using HTTPS
            httpOnly: true, // Prevent access to cookies via JavaScript
            sameSite: 'lax', // CSRF protection
        },
    })
);

// Google OAuth2 Configuration
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// middleware to check authentication
const isAuthenticated = (req, res, next) => {
    if (!req.session.tokens) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    next();
};

// route to initiate login
app.get('/auth/login', (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ];
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    res.redirect(authUrl);
});


// callback route to handle authentication
app.get('/auth/callback', async (req, res) => {
    const { code } = req.query;
    try {
        // Exchange authorization code for access and refresh tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Store tokens in session
        req.session.tokens = tokens;

        // Redirect to a dashboard or home page
        if (req.session.tokens) {
            res.redirect('http://localhost:3000/');

        }
       
    } catch (error) {
        console.error('Error during OAuth callback:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// check if user is authenticated
app.get('/auth/check', (req, res) => {
    if (req.session.tokens) {
        res.status(200).json({ authenticated: true });
    } else {
        res.status(401).json({ authenticated: false });
    }
});


// logout route
app.get('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error while logging out in backend:', err);
        }
        else {
            console.log("Logged out successfully")
        }
        res.clearCookie('connect.sid'); // clear the session cookie
        return res.status(200).json({ message: 'Logged out successfully' });
    });
});


// GET request to retrieve stock data based on a specific ticker symbol
app.get('/api/stock/:symbol', isAuthenticated, async (req, res) => {
    tickerSymbol = req.params.symbol
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${tickerSymbol}&interval=5min&apikey=${API_KEY}&datatype=csv&outputsize=compact`

    try {
        const response = await axios.get(url)
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }

})

// GET request to retrieve recommended ticker symbols based on entered input
app.get('/api/recommendation/:symbol', isAuthenticated, async (req, res) => {
    tickerSymbol = req.params.symbol
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${tickerSymbol}&apikey=${API_KEY}`

    try {
        const response = await axios.get(url)
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch ticker recommendations' });
    }

})


// app is running on port PORT
app.listen(PORT, () => {
    console.log("HELLO")
})
