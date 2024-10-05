import React, { useState, useContext } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import heart from "../../assets/heart.svg";
import heartFilled from "../../assets/heart-fill.svg";
import FavoritesContext from "../../context/FavoritesContext";

const ListingFooter = ({ currentUser, user, listing }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const {
    addFavorite,
    removeFavorite,
    favoriteIds = [],
  } = useContext(FavoritesContext);
  const toggleContact = () => setIsContactOpen(!isContactOpen);

  const heartType = favoriteIds.includes(listing.id) ? heartFilled : heart;

  const handleSave = async () => {
    if (heartType === heart) {
      await addFavorite(listing.id);
    } else {
      await removeFavorite(listing.id);
    }
  };

  return (
    <>
      <button onClick={toggleContact}>Contact {user.username}</button>
      {isContactOpen && (
        <Modal fade={false} isOpen={isContactOpen} toggle={toggleContact}>
          <ModalHeader toggle={toggleContact}>
            {user.username} Contact Info
          </ModalHeader>
          <ModalBody>{user.contactInfo}</ModalBody>
        </Modal>
      )}
      {currentUser && (
        <button onClick={handleSave}>
          Save <img id="listing-footer-heart" src={heartType} />
        </button>
      )}
    </>
  );
};

export default ListingFooter;
