// this file provides the frontend with all methods to call upon the backend
import { toast } from "react-toastify";

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/'; // backend base URL

// function to fetch stock data by a specific ticker symbol
export const fetchStockDatabyTicker = async (tickerSymbol) => {

    try {
        const data = await axios.get(`${API_BASE_URL}api/stock/${tickerSymbol}`, {
            withCredentials: true,
        })

        // check if the API returned an information object with a rate limit message
        if (data?.Information?.includes("rate limits")) {
            return "You have reached the API Request Limit for today.";
        }

        return data
        
    }

    catch (error) {
        // Handle error cases (e.g., API limit, network issues)
        if (error.message.includes("rate limits")) {
            throw error; // Re-throw the rate limit error for handling
        }
        throw new Error("Error fetching stock data. Please try again later.");
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
                toast.success("Logged out successfully!", {
                    position: "top-center",
                    autoClose: 3000, // Close toast after 3 seconds
                });
                window.location.href = '/login';
            } else {
                console.error('Failed to log out');
            }
        })
        .catch((error) => {
            console.error('Error logging out:', error);
        });
};
