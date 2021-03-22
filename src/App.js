import React, { useState, useEffect } from 'react';
import {commerce} from './lib/commerce'; 
import { Products, Navbar, Cart, Checkout} from './compnents';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
const App= () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] =useState({});
    const [order, setOrder]= useState({});
    const [errmsg, seterrmsg] = useState('');
    const fetchProducts = async () => {
        const { data } = await commerce.products.list();
        setProducts(data);
    }

    const updateQty = async (productId, quantity) => {
        const res = await commerce.cart.update(productId, { quantity });
        setCart( res.cart);
    }

    const fetchCart= async () => {
        setCart(await commerce.cart.retrieve());
    }

    const removeItem = async (id) => {
        const res= await commerce.cart.remove(id);
        setCart(res.cart);
    }

    const deleteAll = async () => {
        const res = await commerce.cart.empty();
        setCart(res.cart);
    }

    const addToCart = async (productId, quantity) => {
        const item= await commerce.cart.add(productId, quantity);
        setCart(item.cart); 
    }
    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
        setCart(newCart);
    }
    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incommingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
            setOrder(incommingOrder);
            refreshCart();
        } catch (error) {
            seterrmsg(error.data.error.message);
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);
    
    return (
        <Router>
            <div>
                <Navbar noOfItems={cart.total_items}/>
                <Switch>
                    <Route exact path="/">
                        <Products products= {products} onAddToCart= {addToCart}/>
                    </Route>
                    <Route exact path= "/cart">
                        <Cart cart= {cart} updateQty={updateQty} removeItem={removeItem} deleteAll={deleteAll}/> 
                    </Route>
                    <Route exact path="/checkout"> 
                    <Checkout cart= {cart}
                        order={order}
                        onCaptureCheckout={handleCaptureCheckout}
                        error={errmsg}
                        refreshCart={refreshCart}
                    /> </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App;