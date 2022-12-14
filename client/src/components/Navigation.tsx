import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import { doSignOut } from '../firebase/FirebaseFunctions';
import { AppBar, Button, Container, Stack, Toolbar } from '@mui/material';
import DeckIcon from '@mui/icons-material/Deck';
import '../App.css';

const Navigation = () => {
  const nav = useNavigate();
  const { currentUser } = useContext(AuthContext);
  useEffect(
    () => {
      if (!currentUser && window.location.pathname !== '/signin' && window.location.pathname !== '/signup') {
        nav('/signin');
      }
    }
    , [currentUser, nav])



  return (
    <div className='App'>
      <header className='App-header'>
        <AppBar position='static' sx={{ boxShadow: 'none' }}>
          <Container maxWidth='xl'>
            <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
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
                <Link className='link' to='/create-listing'>
                  <Button variant='contained' disableElevation>Create Listing</Button>
                </Link>
              </Stack>
              <Stack direction='row' spacing={0} justifyContent='flex-end'>
                {currentUser ? (
                  <Button variant='contained' disableElevation onClick={doSignOut}>Sign Out</Button>
                ) : (
                  <div>
                    <Link className='link' to='/signin'>
                      <Button variant='contained' disableElevation>Log In</Button>
                    </Link>
                    <Link className='link' to='/signup'>
                      <Button variant='contained' disableElevation>Sign Up</Button>
                    </Link>
                  </div>
                )}
              </Stack>
            </Toolbar>
          </Container>
        </AppBar>
      </header>
    </div>
  )
};


export default Navigation;