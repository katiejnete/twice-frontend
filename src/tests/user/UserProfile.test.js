import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import UserProfile from "../../components/UserAccount/UserProfile";
import TwiceLovedApi from "../../api";

jest.mock("../../api");

describe("UserProfile", () => {
  const mockUser = {
    username: "testuser",
    avatar: "http://example.com/avatar.jpg",
    itemsGivenAway: 5,
    contactInfo: "testuser@example.com",
  };
  
  const mockListings = [
    { id: 1, title: "Mock Listing 1", listingImages: [{ imageUrl: "http://example.com/image1.jpg" }] },
    { id: 2, title: "Mock Listing 2", listingImages: [] },
  ];

  beforeEach(() => {
    TwiceLovedApi.getUser.mockResolvedValue(mockUser);
    TwiceLovedApi.getUserListings.mockResolvedValue(mockListings);
  });

  test("renders user profile and listings", async () => {
    render(
      <MemoryRouter initialEntries={['/user/testuser']}>
        <Routes>
          <Route path="/user/:username" element={<UserProfile />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /testuser/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/Items Given Away: 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Info: testuser@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Listing 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Listing 2/i)).toBeInTheDocument();
  });
});
