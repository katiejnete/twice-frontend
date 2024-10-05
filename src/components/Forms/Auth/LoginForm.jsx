import React, { useContext } from "react";
import useLogin from "../../../hooks/useLogin";
import { Modal, ModalHeader, ModalBody, Alert } from "reactstrap";
import TwiceLovedApi from "../../../api";
import AuthContext from "../../../context/AuthContext";

const LoginForm = ({ fetchUser, toggle, isLoginOpen }) => {
  const { formData, error, setError, isLoading, setIsLoading, handleChange } =
    useLogin(isLoginOpen);
  const { setToken } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const userToken = await TwiceLovedApi.loginUser(formData);
      setToken(userToken);
      await fetchUser(formData["username"]);
      toggle();
    } catch (err) {
      console.error(`Authentication failed:`, err);
      setError(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    await handleLogin();
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isLoginOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Log In</ModalHeader>
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

export default LoginForm;
