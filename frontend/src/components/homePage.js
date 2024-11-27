import '../App.css';
import { fetchStockDatabyTicker, fetchTickerRecommendations, handleLogout } from '../services/api';
import React, { useState, useEffect } from "react"
// import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as Highcharts from "highcharts/highstock";


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

    // log stockData and tickerRecs whenever they change
    useEffect(() => {
        if (stockData) {
            console.log("Updated stockData:", stockData.data);
        }
        if (tickerRecs) {
            console.log("Updated ticker recommendations:", tickerRecs);
        }
    }, [stockData, tickerRecs]);

    // useEffect(() => {
    //   if (ticker) {
    //     getTickerRecs();
    //   } else {
    //     setTickerRecs([]);
    //   }
    // }, [ticker]);


    // parses the returned stock data to display
    const parseStockData = (data) => {
        console.log(data)
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

    // function that gets the stock data based on the ticker symbol entered by the user
    const getStockData = async () => {

        try {
            const rawData = await fetchStockDatabyTicker(ticker)
            const extractedData = rawData.data

            try {
                const parsedData = parseStockData(extractedData)
                setStockData(parsedData)

            }

            catch (error) {
                console.log("HELLO")
                throw error

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
            <div class="header">
                <button class="signout" onClick={handleLogout}>Sign Out</button>
            </div>
            <h1>Stock Data Visualizer</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter ticker symbol (e.g., IBM)"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    onFocus={() => setShowDropdown(true)} />
                <button class="getStocks" onClick={getStockData}>Fetch Stock Data</button>
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
                {stockData && (
                    <div>
                        <HighchartsReact
                            highcharts={Highcharts}
                            constructorType={"stockChart"}
                            options={options}
                        />

                    </div>
                )}
            </div>
            
        </div>
    );
}



export default HomePage