import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel,Typography, CircularProgress, Divider, Button} from '@material-ui/core';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce';
import {Link, useHistory} from 'react-router-dom';
const steps= ['Shipping Address', 'Payment details'];
const Checkout = ({ cart,order, onCaptureCheckout, error}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [ shippingData, setShippingData] = useState({});
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [finished, setFinished] = useState(false);
    const history= useHistory();
    const classes= useStyles();
    useEffect(() => {
        const genToken = async () => {
            try {
                const Token= await commerce.checkout.generateToken(cart.id, {type: 'cart'});
                setCheckoutToken(Token);
            } catch (error) {
                history.pushState('/');
            }
        }
        genToken();
    },[cart]);

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep+1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep-1);

    const next = (data) => {
        setShippingData(data);
        nextStep();
    }
    const timeup = () => {
        setTimeout(() => {
            setFinished(true);
           
        }, 4000);
    }

    let Confirmation = () => order.customer ? (
        <div>
            <div>
                <Typography variant="h5">Thank you {order.customer.firstname} for your Purchase</Typography>
                <Divider className={ classes.divider} />
                <Typography variant= "suntitle2">Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component= {Link} to= "/" variant="outlined" type="button">Home</Button>
        </div>
        ) : finished ? (<div>
            <Typography variant="h5">Thank you for your Purchase</Typography>
            <Divider className={ classes.divider} />
            <br />
            <Button component= {Link} to= "/" variant="outlined" type="button">Home</Button>

        </div>) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    if(error) {
        <div>
            <Typography variant="h5"> Error : {error}</Typography>
            <br />
        </div>
    }
    const Form = () => activeStep == 0 ? <AddressForm checkoutToken={checkoutToken} next= {next} /> : <PaymentForm  shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} timeup={timeup}/>
    return (
        <div>
            <div className={classes.toolbar}/>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </div>
        
    )
}

export default Checkout;