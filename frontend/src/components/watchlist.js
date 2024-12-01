import React, { useState, useEffect } from "react";
import {
    fetchWatchlists,
    createWatchlist,
    updateWatchlist,
    deleteWatchlist,
} from "../services/api"; 
import "../Watchlist.css"
import { toast, ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS

const Watchlist = () => {
    const [watchlists, setWatchlists] = useState([]);
    const [newWatchlistName, setNewWatchlistName] = useState("");
    const [newWatchlistStocks, setNewWatchlistStocks] = useState("");

    // fetch watchlists when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchWatchlists();
                console.log(data)
                setWatchlists(data);
            } catch (error) {
                console.error("Failed to fetch watchlists:", error);
            }
        };
        fetchData();
    }, []);

    // creating a new watchlist
    const handleCreateWatchlist = async () => {
        if (!newWatchlistName || !newWatchlistStocks) {
            alert("Please provide a name and stocks for the watchlist.");
            return;
        }
        try {
            const newWatchlist = {
                name: newWatchlistName,
                stocks: newWatchlistStocks.split(",").map((stock) => stock.trim()),
            };
            const createdWatchlist = await createWatchlist(newWatchlist);
            setWatchlists([...watchlists, createdWatchlist]);
            setNewWatchlistName("");
            setNewWatchlistStocks("");
        } catch (error) {
            console.error("Failed to create watchlist:", error);
        }
    };

    // deleting a watchlist
    const handleDeleteWatchlist = async (id) => {
        try {
            await deleteWatchlist(id);   // delete it from database
            setWatchlists(watchlists.filter((watchlist) => watchlist._id !== id));    // delete it from frontend
        } catch (error) {
            console.error("Failed to delete watchlist:", error);
        }
    };

    // Handle updating a watchlist
    const handleUpdateWatchlist = async (id) => {
        const updatedName = prompt("Enter new name for the watchlist:");
        const updatedStocks = prompt("Enter new stocks (comma-separated):");

        if (!updatedName || !updatedStocks) {
            alert("Name and stocks are required to update the watchlist.");
            return;
        }

        try {
            const updatedWatchlist = {
                name: updatedName,
                stocks: updatedStocks.split(",").map((stock) => stock.trim()),
            };
            const response = await updateWatchlist(id, updatedWatchlist);
            setWatchlists(
                watchlists.map((watchlist) =>
                    watchlist._id === id ? response : watchlist
                )
            );
        } catch (error) {
            console.error("Failed to update watchlist:", error);
        }
    };

    return (
        <div>
            <h1>My Watchlists</h1>
            <div>
                {watchlists.length === 0 ? (
                    <p>No watchlists found. Create one below!</p>
                ) : (
                    watchlists.map((watchlist) => (
                        <div key={watchlist._id} className="watchlist">
                            <h3>{watchlist.name}</h3>
                            <p>Stocks: {watchlist.stocks.join(", ")}</p>
                            <button onClick={() => handleDeleteWatchlist(watchlist._id)}>
                                Delete
                            </button>
                            <button onClick={() => handleUpdateWatchlist(watchlist._id)}>
                                Update
                            </button>
                        </div>
                    ))
                )}
            </div>
            <div>
                <h2>Create a New Watchlist</h2>
                <input
                    type="text"
                    placeholder="Watchlist Name"
                    value={newWatchlistName}
                    onChange={(e) => setNewWatchlistName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && newWatchlistName && newWatchlistStocks) {
                            handleCreateWatchlist(); // get data when user presses enter
                        }
                        else if (e.key === "Enter" && (!newWatchlistName || !newWatchlistStocks)) {
                            toast.error("Please enter a watchlist name and stocks for this watchlist.", {
                                position: "top-center",
                                autoClose: 5000,
                            });
                        }
                    }}
                />
                <input
                    type="text"
                    placeholder="Stocks (comma-separated)"
                    value={newWatchlistStocks}
                    onChange={(e) => setNewWatchlistStocks(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && newWatchlistName && newWatchlistStocks) {
                            handleCreateWatchlist(); // get data when user presses enter
                        }
                        else if (e.key === "Enter" && (!newWatchlistName || !newWatchlistStocks)) {
                            toast.error("Please enter a watchlist name and stocks for this watchlist.", {
                                position: "top-center",
                                autoClose: 5000,
                            });
                        }
                    }}
                />
                <button onClick={handleCreateWatchlist}>Create Watchlist</button>
            </div>
        </div>
    );
};

export default Watchlist;