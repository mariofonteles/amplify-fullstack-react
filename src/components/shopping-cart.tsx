import React, { createContext, useContext, useState } from 'react';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography, Grid, IconButton, List, ListItem, ListItemText, TextField, Box } from '@mui/material';
import { createStyles } from '@mui/material/styles/';
import {Add, Remove} from '@mui/icons-material'
import { CartContext, Product } from '../routes/root';
import { useNavigate } from 'react-router-dom';

// interface Product {
//     name: string;
//     quantity: number;
// }

interface ShoppingCartProps {
    onClose: () => void;
  }

const ShoppingCart: React.FC<ShoppingCartProps> = ({ onClose }) => {
//   const classes = useStyles();
    const navigate = useNavigate();

    const { cart } = useContext(CartContext);

    const [products, setProducts] = useState<Product[]>([
        ...cart
    ]);

    const handleIncrement = (index: number) => {
        const newProducts = [...products];
        newProducts[index].quantity++;
        setProducts(newProducts);
    };

    const handleDecrement = (index: number) => {
        const newProducts = [...products];
        newProducts[index].quantity = Math.max(0, newProducts[index].quantity - 1);
        setProducts(newProducts);
    };

    const handleCheckout = () => {
        onClose(); // Close the modal
        navigate('/checkout', { state: { cart } });
      };

    if(!products || products.length <= 0) {
        return (
            <Box>
               <Typography variant="h4" align="center" gutterBottom>
                    Shopping Cart is Empty
                </Typography>
            </Box>
        )
    }
    return (
        <>
        <List sx={{backgroundColor: 'white'}}>
        {cart.map((product, index) => (
            <ListItem key={index}>
            <ListItemText primary={product.name} />
            <ListItemText primary={`R$${product.price}`} />
            <TextField type="number" sx={{width:'15%'}} value={product.quantity} InputProps={{ readOnly: true }} />
            <IconButton onClick={() => handleIncrement(index)}>
                <Add />
            </IconButton>
            <IconButton onClick={() => handleDecrement(index)}>
                <Remove />
            </IconButton>
            </ListItem>
        ))}
        </List>
        <Box display="flex" justifyContent="center">
            <Button variant="contained" color="primary" sx={{marginTop: '15px'}} onClick={handleCheckout}>
                Go to checkout
            </Button>
        </Box>
        </>
    );
}

export default ShoppingCart;