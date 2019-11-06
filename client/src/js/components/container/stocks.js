import React, { useState, useEffect } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import UserStores from '../presentational/userStories';

const Stocks = () => {
  const [toggleUs, setToggleUs] = useState(false);
  const [singlePrice, setSinglePrice] = useState('');
  const [like, setLike] = useState(false);
  const [compPrice1, setCompPrice1] = useState('');
  const [compPrice2, setCompPrice2] = useState('');
  const [likeBoth, setLikeBoth] = useState(false);
  const [stockInfo, setStockInfo] = useState([]);
  const toggle = () => {
    if (toggleUs === false) {
      setToggleUs(true);
    } else {
      setToggleUs(false);
    }
  };
  const toggleLike = event => {
    event.preventDefault();
    if (like === false) {
      setLike(true);
      return;
    }
    setLike(false);
  };
  const toggleLikeBoth = event => {
    event.preventDefault();
    if (likeBoth === false) {
      setLikeBoth(true);
      return;
    }
    setLikeBoth(false);
  };
  const errorFunc = error => {
    if (error.response !== undefined && error.response.status === 404) {
      if (error.response.data.stockData.error !== undefined) {
        setStockInfo([error.response.data.stockData]);
        return;
      }
      setStockInfo([{ error: 'Error: Network Error' }]);
      return;
    }
    setStockInfo([{ error: 'Error: Network Error' }]);
  };
  const getPriceFunc = async event => {
    event.preventDefault();
    if (singlePrice === '') {
      alert('Please fill out required fields');
      return;
    }
    try {
      let url = `http://localhost:3000/api/stock-prices?stock=${singlePrice}`;
      if (like === true) {
        url = url.concat('&like=true');
      }
      const req = await axios.get(url);
      setStockInfo([req.data.stockData]);
      setSinglePrice('');
    } catch (error) {
      return errorFunc(error);
    }
  };
  const compareFunc = async event => {
    event.preventDefault();
    if (compPrice1 === '' || compPrice2 === '') {
      alert('Please fill out required fields');
      return;
    }
    let url = `http://localhost:3000/api/stock-prices?stock=${compPrice1}&stock=${compPrice2}`;
    if (likeBoth === true) {
      url = url.concat('&like=true');
    }
    try {
      const req = await axios.get(url);
      setStockInfo([...req.data.stockData]);
      setCompPrice1('');
      setCompPrice2('');
    } catch (error) {
      return errorFunc(error);
    }
  };
  return (
    <div id="stocksDiv">
      <form onSubmit={e => getPriceFunc(e)}>
        <div id="singlePriceDiv">
          <h3 className="h3">Get single price and total likes</h3>
          <input
            id="input0"
            type="text"
            placeholder="GOOG"
            value={singlePrice}
            onChange={e => setSinglePrice(e.target.value)}
          />
          <input type="checkbox" onInput={e => toggleLike(e)} />
          <span className="qMark">Like?</span>
          <br />
          <button id="button0" type="submit">
            Get Price!
          </button>
        </div>
      </form>
      <form onSubmit={e => compareFunc(e)}>
        <div id="compareDiv">
          <h3 className="h3">Compare and get relative likes</h3>
          <input
            id="input1"
            type="text"
            className="lowerInputs"
            placeholder="GOOG"
            value={compPrice1}
            onChange={e => setCompPrice1(e.target.value)}
          />
          <input
            id="input2"
            type="text"
            className="lowerInputs"
            placeholder="MSFT"
            value={compPrice2}
            onChange={e => setCompPrice2(e.target.value)}
          />
          <input type="checkbox" onInput={e => toggleLikeBoth(e)} />
          <span className="qMark">Like both?</span>
          <button type="submit" id="secondBtn">
            Get Price!
          </button>
        </div>
      </form>
      <div>
        {stockInfo.length === 0 ? null : (
          <div id="stockInfo">
            {stockInfo[0].error !== undefined ? (
              <span>{stockInfo[0].error}</span>
            ) : (
              <div>
                {stockInfo[1] === undefined ? (
                  <div>
                    <span>
                      {stockInfo[0].company} ({stockInfo[0].stock}) | Price: {stockInfo[0].price} |
                      Likes: {stockInfo[0].likes}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span>
                      {stockInfo[0].company} ({stockInfo[0].stock}) | Price: {stockInfo[0].price} |
                      Relative Likes: {stockInfo[0].likes}
                    </span>
                    <br />
                    <br />
                    <span>
                      {stockInfo[1].company} ({stockInfo[1].stock}) | Price: {stockInfo[1].price} |
                      Relative Likes: {stockInfo[1].likes}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div id="usDiv" onClick={() => toggle()}>
        User Stories: <span id="usDivSpan">{toggleUs === false ? '▼' : '▲'}</span>
      </div>
      <div>{toggleUs === true ? <UserStores /> : null}</div>
    </div>
  );
};

export default Stocks;
