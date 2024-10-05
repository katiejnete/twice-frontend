import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { BeatLoader } from "react-spinners";
import { Alert } from "reactstrap";
import useUpdateListing from "../../../hooks/useUpdateListing";
import ListingImageForm from "./UpdateListingImageForm";
import TwiceLovedApi from "../../../api";
import AuthContext from "../../../context/AuthContext";
import ListingsContext from "../../../context/ListingsContext";
import ImpactContext from "../../../context/ImpactContext";
import "../../../stylesheets/UpdateListingForm.css";

const UpdateListingForm = ({ onNotAvail }) => {
  const {
    id,
    listing,
    loading,
    error,
    setError,
    initialValues,
    categories,
    conditions,
    submitting,
    setSubmitting,
  } = useUpdateListing(); // extract data for managing listing update state
  const { user } = useContext(AuthContext);
  const { setListings } = useContext(ListingsContext);
  const { setItemsGivenAway } = useContext(ImpactContext);
  const { listingImages } = initialValues;
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const listingData = {...values};
        delete listingData.listingImages; // exclude images from data sent to api, images handled separately
        await TwiceLovedApi.patchListing(user.username, id, listingData);

        // update local listings based on listing's status
        if (values["status"] === "Available") {
          setListings((prevListings) => [...prevListings, listing]);
        } else {
          onNotAvail(id); // custom function to update local listings based on "Taken"/"Inactive" status
          if (values["status"] === "Taken")
            setItemsGivenAway((prev) => prev + 1); // increment db's total items given away
        }
        navigate(`/listings/${id}`);
      } catch (err) {
        console.error("Error updating listing:", err);
        setError("Failed to update listing. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) return <BeatLoader />;

  return (
    <div className="update-listing-box">
      <h1>Edit Listing</h1>
      <ListingImageForm
        currentImages={listingImages}
        user={user}
        id={id}
      />
      <form id="update-listing-form" onSubmit={formik.handleSubmit}>
        <div>
          {" "}
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formik.values.title}
            onChange={formik.handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formik.values.categoryId}
            onChange={formik.handleChange}
          >
            {categories.map((category, idx) => (
              <option key={category} value={idx + 1}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="conditionId">Condition</label>
          <select
            id="conditionId"
            name="conditionId"
            value={formik.values.conditionId}
            onChange={formik.handleChange}
          >
            {conditions.map((condition, idx) => (
              <option key={condition} value={idx + 1}>
                {condition}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
          >
            {["Available", "Taken", "Inactive"].map((status, idx) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <button disabled={submitting} type="submit">
          Update Listing
        </button>
      </form>
      {error && (
        <Alert color="danger" className="mt-2" fade={false}>
          {error}
        </Alert>
      )}
    </div>
  );
};

export default UpdateListingForm;
