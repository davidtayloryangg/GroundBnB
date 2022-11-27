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

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          <header className='App-header'>
            <AppBar position='static' sx={{ boxShadow: 'none'}}>
              <Container maxWidth='xl'>
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                {/* <Stack direction='row' justifyContent='space-between'> */}
                  <Stack direction='row' justifyContent='flex-start'>
                      <Link className='link' to='/'>
                        <Button variant='contained' startIcon={<DeckIcon />} disableElevation sx={{
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'white',
                            textDecoration: 'none',
                          }}> GroundBnB</Button>
                      </Link>
                      <Link className='link' to='/listings'>
                        <Button variant='contained' disableElevation>Listings</Button>
                      </Link>
                      <Link className='link' to='/bookings'>
                        <Button variant='contained' disableElevation>Bookings</Button>
                      </Link>
                      <Link className='link' to='/my-profile'>
                        <Button variant='contained' disableElevation>My Profile</Button>
                      </Link>
                    </Stack>
                    <Stack direction='row' spacing={0} justifyContent='flex-end'>
                      <Link className='link' to='/login'>
                        <Button variant='contained' disableElevation>Log In</Button>
                      </Link>
                      <Link className='link' to='/signup'>
                        <Button variant='contained' disableElevation>Sign Up</Button>
                      </Link>
                    </Stack>
                  {/* </Stack> */}
                </Toolbar>
              </Container>
            </AppBar>
          </header>
        </div>
        <div className='App-body'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bookings" />
            <Route path="/listings" />
            <Route path="/my-profile" />
            <Route path="/login" />
            <Route path="/signup" />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
