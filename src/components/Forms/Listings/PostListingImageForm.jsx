import React, { useState, useRef } from "react";
import { Alert } from "reactstrap";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const ListingImageForm = ({ onImageUpload }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [existingImages, setExistingImages] = useState([]); // stores currently uploaded images
  const [removing, setRemoving] = useState(false);

  const fileInputRef = useRef(null); // reference to reset file input after actions

  const handleImageChange = (e) => {
    // add new selected files to existing selected images
    const files = Array.from(e.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleImageUpload = async () => {
    setFeedback(null);
    if (selectedImages.length === 0) {
      setError("Please select at least one image.");
      return;
    }
    if (selectedImages.length > 3 || existingImages.length >= 3) {
      setError("Limit of three images exceeded.");
      return;
    } else {
      setIsUploading(true);
      setError("");
  
      try { 
        // upload selected images to cloudinary
        const uploadedImageUrls = await Promise.all(
          selectedImages.map(async (image) => {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", "ddqaqzvo");
  
            const res = await axios.post(
              "https://api.cloudinary.com/v1_1/dvyxwopxt/image/upload",
              formData
            );
            return res.data.secure_url;
          })
        );
  
        onImageUpload(uploadedImageUrls); // pass uploaded image urls to parent

        // add new image urls to the existing images state
        setExistingImages((prev) => {
          const newImageUrls = uploadedImageUrls.map((image) => ({id: uuidv4(), imageUrl: image }));
          return [...prev, ...newImageUrls];
        });
        setFeedback("Images added to listing");
      } catch (err) {
        setError("Failed to upload images. Please try again.");
      } finally {
        setIsUploading(false);
        setSelectedImages([]);
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (removeId) => {
    try {
      setFeedback(null);
      setRemoving(true);
      setError("");

      // remove image form existing images state
      setExistingImages((prev) => prev.filter(({id}) => id !== removeId));
      setFeedback("Image removed.");
    } catch (err) {
      console.error(err);
      setError("Failed to remove image.");
    } finally {
      fileInputRef.current.value = "";
      setSelectedImages([]);
      setRemoving(false);
    }
  };

  return (
    <div id="listing-img-form">
      <div className="image-preview-section">
        {existingImages && existingImages.length > 0 && (
          <div className="existing-images">
            <h5>Current Images:</h5>
            <div className="image-list">
              {existingImages.map(({id, imageUrl}) => (
                <div key={id} className="image-item">
                  <img
                    src={imageUrl}
                    alt={`Listing image ${id}`}
                    className="img-preview"
                  />
                  <button
                    type="button"
                    disabled={removing}
                    onClick={() => handleRemoveImage(id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <label htmlFor="image-upload">Upload Images:</label>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        ref={fileInputRef}
      />
      <button type="button" onClick={handleImageUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Images"}
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

export default ListingImageForm;
