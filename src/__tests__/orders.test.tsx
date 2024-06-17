import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Orders from '../components/orders';

// Mock the AWS Amplify client
jest.mock('aws-amplify/api', () => ({
  generateClient: jest.fn().mockReturnValue({
    models: {
      Order: {
        list: jest.fn().mockResolvedValue({
          data: [
            {
              id: '1',
              items: [
                { cafeItemId: '1', name: 'Product 1', price: 10 },
                { cafeItemId: '2', name: 'Product 2', price: 20 },
              ],
            },
          ],
        }),
      },
      CafeItem: {
        get: jest.fn().mockImplementation(({ id }) => {
          const items = {
            '1': { data: { name: 'Product 1', price: 10 } },
            '2': { data: { name: 'Product 2', price: 20 } },
          };
          return Promise.resolve(items[id]);
        }),
      },
    },
  }),
}));

describe('Orders', () => {
  it('renders loading state initially', () => {
    render(
      <Router>
        <Orders />
      </Router>
    );

    expect(screen.getByText('Loading your orders...')).toBeTruthy();
  });

  it('renders orders after loading', async () => {
    render(
      <Router>
        <Orders />
      </Router>
    );

    await waitFor(() => screen.getByText('Your Orders'));

    expect(screen.getByText('Order ID: 1')).toBeTruthy();
    expect(screen.getByText('Product 1 R$10')).toBeTruthy();
    expect(screen.getByText('Product 2 R$20')).toBeTruthy();
    expect(screen.getByText('Total: R$30.00')).toBeTruthy();
  });
});
