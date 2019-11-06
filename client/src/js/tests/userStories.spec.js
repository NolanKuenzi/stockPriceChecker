import React from 'react';
import { render, cleanup } from '@testing-library/react';
import UserStories from '../components/presentational/userStories';

afterEach(cleanup);

describe('<UserStories Component />', () => {
  test('It displays the default text', () => {
    const { container } = render(<UserStories />);
    const userStoriesDiv = container.querySelector('[id="userStoriesDiv"]');
    expect(userStoriesDiv.textContent).toContain(
      'Set the content security policies to only allow loading of scripts and CSS from your server.'
    );
    expect(userStoriesDiv.textContent).toContain(
      `/api/stock-prices?stock=GOOG${'&'}stock=MSFT${'&'}like=true`
    );
    expect(userStoriesDiv.textContent).toContain(
      `{"stockData":[{"stock":"MSFT","price":"62.30","rel_likes":-1},{"stock":"GOOG","price":"786.90","rel_likes":1}]}`
    );
  });
});
