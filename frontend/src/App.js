import logo from './logo.svg';
import './App.css';
import { fetchStockDatabyTicker } from './services/api';
import React, {useState} from "react"

function App() {

  // stores the ticker symbol the user is looking for
  const[ticker, setTicker] = useState() 

  // stores the returned stock data 
  const [stockData, setStockData] = useState() 

  // function that gets the stock data based on the ticker symbol entered by the user
  const getStockData = async () => {
    try {
      setStockData(await fetchStockDatabyTicker(ticker))
      console.log("SUCCESS")
    }
    catch (error) {
      throw error
    }

    console.log(stockData)

  }

  return (
    <div className="App">
      <h1>Testing ticket endpoint</h1>
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
            <h3>Stock Data for {ticker.toUpperCase()}:</h3>
            <pre>{JSON.stringify(stockData, null, 2)}</pre>
          </div>
        )}
      </div>
      
    </div>
  );
}

export default App;
