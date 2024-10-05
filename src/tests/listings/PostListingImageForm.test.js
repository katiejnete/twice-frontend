import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ListingImageForm from "../../components/Forms/Listings/PostListingImageForm"; 

jest.mock("axios");

describe("ListingImageForm", () => {
  const mockOnImageUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders image upload form", () => {
    render(<ListingImageForm onImageUpload={mockOnImageUpload} />);

    expect(screen.getByLabelText(/Upload Images:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Upload Images/i })
    ).toBeInTheDocument();
  });

  test("displays an error message when no images are selected", async () => {
    render(<ListingImageForm onImageUpload={mockOnImageUpload} />);

    fireEvent.click(screen.getByRole("button", { name: /Upload Images/i }));

    expect(
      await screen.findByText(/Please select at least one image/i)
    ).toBeInTheDocument();
  });

  test("uploads images and calls onImageUpload with URLs", async () => {
    const mockImageFile = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    const uploadResponse = {
      data: { secure_url: "http://example.com/image.png" },
    };

    axios.post.mockResolvedValueOnce(uploadResponse);

    render(<ListingImageForm onImageUpload={mockOnImageUpload} />);

    const fileInput = screen.getByLabelText(/Upload Images:/i);
    fireEvent.change(fileInput, { target: { files: [mockImageFile] } });

    fireEvent.click(screen.getByRole("button", { name: /Upload Images/i }));

    await waitFor(() => {
      expect(mockOnImageUpload).toHaveBeenCalledWith([
        "http://example.com/image.png",
      ]);
      expect(screen.getByText(/Images added to listing/i)).toBeInTheDocument();
    });
  });

  test("displays an error message on upload failure", async () => {
    const mockImageFile = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    axios.post.mockRejectedValueOnce(new Error("Upload failed"));

    render(<ListingImageForm onImageUpload={mockOnImageUpload} />);

    const fileInput = screen.getByLabelText(/Upload Images:/i);
    fireEvent.change(fileInput, { target: { files: [mockImageFile] } });

    fireEvent.click(screen.getByRole("button", { name: /Upload Images/i }));

    expect(
      await screen.findByText(/Failed to upload images/i)
    ).toBeInTheDocument();
  });

  test("removes an existing image and updates the UI", async () => {
    const mockImageFile = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    const uploadResponse = {
      data: { secure_url: "http://example.com/image.png" },
    };

    axios.post.mockResolvedValueOnce(uploadResponse);

    render(<ListingImageForm onImageUpload={mockOnImageUpload} />);

    const fileInput = screen.getByLabelText(/Upload Images:/i);
    fireEvent.change(fileInput, { target: { files: [mockImageFile] } });

    fireEvent.click(screen.getByRole("button", { name: /Upload Images/i }));

    await waitFor(() => {
      expect(mockOnImageUpload).toHaveBeenCalledWith([
        "http://example.com/image.png",
      ]);
    });

    const removeButton = screen.getByRole("button", { name: /Remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText(/Image removed/i)).toBeInTheDocument();
    });
  });
});
