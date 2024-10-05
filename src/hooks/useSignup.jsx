import React, { useState, useEffect } from "react";

const useSignup = (isSignupOpen) => {
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
    if (isSignupOpen) {
      setFormData(INITIAL_STATE);
      setError(null);
    }
  }, [isSignupOpen]);

  return { formData, error, setError, isLoading, setIsLoading, handleChange };
};

export default useSignup;
