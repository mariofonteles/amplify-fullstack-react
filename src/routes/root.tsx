import React, { createContext } from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, List, ListItem, ListItemText, Box, IconButton } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import MenuIcon from '@mui/icons-material/Menu';
import Modal from '@mui/material/Modal';
import ShoppingCart from '../components/shopping-cart';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50vw',
  height: '50vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export interface Product {
  name: string;
  quantity: number;
  price?: number;
}

export interface CartContextProps {
  cart: Product[];
  addToCart: (product: Product) => void;
}

export const CartContext = createContext<CartContextProps>({} as CartContextProps);


const Root: React.FC = () => {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart(prevCart => [...prevCart, product]);
  };


  return (
    <Authenticator>
      {({ signOut, user }) => (
      <main>
      <CartContext.Provider value={{ cart, addToCart }}>
        <AppBar position="fixed">
          <Toolbar>
            {/* <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton> */}
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              {user?.signInDetails?.loginId}
            </Typography>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Café Facul
            </Typography>
            {/* <Button color="inherit">Menu</Button> */}
            <Button color="inherit" onClick={handleOpen}>Carrinho</Button>
            {/* <Button color="inherit">Minha Conta</Button> */}
            <Button onClick={signOut} color="inherit">Logout</Button>
          </Toolbar>
        </AppBar>
        <Modal 
          open={open}
          onClose={handleClose}>
            <Box sx={style}>
              <ShoppingCart onClose={handleClose}/>
            </Box>
        </Modal>
        <Outlet/>
      </CartContext.Provider>
      </main>
      
      )}
    </Authenticator>
  );
}

export default Root;

