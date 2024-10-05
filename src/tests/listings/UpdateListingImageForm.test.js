import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import UpdateListingImageForm from "../../components/Forms/Listings/UpdateListingImageForm"; 

jest.mock("axios");
jest.mock("../../api"); 

describe("UpdateListingImageForm", () => {
  const mockUser = { username: "testUser" };
  const mockId = "12345";
  const mockCurrentImages = [
    { imageUrl: "http://example.com/image1.jpg", id: 1, imageOrder: 0 },
    { imageUrl: "http://example.com/image2.jpg", id: 2, imageOrder: 1 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders image upload form", () => {
    render(<UpdateListingImageForm currentImages={mockCurrentImages} user={mockUser} id={mockId} />);

    expect(screen.getByLabelText(/Upload Images:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Upload Images/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Current Images:/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Listing image 0/i)).toBeInTheDocument(); // Checks first current image
  });

  test("displays an error message when no images are selected", async () => {
    render(<UpdateListingImageForm currentImages={mockCurrentImages} user={mockUser} id={mockId} />);

    fireEvent.click(screen.getByRole("button", { name: /Upload Images/i }));

    expect(
      await screen.findByText(/Please select at least one image/i)
    ).toBeInTheDocument();
  });

  test("displays an error message on upload failure", async () => {
    const mockImageFile = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    axios.post.mockRejectedValueOnce(new Error("Upload failed"));

    render(<UpdateListingImageForm currentImages={mockCurrentImages} user={mockUser} id={mockId} />);

    const fileInput = screen.getByLabelText(/Upload Images:/i);
    fireEvent.change(fileInput, { target: { files: [mockImageFile] } });

    fireEvent.click(screen.getByRole("button", { name: /Upload Images/i }));

    expect(
      await screen.findByText(/Failed to upload images/i)
    ).toBeInTheDocument();
  });

  test("removes an existing image and updates the UI", async () => {
  
    const uploadResponse = {
      data: { secure_url: "http://example.com/image1.png" },
    };
  
    axios.post.mockResolvedValueOnce(uploadResponse);
  
    render(<UpdateListingImageForm currentImages={[{ imageUrl: "http://example.com/image1.png", imageOrder: 1, id: 1 }]} user={{ username: "testuser" }} id={1} />);
  
    const removeButton = screen.getByRole('button', { name: /Remove/i });
    fireEvent.click(removeButton);
  
    await waitFor(() => {
      expect(screen.queryByAltText(/Listing image 1/i)).not.toBeInTheDocument();
    });
  });
  
});
