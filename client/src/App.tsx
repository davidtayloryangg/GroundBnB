import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./firebase/Auth";
import Home from "./components/Home";
import MyProfile from "./components/MyProfile";
import Navigation from "./components/Navigation";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import PageNotFound from "./components/PageNotFound";
import SingleListing from "./components/SingleListing";
import Search from "./components/Search";
import CreateListing from "./components/CreateListing";

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
            <Route path="/listings/page/:pagenum" element={<Home />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/listing/:listingId" element={<SingleListing />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
