import React, { useState, useRef } from "react";
import { Alert } from "reactstrap";
import axios from "axios";
import TwiceLovedApi from "../../../api";

const ListingImageForm = ({ currentImages = [], user, id }) => {
  const [selectedImages, setSelectedImages] = useState([]); // state to hold images selected for upload
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [existingImages, setExistingImages] = useState(currentImages || []); // state for images already associated with listing
  const [removing, setRemoving] = useState(false);

  const fileInputRef = useRef(null); // ref for accessing file input to reset after user actions

  // convert file list to array and append new files to selected images arr
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  // handle uploaded image urls and associate them with listing
  const onImageUpload = async (uploadedImageUrls) => {
    try {
      const uploadedImages = uploadedImageUrls.map((imageUrl) => ({
        imageUrl,
      }));

      for (let image of uploadedImages) {
        // post each image to listing via api and update existing images state
        const newListingImage = await TwiceLovedApi.postListingImage(
          user.username,
          id,
          image
        );
        setExistingImages((prev) => [...prev, newListingImage]);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // handle removal of image from listing
  const handleRemoveImage = async (imagePosition) => {
    try {
      setFeedback(null);
      setRemoving(true);
      setError("");

      // call api to delete specified image by its position
      const listingImages = await TwiceLovedApi.deleteListingImage(
        user.username,
        id,
        imagePosition
      );

      // update exisiting images based on api response
      if (!listingImages) setExistingImages([]);
      else setExistingImages(listingImages);
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
        const uploadedImageUrls = await Promise.all(
          selectedImages.map(async (image) => {
            const formData = new FormData();
            formData.append("file", image); // append image file to form data
            formData.append("upload_preset", "ddqaqzvo"); // set cloudinary upload preset

            const res = await axios.post(
              "https://api.cloudinary.com/v1_1/dvyxwopxt/image/upload",
              formData
            );
            return res.data.secure_url;
          })
        );

        // handle uploaded iamge urls
        await onImageUpload(uploadedImageUrls);
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

  return (
    <div id="listing-img-form">
      <div className="image-preview-section">
        {existingImages && existingImages.length > 0 && (
          <div className="existing-images">
            <h5>Current Images:</h5>
            <div className="image-list">
              {existingImages.map(({ imageUrl, imageOrder, id }) => (
                <div key={id} className="image-item">
                  <img
                    src={imageUrl}
                    alt={`Listing image ${imageOrder}`}
                    className="img-preview"
                  />
                  <button
                    type="button"
                    disabled={removing}
                    data-image-order={imageOrder}
                    onClick={() => handleRemoveImage(imageOrder)}
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
