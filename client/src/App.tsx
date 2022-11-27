import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './firebase/Auth';
import Home from './components/Home';
import Account from './components/Account';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Landing from './components/Landing';

function App() {
  return (
    <AuthProvider>
      <Router>
    <div className="App">
      <header className="App-header">
      <Navigation />
      </header>
    </div>
    <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/home' element={<PrivateRoute />}>
            <Route path='/home' element={<Home />} />
          </Route>
          <Route path='/account' element={<PrivateRoute />}>
            <Route path='/account' element={<Account />} />
          </Route>
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
