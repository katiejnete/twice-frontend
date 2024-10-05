import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchContext from "../../../context/SearchContext";
import "../../../stylesheets/SearchForm.css";

const SearchForm = () => {
  const INITIAL_STATE = { q: "" };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const { setStoredSearchData, setResetSearch, grabQueryParams } =
    useContext(SearchContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    setLoading(true);
    setResetSearch(true); // search should be reset to initial state for every new query search term
    setStoredSearchData((prev) => ({ ...prev, ...formData })); // update stored search data (user's set location via customizable location form or account settings location) with current form data

    const queryParams = grabQueryParams();
    // navigate to search page with query params if zip exists. otherwise, navigate to search without zip
    if (queryParams["zip"]) navigate(`/search?q=${formData["q"]}&zip=${queryParams.zip}&radius=${queryParams.radius || ""}`);
    else navigate(`/search?q=${formData["q"]}`);

    setLoading(false);
    setFormData(INITIAL_STATE);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(() => ({ [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  useEffect(() => {
    // check if current pathname is root, to reset search and navigate based on stored location data
    if (location.pathname === "/") {
      setResetSearch(true);
      setStoredSearchData((prev) => ({ ...prev, ...formData }));
  
      const queryParams = grabQueryParams();
      // navigate to search page with query params if zip exists otherwise stay on root page
      if (queryParams["zip"]) navigate(`/search?q=${formData["q"]}&zip=${queryParams.zip}&radius=${queryParams.radius || ""}`);
      else navigate(`/`);

      setFormData(INITIAL_STATE);
    }
  }, [location.pathname]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="q"
          placeholder="Search for available items"
          value={formData["q"]}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading} className="search-btn">
          Search
        </button>
      </form>
    </>
  );
};

export default SearchForm;
