import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { doSignUpWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../firebase/Auth";
import SocialSignIn from "./SocialSignIn";
import { emailFilter, stringFilter, isAtLeast13 } from "../Validation";

function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignUp = async (e: any) => {
    e.preventDefault();
    const { firstName, lastName, email, passwordOne, passwordTwo, birthdate } =
      e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch("Passwords do not match");
      return false;
    }

    try {
      setLoading(true);
      email.value = emailFilter(email.value);
      passwordOne.value = stringFilter(passwordOne.value);
      firstName.value = stringFilter(firstName.value);
      lastName.value = stringFilter(lastName.value);
      birthdate.value = stringFilter(birthdate.value);

      isAtLeast13(new Date(birthdate.value));

      await doSignUpWithEmailAndPassword(
        email.value,
        passwordOne.value,
        firstName.value + " " + lastName.value
      );
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email");
      }
    }
  };

  if (currentUser && !loading) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Sign up</h1>
      {pwMatch && <h4 className="error">{pwMatch}</h4>}
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label>
            First Name:
            <input
              className="form-control"
              required
              name="firstName"
              type="text"
              placeholder="Name"
            />
          </label>
        </div>
        <br />
        <div className="form-group">
          <label>
            Last Name:
            <input
              className="form-control"
              required
              name="lastName"
              type="text"
              placeholder="Name"
            />
          </label>
        </div>
        <br />
        <div className="form-group">
          <label>
            Email:
            <input
              className="form-control"
              required
              name="email"
              type="email"
              placeholder="Email"
            />
          </label>
        </div>
        <br />
        <div className="form-group">
          <label>
            Birthdate:
            <input
              className="form-control"
              required
              id="birthdate"
              name="birthdate"
              type="date"
              placeholder="Birthdate"
            />
          </label>
        </div>
        <br />
        <div className="form-group">
          <label>
            Password:
            <input
              className="form-control"
              id="passwordOne"
              name="passwordOne"
              type="password"
              placeholder="Password"
              autoComplete="off"
              required
            />
          </label>
        </div>
        <br />
        <div className="form-group">
          <label>
            Confirm Password:
            <input
              className="form-control"
              name="passwordTwo"
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              required
            />
          </label>
        </div>
        <br />
        <button id="submitButton" name="submitButton" type="submit">
          Sign Up
        </button>
      </form>
      <br />
      <SocialSignIn type="signup" />
    </div>
  );
}

export default SignUp;
