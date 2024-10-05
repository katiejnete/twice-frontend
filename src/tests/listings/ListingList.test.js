import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ListingList from "../../components/Listings/ListingList";
import useSearch from "../../hooks/useSearch";

jest.mock("../../hooks/useSearch");

describe("ListingList Component", () => {
  const mockSetListingsLoading = jest.fn();
  
  const mockListings = [
    { 
      id: 1, 
      title: "Item 1", 
      description: "Description 1", 
      listingImages: [{ imageUrl: "image1.jpg" }] 
    },
    { 
      id: 2, 
      title: "Item 2", 
      description: "Description 2", 
      listingImages: [{ imageUrl: "image2.jpg" }] 
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useSearch.mockReturnValue({
      grabQueryParams: jest.fn().mockReturnValue({ q: "test" }),
    });
  });

  test("renders listing cards when listings are provided", () => {
    render(
      <MemoryRouter>
        <ListingList listings={mockListings} setListingsLoading={mockSetListingsLoading} user={null} />
      </MemoryRouter>
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  test("displays an alert message when no listings are present and not on the home page", () => {
    render(
      <MemoryRouter initialEntries={['/some-other-page']}>
        <ListingList listings={[]} setListingsLoading={mockSetListingsLoading} user={null} />
      </MemoryRouter>
    );

    const alertMessage = screen.getByText(/No items found/i);
    expect(alertMessage).toBeInTheDocument();
  });

  test("does not display an alert message when on the home page", () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ListingList listings={[]} setListingsLoading={mockSetListingsLoading} user={null} />
      </MemoryRouter>
    );

    const alertMessage = screen.queryByText(/No items found for/i);
    expect(alertMessage).not.toBeInTheDocument();
  });

  test("handles image load and sets loading state correctly", () => {
    render(
      <MemoryRouter>
        <ListingList listings={mockListings} setListingsLoading={mockSetListingsLoading} user={null} />
      </MemoryRouter>
    );
  
    mockListings.forEach((listing) => {
      const image = screen.getByAltText(listing.title);
      fireEvent.load(image);
    });
  
    expect(mockSetListingsLoading).toHaveBeenCalledWith(false);
  });
  
});
