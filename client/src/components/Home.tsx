import React from "react";
import { AuthContext } from "../firebase/Auth";
import "../App.css";
import Listings from "./Listings";
export default function Home() {
  const { currentUser } = React.useContext(AuthContext);
  let welcomeMessage = currentUser ? (
    <p>
      Welcome {currentUser.email}, to GroundBnB. Looking for a backyard to throw
      your next party or barbeque?
    </p>
  ) : (
    <p>
      Welcome to GroundBnB. Looking for a backyard to throw your next party or
      barbeque?
    </p>
  );

  return (
    <div>
      <div className="welcome-message">{welcomeMessage}</div>
      <Listings></Listings>
    </div>
  );
}
