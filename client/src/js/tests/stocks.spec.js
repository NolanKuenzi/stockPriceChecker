import React from 'react';
import { render, cleanup, fireEvent, waitForDomChange, act } from '@testing-library/react';
import regeneratorRuntime, { async } from 'regenerator-runtime'; /* eslint-disable-line */
import axiosMock from 'axios';
import Stocks from '../components/container/stocks';

afterEach(cleanup);
jest.mock('axios');

describe('<Stocks /> component', () => {
  test('It displays the default text', () => {
    const { container } = render(<Stocks />);
    const stocksDiv = container.querySelector('[id="stocksDiv"]');
    expect(stocksDiv.textContent).toContain('Get single price and total likes');
    expect(stocksDiv.textContent).toContain('Compare and get relative likes');
  });
  test('It renders <UserStories /> component', () => {
    const { container } = render(<Stocks />);
    const stocksDiv = container.querySelector('[id="stocksDiv"]');
    const usDiv = container.querySelector('[id="usDiv"]');
    fireEvent.click(usDiv);
    act(() => {
      expect(stocksDiv.textContent).toContain(
        'I can also pass along the field like as true (boolean) to have my like added to the stock(s). Only 1 like per IP should be accepted.'
      );
      expect(stocksDiv.textContent).toContain(`/api/stock-prices?stock=GOOG${'&'}stock=MSFT`);
      expect(stocksDiv.textContent).toContain(
        `{"stockData":{"stock":"GOOG","price":"786.90","likes":1}}`
      );
    });
  });
  test('It displays get req data for a single stock', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        stockData: {
          company: 'Alphabet, Inc.',
          stock: 'GOOG',
          price: '1265.13',
          likes: '0',
        },
      },
    });
    const { container } = render(<Stocks />);
    const input0 = container.querySelector('[id="input0"]');
    const button0 = container.querySelector('[id="button0"]');
    fireEvent.change(input0, { target: { value: 'goog' } });
    fireEvent.click(button0);
    await waitForDomChange();
    const stockInfo = container.querySelector('[id="stockInfo"]');
    expect(stockInfo.textContent).toContain('Alphabet, Inc.');
    expect(stockInfo.textContent).toContain('GOOG');
    expect(stockInfo.textContent).toContain('1265.13');
    expect(stockInfo.textContent).toContain('0');
  });
  test('It displays get error data for a single stock', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        stockData: {
          error: 'Stock: gog was not found',
        },
      },
    });
    const { container } = render(<Stocks />);
    const input0 = container.querySelector('[id="input0"]');
    const button0 = container.querySelector('[id="button0"]');
    fireEvent.change(input0, { target: { value: 'gog' } });
    fireEvent.click(button0);
    await waitForDomChange();
    const stockInfo = container.querySelector('[id="stockInfo"]');
    expect(stockInfo.textContent).not.toContain('Alphabet, Inc.');
    expect(stockInfo.textContent).not.toContain('GOOG');
    expect(stockInfo.textContent).not.toContain('1265.13');
    expect(stockInfo.textContent).not.toContain('0');
    expect(stockInfo.textContent).toContain('Stock: gog was not found');
  });
  test('It displays get req data for two stocks', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        stockData: [
          {
            company: 'General Motors Co.',
            stock: 'GM',
            price: '38.39',
            likes: '0',
          },
          {
            company: 'Verizon Communications, Inc.',
            stock: 'VZ',
            price: '59.87',
            likes: '0',
          },
        ],
      },
    });
    const { container } = render(<Stocks />);
    const input1 = container.querySelector('[id="input1"]');
    const input2 = container.querySelector('[id="input2"]');
    const secondBtn = container.querySelector('[id="secondBtn"]');
    fireEvent.change(input1, { target: { value: 'GM' } });
    fireEvent.change(input2, { target: { value: 'VZ' } });
    fireEvent.click(secondBtn);
    await waitForDomChange();
    const stockInfo = container.querySelector('[id="stockInfo"]');
    expect(stockInfo.textContent).toContain('General Motors Co.');
    expect(stockInfo.textContent).toContain('GM');
    expect(stockInfo.textContent).toContain('38.39');
    expect(stockInfo.textContent).toContain('0');
    expect(stockInfo.textContent).toContain('Verizon Communications, Inc.');
    expect(stockInfo.textContent).toContain('VZ');
    expect(stockInfo.textContent).toContain('59.87');
    expect(stockInfo.textContent).toContain('0');
  });
});
