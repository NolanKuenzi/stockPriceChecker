import React from 'react';
import Footer from './footer';

const UserStores = () => (
  <div id="userStoriesDiv">
    <div>
      <h3>User Stories:</h3>
      <ol>
        <li>
          Set the content security policies to only allow loading of scripts and CSS from your
          server.
        </li>
        <li>
          can GET /api/stock-prices with form data containing a Nasdaq stock ticker and recieve back
          an object stockData.
        </li>
        <li>
          In stockData, I can see the stock (the ticker as a string), price (decimal in string
          format), and likes (int).
        </li>
        <li>
          I can also pass along the field like as true (boolean) to have my like added to the
          stock(s). Only 1 like per IP should be accepted.
        </li>
        <li>
          If I pass along 2 stocks, the return object will be an array with information about both
          stocks. Instead of likes, it will display rel_likes (the difference between the likes) on
          both.
        </li>
        <li>
          A good way to receive current prices is through our stock price proxy (replacing 'GOOG'
          with your stock symbol): https://repeated-alpaca.glitch.me/v1/stock/GOOG/quote
        </li>
        <li>All 5 functional tests are complete and passing.</li>
      </ol>
    </div>
    <div>
      <h3>Example usage:</h3>
      <ul>
        <li>/api/stock-prices?stock=GOOG</li>
        <li>{`/api/stock-prices?stock=GOOG${'&'}like=true`}</li>
        <li>{`/api/stock-prices?stock=GOOG${'&'}stock=MSFT`}</li>
        <li>{`/api/stock-prices?stock=GOOG${'&'}stock=MSFT${'&'}like=true`}</li>
      </ul>
    </div>
    <div>
      <h3>Example return:</h3>
      <ul>
        <li>{`{"stockData":{"stock":"GOOG","price":"786.90","likes":1}}`}</li>
        <li>
          {`{"stockData":[{"stock":"MSFT","price":"62.30","rel_likes":-1},`}
          {`{"stock":"GOOG","price":"786.90","rel_likes":1}]}`}
        </li>
      </ul>
    </div>
    <Footer />
  </div>
);

export default UserStores;
