# Stocks Dashboard by Aditya Vikrant
A project that helps users visualize real-time stock data and create custom watchlists

## Clone the respository
First, clone the repository: `git clone [https cloning link]`

## .env file
Open a terminal window

Navigate into the project directory: `cd stocks-dashboard`

Create a file for environment variables: `touch .env`

Contact the repository owner for access to environment variables at vikrant.a@northeastern.edu.

Paste these variables into your newly created file.

## Run the backend
Open a terminal window.  

Navigate into the backend directory: `cd stocks-dashboard/backend`  

Install all dependencies: `npm i`

Go back a directory: `cd ..`

Then run the backend: `node backend/index.js`

## Run the frontend
Open another terminal window. 

Navigate into the project directory, then navigate into the frontend directory: `cd stocks-dashboard/frontend` 

Install all dependencies: `npm i`

Then run the frontend: `npm start`

## Visualize stock data
In the input box, enter the ticker symbol for whichever stock data you are trying to view. 
For example, if you would like to view stock data for Apple, enter 'aapl' or 'AAPL' and click 'Enter'.
Choose 'All' as the zoom option, and you should now be able to see your chart.

## View, Delete, and Update watchlists
In the bottom half of the screen, you will be able to view any watchlist you have previously created.
If not, you can proceed to create a new one!

For every watchlist, you will have a 'Delete' and 'Update' button. 

When you click the delete button, the watchlist will be removed from your list of watchlists.

When you click the update button, you will be prompted to enter a new name and new list of stocks you would like
the watchlist to have. Once you have entered these values and clicked 'Ok', your watchlist will be updated!

## Create watchlists
Below your list of watchlists, there is a section dedicated to creating your own watchlists.
In the left input box, enter the name of the watchlist you want to create.
In the right input box, enter the list of stocks (separated by commas) you would like the watchlist to contain.
Make sure that you enter the stock ticker symbols, not the actual name of the stocks!

Enjoy!


## Note: The Alpha Vantage API only allows for 25 requests a day per API key, so if your request is unable to be completed, it is due to this daily limit being exceeded.
