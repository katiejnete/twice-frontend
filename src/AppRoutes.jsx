import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ListingResults from "./components/Listings/ListingResults";
import PostListingForm from "./components/Forms/Listings/PostListingForm";
import FavoriteList from "./components/Favorites/FavoriteList";
import UpdateListingForm from "./components/Forms/Listings/UpdateListingForm";
import AccountSettings from "./components/UserAccount/AccountSettings";
import Listing from "./components/Listings/Listing";
import UserProfile from "./components/UserAccount/UserProfile";
import NotFound from "./components/NotFound";
import ListingsContext from "./context/ListingsContext";

const AppRoutes = () => {
  const { setListings } = useContext(ListingsContext);

  // updates local listings when user deletes listing
  const handleDelete = (listingId) => {
    setListings((prevListings) =>
      prevListings.filter((listing) => listing.id !== listingId)
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<ListingResults />} />
      <Route path="/account/settings" element={<AccountSettings />} />
      <Route
        path="/listings/:id/edit"
        element={<UpdateListingForm onNotAvail={handleDelete} />}
      />
      <Route
        path="/listings/:id"
        element={<Listing onDelete={handleDelete} />}
      />
      <Route path="/listings/new" element={<PostListingForm />} />
      <Route path="/users/:username" element={<UserProfile />} />
      <Route
        path="/account/favorites"
        element={
          <FavoriteList />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
