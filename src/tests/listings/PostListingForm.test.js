import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import ListingsContext from "../../context/ListingsContext"
import PostListingForm from "../../components/Forms/Listings/PostListingForm"
import FilterOptionsContext from "../../context/FilterOptionsContext";
import TwiceLovedApi from "../../api";

jest.mock("../../api");

describe("PostListingForm", () => {
  const mockSetListings = jest.fn();
  const mockUser = { username: "testuser", locationId: 123 };

  const mockCategories = ["Category 1", "Category 2"];
  const mockConditions = ["New", "Used"];

  beforeEach(() => {
    render(
        <MemoryRouter>
      <AuthContext.Provider value={{ user: mockUser }}>
        <ListingsContext.Provider value={{ setListings: mockSetListings }}>
          <FilterOptionsContext.Provider value={{ categories: mockCategories, conditions: mockConditions }}>
            <PostListingForm />
          </FilterOptionsContext.Provider>
        </ListingsContext.Provider>
      </AuthContext.Provider>
      </MemoryRouter>
    );
  });

  test("renders the post listing form", () => {
    expect(screen.getByText(/Post Listing/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Condition/i)).toBeInTheDocument();
  });

  test("submits the form and posts listing", async () => {
    TwiceLovedApi.postListing.mockResolvedValue({ id: 1 });

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Test Listing" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "This is a test description." },
    });
    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    await waitFor(() => {
      expect(TwiceLovedApi.postListing).toHaveBeenCalledWith(
        mockUser.username,
        expect.objectContaining({
          title: "Test Listing",
          description: "This is a test description.",
          locationId: mockUser.locationId,
        })
      );
      expect(mockSetListings).toHaveBeenCalled();
    });
  });
});