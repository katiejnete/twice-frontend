import React from "react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Category from "../../components/Categories/Category"; // Adjust path if necessary

describe("Category", () => {
  const setup = (category = "Sample Category") => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Category category={category} />
      </MemoryRouter>
    );
  };

  it("renders the category as a NavLink", () => {
    setup("Test Category");
    const categoryLink = screen.getByRole("link", { name: /test category/i });
    expect(categoryLink).toBeInTheDocument();
  });

  it("navigates to the correct URL when clicked", () => {
    setup("Test Category");
    const categoryLink = screen.getByRole("link", { name: /test category/i });
    expect(categoryLink).toHaveAttribute("href", "/search?category=Test Category");
  });

  it("renders without crashing with a default category", () => {
    setup();
    const categoryLink = screen.getByRole("link", { name: /sample category/i });
    expect(categoryLink).toBeInTheDocument();
  });
});
