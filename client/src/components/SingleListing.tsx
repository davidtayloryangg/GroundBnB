import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as firestore from "firebase/firestore";
import { useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddCommentIcon from "@mui/icons-material/AddComment";
import dayjs, { type Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  LocalizationProvider,
  DateRangePicker,
  DateRange,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import Box from "@mui/material/Box";
import {
  Divider,
  Grid,
  Rating,
  Card,
  Alert,
  IconButton,
  AlertTitle,
  TextField,
  CardActions,
  Stack,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Avatar,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import ImageGallery from "react-image-gallery";
import { AuthContext } from "../firebase/Auth";
import { stringFilter, reviewFilter, validString } from "../Validation";
const Timestamp = firestore.Timestamp;

function SingleListing() {
  const { listingId } = useParams();
  let listingIdValue = stringFilter(listingId);
  const [listingData, setListingData] = useState(undefined);
  const [bookingsForListingData, setBookingsForListingData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [value, setValue] = useState<DateRange<Dayjs>>([null, null]);
  const [reviewRating, setReviewRating] = useState<number | null>(1);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [bookingId, setBookingId] = useState("");
  const [reviewError, setReviewError] = useState(undefined);
  const [bookingError, setBookingError] = useState(undefined);
  const [listingError, setListingError] = useState([404, "Error Not Found"]);

  const increasePeople = () => {
    setNumberOfPeople(numberOfPeople + 1);
  };

  const decreasePeople = () => {
    if (numberOfPeople > 1) setNumberOfPeople(numberOfPeople - 1);
  };

  const buildReviewCard = (review: {
    user: string;
    rating: number;
    text: string;
    date: string;
  }) => {
    return (
      <Grid item sx={{ pb: 4 }} key={Math.random()}>
        <Card>
          <CardHeader
            avatar={<Avatar src="/broken-image.jpg" />}
            title={review.user}
            subheader={review.date}
          ></CardHeader>
          <CardContent>
            <Rating
              name="read-only"
              value={review.rating}
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "#000000",
                },
              }}
              readOnly
            />
            <Typography>{review.text}</Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const bookListing = async () => {
    if (currentUser === null) {
      navigate("/signin");
      return;
    }

    if (value[0] === null || value[1] === null) {
      setBookingError("You must select a start and end date");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4000/bookings/create",
        {
          bookerId: currentUser.uid,
          listingId: listingData.listingId,
          numOfPeople: numberOfPeople,
          endTimestamp: value[1].toDate(),
          startTimestamp: value[0].toDate(),
        }
      );

      setBookingId(data.bookingId);
      setOpen(true);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setBookingError(e.response.data.message);
      } else {
        setReviewError(e);
      }
    }
  };

  const addReview = async (reviewText: string) => {
    try {
      validString(reviewText);
      await axios.post(
        `http://localhost:4000/listings/${listingIdValue}/review`,
        {
          listingId: listingId,
          userId: currentUser.uid,
          rating: reviewRating,
          text: reviewText,
          date: new Date(),
        }
      );

      window.location.reload();
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setReviewError(e.response.data.message);
      } else {
        setReviewError(e);
      }
    }
  };

  useEffect(() => {
    async function fetchListingData() {
      try {
        let { data } = await axios.get(
          `http://localhost:4000/listings/${listingIdValue}`
        );
        setListingData(data);

        if (data) {
          if (data.reviews.length !== 0) {
            let reviewsArr: {
              user: string;
              rating: string;
              text: string;
              date: string;
            }[] = [];
            for (let review of data.reviews) {
              let reviewDate = new Timestamp(
                review.date.seconds,
                review.date.nanoseconds
              ).toDate();
              let fullName: string = "Unknown User";

              try {
                let { data } = await axios.get(
                  `http://localhost:4000/users/${review.userId}`
                );
                fullName = `${data.firstName} ${data.lastName}`;
              } catch (e) { }

              reviewsArr.push({
                user: fullName,
                rating: review.rating,
                text: review.text,
                date: `${reviewDate.toLocaleDateString("default", {
                  month: "long",
                })} ${reviewDate.getFullYear()}`,
              });
            }

            setReviews(reviewsArr);
          }
        }

        if (data.numOfBookings !== 0) {
          try {
            data = await axios.get(
              `http://localhost:4000/bookings/listing/${listingIdValue}?excludeCanceled=true`
            );
            setBookingsForListingData(data.data);
          } catch (e) { }
        }
      } catch (e) {
        if (axios.isAxiosError(e)) {
          setListingError([e.response.status, e.response.data.message]);
        } else {
          setListingError([500, e.toString()]);
        }
      }
    }

    fetchListingData();
  }, [listingIdValue]);

  if (listingData) {
    const avgRating = parseFloat(listingData.averageRating).toFixed(2);
    const numOfReviews =
      listingData.reviews === undefined ? 0 : listingData.reviews.length;
    const addressLat = listingData.address.geolocation.latitude;
    const addressLong = listingData.address.geolocation.longitude;
    const tempBookings: Dayjs[] = [];
    let numOfDays = 1;
    let price = parseFloat(listingData.price).toFixed(2);
    let conflict = false;
    let listingImagesArr: {
      original: string;
      originalAlt: string;
      thumbnail: string;
      thumbnailAlt: string;
    }[] = [];
    let reviewCards = reviews.map((review) => {
      return buildReviewCard(review);
    });

    listingData.imageUrls.forEach((image: string) => {
      listingImagesArr.push({
        original: image,
        originalAlt: image,
        thumbnail: image,
        thumbnailAlt: image,
      });
    });

    if (value[0] !== null && value[1] !== null) {
      numOfDays = value[1].diff(value[0], "day") + 1;
      price = (parseFloat(listingData.price) * numOfDays).toFixed(2);
    } else {
      numOfDays = 1;
    }

    const disableBookedDates = (date: Dayjs) => {
      let dateFound = false;

      for (let booking of bookingsForListingData) {
        let startTime = dayjs(
          new Timestamp(
            booking.startTimestamp.seconds,
            booking.startTimestamp.nanoseconds
          ).toDate()
        );
        let endTime = dayjs(
          new Timestamp(
            booking.endTimestamp.seconds,
            booking.endTimestamp.nanoseconds
          ).toDate()
        );

        if (date.isSame(startTime, "date") || date.isSame(endTime, "date")) {
          tempBookings.push(date);
          dateFound = true;
        } else if (date.isBetween(startTime, endTime, "day")) {
          tempBookings.push(date);
          dateFound = true;
        }
      }

      return dateFound;
    };
    return (
      <div>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item justifyContent="center" alignItems="center">
            <Card style={{ border: "none", boxShadow: "none" }}>
              <CardContent sx={{ paddingBottom: "20px" }}>
                <Typography
                  variant="h1"
                  fontSize="55px"
                  marginBottom="10px"
                  fontWeight="bold"
                >
                  {listingData.address.street}
                </Typography>
                <Typography variant="h2" fontSize="30px">
                  <StarIcon fontSize="small" /> {avgRating} &middot;{" "}
                  {listingData.address.city}, {listingData.address.state}, US{" "}
                  {listingData.address.zipcode}
                </Typography>
              </CardContent>
              <CardMedia>
                <ImageGallery items={listingImagesArr} />
              </CardMedia>
            </Card>
          </Grid>
          <Grid item justifySelf="center" marginTop="25px">
            <Card
              sx={{
                minWidth: 275,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: 19 }}
                  color="text.secondary"
                  fontWeight="bold"
                  gutterBottom
                >
                  ${listingData.price} per day
                </Typography>
                <Typography
                  sx={{ fontSize: 13 }}
                  color="text.secondary"
                  fontWeight="bold"
                  gutterBottom
                >
                  {numOfReviews} reviews
                </Typography>
                <Typography variant="body2" width="400px">
                  {listingData.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Typography sx={{ fontSize: 14 }}>Number of People</Typography>
                <Button
                  aria-label="decrease number of people"
                  onClick={decreasePeople}
                >
                  <RemoveIcon />
                </Button>
                <Typography sx={{ fontSize: 14 }}>{numberOfPeople}</Typography>
                <Button
                  aria-label="increase number of people"
                  onClick={increasePeople}
                >
                  <AddIcon />
                </Button>
              </CardActions>
              <CardContent>
                {bookingError ? (
                  <Alert key="booking-date-error" severity="error">
                    <Typography sx={{ fontSize: 13 }}>
                      {bookingError}
                    </Typography>
                  </Alert>
                ) : undefined}
              </CardContent>
              <CardActions>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateRangePicker
                    disablePast
                    value={value}
                    onChange={(newValue) => {
                      if (
                        value[0] === null ||
                        newValue[1] === null ||
                        bookingsForListingData.length === 0
                      ) {
                        setValue(newValue);
                      } else if (bookingsForListingData.length !== 0) {
                        if (newValue[0] !== null) {
                          tempBookings.forEach((booking) => {
                            if (newValue[1].isSame(booking, "date")) {
                              conflict = true;
                            } else if (
                              booking.isBetween(newValue[0], newValue[1], "day")
                            ) {
                              conflict = true;
                            }
                          });

                          if (!conflict) {
                            conflict = false;
                            setValue(newValue);
                          }
                        }
                      }
                    }}
                    renderInput={(startProps, endProps) => (
                      <React.Fragment>
                        {conflict ? (
                          <Alert
                            key="datepicker-date-error"
                            severity="error"
                            style={{
                              height: "100%",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
                            <AlertTitle sx={{ fontSize: 14 }}>
                              Pick new dates
                            </AlertTitle>
                            <Typography sx={{ fontSize: 13 }}>
                              Dates picked conflict with current bookings!
                            </Typography>
                          </Alert>
                        ) : undefined}
                        <TextField {...startProps} />
                        <Box sx={{ mx: 2 }}> to </Box>
                        <TextField {...endProps} />
                      </React.Fragment>
                    )}
                    shouldDisableDate={disableBookedDates}
                  />
                </LocalizationProvider>
              </CardActions>
              <CardActions>
                <LoadScript googleMapsApiKey="AIzaSyDdyfTCvAdjx1xoiGciyy8csFjETA7_Zs8">
                  <GoogleMap
                    mapContainerStyle={{
                      height: "35vh",
                      width: "100%",
                    }}
                    zoom={16}
                    center={{ lat: addressLat, lng: addressLong }}
                  >
                    <Marker
                      key={Math.random()}
                      position={{ lat: addressLat, lng: addressLong }}
                    />
                  </GoogleMap>
                </LoadScript>
              </CardActions>
              <CardContent>
                <Typography fontWeight="bold">
                  ${listingData.price} X {numOfDays} days &nbsp; &nbsp;
                </Typography>
              </CardContent>
              <Divider sx={{ borderBottomWidth: 4 }} />
              <CardContent>
                <Typography fontWeight="bold">
                  Total due upon arrival &nbsp; &nbsp; ${price}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  marginBottom: "10px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {currentUser !== null &&
                  listingData.ownerId === currentUser.uid ? (
                  <Button aria-label="edit listing" variant='contained' color='warning' component={Link} to={`/edit-listing/${listingIdValue}`}>
                    Edit this listing
                  </Button>
                ) : (
                  <Button
                    aria-label="book listing"
                    variant="contained"
                    onClick={bookListing}
                  >
                    Book this listing
                  </Button>
                )}
                <Dialog
                  open={open}
                  aria-labelledby="confirmation-dialog-title"
                  aria-describedby="confirmation-dialog-description"
                >
                  <DialogTitle id="confirmation-dialog-title">
                    {"Booking Confirmation"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="confirmation-dialog-description">
                      <Typography>
                        Your booking has been successfully saved! Your
                        confirmation code is{" "}
                      </Typography>
                      <Typography sx={{ fontWeight: "bold" }}>
                        {bookingId}
                      </Typography>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={(e) => navigate("/")} autoFocus>
                      Home
                    </Button>
                    <Button onClick={(e) => window.location.reload()}>
                      Go Back
                    </Button>
                  </DialogActions>
                </Dialog>
              </CardActions>
            </Card>
          </Grid>
          <Grid
            container
            sx={{ pt: 5 }}
            alignItems="center"
            justifyContent="center"
          >
            <Stack spacing={2} sx={{ width: "65%" }}>
              <Grid item>
                <Typography variant="h3" fontSize="20px">
                  <StarIcon fontSize="small" /> {avgRating} &middot;{" "}
                  {numOfReviews} reviews
                </Typography>
              </Grid>
              {currentUser !== null &&
                listingData.ownerId !== currentUser.uid ? (
                <Grid item sx={{ pb: 4 }}>
                  <Card sx={{ border: "none", boxShadow: "none" }}>
                    {reviewError ? (
                      <Alert key="review-date-error" severity="error">
                        <Typography sx={{ fontSize: 13 }}>
                          {reviewError}
                        </Typography>
                      </Alert>
                    ) : undefined}
                    <Rating
                      name="simple-controlled"
                      value={reviewRating}
                      onChange={(event, newValue) => {
                        console.log(newValue);
                        setReviewRating(newValue);
                      }}
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: "#000000",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Add your review here"
                      id="review-textbox"
                      value={textValue}
                      onChange={(e) => {
                        try {
                          setTextValue(reviewFilter(e.target.value));
                        } catch (e) {
                          setReviewError(e);
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            aria-label="Add comment"
                            onClick={(e) => addReview(textValue)}
                          >
                            <AddCommentIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </Card>
                </Grid>
              ) : undefined}
              {reviewCards}
            </Stack>
          </Grid>
        </Grid>
      </div>
    );
  } else if (listingError[1] !== "Error Not Found") {
    return (
      <Grid container alignItems="center" justifyContent="center">
        <Grid item>
          <Card sx={{ border: "none", boxShadow: "none", textAlign: "center" }}>
            <CardContent>
              <Typography variant="h1" fontWeight="bold">
                {listingError[0]}
              </Typography>
              <Typography variant="h2">{listingError[1]}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container alignItems="center" justifyContent="center">
        <Grid item>
          <Card sx={{ border: "none", boxShadow: "none", textAlign: "center" }}>
            <CardContent>
              <Typography variant="h1" fontWeight="bold">
                Loading
              </Typography>
              <LinearProgress />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default SingleListing;
