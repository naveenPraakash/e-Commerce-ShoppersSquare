import React, {useState, useEffect} from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography} from '@material-ui/core';
import { useForm, FormProvider} from 'react-hook-form';
import { Link } from 'react-router-dom';
import FormInput from './FormInput';
import { commerce } from '../../lib/commerce';
const AddressForm = ({ checkoutToken, next}) => {
    const [shippingCountries, setShippingCountries]= useState([]);
    const [shippingCountry, setShippingCountry]= useState('');
    const [shippingSubdivisions, setShippingSubdivisions]= useState([]);
    const [shippingSubdivision, setShippingSubdivision]= useState('');
    const [shippingOptions, setShippingOptions]= useState([]);
    const [shippingOption, setShippingOption]= useState('');
    const methods= useForm();

    const fetchShippingCountries= async (checkoutTokenId) => {
        const {countries}= await commerce.services.localeListShippingCountries(checkoutTokenId);
        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    }
    const fetchSubDivisions= async (countryCode) => {
        const { subdivisions }= await commerce.services.localeListSubdivisions(countryCode);
        
        setShippingSubdivisions(subdivisions);
        setShippingSubdivision(Object.keys(subdivisions)[0]);
    }
    const fetchOptions= async (checkoutTokenId, country, region= null) => {
        const  options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });
        setShippingOptions(options);
        setShippingOption(options[0].id);
    }
    
    useEffect(() => {
        fetchShippingCountries(checkoutToken.id)
    },[])
    useEffect(() => {
        if(shippingCountry) fetchSubDivisions(shippingCountry);
    }, [shippingCountry]); 
    useEffect(() => {
        if(shippingSubdivision) fetchOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    }, [shippingSubdivision]); 

    const countries= Object.entries(shippingCountries).map(([code, name]) => ({id: code, label: name}));
    const subDivisions= Object.entries(shippingSubdivisions).map(([code, name]) => ({id: code, label: name}));
    const options= shippingOptions.map((shipopt) => ({id: shipopt.id, label: `${shipopt.description}- (${shipopt.price.formatted_with_symbol})`}));
    return (
        <div>
            <Typography variant= "h6" gutterbottom>Shipping Address</Typography>
            <FormProvider { ...methods}>
                <form onSubmit= {methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption}))} >
                    <Grid container spacing={3}>
                        <FormInput required name= 'FirstName' label= 'First Name' />
                        <FormInput required  name= 'LastName' label= 'Last Name' />
                        <FormInput required  name= 'Address1' label= 'Address' />
                        <FormInput required  name= 'Email' label= 'Email' />
                        <FormInput required  name= 'City' label= 'City' />
                        <FormInput required  name= 'Zip' label= 'Zip' />
                        <FormInput   name= 'Phone' label= 'contact number' />
                    
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Shipping Country</InputLabel>
                        <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>  
                            {countries.map((country) => (
                            <MenuItem key={country.id} value={country.id}>
                               {country.label}
                            </MenuItem>
                            ))}
                            
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Shipping Sub-division</InputLabel>
                        <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>  
                            {subDivisions.map((subdiv) => (
                            <MenuItem key={subdiv.id} value={subdiv.id}>
                               {subdiv.label}
                            </MenuItem>
                            ))}
                            
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Shipping Options</InputLabel>
                        <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>  
                            {options.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                               {option.label}
                            </MenuItem>
                            ))}
                            
                        </Select>
                    </Grid>
                    </Grid>
                    <br />
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button component= {Link} to= "/cart" variant="outlined" color="secondary">Back to cart</Button>
                        <Button type= "submit" variant="contained" color= "primary">Next</Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}
export default AddressForm;