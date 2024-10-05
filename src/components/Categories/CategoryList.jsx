import React from "react";
import Category from "./Category";
import "../../stylesheets/CategoryList.css";

const CategoryList = ({ categories }) => {
  
  return (
    <section className="category-list">
      {categories &&
        categories.map((category, index) => (
          <Category key={index} category={category} />
        ))}
    </section>
  );
};

export default CategoryList;
