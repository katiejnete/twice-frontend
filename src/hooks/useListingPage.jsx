import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import TwiceLovedApi from "../api";
import FilterOptionsContext from "../context/FilterOptionsContext";
import defaultListingImage from "../assets/listingPlaceholder.png";

const useListingPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { categories, conditions } = useContext(FilterOptionsContext);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const fetchedListing = await TwiceLovedApi.getListing(id);
        const updatedListing = { ...fetchedListing };
        if (updatedListing.listingImages.length === 0) { // if no images append to listing default image  
          updatedListing.listingImages[0] = {
            imageUrl: defaultListingImage,
            id: uuidv4(),
          };
        }
        setListing(updatedListing);
        const fetchedProfile = await TwiceLovedApi.getUser(
          updatedListing.username
        );
        setUserProfile(fetchedProfile); // updates state with fetched user profile
        const fetchedLocation = await TwiceLovedApi.getLocationById(
          updatedListing.locationId
        );
        setLocation(fetchedLocation); // updates state with fetched user location
      } catch (err) {
        console.error(`Error fetching listing`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  return {
    id,
    listing,
    userProfile,
    location,
    loading,
    categories,
    conditions,
  };
};

export default useListingPage;
