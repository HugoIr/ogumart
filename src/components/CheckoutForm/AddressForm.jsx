import { Grid, Typography, Button } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './CustomTextField';
import { InputLabel, Select, MenuItem } from '@material-ui/core';
import { commerce } from '../../lib/commerce';
import { Link } from 'react-router-dom';


const AddressForm = ( { checkoutToken, next } ) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');

    const countries = Object.entries(shippingCountries).map(([key, value]) => ( {id: key, label: value} ) );
    const subdivisions = Object.entries(shippingSubdivisions).map(([key, value]) => ( {id: key, label: value} ) );
    const options = shippingOptions.map( (option) => ({id:option.id, label: `${option.description} - (${option.price.formatted_with_symbol})` }));


    const methods = useForm();

    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

        // console.log('contires',countries);

        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    }

    const fetchShippingSubdivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);

        setShippingSubdivisions(subdivisions);
        setShippingSubdivision(Object.keys(subdivisions)[0]);
    }

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });

        setShippingOptions(options);
        setShippingOption(options[0].id);
    }


    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);
    }, [checkoutToken]);

    useEffect( () => {
        shippingCountry && fetchShippingSubdivisions(shippingCountry);
    }, [shippingCountry] );

    useEffect( () => {
        shippingSubdivision && fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    }, [checkoutToken, shippingCountry, shippingSubdivision] )

    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data)=> next({...data, shippingCountry, shippingSubdivision, shippingOption}) )} >
                    <Grid container spacing={3}>
                        <FormInput name="firstName" label="First name" />
                        <FormInput name="lastName" label="Last name" />
                        <FormInput name="address1" label="Address" />
                        <FormInput name="email" label="Email" />
                        <FormInput name="city" label="City" />
                        <FormInput name="zip" label="ZIP / Postal Code" />

                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select defaultValue="" value={shippingCountry} fullWidth onChange={ (e) => setShippingCountry(e.target.value) }>
                                 { countries.map( (country) => (
                                    <MenuItem defaultValue="" key={country.id} value={country.id}>
                                        {country.label}
                                    </MenuItem>
                                ) ) }
                                
                            </Select>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivisions</InputLabel>
                            <Select defaultValue="" value={shippingSubdivision} fullWidth onChange={ (e) => ( setShippingSubdivision(e.target.value) ) }>
                                { subdivisions.map( (subdivision) => (
                                    <MenuItem defaultValue="" key={subdivision.id} value={subdivision.id}>
                                        {subdivision.label}
                                    </MenuItem>
                                ) ) }
                            </Select>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select defaultValue="" value={shippingOption} fullWidth onChange={ (e) => setShippingOption(e.target.value) }>
                                    { options.map( (option) => (
                                        <MenuItem defaultValue="" key={option.id} value={option.id}>
                                            {option.label}
                                        </MenuItem>
                                    ) ) }
                            </Select>
                        </Grid>
                    </Grid>

                    <br />
                    <div style={{ display: 'flex', justifyContent:'space-between' }}>
                        <Button component={Link} to="/cart" variant="outlined">Back to Cart</Button>
                        <Button type="submit" variant="contained" color="primary">Next</Button>
                    </div>

                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
