import React, { useContext } from 'react';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography, Grid } from '@mui/material';
import { createStyles } from '@mui/material/styles/';
import { CartContext } from "../routes/root"
import { generateClient } from 'aws-amplify/api';
import type { Schema } from "../../amplify/data/resource";

const useStyles = createStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const Home: React.FC = () => {
//   const classes = useStyles();
  const products = [{name: 'product 1', price: 10.00}, {name: 'product 2', price: 15.00}, {name: 'product 3', price: 5.00}]; // Replace with your actual product data
  
  const client = generateClient<Schema>();

  const { addToCart } = useContext(CartContext);

  const handleAddToCartClick = (product: any) => {
    // const product = { name: 'Product 1', quantity: 1 }; // Replace with your actual product data
    addToCart({name: product.name, quantity: 1, price: product.price});
  };
  return (
    <>
     <Typography variant="h4" align="center" gutterBottom>
        Escolha os produtos:
      </Typography>
    <Grid container spacing={3} justifyContent={'center'}>
        {products.map((product, index) => (
        <Grid item key={index}>
          <Card sx={{width: '15vw'}}>
            <CardActionArea>
              <CardMedia
                sx={{height: 140}}
                image="https://via.placeholder.com/150" // Replace with your actual image URL
                title={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                  R${product.price}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" onClick={() => handleAddToCartClick(product)}>
                Add to Cart
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
    </>
  );
}

export default Home;