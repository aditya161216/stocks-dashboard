import logo from './logo.svg';
import './App.css';
import { fetchStockDatabyTicker } from './services/api';
import React, {useState, useEffect} from "react"
// import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as Highcharts from "highcharts/highstock";

function App() {

  // stores the ticker symbol the user is looking for
  const[ticker, setTicker] = useState("") 

  // stores the returned stock data 
  const [stockData, setStockData] = useState([]);

  // log stockData whenever it changes
  useEffect(() => {
    if (stockData) {
      console.log("Updated stockData:", stockData.data);
    }
  }, [stockData]);

  // parses the returned stock data to display
  const parseStockData = (data) => {
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
      const parsedData = parseStockData(extractedData)
      setStockData(parsedData)
      console.log(parsedData)
    }
    catch (error) {
      throw error
    }

    console.log(stockData)

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
      <h1>Stock Data Visualizer</h1>
      <div>
        <input 
          type="text" 
          placeholder="Enter ticker symbol (e.g., IBM)" 
          value={ticker} 
          onChange={(e) => setTicker(e.target.value)}>
        </input>
        <button onClick={getStockData}>Fetch Stock Data</button>
      </div>
      <div>
        {stockData && (
          <div>
            {/* <h3>Stock Data for {ticker.toUpperCase()}:</h3> */}
            {/* <pre>{JSON.stringify(stockData, null, 2)}</pre> */}
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

export default App;
