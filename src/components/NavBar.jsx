import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import ModalContext from "../context/ModalContext";
import FilterOptionsContext from "../context/FilterOptionsContext";

import SearchCriteriaForm from "./Forms/Search/SearchCriteriaForm";
import LoginForm from "./Forms/Auth/LoginForm";
import SignupForm from "./Forms/Auth/SignupForm";
import CategoryList from "./Categories/CategoryList";
import AccountDropdown from "./UserAccount/AccountDropdown";

import logo from "../assets/logo.png";
import geoIcon from "../assets/geoAltFill.svg";
import heartIcon from "../assets/heart.svg";
import "../stylesheets/NavBar.css";
import "../stylesheets/ModalForms.css";

const NavBar = () => {
  const [isZipOpen, setIsZipOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { isSignupOpen, toggleSignup } = useContext(ModalContext);
  const { user, fetchUser } = useContext(AuthContext);
  const { categories } = useContext(FilterOptionsContext);

  const toggleZip = () => setIsZipOpen(!isZipOpen);
  const toggleLogin = () => setIsLoginOpen(!isLoginOpen);

  return (
    <div className="navbar">
      <NavLink to="/">
        <img src={logo} alt="TwiceLoved logo" />
      </NavLink>
      <section className="navbar-search-form">
        <SearchCriteriaForm isZipOpen={isZipOpen} toggleZip={toggleZip} />
        <button onClick={toggleZip} className="navbar-button--geo">
          <img src={geoIcon} />
        </button>
      </section>
      {user && (
        <>
          <NavLink to="/account/favorites">
            <button className="navbar-favorites">
              <img src={heartIcon} />
            </button>
          </NavLink>
          <NavLink to="/listings/new">
            <strong>Post Listing</strong>
          </NavLink>
        </>
      )}
      {!user && (
        <section className="navbar-search-form">
          <button className="navbar-search-btn" onClick={toggleLogin}>
            Log In
          </button>
          <LoginForm
            fetchUser={fetchUser}
            toggle={toggleLogin}
            isLoginOpen={isLoginOpen}
          />
          <button className="navbar-search-btn" onClick={toggleSignup}>
            Sign Up
          </button>
          <SignupForm
            fetchUser={fetchUser}
            toggle={toggleSignup}
            isSignupOpen={isSignupOpen}
          />
        </section>
      )}
      {user && <AccountDropdown />}
      <CategoryList categories={categories} />
    </div>
  );
};

export default NavBar;
