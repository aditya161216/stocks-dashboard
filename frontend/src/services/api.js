// this file provides the frontend with all methods to call upon the backend

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/'; // backend base URL

// function to fetch stock data by a specific ticker symbol
export const fetchStockDatabyTicker = async (tickerSymbol) => {

    try {
        const data = await axios.get(`${API_BASE_URL}api/stock/${tickerSymbol}`, {
            withCredentials: true,
        })
        return data
    }

    catch (error) {
        throw error
    }

}

// function to fetch ticker recommendations based on a ticker symbol
export const fetchTickerRecommendations = async (tickerSymbol) => {

    try {
        const data = await axios.get(`${API_BASE_URL}api/recommendation/${tickerSymbol}`, {
            withCredentials: true,
        })
        return data
    }

    catch (error) {
        throw error
    }

}

// function to logout
export const handleLogout = () => {
    fetch('http://localhost:3001/auth/logout', {
        method: 'GET',
        credentials: 'include',
    })
        .then((response) => {
            if (response.ok) {
                window.location.href = '/login';
            } else {
                console.error('Failed to log out');
            }
        })
        .catch((error) => {
            console.error('Error logging out:', error);
        });
};
