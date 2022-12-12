import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

function PageController(props: any) {
  let page = props.page;
  let nextUrl = props.nextUrl;
  let nextBtn;
  let previousBtn;
  let btnStyle = {
    borderRadius: 35,
    backgroundColor: "#1976D2",
    width: "150px",
    fontSize: "18px",
  };

  if (page > 1) {
    previousBtn = (
      <Button
        style={btnStyle}
        component={Link}
        to={`/listings/page/${page - 1}`}
        variant="contained"
      >
        Previous
      </Button>
    );
  }
  if (nextUrl != null) {
    nextBtn = (
      <Button
        style={btnStyle}
        component={Link}
        to={`/listings/page/${parseInt(page) + 1}`}
        variant="contained"
      >
        Next
      </Button>
    );
  }

  if (previousBtn && nextBtn) {
    return (
      <div>
        {previousBtn} {nextBtn}
      </div>
    );
  } else if (previousBtn && !nextBtn) {
    return <div>{previousBtn}</div>;
  } else if (!previousBtn && nextBtn) {
    return <div>{nextBtn}</div>;
  }
}

export default PageController;
