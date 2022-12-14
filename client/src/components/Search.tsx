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
} from "@mui/material";

const libraries = ["places"];

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

    if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className="content">
                <div className="search-wrapper">
                    <h2>Search Container</h2>
                    <p>Lat: {coordinates.lat}</p>
                    <p>Lng: {coordinates.lng}</p>
                    <p>Address: {address}</p>
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
        <h2>Listings && Map Container</h2>
        <Grid container spacing={2}>
          <Grid container item spacing={2} xs={12} sm={6}>
            {listings?.map((item) => (
              <Grid item xs={12} md={6} lg={4}>
                <Card>
                  {/* <AutoPlaySwipeableViews>
                    {item.imagesUrls?.map((image) => (
                      <div>
                        <img src={image} alt="listing" />
                      </div>
                    ))}
                  </AutoPlaySwipeableViews> */}
                  {/* <img
                    src={item.imagesUrls?.map((image) => image)}
                    alt="Temp. Unavailable"
                  /> */}
                  <CardMedia
                    component="img"
                    alt="Temp. Unavailable"
                    height="250"
                    image={item.imagesUrls?.map((image) => image)}
                  />
                  <Typography variant="h6">
                    {item.address.city}, {item.address.state}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Grid container justify="space-between">
                    <Grid item alignItems="left" xs={6}>
                      <Typography inline variant="subtitle2" align="left">
                        ${item.price}
                      </Typography>
                    </Grid>
                    <Grid item alignItems="right" xs={6}>
                      <Typography inline variant="subtitle2" align="right">
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
                    >
                      Learn more
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <p>Testing</p>
              </Card>
            </Grid>
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
              <MarkerF position={{ lat: 40.85936, lng: -74.18905 }} />
              {listings?.map((item) => (
                <MarkerF
                  position={{
                    lat: parseFloat(item.address.geolocation.latitide),
                    lng: parseFloat(item.address.geolocation.longitude),
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