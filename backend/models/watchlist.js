const mongoose = require('mongoose');

// schema consists of the user ID and the list of watchlists for this user
const WatchlistSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // use Google ID Token or email
    name: { type: String, required: true }, // name of watchlist
    stocks: [{ type: String }], // list of stocks in watchlist
}, { timestamps: true });

module.exports = mongoose.model("Watchlist", WatchlistSchema);