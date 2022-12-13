import React, { MouseEvent, useRef } from "react";
import "../App.css";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";

function ListingCard(props: any) {
  let listing: Listing = props.listing;
  const navigate = useNavigate();
  const imageGalleryRef = useRef(null);
  let galleryImages: ReactImageGalleryItem[] = [];

  listing.imageUrls.forEach((image) => {
    let imageObj = {
      original: image,
      thumbnail: image,
      originalWidth: 400,
      originalHeight: 350,
      sizes: "(min-width: 400px) 350px, 100vw",
      originalAlt: "listing image",
      srcSet: `${image} 400w`,
    };
    galleryImages.push(imageObj);
  });

  const handleMouseEnter = () => {
    imageGalleryRef.current.play();
  };

  const handleMouseLeave = () => {
    imageGalleryRef.current.pause();
  };

  const onCardClick = (event: MouseEvent) => {
    navigate(`/listing/${listing.listingId}`);
  };

  return (
    <Grid
      item
      xs={12}
      md={6}
      lg={4}
      key={listing.listingId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        sx={{
          width: 400,
          height: 425,
          marginLeft: "auto",
          marginRight: "auto",
          "&:hover": {
            backgroundColor: "rgb( 220, 220, 220, 0.6)",
            boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
          },
        }}
      >
        {/* This is the image without the image gallery stuff */}
        {/* <CardMedia
          component="img"
          height="250"
          width="250"
          image={
            listing.imageUrls && listing.imageUrls.length > 0
              ? listing.imageUrls[0]
              : "/imgs/no_image.jpeg"
          }
          alt={listing.listingId}
          draggable="false"
        /> */}
        <CardContent>
          <Stack sx={{ height: 330 }}>
            <div className="image-gallery-container">
              <ImageGallery
                items={galleryImages}
                infinite={true}
                showThumbnails={false}
                showFullscreenButton={false}
                showPlayButton={false}
                showBullets={listing.imageUrls.length > 1 ? true : false}
                ref={imageGalleryRef}
              />
            </div>
            <Typography variant="h6">
              {listing.address.city}, {listing.address.state}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {listing.description}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography display="inline" variant="subtitle2" align="left">
              $
              {listing.price % 1 === 0
                ? listing.price
                : listing.price.toFixed(2)}
            </Typography>
            <Typography display="inline" variant="subtitle2" align="right">
              ★
              {listing.averageRating % 1 === 0
                ? listing.averageRating
                : listing.averageRating.toFixed(1)}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            sx={{ marginTop: "10px" }}
            onClick={(e) => onCardClick(e)}
          >
            Learn more
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default ListingCard;
