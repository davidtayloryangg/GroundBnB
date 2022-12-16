import React, { useState, useMemo, useEffect, useContext } from 'react';
import { Autocomplete, Box, Button, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../firebase/Auth';
import parse from 'autosuggest-highlight/parse';
import * as _ from 'lodash';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const PLACESTYPES = ['premise', 'street_address'];

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}
const autocompleteService = { current: null as any };

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
  terms: Array<any>;
  types: Array<string>;
}

export default function CreateListing() {
  const { currentUser } = useContext(AuthContext);

  const [value, setValue] = React.useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly PlaceType[]>([]);
  const loaded = React.useRef(false);

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ accept: { 'image/jpeg': ['.jpeg', '.jpg'] } });

  const [streetError, setStreetError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [zipcodeError, setZipcodeError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector('head'),
        'google-maps',
      );
    }

    loaded.current = true;
  }

  const fetch = useMemo(
    () =>
      _.throttle(
        (
          request: { input: string, types: Array<string> },
          callback: (results?: readonly PlaceType[]) => void,
        ) => {
          (autocompleteService.current as any).getPlacePredictions(
            request,
            callback,
          );
        },
        200,
      ),
    [],
  );

  useEffect(() => {
    let active = true;

    if (value) {
      // TODO: fill in fields here since address has been selected
      // https://developers.google.com/maps/documentation/places/web-service/details
      setStreet(`${value.terms[0].value} ${value.terms[1].value}`);
      setCity(value.terms[2].value);
      setState(value.terms[3].value);
    }

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (
        window as any
      ).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    if (/^\d+$/.test(inputValue.charAt(0))) {
      fetch({ input: inputValue, types: PLACESTYPES }, (results?: readonly PlaceType[]) => {
        if (active) {
          let newOptions: readonly PlaceType[] = [];
  
          if (value) {
            newOptions = [value];
          }
  
          if (results) {
            newOptions = [...newOptions, ...results];
          }
  
          setOptions(newOptions);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const handleStreetChange = (e: any) => {
    setStreet(e.target.value);
  };

  const handleCityChange = (e: any) => {
    setCity(e.target.value);
  };

  const handleStateChange = (e: any) => {
    setState(e.target.value);
  };

  const handleZipcodeChange = (e: any) => {
    setZipcode(e.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e: any) => {
    setPrice(e.target.value);
  };

  const checkForErrors = () => {
    let errors = false;
    if (street.trim().length === 0) {
      errors = true;
      setStreetError(true);
    }
    if (city.trim().length === 0) {
      errors = true;
      setCityError(true);
    }
    if (state.trim().length === 0) {
      errors = true;
      setStateError(true);
    }
    if (zipcode.trim().length === 0 || zipcode.trim().length !== 5 || !/^\d+$/.test(zipcode)) {
      errors = true;
      setZipcodeError(true);
    }
    if (description.trim().length === 0) {
      errors = true;
      setDescriptionError(true);
    }
    if (price.trim().length === 0 || !/^\d+$/.test(price)) {
      errors = true;
      setPriceError(true);
    }
    if (acceptedFiles.length === 0) {
      errors = true;
      setImageError(true);
    }
    return errors
  };

  const createListing = async (description: String, price: String, street: String, city: String, state: String, zipcode: String, imageArray: Array<File>) => {
    // Validate address
    console.log('validating addresss')
    const { data } = await axios.post(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${GOOGLE_MAPS_API_KEY}`, {
      address: {
        regionCode: "US",
        locality: city,
        administrativeArea: state,
        postalCode: zipcode,
        addressLines: [street]
      },
      enableUspsCass: true
    });
    console.log('address validated')
    if (data.result.verdict.hasUnconfirmedComponents || data.result.verdict.hasReplacedComponents) {
      throw 'Invalid Address'
    }
    console.log('calling server')
    // Need to call post route
    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    const serverReponse = await axios.post('http://localhost:4000/listings/create', {
      description: description,
      price: price,
      street: data.result.address.postalAddress.addressLines[0],
      city: data.result.address.postalAddress.locality,
      state: data.result.address.postalAddress.administrativeArea,
      zipcode: data.result.address.postalAddress.postalCode.substring(0, 5),
      lat: data.result.geocode.location.latitude,
      lon: data.result.geocode.location.longitude,
      ownerId: currentUser.uid,
      "imageArray[]": acceptedFiles
    }, config)
    console.log(serverReponse);
  }

  const imagesList = acceptedFiles.map((file, index) => {
    return <li key={index}>{file.name}</li>
  });

  return (
    <div>
      <br />
      <Typography variant='h3' component='div'>Create Listing</Typography>
      <br />
      <form
        id='create-listing-form'
        onSubmit={async (e) => {
          e.preventDefault();
          setStreetError(false);
          setCityError(false);
          setStateError(false);
          setZipcodeError(false);
          setDescriptionError(false);
          setPriceError(false);
          setImageError(false);

          const errors = checkForErrors();
          if (!errors) {
            try {
              await createListing(description, price, street, city, state, zipcode, acceptedFiles);
            } catch (e) {
              console.log(e);
            }
          }

        }}>
        <Stack direction='row' spacing={1} justifyContent='space-evenly'>
          <Stack direction='column'>
            <div className='image-dropzone-area' {...getRootProps({className: 'dropzone image-dropzone-area'})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some images here, or click to select images</p>
            </div>
            <div>
              <p className='error'>{imageError ? 'Must select at least one image' : ''}</p>
              <p>Files:</p>
              <ul>
                {imagesList}
              </ul>
            </div>
          </Stack>
          <Stack direction='column' spacing={2}>
          <Autocomplete
            id="google-map-demo"
            size='small'
            sx={{ width: 350 }}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.description
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(event: any, newValue: any | null) => {
              setOptions(newValue ? [newValue, ...options] : options);
              setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Add a location" fullWidth />
            )}
            renderOption={(props, option) => {
              const matches = option.structured_formatting.main_text_matched_substrings;
              const parts = parse(
                option.structured_formatting.main_text,
                matches.map((match: any) => [match.offset, match.offset + match.length]),
              );

              return (
                <li {...props}>
                  <Grid container alignItems="center">
                    <Grid item>
                      <Box
                        component={LocationOnIcon}
                        sx={{ color: 'text.secondary', mr: 2 }}
                      />
                    </Grid>
                    <Grid item xs>
                      {parts.map((part: any, index: any) => (
                        <span
                          key={index}
                          style={{
                            fontWeight: part.highlight ? 700 : 400,
                          }}
                        >
                          {part.text}
                        </span>
                      ))}
                      <Typography variant="body2" color="text.secondary">
                        {option.structured_formatting.secondary_text}
                      </Typography>
                    </Grid>
                  </Grid>
                </li>
              );
            }}
          />

            <TextField variant='outlined' label='Street Address' id='street' name='street' value={street} onChange={handleStreetChange} size='small' error={streetError} helperText={streetError ? 'Invalid Input' : null} required fullWidth sx={{width: '350px'}} />
            <TextField variant='outlined' label='City' id='city' name='city' value={city} onChange={handleCityChange} size='small' error={cityError} helperText={cityError ? 'Invalid Input' : null} required fullWidth />
            <TextField select variant='outlined' label='State' id='state' name='state' value={state} onChange={handleStateChange} size='small' error={stateError} helperText={stateError ? 'Invalid Input' : null} required fullWidth>
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
            <TextField variant='outlined' label='Zip Code' id='zipcode' name='zipcode' value={zipcode} onChange={handleZipcodeChange} size='small' error={zipcodeError} helperText={zipcodeError ? 'Invalid Input' : null} required fullWidth />
            <TextField multiline rows={3} variant='outlined' label='Description' id='description' name='description' value={description} onChange={handleDescriptionChange} size='small' error={descriptionError} helperText={descriptionError ? 'Invalid Input' : null} required fullWidth />
            <TextField variant='outlined' label='Price' id='price' name='price' value={price} onChange={handlePriceChange} size='small' error={priceError} helperText={priceError ? 'Invalid Input' : null} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} required fullWidth />
          </Stack>
        </Stack>
        <Button variant='contained' type='submit' disableElevation sx={{width: '150px'}}>Save</Button>
      </form>
    </div>
  )
}
