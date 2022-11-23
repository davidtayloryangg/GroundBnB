import {Navigate, Outlet} from 'react-router-dom';
import React, {useContext} from 'react';
import {AuthContext} from '../firebase/Auth';

const PrivateRoute = () => {
  const {currentUser} = useContext(AuthContext);
  console.log('Private Route Comp current user', currentUser);
  return currentUser ? <Outlet /> : <Navigate to='/signin' />;
};

export default PrivateRoute;