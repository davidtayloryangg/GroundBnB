import React, { useState, useEffect, useContext, MouseEvent } from "react";
import "../App.css";
import axios from "axios";
import { AuthContext } from "../firebase/Auth";
import {
  Backdrop,
  CircularProgress,
  Stack,
  List,
  ListItem,
  Card,
  CardMedia,
  Typography,
  CardContent,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import BookingCard from "./BookingCard";

function MyProfile() {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(undefined);
  const [userListingData, setUserListingData] = useState(undefined);
  const [userBookingData, setUserBookingData] = useState(undefined);
  const [listingBookingData, setListingBookingData] = useState(undefined);
  const [show404, setShow404] = useState(false);
  const [showServerError, setShowServerError] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [listingFilter, setListingFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [navigate, currentUser]);

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  type UserBooking = {
    listing: Listing;
    booking: Booking;
  };

  type GetUserResponse = {
    firstName: string;
    lastName: string;
  };

  const handleBookingFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newBookingFilter: string
  ) => {
    if (newBookingFilter !== null) {
      setBookingFilter(newBookingFilter);
    }
  };

  const handleListingFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newListingFilter: string
  ) => {
    if (newListingFilter !== null) {
      setListingFilter(newListingFilter);
    }
  };

  function canCancel(date: timestamp): boolean {
    const formatDate = new Date(
      date.seconds * 1000 + date.nanoseconds / 1000000
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    formatDate.setDate(formatDate.getDate() - 2);
    return formatDate < today;
  }

  function pastDate(date: timestamp): boolean {
    const formatDate = new Date(
      date.seconds * 1000 + date.nanoseconds / 1000000
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return formatDate < today;
  }

  let bookingsFilterButtonStyle = {
    "&.MuiToggleButton-root.Mui-selected": {
      backgroundColor: "#1976D2",
      color: "white",
    },
  };

  const onCardClick = (event: MouseEvent, listingId: string) => {
    navigate(`/listing/${listingId}`);
  };

  const onCancledClicked = async (
    event: MouseEvent,
    bookingId: string,
    isOwner: boolean
  ) => {
    if (event.target === event.currentTarget) {
      event.stopPropagation();
    }
    try {
      const { data } = await axios.post(
        `http://localhost:4000/bookings/${bookingId}/cancel`,
        {
          userId: currentUser.uid,
        }
      );
      if (isOwner) {
        let bookingIndex = listingBookingData.findIndex(
          (listingBooking: Booking) => listingBooking.bookingId === bookingId
        );
        if (bookingIndex !== -1) {
          let listingBookingDataCopy = [...listingBookingData];
          listingBookingDataCopy[bookingIndex] = data.booking;
          setListingBookingData(listingBookingDataCopy);
        }
      } else {
        let bookingIndex = userBookingData.findIndex(
          (userBooking: UserBooking) =>
            userBooking.booking.bookingId === bookingId
        );
        if (bookingIndex !== -1) {
          let userBookingDataCopy = [...userBookingData];
          userBookingDataCopy[bookingIndex].booking = data.booking;
          setUserBookingData(userBookingDataCopy);
        }
      }
      setShowSuccessToast(true);
    } catch (e) {
      setShowErrorToast(true);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setShow404(false);
      try {
        let userData = await axios.get<GetUserResponse>(
          `http://localhost:4000/users/${currentUser.uid}`
        );
        setUserData(userData.data);
        let userListings = await axios.get<Listing[]>(
          `http://localhost:4000/listings/owner/${currentUser.uid}`
        );
        let userBookings = await axios.get<Booking[]>(
          `http://localhost:4000/bookings/booker/${currentUser.uid}`
        );
        setUserListingData(userListings.data);
        if (userListings.data.length !== 0) {
          setListingFilter(userListings.data[0].listingId);
        }
        let userBookingsArr: UserBooking[] = [];
        for (let booking of userBookings.data) {
          let bookingListing = await axios.get<Listing>(
            `http://localhost:4000/listings/${booking.listingId}`
          );
          let bookingObj: UserBooking = {
            listing: bookingListing.data,
            booking: booking,
          };
          userBookingsArr.push(bookingObj);
        }
        setUserBookingData(userBookingsArr);
        let listingBookingsArr: Booking[] = [];
        for (let listingBooking of userListings.data) {
          let bookings = await axios.get<Booking[]>(
            `http://localhost:4000/bookings/listing/${listingBooking.listingId}`
          );
          listingBookingsArr = [...listingBookingsArr, ...bookings.data];
        }
        setListingBookingData(listingBookingsArr);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setShowServerError(true);
      }
    }
    fetchData();
  }, []);

  const buildBookings = () => {
    let userBookings = userBookingData;
    let currentFilterText: string;

    switch (bookingFilter) {
      case "all":
        userBookings = userBookingData;
        currentFilterText = "";
        break;
      case "past":
        userBookings = userBookings.filter(
          (userBooking: UserBooking) =>
            pastDate(userBooking.booking.endTimestamp) === true
        );
        currentFilterText = "Past";
        break;
      case "upcoming":
        userBookings = userBookings.filter(
          (userBooking: UserBooking) =>
            canCancel(userBooking.booking.startTimestamp) === false
        );
        currentFilterText = "Upcoming";
        break;
      case "canceled":
        userBookings = userBookings.filter(
          (userBooking: UserBooking) =>
            userBooking.booking.status === "CANCELED"
        );
        currentFilterText = "Canceled";
        break;
      case "active":
        userBookings = userBookings.filter(
          (userBooking: UserBooking) => userBooking.booking.status === "ACTIVE"
        );
        currentFilterText = "Active";
        break;
      default:
        userBookings = userBookingData;
        currentFilterText = "";
        break;
    }
    if (userBookings.length === 0) {
      return (
        <div>
          <h3>{`No ${currentFilterText} Bookings`}</h3>
        </div>
      );
    }
    return (
      <List
        sx={{
          width: "100%",
          maxHeight: 425,
          display: "flex",
          flexDirection: "row",
          padding: 0,
          overflow: "scroll",
        }}
      >
        {userBookings.map((userBooking: UserBooking) => {
          return (
            <BookingCard
              userBooking={userBooking}
              isOwner={false}
              onCancledClicked={onCancledClicked}
              key={userBooking.booking.bookingId}
            ></BookingCard>
          );
        })}
      </List>
    );
  };

  const buildListingBookings = () => {
    let listingBookings = listingBookingData;

    listingBookings = listingBookings.filter(
      (booking: Booking) => booking.listingId === listingFilter
    );

    if (listingBookings.length === 0) {
      return (
        <div>
          <h3>{`No Bookings`}</h3>
        </div>
      );
    }

    return (
      <List
        sx={{
          width: "100%",
          maxHeight: 425,
          display: "flex",
          flexDirection: "row",
          padding: 0,
          overflow: "scroll",
        }}
      >
        {listingBookings.map((booking: Booking) => {
          let listing = userListingData.find(
            (listing: Listing) => listing.listingId === booking.listingId
          );
          let userBooking: UserBooking = {
            listing: listing,
            booking: booking,
          };
          return (
            <BookingCard
              userBooking={userBooking}
              isOwner={true}
              onCancledClicked={onCancledClicked}
              key={booking.bookingId}
            ></BookingCard>
          );
        })}
      </List>
    );
  };

  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (showServerError) {
    return (
      <div className="centered">
        <h1>Server Error.</h1>
      </div>
    );
  } else {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={showSuccessToast}
          autoHideDuration={3000}
          onClose={() => setShowSuccessToast(false)}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Booking Canceled
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={showErrorToast}
          autoHideDuration={3000}
          onClose={() => setShowErrorToast(false)}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            Error canceling booking. Please try again!
          </Alert>
        </Snackbar>
        <div className="user-data-container">
          <h1>Profile</h1>
          {userData && (
            <div className="user-data">
              <h2>
                <strong>First Name:</strong> {userData.firstName}
              </h2>
              <h2>
                <strong>Last Name:</strong> {userData.lastName}
              </h2>
            </div>
          )}
          <div>
            <h2>My Listings</h2>
            {userListingData.length === 0 && (
              <div>
                <h3>No Listings</h3>
              </div>
            )}
            {userListingData.length > 0 && (
              <List
                sx={{
                  width: "100%",
                  maxHeight: 425,
                  display: "flex",
                  flexDirection: "row",
                  padding: 0,
                  overflow: "scroll",
                }}
              >
                {userListingData.map((listing: Listing) => {
                  return (
                    <ListItem
                      sx={{
                        width: 350,
                        height: 250,
                      }}
                      onClick={(e) => onCardClick(e, listing.listingId)}
                      key={listing.listingId}
                    >
                      <Card
                        sx={{
                          width: 350,
                          height: 225,
                          "&:hover": {
                            backgroundColor: "rgb( 220, 220, 220, 0.6)",
                            boxShadow: "rgba(0, 0, 0, 0.56) 0px 5px 5px 4px",
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={
                            listing.imageUrls && listing.imageUrls.length > 0
                              ? listing.imageUrls[0]
                              : "/imgs/no_image.jpeg"
                          }
                          height="100"
                          width="400"
                          alt={listing.listingId}
                          draggable="false"
                        />
                        <CardContent>
                          <Stack justifyContent="space-evenly">
                            <Typography
                              sx={{ fontSize: "17px", fontWeight: "bold" }}
                            >
                              {listing.address.street}
                            </Typography>
                            <Typography
                              sx={{ fontSize: "17px", fontWeight: "bold" }}
                            >
                              {listing.address.city}, {listing.address.state}
                            </Typography>

                            <Stack
                              direction="row"
                              sx={{ width: "100%" }}
                              spacing={1}
                            >
                              <Typography
                                sx={{ fontSize: "15px", fontWeight: "bold" }}
                              >
                                Number of Bookings:
                              </Typography>
                              <Typography sx={{ fontSize: "15px" }}>
                                {listing.numOfBookings}
                              </Typography>
                            </Stack>

                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              sx={{ width: "100%" }}
                            >
                              <Stack
                                direction="row"
                                sx={{ width: "100%" }}
                                spacing={1}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "15px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Price:
                                </Typography>
                                <Typography sx={{ fontSize: "15px" }}>
                                  $
                                  {listing.price % 1 === 0
                                    ? listing.price
                                    : listing.price.toFixed(2)}
                                </Typography>
                              </Stack>

                              <Typography
                                display="inline"
                                sx={{ fontSize: "15px" }}
                                align="right"
                              >
                                ★
                                {listing.averageRating % 1 === 0
                                  ? listing.averageRating
                                  : listing.averageRating.toFixed(1)}
                              </Typography>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </div>
          <div>
            <h2>My Bookings</h2>
            <ToggleButtonGroup
              value={bookingFilter}
              exclusive
              onChange={handleBookingFilterChange}
              aria-label="text alignment"
              color="primary"
            >
              <ToggleButton value="all" sx={bookingsFilterButtonStyle}>
                All
              </ToggleButton>
              <ToggleButton value="past" sx={bookingsFilterButtonStyle}>
                Past
              </ToggleButton>
              <ToggleButton value="upcoming" sx={bookingsFilterButtonStyle}>
                Upcoming
              </ToggleButton>
              <ToggleButton value="active" sx={bookingsFilterButtonStyle}>
                Active
              </ToggleButton>
              <ToggleButton value="canceled" sx={bookingsFilterButtonStyle}>
                Canceled
              </ToggleButton>
            </ToggleButtonGroup>
            {buildBookings()}
          </div>
          <div>
            <h2>My Bookings for my Listings</h2>
            <ToggleButtonGroup
              value={listingFilter}
              exclusive
              onChange={handleListingFilterChange}
              aria-label="text alignment"
              color="primary"
            >
              {userListingData.map((listing: Listing) => {
                return (
                  <ToggleButton
                    value={listing.listingId}
                    sx={bookingsFilterButtonStyle}
                    key={listing.listingId}
                  >
                    {listing.address.street} <br />
                    {listing.address.city}, {listing.address.state}
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
            {buildListingBookings()}
          </div>
        </div>
      </div>
    );
  }
}

export default MyProfile;
