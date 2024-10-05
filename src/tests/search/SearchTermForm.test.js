import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import SearchForm from "../../components/Forms/Search/SearchTermForm";
import SearchContext from "../../context/SearchContext";

const mockSetStoredSearchData = jest.fn();
const mockSetResetSearch = jest.fn();
const mockGrabQueryParams = jest.fn().mockReturnValue({});

const mockSearchContext = {
  setStoredSearchData: mockSetStoredSearchData,
  setResetSearch: mockSetResetSearch,
  grabQueryParams: mockGrabQueryParams,
};

describe("SearchForm", () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <SearchContext.Provider value={mockSearchContext}>
          <SearchForm />
        </SearchContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders SearchForm without crashing", () => {
    setup();
    expect(
      screen.getByPlaceholderText(/search for available items/i)
    ).toBeInTheDocument();
  });

  it("should update form data on input change", () => {
    setup();
    const input = screen.getByPlaceholderText(/search for available items/i);

    fireEvent.change(input, { target: { value: "Test Item" } });

    expect(input.value).toBe("Test Item");
  });

  it("should call setStoredSearchData and navigate on form submit", async () => {
    setup();

    const input = screen.getByPlaceholderText(/search for available items/i);
    fireEvent.change(input, { target: { value: "Test Item" } });

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(mockSetResetSearch).toHaveBeenCalledWith(true);
      expect(mockSetStoredSearchData).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });
  });
});
