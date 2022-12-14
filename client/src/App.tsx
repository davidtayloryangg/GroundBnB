import './App.css';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import DeckIcon from '@mui/icons-material/Deck';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider } from './firebase/Auth';
import Home from './components/Home';
import Account from './components/Account';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Landing from './components/Landing';
import SignOut from './components/SignOut';
import CreateListing from './components/CreateListing';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          <Navigation />
        </div>
        <div className='App-body'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bookings" />
            <Route path="/listings" />
            <Route path="/my-profile" />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signout" element={<SignOut />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
