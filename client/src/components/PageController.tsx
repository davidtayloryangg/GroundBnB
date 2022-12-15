import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

function PageController(props: any) {
  let nextUrl = props.nextUrl;
  let prevUrl = props.prevUrl;
  let nextBtn;
  let previousBtn;
  let btnStyle = {
    borderRadius: 35,
    backgroundColor: "#1976D2",
    width: "150px",
    fontSize: "18px",
  };

  if (prevUrl != null) {
    previousBtn = (
      <Button
        style={btnStyle}
        component={Link}
        to={prevUrl}
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
        to={nextUrl}
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
