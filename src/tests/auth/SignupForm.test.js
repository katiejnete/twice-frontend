import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "../../components/Forms/Auth/SignupForm";
import TwiceLovedApi from "../../api";
import AuthContext from "../../context/AuthContext";
import '@testing-library/jest-dom'; 

jest.mock("../../api");

const mockSetToken = jest.fn();
const mockFetchUser = jest.fn();

const MockAuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{ setToken: mockSetToken, fetchUser: mockFetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

describe("SignupForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <MockAuthProvider>
        <SignupForm toggle={jest.fn()} isSignupOpen={true} />
      </MockAuthProvider>
    );

    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it("calls fetchUser and sets token on successful sign up", async () => {
    TwiceLovedApi.registerUser.mockResolvedValueOnce("mock-token");

    render(
      <MockAuthProvider>
        <SignupForm toggle={jest.fn()} isSignupOpen={true} />
      </MockAuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith("mock-token");
      expect(mockFetchUser).toHaveBeenCalledWith("testuser");
    });
  });

  it("displays an error message when signup fails", async () => {
    TwiceLovedApi.registerUser.mockRejectedValueOnce("Registration failed"); 

    render(
      <MockAuthProvider>
        <SignupForm toggle={jest.fn()} isSignupOpen={true} />
      </MockAuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });
});

