// this file provides the frontend with all methods to call upon the backend
import { toast } from "react-toastify";

import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3001/'; // backend base URL
const API_BASE_URL = 'https://stocks-dashboard-442921.ue.r.appspot.com/'

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
    fetch('https://stocks-dashboard-442921.ue.r.appspot.com/auth/logout', {
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


// fetch all watchlists for the user
export const fetchWatchlists = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}api/watchlists`, {
            withCredentials: true,
        });
        console.log("I am in api.js", response)
        return response.data;
    } catch (error) {
        console.error("Error fetching watchlists:", error);
        throw error;
    }
};

// create a new watchlist
export const createWatchlist = async (watchlist) => {
    try {
        const response = await axios.post(`${API_BASE_URL}api/watchlists`, watchlist, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating watchlist:", error);
        throw error;
    }
};

// update a watchlist
export const updateWatchlist = async (id, watchlist) => {
    try {
        const response = await axios.put(`${API_BASE_URL}api/watchlists/${id}`, watchlist, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error updating watchlist:", error);
        throw error;
    }
};

// delete a watchlist
export const deleteWatchlist = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}api/watchlists/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting watchlist:", error);
        throw error;
    }
};