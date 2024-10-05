import React, { useState, useEffect } from "react";
import TwiceLovedApi from "../api";

const useFavorites = (user, token) => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user && token) {
        try {
          const fetchedFavoriteIds = await TwiceLovedApi.getUserFavorites(
            user.username
          );
          setFavoriteIds(fetchedFavoriteIds); // store ids of fetched favorites
          const listings = await Promise.all(
            fetchedFavoriteIds.map(
              async (favorite) => await TwiceLovedApi.getListing(favorite) // fetch listing for each favorite
            )
          );
          setFavorites(listings);
        } catch (err) {
          console.error(`Error fetching favorites:`, err);
        } finally {
          setFavoritesLoading(false);
        }
      }
    };

    fetchFavorites();
  }, [token, user]);

  const addFavorite = async (itemId) => {
    try {
      await TwiceLovedApi.postFavorite(user.username, itemId);
      setFavoriteIds((prev) => [...prev, itemId]);
      const newFavorite = await TwiceLovedApi.getListing(itemId);
      setFavorites((prev) => [...prev, newFavorite]);
    } catch (err) {
      console.error(`Failed to add favorite:`, err);
    }
  };

  const removeFavorite = async (removeId) => {
    try {
      await TwiceLovedApi.deleteFavorite(user.username, removeId);
      setFavoriteIds((prev) => prev.filter((itemId) => itemId !== removeId));
      setFavorites((prev) =>
        prev.filter((favorite) => favorite.id !== removeId)
      ); // filter out removed favorite ids
    } catch (err) {
      console.error(`Failed to remove favorite:`, err);
    }
  };

  return {
    favorites,
    setFavorites,
    favoriteIds,
    setFavoriteIds,
    addFavorite,
    removeFavorite,
    favoritesLoading,
    setFavoritesLoading
  };
};

export default useFavorites;
