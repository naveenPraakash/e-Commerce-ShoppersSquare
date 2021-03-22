import React from 'react';
import { Container, Button, Grid, Typography} from '@material-ui/core';
import CartItem from './CartItem/CartItem';
import useStyles from './styles';
import { Link } from 'react-router-dom';
const Cart = ({ cart, deleteAll, updateQty, removeItem }) => {

    const classes = useStyles();
    const EmptyCart= () => (
        <Typography variant="subtitle1">Your Shopping Cart is Empty!
        <Link to="/" className={classes.Link}> Add Item</Link>
        </Typography>
        
    );
    const FilledCart = () => (
        <div>
            <Grid container spacing= {3} >
                {cart.line_items.map((item) => (
                    <Grid item xs= {12} sm= {4} key={item.id}>
                        <div><CartItem item= {item}  updateQty={updateQty} removeItem = {removeItem}/></div>
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant= "h4"> SubTotal : {cart.subtotal.formatted_with_symbol}</Typography>
                <div>
                    <Button className= {classes.emptyButton} size= "large" type= "button" variant="contained" color="secondary" onClick= {deleteAll}>Empty Cart</Button>
                    <Button component={Link} to="/checkout" className= {classes.checkoutButton} size= "large" type= "button" variant="contained" color="primary">CheckOut</Button>
                </div>
            </div>
        </div>
    );

    if(!cart.line_items) 
        return 'loading.....';
    return (
        <div>
            <Container>
                <div className= {classes.toolbar} />
                <Typography className= {classes.title} variant="h3" gutterBottom> Your Shopping Cart</Typography>
                { !cart.line_items.length ? <EmptyCart /> : <FilledCart />}
            </Container>
        </div>
    )
}

export default Cart;