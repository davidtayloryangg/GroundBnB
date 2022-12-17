import React from "react";
import { AuthContext } from "../firebase/Auth";
import "../App.css";
import Listings from "./Listings";
export default function Home() {
  const { currentUser } = React.useContext(AuthContext);
  let welcomeMessage = currentUser ? (
    <h1>
      Welcome {currentUser.displayName}, to GroundBnB. Looking for a backyard to
      throw your next party or barbeque?
    </h1>
  ) : (
    <h1>
      Welcome to GroundBnB. Looking for a backyard to throw your next party or
      barbeque?
    </h1>
  );

  return (
    <div>
      <div className="welcome-message">{welcomeMessage}</div>
      <Listings></Listings>
    </div>
  );
}
