import "./App.css";
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import DeckIcon from "@mui/icons-material/Deck";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { AuthProvider } from "./firebase/Auth";
import Home from "./components/Home";
import Account from "./components/Account";
import PrivateRoute from "./components/PrivateRoute";
import Navigation from "./components/Navigation";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Landing from "./components/Landing";
import SignOut from "./components/SignOut";
import PageNotFound from "./components/PageNotFound";
import SingleListing from './components/SingleListing';
import Search from './components/Search';
import CreateListing from './components/CreateListing';
import EditListing from "./components/EditListing";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
        </div>
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Navigate to="/listings/page/1" />} />
            <Route path="/bookings" />
            <Route path="/listings/page/:pagenum" element={<Home />} />
            <Route path="/my-profile" />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path='/edit-listing/:listingId' element={<EditListing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signout" element={<SignOut />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/listing/:listingId" element={<SingleListing />}/>
            <Route path="/search" element={<Search />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
