import React, { useState, useEffect, useContext } from "react";
import { Alert } from "reactstrap";
import { BeatLoader } from "react-spinners";
import FavoritesContext from "../../context/FavoritesContext";
import Favorite from "./Favorite";

const FavoriteList = () => {
  // tracks number of images that have fully loaded
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const { favorites, removeFavorite, favoritesLoading, setFavoritesLoading } =
    useContext(FavoritesContext);

  // increments the count of loaded images
  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  // once all favorite images are loaded, set loading to false
  useEffect(() => {
    if (imagesLoaded === favorites.length) setFavoritesLoading(false);
  }, [imagesLoaded]);

  // show loading spinner while favorite images are still loading
  if (favoritesLoading) {
    return(
      <div role="status">
        <BeatLoader />
      </div>
    );
  }

  return (
    <section className="listing-list">
      <h1>Favorites</h1>
      {favorites.length > 0 &&
        favorites.map((favorite) => (
          <Favorite
            key={favorite.id}
            favorite={favorite}
            handleImageLoad={handleImageLoad}
            removeFavorite={removeFavorite}
          />
        ))}
      {!favorites.length && (
        <Alert color="primary" className="mt-2" fade={false}>
          You haven't added any favorites yet. Start exploring and add some
          listings to your favorites!
        </Alert>
      )}
    </section>
  );
};

export default FavoriteList;
