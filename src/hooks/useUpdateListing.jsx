import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TwiceLovedApi from "../api";
import FilterOptionsContext from "../context/FilterOptionsContext";

const useUpdateListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const { categories, conditions } = useContext(FilterOptionsContext);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    categoryId: "",
    conditionId: "",
    locationId: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const listing = await TwiceLovedApi.getListing(id);
        setListing(listing);
        setInitialValues({
          title: listing.title,
          description: listing.description,
          categoryId: listing.categoryId,
          conditionId: listing.conditionId,
          locationId: listing.locationId,
          status: listing.status,
          listingImages: listing.listingImages,
        });
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError("Unable to fetch listing data.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleImageUpload = (uploadedImages) => {
    setImageUrls(uploadedImages.map((imageUrl) => ({ imageUrl }))); // formats uploaded image urls to objects for api
  };

  return {
    id,
    listing,
    loading,
    error,
    setError,
    imageUrls,
    initialValues,
    categories,
    conditions,
    handleImageUpload,
    submitting,
    setSubmitting,
  };
};

export default useUpdateListing;
