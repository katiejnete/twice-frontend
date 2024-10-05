import React, { useState } from "react";
import { Alert } from "reactstrap";
import { useFormik } from "formik";
import TwiceLovedApi from "../../../api";

function UpdateContactForm({ user, fetchUser }) {
  const [userData, setUserData] = useState(user);
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
      setError("Update failed");
    }
  };

  const INITIAL_STATE = { updateVal: userData.contactInfo || "" };
  const formik = useFormik({
    initialValues: INITIAL_STATE,
    onSubmit: async ({ updateVal }) => {
      setLoading(true);
      setError(null);
      const updatedUser = await handleUpdate({
        colName: "contactInfo",
        updateVal,
      });
      if (updatedUser) {
        await fetchUser(updatedUser.username);
        setUserData(updatedUser);
        setFeedback("User updated");
      }
      setLoading(false);
    },
  });

  return (
    <form id="update-contact-form" onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="contact">Contact Info</label>
        <textarea
          id="contact"
          name="updateVal"
          type="textarea"
          onChange={formik.handleChange}
          value={formik.values.updateVal}
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

export default UpdateContactForm;
