import React, { useContext, useState } from "react";
import FilterOptionsContext from "../../../context/FilterOptionsContext";

const ListingForm = ({ onChange }) => {
  const { categories, conditions } = useContext(FilterOptionsContext);

  const handleChange = (e) => {
    onChange((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div id="listing-form">
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          type="textarea"
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="category-select">Category</label>
        <select name="categoryId" id="category-select" onChange={handleChange}>
          {categories.map((category, idx) => (
            <option key={category} value={idx + 1}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="condition-select">Condition</label>
        <select
          name="conditionId"
          id="condition-select"
          onChange={handleChange}
        >
          {conditions.map((condition, idx) => (
            <option key={condition} value={idx + 1}>
              {condition}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ListingForm;
