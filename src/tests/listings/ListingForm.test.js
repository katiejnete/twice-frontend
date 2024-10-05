import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ListingForm from "../../components/Forms/Listings/ListingForm"
import FilterOptionsContext from "../../context/FilterOptionsContext";

describe("ListingForm", () => {
  const mockCategories = ["Category 1", "Category 2"];
  const mockConditions = ["New", "Used"];

  const renderListingForm = (onChange) => {
    render(
      <FilterOptionsContext.Provider value={{ categories: mockCategories, conditions: mockConditions }}>
        <ListingForm onChange={onChange} />
      </FilterOptionsContext.Provider>
    );
  };

  test("renders listing form with fields", () => {
    const handleChange = jest.fn();
    renderListingForm(handleChange);

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Condition/i)).toBeInTheDocument();
  });

  test("calls onChange prop when fields are filled", () => {
    const handleChange = jest.fn();
    renderListingForm(handleChange);

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Test Listing" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/Condition/i), {
      target: { value: "1" }, 
    });

    expect(handleChange).toHaveBeenCalledTimes(4);
  });
});
