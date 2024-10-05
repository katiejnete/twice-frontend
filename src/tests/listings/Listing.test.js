import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Listing from "../../components/Listings/Listing";
import useListingPage from "../../hooks/useListingPage";
import FavoritesContext from "../../context/FavoritesContext";

jest.mock("../../hooks/useListingPage");

test("renders listing details correctly", async () => {
  useListingPage.mockReturnValue({
    id: 1,
    listing: {
      title: "Mock Listing",
      description: "Description for mock listing",
      lastModified: "2024-01-01",
      conditionId: 1,
      categoryId: 1,
      listingImages: [{ id: 1, imageUrl: "http://example.com/image1.jpg" }],
      city: "Sample City",
      state: "Sample State",
      status: "active",
    },
    userProfile: {
      username: "mockUser",
      avatar: "http://example.com/avatar.jpg",
      itemsGivenAway: 5,
    },
    location: { latitude: 123.45, longitude: 67.89 },
    loading: false,
    categories: ["Electronics", "Furniture", "Clothing"],
    conditions: ["New", "Like New", "Used", "Refurbished", "Damaged"],
  });

  render(
    <AuthContext.Provider value={{ user: { id: 1, addFavorite: jest.fn() } }}>
      <FavoritesContext.Provider value={{addFavorite: jest.fn()}}>
        <MemoryRouter>
          <Listing onDelete={jest.fn()} />
        </MemoryRouter>
      </FavoritesContext.Provider>
    </AuthContext.Provider>
  );

  await waitFor(() => {
    expect(
      screen.getByRole("heading", { name: /Mock Listing/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Description for mock listing/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Last updated 2024-01-01/i)).toBeInTheDocument();
    expect(screen.getByText(/Condition - New/i)).toBeInTheDocument();
    expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample City/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample State/i)).toBeInTheDocument();
  });
});
