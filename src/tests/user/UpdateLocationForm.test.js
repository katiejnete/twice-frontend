// UpdateLocationForm.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateLocationForm from "../../components/Forms/User/UpdateLocationForm";
import TwiceLovedApi from "../../api";

jest.mock("../../api");

describe("UpdateLocationForm", () => {
  const mockUser = { username: "testuser", zip: "12345" };
  const mockFetchUser = jest.fn();

  beforeEach(() => {
    render(<UpdateLocationForm user={mockUser} fetchUser={mockFetchUser} />);
  });

  it("should update zip code successfully", async () => {
    TwiceLovedApi.patchUser.mockResolvedValueOnce({
      username: mockUser.username,
      zip: "67890",
    });

    const input = screen.getByLabelText(/Zip Code/i);
    fireEvent.change(input, { target: { value: "67890" } });

    const saveButton = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockFetchUser).toHaveBeenCalledWith(mockUser.username);
      expect(screen.getByText(/User updated/i)).toBeInTheDocument();
    });

    // Ensure no error message is displayed
    expect(screen.queryByRole("alert", { name: /danger/i })).not.toBeInTheDocument();
  });

  it("should display an error message when the zip code is invalid", async () => {
    const input = screen.getByLabelText(/Zip Code/i);
    fireEvent.change(input, { target: { value: "invalid-zip" } });

    const saveButton = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Zip code must be valid zip code/i)).toBeInTheDocument();
    });
  });

  it("should display an error message when the update fails", async () => {
    TwiceLovedApi.patchUser.mockRejectedValueOnce(new Error("Update failed"));

    const input = screen.getByLabelText(/Zip Code/i);
    fireEvent.change(input, { target: { value: "67890" } });

    const saveButton = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
  });
});
