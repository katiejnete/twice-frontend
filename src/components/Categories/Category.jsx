import React from "react";
import { NavLink } from "react-router-dom";

const Category = ({ category }) => {
  return <NavLink to={`/search?category=${category}`}>{category}</NavLink>;
};

export default Category;
