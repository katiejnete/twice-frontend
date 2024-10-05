import React, { useState, useEffect } from "react";

const useLogin = (isLoginOpen) => {
  const INITIAL_STATE = {
    username: "",
    password: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isLoginOpen) {
      setFormData(INITIAL_STATE);
      setError(null);
    }
  }, [isLoginOpen]);

  return { formData, error, setError, isLoading, setIsLoading, handleChange };
};

export default useLogin;
