import React, { useState } from "react";
import { useFormik } from "formik";
import { Alert } from "reactstrap";
import TwiceLovedApi from "../../../api";

function UpdatePasswordForm({ user, fetchUser }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleUpdate = async (formData) => {
    try {
      const updatedUser = await TwiceLovedApi.patchUser(
        user.username,
        formData
      );
      return updatedUser;
    } catch (err) {
      console.error(`Patch failed:`, err);
      setError(err[0]);
      setLoading(false);
    }
  };

  const INITIAL_STATE = { currentVal: "", updateVal: "" };
  const formik = useFormik({
    initialValues: INITIAL_STATE,
    onSubmit: async ({ updateVal, currentVal }) => {
      setLoading(true);
      setError(null);
      setFeedback(null);
      
      if (updateVal.length < 8) {
        setError("Password must be a minimum of 8 characters");
        setLoading(false);
        return;  
      } else {
        try {
          const updatedUser = await handleUpdate({
            colName: "password",
            updateVal,
            currentVal,
          });
  
          if (updatedUser) {
            await fetchUser(updatedUser.username);
            formik.resetForm();
            setFeedback("User updated");
          }
        } catch (e) {
          setError("An error occurred during the update.");
        } finally {
          setLoading(false);
        }
      }
    },
  });

  return (
    <form id="update-password-form" onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="current-password">Current Password</label>
        <input
          id="current-password"
          name="currentVal"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.currentVal}
          autoComplete="current-password"
          required
        />
      </div>
      <div>
        <label htmlFor="new-password">New Password</label>
        <input
          id="new-password"
          name="updateVal"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.updateVal}
          autoComplete="new-password"
          required
        />
      </div>
      {error && (
        <Alert color="danger" className="mt-2" fade={false}>
          {error}
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

export default UpdatePasswordForm;
