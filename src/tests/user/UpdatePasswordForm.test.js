import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdatePasswordForm from "../../components/Forms/User/UpdatePasswordForm";
import AuthContext from "../../context/AuthContext";
import TwiceLovedApi from "../../api";

jest.mock("../../api");

describe("UpdatePasswordForm", () => {
  const mockUser = { username: "testuser" };
  const mockFetchUser = jest.fn();

  beforeEach(() => {
    render(
      <AuthContext.Provider value={{ user: mockUser, fetchUser: mockFetchUser }}>
        <UpdatePasswordForm user={mockUser} fetchUser={mockFetchUser} />
      </AuthContext.Provider>
    );
  });

  it("should update the password successfully", async () => {
    const newPassword = "newpassword123";
    
    TwiceLovedApi.patchUser.mockResolvedValueOnce({ username: "testuser" });

    fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: "currentpassword" } });
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: newPassword } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/user updated/i)).toBeInTheDocument();
      expect(mockFetchUser).toHaveBeenCalledWith(mockUser.username);
    });

    expect(screen.queryByRole("alert", { name: /danger/i })).not.toBeInTheDocument();
  });

  it("should display an error message when the new password is too short", async () => {
    const shortPassword = "short";

    fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: "currentpassword" } });
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: shortPassword } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be a minimum of 8 characters/i)).toBeInTheDocument();
    });
  });
});
