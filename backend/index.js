const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// setup app
const app = express();
app.use(cors());     // cross origin resource sharing
app.use(express.json());
const PORT = 3001;
const API_KEY = process.env.API_KEY


// GET request to retrieve stock data based on a specific ticker symbol
app.get('/api/stock/:symbol', async (req, res) => {
    tickerSymbol = req.params.symbol
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${tickerSymbol}&interval=5min&apikey=${API_KEY}&datatype=csv`

    try {
        const response = await axios.get(url)
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }

})


// app is running on port PORT
app.listen(PORT, () => {
    console.log("HELLO")
})
