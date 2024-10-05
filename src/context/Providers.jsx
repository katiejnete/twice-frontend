// src/contexts/Providers.js
import React, { useState } from "react";
import useUser from "../hooks/useUser";
import useAuth from "../hooks/useAuth";
import useFavorites from "../hooks/useFavorites";
import useSearch from "../hooks/useSearch";
import useListings from "../hooks/useListings";
import useItemsGivenAway from "../hooks/useItemsGivenAway";

import AuthContext from "./AuthContext";
import ModalContext from "./ModalContext";
import ListingsContext from "./ListingsContext";
import SearchContext from "./SearchContext";
import FilterOptionsContext from "./FilterOptionsContext";
import ImpactContext from "./ImpactContext";
import FavoritesContext from "./FavoritesContext";

const Providers = ({ children }) => {
  const { user, setUser, fetchUser, avatar, setAvatar } = useUser();
  const [token, setToken] = useAuth();
  const {
    favorites,
    setFavorites,
    favoriteIds,
    setFavoriteIds,
    addFavorite,
    removeFavorite,
    favoritesLoading,
    setFavoritesLoading,
  } = useFavorites(user, token);
  const {
    queryData,
    setQueryData,
    storedSearchData,
    setStoredSearchData,
    updateQueryParams,
    grabQueryParams,
    resetSearch,
    setResetSearch,
    searching
  } = useSearch();
  const {
    items: listings,
    setItems: setListings,
    loading: listingsLoading,
    setLoading: setListingsLoading,
  } = useListings(storedSearchData, user);
  const {
    items: itemsGivenAway,
    setItems: setItemsGivenAway,
    loading: itemsGivenAwayLoading,
    setLoading: setAreItemsGivenAwayLoading,
  } = useItemsGivenAway();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const toggleSignup = () => setIsSignupOpen(!isSignupOpen);
  const categories = [
    "Electronics",
    "Furniture",
    "Clothing",
    "Toys and Games",
    "Books",
    "Home",
    "Sports",
    "Miscellaneous",
    "Health and Beauty",
  ];
  const conditions = ["New", "Like New", "Used", "Refurbished", "Damaged"];

  return (
    <AuthContext.Provider
      value={{ user, setUser, fetchUser, token, setToken, avatar, setAvatar }}
    >
      <ModalContext.Provider value={{ isSignupOpen, toggleSignup }}>
        <ListingsContext.Provider
          value={{ listings, setListings, listingsLoading, setListingsLoading }}
        >
          <SearchContext.Provider
            value={{
              storedSearchData,
              setStoredSearchData,
              updateQueryParams,
              grabQueryParams,
              queryData,
              setQueryData,
              resetSearch,
              setResetSearch,
            }}
          >
            <FilterOptionsContext.Provider value={{ categories, conditions }}>
              <FavoritesContext.Provider
                value={{
                  favorites,
                  setFavorites,
                  favoriteIds,
                  setFavoriteIds,
                  addFavorite,
                  removeFavorite,
                  favoritesLoading,
                  setFavoritesLoading,
                }}
              >
                <ImpactContext.Provider
                  value={{
                    itemsGivenAway,
                    setItemsGivenAway,
                    itemsGivenAwayLoading,
                    setAreItemsGivenAwayLoading,
                  }}
                >
                  {children}
                </ImpactContext.Provider>
              </FavoritesContext.Provider>
            </FilterOptionsContext.Provider>
          </SearchContext.Provider>
        </ListingsContext.Provider>
      </ModalContext.Provider>
    </AuthContext.Provider>
  );
};

export default Providers;
