import React, { useState, useEffect } from "react";
import TwiceLovedApi from "../api";

const useItemsGivenAway = () => {
  const [items, setItems] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemList = await TwiceLovedApi.getAllItemsGivenAway();
        setItems(itemList);
      } catch (error) {
        console.error(`Failed to fetch items given away`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [items]);

  return { items, loading, setLoading, setItems };
};

export default useItemsGivenAway;
