import React, { MouseEvent } from "react";
import "../App.css";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
  ListItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function BookingCard(props: any) {
  let userBooking = props.userBooking;
  let isOwner = props.isOwner;
  let onCancledClicked = props.onCancledClicked;
  const navigate = useNavigate();

  const onCardClick = (event: MouseEvent, listingId: string) => {
    navigate(`/listing/${listingId}`);
  };

  function formatDate(date: timestamp): string {
    const formatDate = new Date(
      date.seconds * 1000 + date.nanoseconds / 1000000
    );
    return formatDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function canCancel(date: timestamp): boolean {
    const formatDate = new Date(
      date.seconds * 1000 + date.nanoseconds / 1000000
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    formatDate.setDate(formatDate.getDate() - 2);
    return formatDate < today;
  }

  return (
    <ListItem
      sx={{
        width: 400,
        height: 425,
      }}
      onClick={(e) => onCardClick(e, userBooking.listing.listingId)}
    >
      <Card
        sx={{
          width: 400,
          height: 400,
          "&:hover": {
            backgroundColor: "rgb( 220, 220, 220, 0.6)",
            boxShadow: "rgba(0, 0, 0, 0.56) 0px 5px 5px 4px",
          },
        }}
      >
        <CardMedia
          component="img"
          image={
            userBooking.listing.imageUrls &&
            userBooking.listing.imageUrls.length > 0
              ? userBooking.listing.imageUrls[0]
              : "/imgs/no_image.jpeg"
          }
          height="100"
          width="400"
          alt={userBooking.listing.listingId}
          draggable="false"
        />
        <CardContent>
          <Stack spacing={1} sx={{ height: "275px" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              <Stack>
                <Typography
                  sx={{
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                >
                  {userBooking.listing.address.street}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                >
                  {userBooking.listing.address.city},{" "}
                  {userBooking.listing.address.state}
                </Typography>
              </Stack>

              <Typography
                display="inline"
                sx={{ fontSize: "15px" }}
                align="right"
              >
                ★
                {userBooking.listing.averageRating % 1 === 0
                  ? userBooking.listing.averageRating
                  : userBooking.listing.averageRating.toFixed(1)}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ width: "100%" }} spacing={1}>
              <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                Total Price:
              </Typography>
              <Typography sx={{ fontSize: "15px" }}>
                $
                {userBooking.booking.totalPrice % 1 === 0
                  ? userBooking.booking.totalPrice
                  : userBooking.booking.totalPrice.toFixed(2)}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ width: "100%" }} spacing={1}>
              <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                Number of People:
              </Typography>
              <Typography sx={{ fontSize: "15px" }}>
                {userBooking.booking.numOfPeople}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ width: "100%" }} spacing={1}>
              <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                Start Date:
              </Typography>
              <Typography sx={{ fontSize: "15px" }}>
                {formatDate(userBooking.booking.startTimestamp)}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ width: "100%" }} spacing={1}>
              <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                End Date:
              </Typography>
              <Typography sx={{ fontSize: "15px" }}>
                {formatDate(userBooking.booking.endTimestamp)}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ width: "100%" }} spacing={1}>
              <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                Status:
              </Typography>
              <Typography
                sx={{
                  fontSize: "15px",
                  color:
                    userBooking.booking.status === "ACTIVE"
                      ? "green"
                      : "#ee0000",
                }}
              >
                {userBooking.booking.status.charAt(0) +
                  userBooking.booking.status.substring(1).toLowerCase()}
              </Typography>
            </Stack>

            <Button
              variant="contained"
              sx={{
                marginTop: "10px",
                "&:disabled": {
                  color: "#646464",
                },
              }}
              color="error"
              disabled={
                userBooking.booking.status === "CANCELED" ||
                canCancel(userBooking.booking.startTimestamp)
              }
              onClick={(e) =>
                onCancledClicked(e, userBooking.booking.bookingId, isOwner)
              }
            >
              Cancel
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </ListItem>
  );
}

export default BookingCard;
