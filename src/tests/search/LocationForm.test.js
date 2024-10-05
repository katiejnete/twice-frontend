import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import LocationForm from "../../components/Forms/Search/LocationForm";
import SearchContext from "../../context/SearchContext";
import TwiceLovedApi from "../../api";

jest.mock("../../api", () => ({
  getLocationByZip: jest.fn(),
}));

const mockSetStoredSearchData = jest.fn();
const mockUpdateQueryParams = jest.fn();
const mockToggle = jest.fn();

const mockSearchContext = {
  setStoredSearchData: mockSetStoredSearchData,
};

describe("LocationForm", () => {
  const setup = (isZipOpen = true, error = null) => {
    render(
      <SearchContext.Provider value={mockSearchContext}>
        <LocationForm
          isZipOpen={isZipOpen}
          toggle={mockToggle}
          updateQueryParams={mockUpdateQueryParams}
        />
      </SearchContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should submit the form with valid ZIP and radius", async () => {
    TwiceLovedApi.getLocationByZip.mockResolvedValue({ city: "Sample City" });
  
    setup();
  
    fireEvent.change(screen.getByPlaceholderText(/enter zip code/i), {
      target: { value: "12345" },
    });
  
    fireEvent.change(
      screen.getByPlaceholderText(/enter the mile radius for your search/i),
      { target: { value: "10" } }
    );
  
    mockSetStoredSearchData.mockImplementationOnce((callback) => {
      const updatedData = callback({});
      expect(updatedData).toEqual({ zip: "12345", radius: "10" });
      return updatedData;
    });
  
    fireEvent.click(screen.getByRole("button", { name: /apply/i }));
  
    await waitFor(() => {
      expect(mockSetStoredSearchData).toHaveBeenCalled();
      expect(mockUpdateQueryParams).toHaveBeenCalledWith({
        zip: "12345",
        radius: "10",
      });
      expect(mockToggle).toHaveBeenCalled();
    });
  });

  it("should display error for invalid ZIP code", async () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText(/enter zip code/i), {
      target: { value: "abc" },
    });

    fireEvent.click(screen.getByRole("button", { name: /apply/i }));

    await waitFor(() => {
      expect(screen.getByText(/zip code must be valid/i)).toBeInTheDocument();
      expect(mockSetStoredSearchData).not.toHaveBeenCalled();
      expect(mockUpdateQueryParams).not.toHaveBeenCalled();
      expect(mockToggle).not.toHaveBeenCalled();
    });
  });

  it("should close the modal when toggle is called", () => {
    setup();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(mockToggle).toHaveBeenCalled();
  });
});
