import React, { useContext } from "react";
import SearchTermForm from "./SearchTermForm";
import LocationForm from "./LocationForm";

import SearchContext from "../../../context/SearchContext";

const SearchCriteriaForm = ({ isZipOpen, toggleZip }) => {
  const { updateQueryParams } = useContext(SearchContext);

  return (
    <>
      <SearchTermForm />
      <LocationForm
        isZipOpen={isZipOpen}
        toggle={toggleZip}
        updateQueryParams={updateQueryParams}
      />
    </>
  );
};

export default SearchCriteriaForm;
