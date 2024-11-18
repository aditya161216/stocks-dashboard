// this file provides the frontend with all methods to call upon the backend

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/'; // backend base URL

// function to fetch stock data by a specific ticker symbol
export const fetchStockDatabyTicker = async (tickerSymbol) => {

    try {
        const data = await axios.get(`${API_BASE_URL}api/stock/${tickerSymbol}`)
        return data
    }

    catch (error) {
        throw error
    }

}
