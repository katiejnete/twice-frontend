import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import SearchContext from "../../../context/SearchContext";
import FilterOptionsContext from "../../../context/FilterOptionsContext";
import "../../../stylesheets/LocationForm.css";

const FilterForm = ({ isFilterOpen, toggle }) => {
  const { setStoredSearchData, updateQueryParams, resetSearch, setResetSearch } = useContext(SearchContext);
  const { categories, conditions } = useContext(FilterOptionsContext);
  const [loading, setLoading] = useState(false);

  const INITIAL_STATE = { category: "", condition: "" };
  const formik = useFormik({
    initialValues: INITIAL_STATE,
    onSubmit: (values) => {
      setLoading(true);
      setResetSearch(false); // ensure search is not reset when submitting filter options

      setStoredSearchData((searchData) => {
        const updatedData = { ...searchData, ...values };
        updateQueryParams(updatedData);
        return updatedData;
      });
      setLoading(false);
      toggle();
    },
  });

  useEffect(() => {
    if (resetSearch) {
      formik.resetForm();
    }
  }, [resetSearch])

  return (
    <Modal isOpen={isFilterOpen} toggle={toggle} className="filter-form-modal">
      <ModalHeader toggle={toggle}>Filters</ModalHeader>
      <ModalBody className="filter-form-modal-body">
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="category-select">Category</label>
          <select
            name="category"
            id="category-select"
            value={formik.values.category}
            onChange={formik.handleChange}
          >
            <option key="no categories" value="">
              None
            </option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <label htmlFor="condition-select">Condition</label>
          <select
            name="condition"
            id="condition-select"
            value={formik.values.condition}
            onChange={formik.handleChange}
          >
            <option key="no conditions" value="">
              None
            </option>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
          <button disabled={loading} type="submit">See listings</button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default FilterForm;
