import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import TwiceLovedApi from "../../../api";
import AuthContext from "../../../context/AuthContext";

const LogoutLink = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setUser(null);
    await TwiceLovedApi.logoutUser();
    navigate("/");
  };

  return (
    <NavLink onClick={handleLogout} to={"/"}>
      Log Out
    </NavLink>
  );
};

export default LogoutLink;
