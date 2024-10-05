import React, { useContext } from "react";
import Hero from "./Hero";
import ListingsContainer from "./Listings/ListingsContainer";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {!user && <Hero />}
      <ListingsContainer home={true} />
    </>
  );
};

export default Home;
