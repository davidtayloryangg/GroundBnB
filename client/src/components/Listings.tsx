import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useParams,
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import {
  Backdrop,
  CircularProgress,
  Grid,
  Box,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import ListingCard from "./ListingCard";
import PageController from "./PageController";
import PageNotFound from "./PageNotFound";

type GetListingsResponse = {
  next: string;
  data: Listing[];
};

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  let filterByParam = searchParams.get("filterBy");
  if (!filterByParam) {
    filterByParam = "rating-desc";
  }
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listingsData, setListingsData] = useState(undefined);
  const [show404, setShow404] = useState(false);
  const [showServerError, setShowServerError] = useState(false);
  const [filterBy, setFilterBy] = useState(filterByParam);
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
          `http://localhost:4000/listings/page/${pageNumber}?filterBy=${filterBy}`
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
  }, [pageNumber, filterBy]);

  const handleSelectChange = (event: any) => {
    let filterByString = event.target.value;
    const params = {
      filterBy: filterByString,
    };
    const options = {
      pathname: "/listings/page/1",
      search: `?${createSearchParams(params)}`,
    };
    setFilterBy(filterByString);
    navigate(options, { replace: true });
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
  } else if (show404) {
    return <PageNotFound></PageNotFound>;
  } else if (listingsData.data.length > 0) {
    return (
      <div>
        <Stack
          direction="row"
          justifyContent="end"
          sx={{
            paddingTop: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
          }}
        >
          <Select
            value={filterBy}
            onChange={handleSelectChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={{ height: "40px" }}
          >
            <MenuItem value={"rating-desc"}>Rating: High to Low</MenuItem>
            <MenuItem value={"rating-asc"}>Rating: Low to High</MenuItem>
            <MenuItem value={"price-desc"}>Price: High to Low</MenuItem>
            <MenuItem value={"price-asc"}>Price: Low to High</MenuItem>
          </Select>
        </Stack>
        <Grid
          container
          spacing={5}
          sx={{
            paddingRight: 5,
            paddingLeft: 5,
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
          <PageController
            nextUrl={
              listingsData.next ? `/listings/page/${pageNumber + 1}` : null
            }
            prevUrl={pageNumber > 1 ? `/listings/page/${pageNumber - 1}` : null}
          />
        </Box>
      </div>
    );
  }
}
