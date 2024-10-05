import React, { useContext, useState } from "react";
import { Alert } from "reactstrap";
import { BeatLoader } from "react-spinners";
import ListingList from "./ListingList";
import FilterForm from "../Forms/Search/FilterForm";
import SortForm from "../Forms/Search/SortForm";

import ListingsContext from "../../context/ListingsContext";
import SearchContext from "../../context/SearchContext";
import AuthContext from "../../context/AuthContext";
import "../../stylesheets/ListingsContainer.css";

const ListingsContainer = ({ home }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const { listings, listingsLoading, setListingsLoading } =
    useContext(ListingsContext);
  const { updateUrlParams } = useContext(SearchContext);
  const { user } = useContext(AuthContext);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const toggleSort = () => setIsSortOpen(!isSortOpen);

  return (
    <section className="listings-container">
      <button onClick={toggleFilter}>Filters</button>
      <FilterForm
        isFilterOpen={isFilterOpen}
        updateUrlParams={updateUrlParams}
        toggle={toggleFilter}
      />
      <button onClick={toggleSort}>Sort</button>
      <SortForm
        isSortOpen={isSortOpen}
        updateUrlParams={updateUrlParams}
        toggle={toggleSort}
      />
      {home && user && user.locationId && listings.length > 0 && (
        <Alert color="info" fade={false} className="mt-2">
          Items within 10 miles of set location.
        </Alert>
      )}
      {home && user && user.locationId && listings.length === 0 && (
        <Alert color="primary" fade={false} className="mt-2">
          No items found within 10 miles of set location.
        </Alert>
      )}
      {listingsLoading && <BeatLoader />}
      <ListingList
        user={user}
        listings={listings}
        setListingsLoading={setListingsLoading}
        style={{ display: listingsLoading ? "none" : "flex" }}
      />
    </section>
  );
};

export default ListingsContainer;
