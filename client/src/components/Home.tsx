import React from 'react';
import { AuthContext } from '../firebase/Auth';
export default function Home() {
    const { currentUser } = React.useContext(AuthContext);
    return (
        <div>
        <h1>Home</h1>
        {currentUser && <p>Welcome {currentUser.email}</p>}
        </div>
    );
    }
