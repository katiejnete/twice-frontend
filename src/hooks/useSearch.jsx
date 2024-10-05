import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useSearch = () => {
  const [queryData, setQueryData] = useState({});
  const [storedSearchData, setStoredSearchData] = useState({});
  const [resetSearch, setResetSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const updateQueryParams = (newParams) => {
    const queryParams = new URLSearchParams(location.search);
    if (newParams && Object.keys(newParams).length > 0) {
      for (const [key, value] of Object.entries(newParams)) {
        queryParams.set(key, value); // appends to existing query params
      }
      const updatedParams = queryParams.toString();
      navigate(`/search?${updatedParams}`); // navigates to search page with updated query params
    } else {
      setQueryData({}); // clears query params if none
    }
  };

  const grabQueryParams = () => {
    const queryParams = new URLSearchParams(location.search);
    const dataQueryObject = {};

    for (const [key, value] of queryParams) {
      dataQueryObject[key] = value; // constructs obj from query params
    }

    return dataQueryObject;
  };

  // whenever resetSearch is true, removes all keys except for location keys 
  useEffect(() => {
    if (resetSearch) {
      setStoredSearchData((prev) => {
        delete prev.category;
        delete prev.condition;
        delete prev.sort;
        return prev;
      });
    }
  }, [resetSearch]);

  return {
    queryData,
    setQueryData,
    storedSearchData,
    setStoredSearchData,
    updateQueryParams,
    grabQueryParams,
    resetSearch,
    setResetSearch,
  };
};

export default useSearch;
