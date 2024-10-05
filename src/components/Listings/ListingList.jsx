import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Alert } from "reactstrap";
import useSearch from "../../hooks/useSearch";
import ListingCard from "./ListingCard";
import "../../stylesheets/ListingList.css";

const ListingList = ({ listings, setListingsLoading, user }) => {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const { grabQueryParams } = useSearch();
  const location = useLocation();
  let alertMessage = "";

  // construct alert based on user state and search query params
  for (let [key, value] of Object.entries(grabQueryParams())) {
    if (key === "q") key = "search"; // normalize "q" to "search" for alert
    if (value === "") value = "None"; // default value for empty query param
    alertMessage += `${key}: ${value} `;
    if (user && user.locationId) alertMessage += "at user's location "; // let user know searches are at their account setting's location
  }

  // append username to alert if user is logged in and viewing their profile
  if (user && location.pathname === `/users/${user.username}`) {
    alertMessage += user.username;
  }

  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  useEffect(() => {
    if (imagesLoaded === listings.length) setListingsLoading(false);
  }, [imagesLoaded]);

  return (
    <section className="listing-list">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          handleImageLoad={handleImageLoad}
        />
      ))}
      {location.pathname !== "/" && listings.length === 0 && (
        <Alert color="primary" className="mt-2" fade={false}>
          {`No items found for ${alertMessage}`}
        </Alert>
      )}
    </section>
  );
};

export default ListingList;
