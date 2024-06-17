import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Checkout from '../components/checkout';
import { CartContext } from '../routes/root';

// Mock the AWS Amplify client
jest.mock('aws-amplify/api', () => ({
  generateClient: jest.fn().mockReturnValue({
    models: {
      Order: {
        create: jest.fn().mockResolvedValue({ data: { id: '1' } }),
      },
      OrderCafeItem: {
        create: jest.fn().mockResolvedValue({}),
      },
    },
  }),
}));

describe('Checkout', () => {
  const cart = [
    { id: '1', name: 'Product 1', quantity: 1, price: 10 },
    { id: '2', name: 'Product 2', quantity: 2, price: 20 },
  ];

  beforeEach(() => {
    window.history.pushState({ cart }, '', '/checkout');
  });

  it('renders total cost', () => {
    render(
      <Router>
        <CartContext.Provider value={{ addToCart: jest.fn(), cart, removeFromCart: jest.fn()}}>
          <Checkout />
        </CartContext.Provider>
      </Router>
    );

    expect(screen.getByText('Total: R$50.00')).toBeTruthy();
  });

  it('renders products in cart', () => {
    render(
      <Router>
        <CartContext.Provider value={{ addToCart: jest.fn(), cart, removeFromCart: jest.fn()}}>
          <Checkout />
        </CartContext.Provider>
      </Router>
    );

    expect(screen.getByText('Product 1')).toBeTruthy();
    expect(screen.getByText('(Quantity: 1) - R$10')).toBeTruthy();
    expect(screen.getByText('Product 2')).toBeTruthy();
    expect(screen.getByText('(Quantity: 2) - R$20')).toBeTruthy();
  });

  it('completes payment when "Complete Payment" is clicked', async () => {
    render(
      <Router>
        <CartContext.Provider value={{ addToCart: jest.fn(), cart, removeFromCart: jest.fn()}}>
          <Checkout />
        </CartContext.Provider>
      </Router>
    );

    fireEvent.click(screen.getByText('Complete Payment'));

    await waitFor(() => screen.getByText('Processing payment...'));

    await waitFor(() => screen.getByText('Payment Successful!'));
    await waitFor(() => screen.getByText('Redirecting you to Orders page...'));
  });
});
