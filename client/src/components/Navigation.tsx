import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { doSignOut } from "../firebase/FirebaseFunctions";
import {
  AppBar,
  Button,
  Container,
  Stack,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DeckIcon from "@mui/icons-material/Deck";
import "../App.css";

const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyProfilePressed = () => {
    setAnchorEl(null);
    navigate("/my-profile");
  };

  const handleSignOutPressed = () => {
    setAnchorEl(null);
    doSignOut();
  };

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
              <Link className="link" to="/search">
                <Button variant="contained" disableElevation>
                  Search
                </Button>
              </Link>
              <Link className="link" to="/bookings">
                <Button variant="contained" disableElevation>
                  Bookings
                </Button>
              </Link>
              <Link className="link" to="/create-listing">
                <Button variant="contained" disableElevation>
                  Create Listing
                </Button>
              </Link>
            </Stack>
            <Stack direction="row" spacing={0} justifyContent="flex-end">
              {currentUser ? (
                <div>
                  <Button
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <Stack direction="row" spacing={1}>
                      <AccountCircle />
                      <Typography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {currentUser.displayName}
                      </Typography>
                    </Stack>
                  </Button>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleMyProfilePressed}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleSignOutPressed}>Sign Out</MenuItem>
                  </Menu>
                </div>
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
