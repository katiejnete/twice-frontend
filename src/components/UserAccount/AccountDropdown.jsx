import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import LogoutLink from "../Forms/Auth/LogoutLink";
import AuthContext from "../../context/AuthContext";
import defaultAvatar from "../../assets/default-profile-pic.jpg";
import "../../stylesheets/AccountDropdown.css";

const AccountDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useContext(AuthContext);

  let defaultPfp;
  if (user && user.avatar) {
    defaultPfp = user.avatar.includes("static/default-profile-pic.jpg");
  }

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Dropdown
      className="account-dropdown"
      isOpen={dropdownOpen}
      toggle={toggle}
    >
      <DropdownToggle caret>
        {defaultPfp ? <img src={defaultAvatar} /> : <img src={user.avatar} />}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>
          <NavLink to={`/users/${user.username}`}>User Profile</NavLink>
        </DropdownItem>
        <DropdownItem>
          <NavLink to="/account/settings">Account Settings</NavLink>
        </DropdownItem>
        <DropdownItem>
          <LogoutLink />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AccountDropdown;
