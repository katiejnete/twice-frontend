import React, { useState, useContext } from "react";
import { Alert } from "reactstrap";
import { useNavigate } from "react-router-dom";
import ListingForm from "./ListingForm";
import ListingImageForm from "./PostListingImageForm";
import TwiceLovedApi from "../../../api";
import AuthContext from "../../../context/AuthContext";
import ListingsContext from "../../../context/ListingsContext";
import "../../../stylesheets/PostListingForm.css";

const PostListingForm = () => {
  const { user } = useContext(AuthContext);
  const { setListings } = useContext(ListingsContext);

  const INITIAL_STATE = {
    title: "",
    description: "",
    categoryId: 1,
    conditionId: 1,
    locationId: user.locationId,
  };

  const [listingData, setListingData] = useState(INITIAL_STATE);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleListingChange = (data) => {
    setListingData(data);
  };

  const handleImageUpload = (uploadedImages) => {
    setImageUrls(uploadedImages.map((imageUrl) => ({ imageUrl })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!+listingData["locationId"]) {
      setError(
        "Please set your zip code in your account settings before making a post."
      );
    } else {
      try {
        const listing = await TwiceLovedApi.postListing(
          user.username,
          listingData
        ); // post listing details
        // post each image after listing is created
        const listingImages = [];
        for (let image of imageUrls) {
          const listingImage = await TwiceLovedApi.postListingImage(
            user.username,
            listing.id,
            image
          );
          listingImages.push(listingImage);
        }

        listing.listingImages = listingImages;
        setError(null);
        setListings((prev) => [...prev, listing]);
        navigate(`/listings/${listing.id}`, { replace: true });
      } catch (err) {
        console.error(`Failed to post listing`, err);
      }
    }
    setLoading(false);
  };

  return (
    <div className="post-listing-box">
      <form id="post-listing-form" onSubmit={handleSubmit}>
        <h1>Post Listing</h1>
        <ListingForm onChange={handleListingChange} />
        <ListingImageForm onImageUpload={handleImageUpload} />
        <button disabled={loading} type="submit">
          Post
        </button>
        {error && (
          <Alert color="danger" className="mt-2" fade={false}>
            {error}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default PostListingForm;
