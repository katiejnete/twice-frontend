import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import ListingList from "../Listings/ListingList";
import TwiceLovedApi from "../../api";
import defaultAvatar from "../../assets/default-profile-pic.jpg";
import "../../stylesheets/UserProfile.css";

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await TwiceLovedApi.getUser(username);
        setUser(fetchedUser); // update current user with most up-to-date data

        try {
          const listings = await TwiceLovedApi.getUserListings(username);
          setUserListings(listings); // store fetched user listings in state
        } catch (err) {
          console.error(`Error fetching user favorites`, err);
        }

        setLoading(false);
      } catch (err) {
        console.error(`Error fetching user`, err);
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading) {
    return(
      <div role="status">
        <BeatLoader />
      </div>
    );
  }

  return (
    <>
      <section className="user-profile-header">
        <div className="user-profile-avatar-box">
          {user.avatar.includes("static/default-profile-pic.jpg") ? (
            <img src={defaultAvatar} />
          ) : (
            <img src={user.avatar} />
          )}
        </div>
        <h1>{username}</h1>
        <p>Items Given Away: {user.itemsGivenAway}</p>
        <p>Contact Info: {user.contactInfo}</p>
      </section>
      <hr />
      <h2>Items</h2>
      <ListingList
        user={user}
        style={{ display: loading ? "none" : "flex" }}
        listings={userListings}
        setListingsLoading={setLoading}
      />
    </>
  );
};

export default UserProfile;
