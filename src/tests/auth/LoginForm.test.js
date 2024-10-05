import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "../../components/Forms/Auth/LoginForm";
import AuthContext from "../../context/AuthContext";
import TwiceLovedApi from "../../api";
import '@testing-library/jest-dom'; 

jest.mock("../../api");

const mockFetchUser = jest.fn();

const MockAuthProvider = ({ children }) => {
  const setToken = jest.fn();
  return (
    <AuthContext.Provider value={{ setToken }}>{children}</AuthContext.Provider>
  );
};

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Smoke test: Renders without crashing
  test("renders without crashing", () => {
    render(
      <MockAuthProvider>
        <LoginForm
          fetchUser={mockFetchUser}
          toggle={jest.fn()}
          isLoginOpen={true}
        />
      </MockAuthProvider>
    );

    expect(screen.getByText(/Log In/i)).toBeInTheDocument();
  });

  test("displays an error message when login fails", async () => {
    TwiceLovedApi.loginUser.mockRejectedValueOnce("Invalid username/password");

    render(
      <MockAuthProvider>
        <LoginForm
          fetchUser={mockFetchUser}
          toggle={jest.fn()}
          isLoginOpen={true}
        />
      </MockAuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "testpass" },
    });
    fireEvent.click(screen.getByText(/Submit/i));

    expect(
      await screen.findByText("Invalid username/password")
    ).toBeInTheDocument();
  });

  test("calls fetchUser and sets token on successful login", async () => {
    TwiceLovedApi.loginUser.mockResolvedValueOnce("mockedToken");

    render(
      <MockAuthProvider>
        <LoginForm
          fetchUser={mockFetchUser}
          toggle={jest.fn()}
          isLoginOpen={true}
        />
      </MockAuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "testpass" },
    });
    fireEvent.click(screen.getByText(/Submit/i));

    expect(TwiceLovedApi.loginUser).toHaveBeenCalledWith({
      username: "testuser",
      password: "testpass",
    });

    await screen.findByText(/Log In/i);
    expect(mockFetchUser).toHaveBeenCalledWith("testuser");
  });
});
