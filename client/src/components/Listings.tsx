import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Backdrop, CircularProgress, Grid, Box } from "@mui/material";
import ListingCard from "./ListingCard";
import PageController from "./PageController";
import PageNotFound from "./PageNotFound";

type GetListingsResponse = {
  next: string;
  data: Listing[];
};

export default function Listings() {
  const [loading, setLoading] = useState(true);
  const [listingsData, setListingsData] = useState(undefined);
  const [show404, setShow404] = useState(false);
  const [showServerError, setShowServerError] = useState(false);
  let { pagenum } = useParams();
  let pageNumber: number = Number(pagenum);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setShow404(false);
      if (isNaN(pageNumber) || pageNumber <= 0) {
        setShow404(true);
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get<GetListingsResponse>(
          `http://localhost:4000/listings/page/${pageNumber}`
        );
        setListingsData(data);
        setLoading(false);
        if (data.data.length === 0) {
          setShow404(true);
        }
      } catch (e) {
        setLoading(false);
        setShowServerError(true);
      }
    }
    fetchData();
  }, [pageNumber]);

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
  } else if (show404) {
    return <PageNotFound></PageNotFound>;
  } else if (listingsData.data.length > 0) {
    return (
      <div>
        <Grid
          container
          spacing={5}
          sx={{
            paddingRight: 5,
            paddingLeft: 5,
            paddingTop: 5,
          }}
        >
          {listingsData.data.map((item: Listing) => {
            return (
              <ListingCard key={item.listingId} listing={item}></ListingCard>
            );
          })}
        </Grid>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            paddingTop: "15px",
            paddingBottom: "15px",
          }}
        >
          <PageController page={pageNumber} nextUrl={listingsData.next} />
        </Box>
      </div>
    );
  }
}
