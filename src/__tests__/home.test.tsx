import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '../components/home';
import { CartContext } from '../routes/root';

// Mock the AWS Amplify client
jest.mock('aws-amplify/api', () => ({
  generateClient: jest.fn().mockReturnValue({
    models: {
      CafeItem: {
        observeQuery: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockImplementation(({ next }) => {
            next({ items: [{ name: 'Test Product', price: 10, id: '1' }] });
            return { unsubscribe: jest.fn() };
          }),
        }),
      },
    },
  }),
}));

describe('Home', () => {
  it('renders loading state initially', () => {
    render(<Home />);
    expect(screen.getByText('Loading products...')).toBeTruthy();
  });

  it('renders products after loading', async () => {
    render(
      <CartContext.Provider value={{ addToCart: jest.fn(), removeFromCart: jest.fn(), cart: [] }}>
        <Home />
      </CartContext.Provider>
    );

    await waitFor(() => screen.getByText('Test Product'));

    expect(screen.getByText('Test Product')).toBeTruthy();
    expect(screen.getByText('R$10')).toBeTruthy();
  });

  it('adds product to cart when "Add to Cart" is clicked', async () => {
    const addToCart = jest.fn();
    render(
      <CartContext.Provider value={{ addToCart: jest.fn(), removeFromCart: jest.fn(), cart: [] }}>
        <Home />
      </CartContext.Provider>
    );

    await waitFor(() => screen.getByText('Test Product'));

    fireEvent.click(screen.getByText('Add to Cart'));

    expect(addToCart).toHaveBeenCalledWith({
      name: 'Test Product',
      quantity: 1,
      price: 10,
      id: '1',
    });
  });
});
