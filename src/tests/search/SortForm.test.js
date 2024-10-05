import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import SortForm from "../../components/Forms/Search/SortForm";
import AuthContext from "../../context/AuthContext";
import SearchContext from "../../context/SearchContext";

const mockSetStoredSearchData = jest.fn();
const mockUpdateQueryParams = jest.fn();
const mockSetResetSearch = jest.fn();

const mockSearchContext = {
  storedSearchData: {},
  setStoredSearchData: mockSetStoredSearchData,
  updateQueryParams: mockUpdateQueryParams,
  resetSearch: false,
  setResetSearch: mockSetResetSearch,
};

const mockAuthContext = {
  user: null,
};

describe("SortForm", () => {
  const setup = (isSortOpen = true) => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <SearchContext.Provider value={mockSearchContext}>
            <SortForm isSortOpen={isSortOpen} toggle={jest.fn()} />
          </SearchContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders SortForm without crashing", () => {
    setup();
    expect(screen.getByLabelText(/sort/i)).toBeInTheDocument();
  });

  it("should update sort value on select change", () => {
    setup();
    const select = screen.getByLabelText(/sort/i);
    fireEvent.change(select, { target: { value: "recent" } });
    expect(select.value).toBe("recent");
  });

  it("should display error when sorting by closest without location", async () => {
    setup();
    const select = screen.getByLabelText(/sort/i);
    fireEvent.change(select, { target: { value: "closest" } });
    fireEvent.click(screen.getByRole("button", { name: /see listings/i }));

    await waitFor(() => {
      expect(mockSetStoredSearchData).not.toHaveBeenCalled();
      expect(screen.getByText(/please enter zip code to sort listings by proximity/i)).toBeInTheDocument();
    });
  });

  it("should call setStoredSearchData and update query params on form submission", async () => {
    mockAuthContext.user = { locationId: 1 };
    setup();

    const select = screen.getByLabelText(/sort/i);
    fireEvent.change(select, { target: { value: "closest" } });

    mockSetStoredSearchData.mockImplementationOnce((callback) => {
      const updatedData = callback({});
      expect(updatedData).toEqual({ sort: "closest" });
      return updatedData;
    });

    fireEvent.click(screen.getByRole("button", { name: /see listings/i }));

    await waitFor(() => {
      expect(mockSetStoredSearchData).toHaveBeenCalled();
      expect(mockUpdateQueryParams).toHaveBeenCalledWith({
        sort: "closest",
      });
    });
  });
});
