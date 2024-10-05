import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import useListingPage from "../../hooks/useListingPage";
import MapTile from "./MapTile";
import ListingFooter from "./ListingFooter";
import TwiceLovedApi from "../../api";
import AuthContext from "../../context/AuthContext";
import defaultAvatar from "../../assets/default-profile-pic.jpg";
import "../../stylesheets/Listing.css";

const Listing = ({ onDelete }) => {
  const { user } = useContext(AuthContext);
  const {
    id,
    listing,
    userProfile,
    location,
    loading,
    categories,
    conditions,
  } = useListingPage();

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await TwiceLovedApi.deleteListing(userProfile.username, id);
      if (user && listing.userId === user.id) onDelete(id);
      navigate(`/users/${user.username}`);
    } catch (err) {
      console.error(`Failed to delete listing`, err);
    }
  };

  if (loading) {
    return (
      <div role="status">
        <BeatLoader />
      </div>
    );
  }

  return (
    <section className="listing">
      <section className="listing-images">
        {listing.listingImages.map((image) => (
          <img key={image.id} src={image.imageUrl} />
        ))}
      </section>
      <h1>{listing.title}</h1>
      <p key="desc" >{listing.description}</p>
      <p key="last-mod">Last updated {listing.lastModified}</p>
      <p key="condition">Condition - {conditions[+listing.conditionId - 1]}</p>
      <p key="category">{categories[+listing.categoryId - 1]}</p>
      <p key="status">Status: {listing.status}</p>
      <p key="location">
        {listing.city}, {listing.state}
      </p>
      <MapTile lat={location.latitude} long={location.longitude} />
      <hr />
      <section className="listing-user-profile">
        <Link to={`/users/${userProfile.username}`}>
          <div className="listing-avatar-box">
            {userProfile.avatar.includes("static/default-profile-pic.jpg") ? (
              <img src={defaultAvatar} />
            ) : (
              <img src={userProfile.avatar} />
            )}
          </div>
          <h2>{userProfile.username}</h2>
          <p>Items Given Away - {userProfile.itemsGivenAway}</p>
        </Link>
      </section>
      {user && listing.userId === user.id ? (
        <div>
          <Link to={`/listings/${listing.id}/edit`}>
            <button>Edit Listing</button>
          </Link>
          <button onClick={handleDelete}>Delete Listing</button>
        </div>
      ) : (
        <ListingFooter currentUser={user} user={userProfile} listing={listing} />
      )}
    </section>
  );
};

export default Listing;
