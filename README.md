# Stocks Dashboard by Aditya Vikrant
A project that helps users visualize real-time stock data and create custom watchlists

## Clone the respository
First, clone the repository: `git clone [https cloning link]`

## Run the backend
Open a terminal window.  

Navigate into the project directory:  
`cd stocks-dashboard`  

Then run the backend:  
`node backend/index.js`

## Run the frontend
Open another terminal window. 

Navigate into the project directory, then navigate into the frontend directory:  
`cd stocks-dashboard/frontend`  

Then run the frontend:  
`npm start`

## Visualize stock data
In the input box, enter the ticker symbol for whichever stock data you are trying to view. 
For example, if you would like to view stock data for Apple, enter 'aapl' or 'AAPL' and click 'Enter'.
Choose 'All' as the zoom option, and you should now be able to see your chart.

Enjoy!


# NOTE: The Alpha Vantage API only allows for 25 requests a day per API key, so if your request is unable to be completed, it is due to this daily limit being exceeded 