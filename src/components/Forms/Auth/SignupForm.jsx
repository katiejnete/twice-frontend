import React, { useContext } from "react";
import useSignup from "../../../hooks/useSignup";
import { Modal, ModalHeader, ModalBody, Alert } from "reactstrap";
import TwiceLovedApi from "../../../api";

import AuthContext from "../../../context/AuthContext";

const SignupForm = ({ toggle, isSignupOpen }) => {
  const { formData, error, setError, isLoading, setIsLoading, handleChange } =
    useSignup(isSignupOpen);
  const { setToken, fetchUser } = useContext(AuthContext);

  const handleSignup = async () => {
    try {
      const userToken = await TwiceLovedApi.registerUser(formData);
      setToken(userToken);
      await fetchUser(formData["username"]);
      toggle();
    } catch (err) {
      console.error(`Registration failed:`, err);
      setError(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    await handleSignup();
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isSignupOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Sign Up</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          {["username", "password"].map((name) => (
            <div key={name}>
              <input
                type={name === "password" ? "password" : "text"}
                name={name}
                placeholder={name[0].toUpperCase() + name.slice(1)}
                value={formData[name]}
                onChange={handleChange}
                autoComplete={name}
                required
              />
            </div>
          ))}
          {error && (
            <Alert color="danger" className="mt-2" fade={false}>
              {error}
            </Alert>
          )}
          <button type="submit" disabled={isLoading}>Submit</button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default SignupForm;
