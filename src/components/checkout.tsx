import React, { useContext, useState } from 'react';
import { List, ListItem, ListItemText, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../routes/root';
import { CheckCircleOutline } from '@mui/icons-material';

interface Product {
  name: string;
  quantity: number;
  price: number; // Add a price property to your product
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const { cart } = location.state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const totalCost = cart.reduce((total: number, product: Product) => total + product.price * product.quantity, 0);

  const handleCompletePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaymentComplete(true);
      setTimeout(() => {
        navigate('/home');
      }, 3000);
    }, 3000);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography variant="h4" align="center" gutterBottom>
          Processing payment...
        </Typography>
      </Box>
    );
  }

  if (paymentComplete) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
        <CheckCircleOutline color="primary" style={{ fontSize: 60 }} />
        <Typography variant="h4" align="center" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="subtitle1" align="center">
          Redirecting you to home page...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h2" align="center" gutterBottom>
        Total: R${totalCost.toFixed(2)}
      </Typography>
      <List sx={{background:'white', marginBottom:'30px'}}>
        {cart.map((product: any, index: number) => (
          <ListItem key={index}>
            <ListItemText primary={`${product.name}`} secondary={`(Quantity: ${product.quantity}) - R$${product.price}`} />
          </ListItem>
        ))}
      </List>
      <Box sx={{marginTop:'30px'}}>
        <form noValidate autoComplete="off">
            <TextField label="Card Number" value="1234 5678 9012 3456" disabled />
            <TextField label="Card Holder's Name" value="John Doe" disabled />
            <TextField label="Expiry Date" value="12/24" disabled />
            <TextField label="CVV" value="123" disabled />
            <Box display={'flex'} justifyContent={'center'} sx={{marginTop:'30px'}}>
                <Button variant="contained" color="primary" sx={{width: '50%', height:'50%'}} onClick={handleCompletePayment}>
                Complete Payment
                </Button>
            </Box>
        </form>
      </Box>
    </>
  );
}

export default Checkout;