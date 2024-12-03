require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const session = require('express-session');
// const { google } = require('google-auth-library');
const cookieParser = require('cookie-parser');
const { google } = require('googleapis');
const path = require('path');
const Watchlist = require(path.join(__dirname, './models/watchlist'));
const jwt = require('jsonwebtoken');

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
            secure: true, // IMPORTANT - set to true if backend is deployed/uses HTTPS
            httpOnly: true, // Prevent access to cookies via JavaScript
            sameSite: 'lax', // CSRF protection
        },
    })
);


// connect to mongo instance
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Google OAuth2 Configuration
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// middleware to check authentication
const isAuthenticated = (req, res, next) => {
    // res.send(req.session)
    // console.log(req)
    console.log("Session in isAuthenticated:", req);
    if (!req.session.tokens) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    next();
};

app.get('/', (req, res) => {
    res.send("Good morning")
})

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
    console.log("GOODMORNING HELLO", authUrl)
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

        req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
            } else {
                console.log('Session saved successfully');
            }
        });

        console.log("HERE ARE THE TOKENS: ", req.session.tokens)

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

app.get('/get-session', (req, res) => {
    if (req.session) {
        res.send('Session data: '
            + JSON.stringify(req.session));
    } else {
        res.send('No session data found');
    }

})


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
    console.log("HERE IS THE USERID", req.session.tokens.id_token)

    try {
        const response = await axios.get(url)
        
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch ticker recommendations' });
    }

    

})

// MONGODB STUFF

// get a user's watchlists
app.get('/api/watchlists', isAuthenticated, async (req, res) => {
    try {
        const idToken = req.session.tokens.id_token    // this is the id token given by google for this user (does not remain constant however)

        // extract the 'sub' field from the id token, as this remains constant 
        const decodedToken = jwt.decode(idToken);
        const userId = decodedToken.sub;
        
        console.log("IN backend: ", userId)
        const watchlists = await Watchlist.find({ userId });
        res.status(200).json(watchlists);
        // res.send(userId)

    }
    catch (err) {
        console.log(err)
        res.status(500).json({error: "Failed to retrieve watchlists"})
    }
})

// create a watchlist for this user
app.post('/api/watchlists', isAuthenticated, async (req, res) => {
    try {
        const idToken = req.session.tokens.id_token;

        const decodedToken = jwt.decode(idToken);
        const userId = decodedToken.sub; 

        const { name, stocks } = req.body;

        // save the watchlist
        const newWatchlist = new Watchlist({ userId, name, stocks });
        const savedWatchlist = await newWatchlist.save();

        res.status(201).json(savedWatchlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create watchlist" });
    }
});

// update an existing watchlist for this user
app.put('/api/watchlists/:id', isAuthenticated, async (req, res) => {
    try {
        const idToken = req.session.tokens.id_token;

        const decodedToken = jwt.decode(idToken);
        const userId = decodedToken.sub; 

        const { id } = req.params;
        const { name, stocks } = req.body;

        const watchlist = await Watchlist.findOne({ _id: id, userId });
        if (!watchlist) {
            return res.status(404).json({ error: "Watchlist not found or unauthorized" });
        }

        // update the watchlist
        const updatedWatchlist = await Watchlist.findByIdAndUpdate(
            id,
            { name, stocks },
            { new: true }
        );

        res.status(200).json(updatedWatchlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update watchlist" });
    }
});

// delete an existing watchlist for this user
app.delete('/api/watchlists/:id', isAuthenticated, async (req, res) => {
    try {
        const idToken = req.session.tokens.id_token;

        const decodedToken = jwt.decode(idToken);
        const userId = decodedToken.sub; 

        const { id } = req.params;

        const watchlist = await Watchlist.findOne({ _id: id, userId });
        if (!watchlist) {
            return res.status(404).json({ error: "Watchlist not found or unauthorized" });
        }

        // delete the watchlist
        await Watchlist.findByIdAndDelete(id);

        res.status(200).json({ message: "Watchlist deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete watchlist" });
    }
});


// app is running on port PORT
app.listen(PORT, () => {
    console.log("HELLO")
})
