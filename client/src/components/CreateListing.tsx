import React, { useState } from 'react';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';

export default function CreateListing() {

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const [streetError, setStreetError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [zipcodeError, setZipcodeError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [imageError, setImageError] = useState(false);


  const handleStreetChange = (e: any) => {
    setStreet(e.target.value);
  }

  const handleCityChange = (e: any) => {
    setCity(e.target.value);
  }

  const handleStateChange = (e: any) => {
    setState(e.target.value);
  }

  const handleZipcodeChange = (e: any) => {
    setZipcode(e.target.value);
  }

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  }

  const handlePriceChange = (e: any) => {
    setPrice(e.target.value);
  }
    
  return (
    <div>
      <br />
      <Typography variant='h3' component='div'>Create Listing</Typography>
      <br />
      <form>
        <Stack direction='row' spacing={1} justifyContent='space-evenly'>
          <Stack direction='column'>
            <div {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some images here, or click to select images</p>
            </div>
          </Stack>
          <Stack direction='column' spacing={2}>
            <TextField variant='filled' label='Street' id='street' name='street' value={street} onChange={handleStreetChange} size='small' error={streetError} helperText={streetError ? 'Invalid Input' : null} required fullWidth sx={{width: '350px'}} />
            <TextField variant='filled' label='City' id='city' name='city' value={city} onChange={handleCityChange} size='small' error={cityError} helperText={cityError ? 'Invalid Input' : null} required fullWidth />
            <TextField select variant='filled' label='State' id='state' name='state' value={state} onChange={handleStateChange} size='small' error={stateError} helperText={stateError ? 'Invalid Input' : null} required fullWidth>
              <MenuItem value='AL'>AL</MenuItem>
              <MenuItem value='AK'>AK</MenuItem>
              <MenuItem value='AZ'>AZ</MenuItem>
              <MenuItem value='AR'>AR</MenuItem>
              <MenuItem value='CA'>CA</MenuItem>
              <MenuItem value='CO'>CO</MenuItem>
              <MenuItem value='CT'>CT</MenuItem>
              <MenuItem value='DE'>DE</MenuItem>
              <MenuItem value='DC'>DC</MenuItem>
              <MenuItem value='FL'>FL</MenuItem>
              <MenuItem value='GA'>GA</MenuItem>
              <MenuItem value='HI'>HI</MenuItem>
              <MenuItem value='ID'>ID</MenuItem>
              <MenuItem value='IL'>IL</MenuItem>
              <MenuItem value='IN'>IN</MenuItem>
              <MenuItem value='IA'>IA</MenuItem>
              <MenuItem value='KS'>KS</MenuItem>
              <MenuItem value='KY'>KY</MenuItem>
              <MenuItem value='LA'>LA</MenuItem>
              <MenuItem value='ME'>ME</MenuItem>
              <MenuItem value='MD'>MD</MenuItem>
              <MenuItem value='MA'>MA</MenuItem>
              <MenuItem value='MI'>MI</MenuItem>
              <MenuItem value='MN'>MN</MenuItem>
              <MenuItem value='MS'>MS</MenuItem>
              <MenuItem value='MO'>MO</MenuItem>
              <MenuItem value='MT'>MT</MenuItem>
              <MenuItem value='NE'>NE</MenuItem>
              <MenuItem value='NV'>NV</MenuItem>
              <MenuItem value='NH'>NH</MenuItem>
              <MenuItem value='NJ'>NJ</MenuItem>
              <MenuItem value='NM'>NM</MenuItem>
              <MenuItem value='NY'>NY</MenuItem>
              <MenuItem value='NC'>NC</MenuItem>
              <MenuItem value='ND'>ND</MenuItem>
              <MenuItem value='OH'>OH</MenuItem>
              <MenuItem value='OK'>OK</MenuItem>
              <MenuItem value='OR'>OR</MenuItem>
              <MenuItem value='PA'>PA</MenuItem>
              <MenuItem value='RI'>RI</MenuItem>
              <MenuItem value='SC'>SC</MenuItem>
              <MenuItem value='SD'>SD</MenuItem>
              <MenuItem value='TN'>TN</MenuItem>
              <MenuItem value='TX'>TX</MenuItem>
              <MenuItem value='UT'>UT</MenuItem>
              <MenuItem value='VT'>VT</MenuItem>
              <MenuItem value='VA'>VA</MenuItem>
              <MenuItem value='WA'>WA</MenuItem>
              <MenuItem value='WV'>WV</MenuItem>
              <MenuItem value='WI'>WI</MenuItem>
              <MenuItem value='WY'>WY</MenuItem>
            </TextField>
            <TextField variant='filled' label='Zip Code' id='zipcode' name='zipcode' value={zipcode} onChange={handleZipcodeChange} size='small' error={zipcodeError} helperText={zipcodeError ? 'Invalid Input' : null} required fullWidth />
            <TextField multiline rows={3} variant='filled' label='Description' id='description' name='description' value={description} onChange={handleDescriptionChange} size='small' error={descriptionError} helperText={descriptionError ? 'Invalid Input' : null} required fullWidth />
            <TextField variant='filled' label='Price' id='price' name='price' value={price} onChange={handlePriceChange} size='small' error={priceError} helperText={priceError ? 'Invalid Input' : null} required fullWidth />
          </Stack>
        </Stack>
        <Button variant='contained' type='submit' disableElevation>Save</Button>
      </form>
    </div>
  )
}
