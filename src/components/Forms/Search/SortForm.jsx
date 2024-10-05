import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import { Modal, ModalHeader, ModalBody, Alert } from "reactstrap";
import AuthContext from "../../../context/AuthContext";
import SearchContext from "../../../context/SearchContext";
import "../../../stylesheets/LocationForm.css";

const SortForm = ({ isSortOpen, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { storedSearchData, setStoredSearchData, updateQueryParams, resetSearch, setResetSearch } =
    useContext(SearchContext);

  const sort = ["Best Match (Default)", "Most Recent", "Most Closest"];

  const INITIAL_STATE = { sort: "best" };
  const formik = useFormik({
    initialValues: INITIAL_STATE,
    onSubmit: (values) => {
      setLoading(true);
      setResetSearch(false); // ensure search is not reset when submitting sort options
      
      // if current user has no location set or did not set custom location, cannot sort listings by proximity
      if (
        user &&
        values["sort"] === "closest" &&
        !storedSearchData["zip"] &&
        !user.locationId
      ) {
        setError("Please enter zip code to sort listings by proximity.");
      } else if (!user && values["sort"] === "closest" && !storedSearchData["zip"]) {
        setError("Please enter zip code to sort listings by proximity.");
      } else {
        // update stored search data and query params with selected sort option
        setStoredSearchData((searchData) => {
          const updatedData = { ...searchData, ...values };
          updateQueryParams(updatedData); // reflect changes in query params
          return updatedData;
        });
        toggle();
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    // reset error message when sort modal opens
    if (isSortOpen && error) {
      setError(null);
    }
  }, [isSortOpen]);

  useEffect(() => {
    if (resetSearch) {
      formik.resetForm();
    }
  }, [resetSearch])

  return (
    <Modal isOpen={isSortOpen} toggle={toggle} className="filter-form-modal">
      <ModalHeader toggle={toggle}>Sort</ModalHeader>
      <ModalBody className="filter-form-modal-body">
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="sort">Sort</label>
          <select
            id="sort"
            name="sort"
            value={formik.values.sort}
            onChange={formik.handleChange}
          >
            <option value="best">{sort[0]}</option>
            <option value="recent">{sort[1]}</option>
            <option value="closest">{sort[2]}</option>
          </select>
          <button disabled={loading} type="submit">See Listings</button>
        </form>
      </ModalBody>
      {error && (
        <Alert fade={false} color="danger" className="mt-2">
          {error}
        </Alert>
      )}
    </Modal>
  );
};

export default SortForm;
