import '../App.css';
import { fetchStockDatabyTicker, fetchTickerRecommendations, handleLogout } from '../services/api';
import React, { useState, useEffect } from "react"
// import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as Highcharts from "highcharts/highstock";
import { toast, ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import Watchlist from "../components/watchlist"


// homepage component
const HomePage = () => {

    // stores the ticker symbol the user is looking for
    const [ticker, setTicker] = useState("")

    // stores the returned stock data 
    const [stockData, setStockData] = useState([]);

    // stores the returned ticker recommendations
    const [tickerRecs, setTickerRecs] = useState([])

    // stores the state of the dropdown recommendation
    const [showDropdown, setShowDropdown] = useState(false);

    // determines whether to display the chart or not
    const [showChart, setShowChart] = useState(false);


    // log stockData and tickerRecs whenever they change
    useEffect(() => {
        if (stockData) {
            console.log("Updated stockData:", stockData.data);
        }
        if (tickerRecs) {
            console.log("Updated ticker recommendations:", tickerRecs);
        }
    }, [stockData, tickerRecs]);

    // update ticker recommendations as the user is typing in a ticker symbol
    // useEffect(() => {
    //   if (ticker) {
    //     getTickerRecs();
    //   } else {
    //     setTickerRecs([]);
    //   }
    // }, [ticker]);


    // parses the returned stock data to display
    const parseStockData = (data) => {

        if (data?.Information === "Thank you for using Alpha Vantage! Our standard API rate limit is 25 requests per day. Please subscribe to any of the premium plans at https://www.alphavantage.co/premium/ to instantly remove all daily rate limits.") {
            
            return "You have reached the API Request Limit for today.";
        }

        else {
            // split CSV into rows
            const rows = data.split("\r\n").slice(1);

            // map rows into Highcharts candlestick format
            const parsedData = rows.map((row) => {
                const [timestamp, open, high, low, close] = row.split(",");
                if (!timestamp || !open || !high || !low || !close) return null; // skip invalid rows
                return [
                    new Date(timestamp).getTime(), // convert timestamp to milliseconds
                    parseFloat(open),
                    parseFloat(high),
                    parseFloat(low),
                    parseFloat(close),
                ];
            });

            // filter out null rows
            return parsedData.filter((item) => item !== null);

        }
        
    }

    // function that gets the stock data based on the ticker symbol entered by the user
    const getStockData = async () => {
        if (!ticker) {
            toast.error("Enter a valid ticker symbol.", {
                position: "top-center",
                autoClose: 5000,
            });
            return
        }

        try {
            var rawData;
            if (ticker) {
                rawData = await fetchStockDatabyTicker(ticker)
                
                const LIMIT_REACHED = (rawData.data.Information === "Thank you for using Alpha Vantage! Our standard API rate limit is 25 requests per day. Please subscribe to any of the premium plans at https://www.alphavantage.co/premium/ to instantly remove all daily rate limits.")
                
                // Check if rate limit message is returned
                if (LIMIT_REACHED) {
                    toast.error("You have reached the request limit for today.", {
                        position: "top-center",
                        autoClose: 5000,
                    });
                    return
                }

                else {
                    const extractedData = rawData.data

                    try {
                        const parsedData = parseStockData(extractedData)
                        setShowChart(true)
                        setStockData(parsedData)

                    }

                    catch (error) {
                        toast.error(error.message, {
                            position: "top-center",
                            autoClose: 5000,
                        });
                        return
                    }

                }

            }
            else {
                setStockData([])
                return "Please enter a valid ticker"
            }
            

            

        }
        catch (error) {
            throw error
        }

        console.log(stockData)

    }

    // handles when user selects a recommendation from the dropdown list
    const handleSelectRecommendation = (symbol) => {
        setTicker(symbol);
        setShowDropdown(false);
        getStockData();
    };

    // handles logout functionality


    // function to fetch ticker recommendations based on a ticker symbol
    const getTickerRecs = async () => {
        try {
            const rawData = await fetchTickerRecommendations(ticker)
            const extractedData = rawData.data.bestMatches
            // const parsedData = parseStockData(extractedData)
            setTickerRecs(extractedData)
        }
        catch (error) {
            setTickerRecs([])
            throw error
        }

    }


    // options for the chart displaying data
    const options = {
        chart: {
            backgroundColor: '#e1e1e4', // Set the background color (replace with your desired color)
        },
        rangeSelector: {
            selected: 1,
        },
        title: {
            text: `Stock History for ${ticker.toUpperCase()}`,
        },
        series: [
            {
                type: "candlestick",
                name: `${ticker.toUpperCase()} Stock Price`,
                data: stockData || [],
            },
        ],
    };

    return (
        <div className="App">
            <ToastContainer />
            <div class="header">
                <button class="signout" onClick={handleLogout}>Sign Out</button>
            </div>
            <p className="input-prompt">Enter a stock ticker symbol (e.g., AAPL, TSLA, AMZN) to view its market performance.</p>
            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    onFocus={() => setShowDropdown(true)} />
                <button class="getStocks" onClick={getStockData}>Fetch Data</button>
                {showDropdown && Array.isArray(tickerRecs) && tickerRecs.length > 0 && (
          <div className="dropdown">
            {/* {tickerRecs.map((rec, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleSelectRecommendation(rec["1. symbol"])}
              >
                {rec["1. symbol"]} - {rec["2. name"]}
              </div>
            ))} */}
          </div>
        )}
                {/* <button onClick={getTickerRecs}>Fetch Ticker Recs</button> */}
            </div>
            <div>
                {stockData && showChart && (
                    <div>
                        <HighchartsReact
                            highcharts={Highcharts}
                            constructorType={"stockChart"}
                            options={options}
                        />

                    </div>
                )}
            </div>
            <Watchlist></Watchlist>
            
        </div>
    );
}



export default HomePage