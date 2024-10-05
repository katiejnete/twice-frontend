import React from 'react';
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import FavoritesContext from "../../context/FavoritesContext";
import FavoriteList from "../../components/Favorites/FavoriteList";
import '@testing-library/jest-dom'; 

const mockFavorites = [
    {
      id: 1,
      userId: 1,
      title: 'Mock Favorite 1',
      description: 'Description for favorite 1',
      categoryId: 1,
      conditionId: 1,
      locationId: 1,
      lastModified: new Date(),
      status: 'active',
      listingImages: [{ imageUrl: 'http://example.com/image1.jpg' }],
    },
    {
      id: 2,
      userId: 1,
      title: 'Mock Favorite 2',
      description: 'Description for favorite 2',
      categoryId: 1,
      conditionId: 1,
      locationId: 1,
      lastModified: new Date(),
      status: 'active',
      listingImages: [{ imageUrl: 'http://example.com/image2.jpg' }],
    },
  ];
  
  describe('FavoriteList Component', () => {
    test('displays a loading spinner while favorites are loading', () => {
      const mockFavoritesContextValue = {
        favorites: [],
        removeFavorite: jest.fn(),
        favoritesLoading: true, 
        setFavoritesLoading: jest.fn(),
      };
  
      render(
        <MemoryRouter>
          <FavoritesContext.Provider value={mockFavoritesContextValue}>
            <FavoriteList />
          </FavoritesContext.Provider>
        </MemoryRouter>
      );
  
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  
    test('displays a message when no favorites are present', () => {
      const mockFavoritesContextValue = {
        favorites: [],
        removeFavorite: jest.fn(),
        favoritesLoading: false,
        setFavoritesLoading: jest.fn(),
      };
  
      render(
        <MemoryRouter>
          <FavoritesContext.Provider value={mockFavoritesContextValue}>
            <FavoriteList />
          </FavoritesContext.Provider>
        </MemoryRouter>
      );
  
      const message = screen.getByText("You haven't added any favorites yet. Start exploring and add some listings to your favorites!");
      expect(message).toBeInTheDocument();
    });
  
    test('displays the favorite items when present', () => {
      const mockFavoritesContextValue = {
        favorites: mockFavorites,
        removeFavorite: jest.fn(),
        favoritesLoading: false,
        setFavoritesLoading: jest.fn(),
      };
  
      render(
        <MemoryRouter>
          <FavoritesContext.Provider value={mockFavoritesContextValue}>
            <FavoriteList />
          </FavoritesContext.Provider>
        </MemoryRouter>
      );
  
      expect(screen.getByText('Mock Favorite 1')).toBeInTheDocument();
      expect(screen.getByText('Mock Favorite 2')).toBeInTheDocument();
    });
  });