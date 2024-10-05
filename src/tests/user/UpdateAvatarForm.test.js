import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateAvatarForm from "../../components/Forms/User/UpdateAvatarForm";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import TwiceLovedApi from "../../api";

jest.mock("axios");
jest.mock("../../api");

describe("UpdateAvatarForm", () => {
  const mockUser = { username: "testuser" };
  const mockToken = "testToken";
  const mockFetchUser = jest.fn();

  beforeEach(() => {
    render(
      <AuthContext.Provider value={{ user: mockUser, token: mockToken, fetchUser: mockFetchUser }}>
        <UpdateAvatarForm />
      </AuthContext.Provider>
    );
  });

  it("should upload an image and update avatar successfully", async () => {
    const file = new File(["dummy content"], "example.png", { type: "image/png" });

    axios.post.mockResolvedValueOnce({
      data: {
        secure_url: "http://example.com/avatar.png",
      },
    });

    TwiceLovedApi.patchUser.mockResolvedValueOnce({});

    const fileInput = screen.getByLabelText(/Upload your avatar:/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByRole("button", { name: /Upload Image/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/Avatar updated/i)).toBeInTheDocument();
      expect(mockFetchUser).toHaveBeenCalledWith(mockUser.username);
    });

    expect(screen.queryByRole("alert", { name: /danger/i })).not.toBeInTheDocument();
  });

  it("should display an error when no image is selected", async () => {
    const uploadButton = screen.getByRole("button", { name: /Upload Image/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/Please upload image file/i)).toBeInTheDocument();
    });
  });

  it("should handle upload errors", async () => {
    const file = new File(["dummy content"], "example.png", { type: "image/png" });

    axios.post.mockRejectedValueOnce(new Error("Upload failed"));

    const fileInput = screen.getByLabelText(/Upload your avatar:/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByRole("button", { name: /Upload Image/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/Image upload failed. Please try again/i)).toBeInTheDocument();
    });
  });
});
