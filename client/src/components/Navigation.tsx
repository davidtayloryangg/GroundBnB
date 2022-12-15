import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { AppBar, Button, Container, Stack, Toolbar } from "@mui/material";
import DeckIcon from "@mui/icons-material/Deck";
import "../App.css";

const Navigation = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="App">
      <AppBar position="static" sx={{ boxShadow: "none" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Stack direction="row" justifyContent="flex-start">
              <Link className="link" to="/">
                <Button
                  variant="contained"
                  startIcon={<DeckIcon />}
                  disableElevation
                  sx={{
                    display: { xs: "none", md: "flex" },
                    fontWeight: 700,
                    letterSpacing: ".2rem",
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  {" "}
                  GroundBnB
                </Button>
              </Link>
              <Link className="link" to="/listings/page/1">
                <Button variant="contained" disableElevation>
                  Listings
                </Button>
              </Link>
              <Link className='link' to='/search'>
                <Button variant='contained' disableElevation>Search</Button>
              </Link>
              <Link className="link" to="/bookings">
                <Button variant="contained" disableElevation>
                  Bookings
                </Button>
              </Link>
              <Link className="link" to="/my-profile">
                <Button variant="contained" disableElevation>
                  My Profile
                </Button>
              </Link>
            </Stack>
            <Stack direction="row" spacing={0} justifyContent="flex-end">
              {currentUser ? (
                <Button
                  variant="contained"
                  disableElevation
                  onClick={doSignOut}
                >
                  Sign Out
                </Button>
              ) : (
                <div>
                  <Link className="link" to="/signin">
                    <Button variant="contained" disableElevation>
                      Log In
                    </Button>
                  </Link>
                  <Link className="link" to="/signup">
                    <Button variant="contained" disableElevation>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default Navigation;
