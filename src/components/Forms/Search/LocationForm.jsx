import React, { useState, useContext, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Alert } from "reactstrap";
import SearchContext from "../../../context/SearchContext";
import TwiceLovedApi from "../../../api";
import "../../../stylesheets/LocationForm.css";

const LocationForm = ({ isZipOpen, toggle, updateQueryParams }) => {
  const INITIAL_STATE = { zip: "", radius: "" };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setStoredSearchData } = useContext(SearchContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // check if zip code is valid number
  const validateForm = () => {
    const newError = {};
    if (!+formData.zip && formData.zip) {
      newError.message = "Zip code must be valid";
      return newError;
    } else if (+formData.zip === 0) return false;
  };

  // fetch location data based on zip code
  const handleLocationSearch = async (zip) => {
    if (!zip) return true; // skip search if zip is empty
    const newError = {};
    try {
      const location = await TwiceLovedApi.getLocationByZip(zip);
      return location;
    } catch (err) {
      console.error(`Failed to fetch location`, err);
      newError.message = err[0];
      return newError;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let locationRes;
    setLoading(true);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
    }
    if (!validationError) {
      locationRes = await handleLocationSearch(formData["zip"]);
      if (locationRes && locationRes.message) {
        setError(locationRes);
      }
    }
    // if no validation or location errors, update stored search data and toggle location modal
    if (!validationError && !(locationRes && locationRes.message)) {
      let updatedData;
      setStoredSearchData((searchData) => {
        updatedData = { ...searchData, ...formData };
        return updatedData;
      });
      updateQueryParams(updatedData);
      toggle();
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isZipOpen && error) {
      setError(null);
    }
  }, [isZipOpen]);

  return (
    <Modal isOpen={isZipOpen} toggle={toggle} className="location-form-modal">
      <ModalHeader toggle={toggle}>ZIP Code</ModalHeader>
      <ModalBody className="location-form-modal-body">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="zip"
            placeholder="Enter ZIP code"
            value={formData["zip"]}
            onChange={handleChange}
          />
          <input
            type="number"
            name="radius"
            placeholder="Enter the mile radius for your search (e.g., 10)..."
            value={formData["radius"]}
            onChange={handleChange}
            min="1"
          />
          <button type="submit" disabled={loading}>
            Apply
          </button>
        </form>
      </ModalBody>
      {error && (
        <Alert fade={false} color="danger" className="mt-2">
          {error.message}
        </Alert>
      )}
    </Modal>
  );
};

export default LocationForm;
