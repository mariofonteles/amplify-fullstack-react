import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import ShoppingCart from '../components/shopping-cart';
import { CartContext } from '../routes/root';

describe('ShoppingCart', () => {
  const cart = [
    { id: '1', name: 'Product 1', quantity: 1, price: 10 },
    { id: '2', name: 'Product 2', quantity: 2, price: 20 },
  ];
  const removeFromCart = jest.fn();

  beforeEach(() => {
    window.history.pushState({ cart }, '', '/cart');
  });

  it('renders products in cart', () => {
    render(
      <Router>
        <CartContext.Provider value={{ addToCart: jest.fn(), cart, removeFromCart: jest.fn()}}>
          <ShoppingCart onClose={jest.fn()} />
        </CartContext.Provider>
      </Router>
    );

    expect(screen.getByText('Product 1')).toBeTruthy();
    expect(screen.getByText('R$10')).toBeTruthy();
    expect(screen.getByText('Product 2')).toBeTruthy();
    expect(screen.getByText('R$20')).toBeTruthy();
  });

  it('removes product from cart when "Delete" is clicked', () => {
    render(
      <Router>
        <CartContext.Provider value={{ addToCart: jest.fn(), cart, removeFromCart: jest.fn()}}>
          <ShoppingCart onClose={jest.fn()} />
        </CartContext.Provider>
      </Router>
    );

    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);

    expect(removeFromCart).toHaveBeenCalledWith(cart[0]);
  });

  it('navigates to checkout when "Go to checkout" is clicked', () => {
    const { history } = render(
      <Router>
        <CartContext.Provider value={{ addToCart: jest.fn(), cart, removeFromCart: jest.fn()}}>
          <ShoppingCart onClose={jest.fn()} />
        </CartContext.Provider>
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /go to checkout/i }));

    expect(history.location.pathname).toBe('/checkout');
  });
});
