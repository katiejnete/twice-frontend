import React, { useContext } from "react";
import UpdatePasswordForm from "../Forms/User/UpdatePasswordForm";
import UpdateAvatarForm from "../Forms/User/UpdateAvatarForm";
import UpdateLocationForm from "../Forms/User/UpdateLocationForm";
import UpdateContactForm from "../Forms/User/UpdateContactForm";
import AuthContext from "../../context/AuthContext";
import "../../stylesheets/AccountSettings.css";

const AccountSettings = () => {
  const { user, fetchUser } = useContext(AuthContext);

  return (
    <div className="account-settings-box">
      <h1>Account Settings</h1>
      <UpdatePasswordForm user={user} fetchUser={fetchUser} />
      <UpdateAvatarForm user={user} fetchUser={fetchUser} />
      <UpdateLocationForm user={user} fetchUser={fetchUser} />
      <UpdateContactForm user={user} fetchUser={fetchUser} />
    </div>
  );
};

export default AccountSettings;
