import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateContactForm from "../../components/Forms/User/UpdateContactForm"; // Adjust the import path as necessary
import TwiceLovedApi from "../../api";

jest.mock("../../api");

describe("UpdateContactForm", () => {
  const mockUser = { username: "testuser", contactInfo: "test@example.com" };
  const mockFetchUser = jest.fn();

  beforeEach(() => {
    render(<UpdateContactForm user={mockUser} fetchUser={mockFetchUser} />);
  });

  it("should update contact info successfully", async () => {
    const updatedContactInfo = "new@example.com";

    // Mock the TwiceLovedApi.patchUser function
    TwiceLovedApi.patchUser.mockResolvedValueOnce({ ...mockUser, contactInfo: updatedContactInfo });

    const textarea = screen.getByLabelText(/Contact Info/i);
    fireEvent.change(textarea, { target: { value: updatedContactInfo } });

    const saveButton = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockFetchUser).toHaveBeenCalledWith(mockUser.username);
      expect(screen.getByText(/User updated/i)).toBeInTheDocument();
      expect(screen.queryByRole("alert", { name: /danger/i })).not.toBeInTheDocument();
    });
  });

  it("should display an error message when the update fails", async () => {
    const errorMessage = "Update failed";

    // Mock the TwiceLovedApi.patchUser function to throw an error
    TwiceLovedApi.patchUser.mockRejectedValueOnce(new Error(errorMessage));

    const textarea = screen.getByLabelText(/Contact Info/i);
    fireEvent.change(textarea, { target: { value: "new@example.com" } });

    const saveButton = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
