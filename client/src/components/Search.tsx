import React, { useEffect, useState } from 'react';
import {GoogleMap, useJsApiLoader, MarkerF} from "@react-google-maps/api"
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import {
    Grid,
    Card,
    CardMedia,
    CardActions,
    Typography,
    Button,
    List,
} from "@mui/material";
import axios from "axios";


const Search = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyDUtq8nmO3GP4tSy0vg7ZilPuwm2JHdNOk",
        libraries: ["places"],
    });
    const [coordinates, setCoordinates] = useState({
        lat: 40.7439905,
        lng: -74.0323626,
      });
    const [address, setAddress] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [listings, setListings] = useState([]);
    const [listingPage, setListingPage] = useState([]);
    const [map, setMap] = useState(null);
    const [lastCardIndex, setLastIndexCard] = useState(1);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);

    const handleChange = () => {
        console.log("Hitting change", address, coordinates);
        setSearchTerm(address);
    };
    const handleSelect = async (value:any) => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setAddress(value);
        setCoordinates(latLng);
    };

    useEffect(() => {
        const settingData = async () => {
          const url = `http://localhost:4000/listings/search/location/${page}?lat=${coordinates.lat}&lon=${coordinates.lng}`;
          const data = await axios.get(url);
          //console.log("Data", data.data);
          setListings(data.data);
          setSearchTerm("");
          if (page > 1) {
            setHasPrev(true);
          } else {
            setHasPrev(false);
          }
          const nextUrl=`http://localhost:4000/listings/search/location/${page+1}?lat=${coordinates.lat}&lon=${coordinates.lng}`;
            const nextData = await axios.get(nextUrl);
            if (nextData.data.length > 0) {
                setHasNext(true);
            } else {
                setHasNext(false);
            }

        };
        if (searchTerm !== "" || page > 0) {
          settingData();
        }
    }, [searchTerm,page]);

    useEffect(() => {
        const initLoad = async () => {
            const url = `http://localhost:4000/listings/search/location/1?lat=${coordinates.lat}&lon=${coordinates.lng}`;
            const data = await axios.get(url);
            setListings(data.data);
        };
        initLoad();
    }, []);

    const setNext = () => {
        setPage(page+1);
        // alert(page);
    };

    const setPrev = () => {
        setPage(page-1);
        // alert(page);
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className="content">
                <div className="search-wrapper" style={{padding: 20}}>
                    {/* <h2>Search Container</h2>
                    <p>Lat: {coordinates.lat}</p>
                    <p>Lng: {coordinates.lng}</p>
                    <p>Address: {address}</p> */}
                    <PlacesAutocomplete
                        value={address}
                        onChange={setAddress}
                        onSelect={handleSelect}
                    >
                        {({
                            getInputProps,
                            suggestions,
                            getSuggestionItemProps,
                            loading,
                        }) => (
                            <div className="search-input">
                                <input
                                    {...getInputProps({
                                        placeholder: "Search Places ...",
                                        className: "location-search-input",
                                        key: "search-input-key",
                                    })}
                                />
                                <button type="submit" onClick={handleChange}>
                                    Search
                                </button>
                                <div className="autocomplete-dropdown-container">
                                    {loading && <div>Loading...</div>}
                                    {suggestions?.map((suggestion) => {
                                    const className = suggestion.active
                                        ? "suggestion-item--active"
                                        : "suggestion-item";
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                        ? { backgroundColor: "#fafafa", cursor: "pointer" }
                                        : { backgroundColor: "#ffffff", cursor: "pointer" };
                                    return (
                                        <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                        >
                                        <span>{suggestion.description}</span>
                                        </div>
                                    );
                                    })}
                                </div>
                            </div>
                    )}
                    </PlacesAutocomplete>
                </div>
                <div className="mapContainer">
                    {/* <h2>Listings && Map Container</h2> */}
                    {hasPrev===true?<Button onClick={setPrev}>Previous Page</Button> : null}
                    {hasNext===true?<Button onClick={setNext}>Next Page</Button> : null}
                    <Grid container spacing={2}>
                        <Grid container item spacing={2} xs={12} sm={6}>
                        {/* <List style={{maxHeight: 1200, width:"100%", overflow: 'auto'}}> */}
                            {listings?.map((item,index) => (
                                <Grid item xs={12} md={6} lg={4}>
                                    <Card style={{height:420, position:"relative"}}>
                                        <CardMedia
                                            component="img"
                                            alt="Temp. Unavailable"
                                            height="250"
                                            image={item.imagesUrls?.map((image:any) => image)}
                                        />
                                        <Typography variant="h6">
                                            {item.address.city}, {item.address.state}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                        <Grid container>
                                            <Grid item alignItems="left" xs={6}>
                                            <Typography variant="subtitle2" align="left">
                                                ${item.price}
                                            </Typography>
                                            </Grid>
                                            <Grid item alignItems="right" xs={6}>
                                            <Typography variant="subtitle2" align="right">
                                                ★
                                                {item.averageRating % 1 === 0
                                                ? item.averageRating
                                                : item.averageRating.toFixed(1)}
                                            </Typography>
                                            </Grid>
                                        </Grid>
                                        <CardActions>
                                            <Button
                                            variant="contained"
                                            href={`listing/${item.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style= {{position:"absolute", bottom: 0, left: 0}}
                                            >
                                            Learn more
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                            {/* <Grid item xs={12} md={6} lg={4}>
                            <Card>
                                <p>Testing</p>
                            </Card>
                            </Grid>
                            </List> */}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <GoogleMap
                            center={coordinates}
                            zoom={10}
                            mapContainerStyle={{ width: "100%", height: "95vh" }}
                            options={{
                                zoomControl: false,
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: false,
                            }}
                            onLoad={(map) => setMap(map)}
                            >
                            <MarkerF position={coordinates} />
                            {listings?.map((item) => (
                                <MarkerF
                                position={{
                                    lat: item.address.geolocation.latitude,
                                    lng: item.address.geolocation.longitude,
                                }}
                                />
                            ))}
                            </GoogleMap>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default Search;