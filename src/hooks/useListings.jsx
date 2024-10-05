import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TwiceLovedApi from "../api";

const useListings = (storedSearchData, user) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const grabQueryParams = () => {
    const queryParams = new URLSearchParams(location.search);
    const dataQueryObject = {};

    for (const [key, value] of queryParams) {
      dataQueryObject[key] = value; // construct obj from query params
    }

    return dataQueryObject;
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        let dataQueryObject = grabQueryParams();
        if (user) {
          if (location.pathname === "/") {
            delete dataQueryObject.q; // removes "q" when on home page
            
          }
          if (storedSearchData.zip) { // add zip and radius to query if they exist
            dataQueryObject.zip = storedSearchData.zip;
            dataQueryObject.radius = storedSearchData.radius;
          }
        } 
        
        const itemList = await TwiceLovedApi.getListings(dataQueryObject);
        setItems(itemList);
      } catch (error) {
        if (error[1].slice(-3) === "404") setItems([]); // set listings to empty arr if 404
        console.error(`Failed to fetch listings`, error);
      } finally {
        setLoading(false);
      }
    };

    if (location.pathname === "/" || location.pathname === "/search") fetchListings();
  }, [location.search, location.pathname, user]);

  return {
    items,
    loading,
    setLoading,
    setItems,
  };
};

export default useListings;
