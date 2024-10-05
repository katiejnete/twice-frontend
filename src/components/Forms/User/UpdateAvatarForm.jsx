import React, { useState, useContext } from "react";
import { Alert } from "reactstrap";
import axios from "axios";
import AuthContext from "../../../context/AuthContext";
import TwiceLovedApi from "../../../api";

const UpdateAvatarForm = () => {
  const [imageSelected, setImageSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const { user, token, fetchUser } = useContext(AuthContext);

  const handleImageUpload = async () => {
    setLoading(true);

    // check if an image has been selected
    if (!imageSelected) {
      setError("Please upload image file");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", "ddqaqzvo");

    try {
      // upload image to cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dvyxwopxt/image/upload`,
        formData
      );
      const imageUrl = response.data.secure_url;

      // update user avatar only if upload was successful
      if (imageUrl.length > 0) {
        setError(null);
        await TwiceLovedApi.patchUser(
          user.username,
          { colName: "avatar", updateVal: imageUrl },
          token
        );
      }
      // only fetch user data again to set feedback if no error
      if (!error) {
        await fetchUser(user.username);
        setFeedback("Avatar updated");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      setError("Image upload failed. Please try again.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="update-avatar-form">
      <label htmlFor="file-upload">Upload your avatar:</label>
      <input
        id="file-upload"
        type="file"
        onChange={(e) => setImageSelected(e.target.files[0])}
      />
      <button type="submit" disabled={loading} onClick={handleImageUpload}>
        Upload Image
      </button>
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
    </div>
  );
};

export default UpdateAvatarForm;
