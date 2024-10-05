import React, { useState, useEffect } from "react";
import TwiceLovedApi from "../api";

const useUser = () => {
  let storedUser = localStorage.getItem("currentUser");
  storedUser = JSON.parse(storedUser);
  const [avatar, setAvatar] = useState("");
  const [user, setUser] = useState(storedUser);

  const fetchUser = async (username) => {
      try {
        const fetchedUser = await TwiceLovedApi.getUser(username);
        localStorage.setItem("currentUser", JSON.stringify(fetchedUser));
        setUser(fetchedUser);
        if (fetchedUser) setAvatar(fetchedUser.avatar); // sets local avatar
        return fetchedUser;
      } catch (err) {
        console.error(`Failed to fetch user: ${username}`, err);
      }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  }, [user]); // updates local storage currentUser on user change

  return { user, fetchUser, setUser, avatar, setAvatar };
};

export default useUser;
