import React, { useState } from "react";
import { useFormik } from "formik";
import { Alert } from "reactstrap";
import TwiceLovedApi from "../../../api";

function UpdateLocationForm({ user, fetchUser }) {
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleUpdate = async (formData) => {
    const newError = {};
    try {
      // send updated user data to api and return updated user obj
      const updatedUser = await TwiceLovedApi.patchUser(
        user.username,
        formData
      );
      return updatedUser;
    } catch (err) {
      console.error(`Patch failed:`, err);
      newError.message = err[0];
      return newError;
    }
  };

  const validateForm = (updateVal) => {
    const newError = {};
    // if zip code is empty string return false for no validation error
    if (+updateVal === 0) return false;
    // if parsed zip code is NaN return error
    else if (!parseInt(updateVal)) {
      newError.message = "Zip code must be valid zip code";
      return newError;
    } else return false;
  };

  const INITIAL_STATE = { updateVal: userData.zip || "" };
  const formik = useFormik({
    initialValues: INITIAL_STATE,
    onSubmit: async ({ updateVal }) => {
      setLoading(true);
      setError(null);
      setFeedback(null);

      let userRes;
      // validate form
      const validationError = validateForm(updateVal);
      if (Object.keys(validationError).length > 0) {
        setError(validationError);
      }
      if (!validationError) {
        // handle update if no validation errors
        userRes = await handleUpdate({ colName: "zip", updateVal });
        if (userRes && userRes.message) {
          setError(userRes);
        }
      }
      // if no errors update current user with data and update form with new data
      if (!validationError && !(userRes && userRes.message)) {
        await fetchUser(userRes.username);
        setUserData(userRes);
        setFeedback("User updated");
      }
      setLoading(false);
    },
  });

  return (
    <form id="update-location-form" onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="zip">Zip Code</label>
        <input
          id="zip"
          name="updateVal"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.updateVal}
        />
      </div>
      {error && (
        <Alert color="danger" className="mt-2" fade={false}>
          {error.message}
        </Alert>
      )}
      {feedback && (
        <Alert color="success" className="mt-2" fade={false}>
          {feedback}
        </Alert>
      )}
      <button type="submit" disabled={loading}>
        Save
      </button>
    </form>
  );
}

export default UpdateLocationForm;
