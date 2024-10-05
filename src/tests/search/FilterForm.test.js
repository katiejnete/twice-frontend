import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import FilterForm from "../../components/Forms/Search/FilterForm";
import SearchContext from "../../context/SearchContext";
import FilterOptionsContext from "../../context/FilterOptionsContext";

const mockSetStoredSearchData = jest.fn();
const mockUpdateQueryParams = jest.fn();
const mockSetResetSearch = jest.fn();
const mockToggle = jest.fn();

const mockSearchContext = {
  setStoredSearchData: mockSetStoredSearchData,
  updateQueryParams: mockUpdateQueryParams,
  resetSearch: false,
  setResetSearch: mockSetResetSearch,
};

const mockFilterOptionsContext = {
  categories: ["Furniture", "Electronics"],
  conditions: ["New", "Used"],
};

describe("FilterForm", () => {
  const setup = (resetSearch = false) => {
    render(
      <SearchContext.Provider value={{ ...mockSearchContext, resetSearch }}>
        <FilterOptionsContext.Provider value={mockFilterOptionsContext}>
          <FilterForm isFilterOpen={true} toggle={mockToggle} />
        </FilterOptionsContext.Provider>
      </SearchContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set stored search data to trigger useEffect for search", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Furniture" },
    });
    fireEvent.change(screen.getByLabelText(/condition/i), {
      target: { value: "New" },
    });
    fireEvent.click(screen.getByRole("button", { name: /see listings/i }));
    await waitFor(() => {
      expect(mockSetStoredSearchData).toHaveBeenCalled();
    });
    expect(mockToggle).toHaveBeenCalled();
  });

  it("should reset form fields when resetSearch is true", async () => {
    setup(true);
    await waitFor(() => {
      expect(screen.getByLabelText(/category/i).value).toBe("");
      expect(screen.getByLabelText(/condition/i).value).toBe("");
    });
  });

  it("should toggle the modal when closed", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockToggle).toHaveBeenCalled();
  });
});
