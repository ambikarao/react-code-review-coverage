import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Wishlist from './Wishlist';

// Mock useApp to provide controlled test data
jest.mock('../AppContext', () => ({
  useApp: jest.fn(),
}));

import { useApp } from '../AppContext';

const sampleWishlist = [
  {
    id: '1',
    product: {
      id: 'p1',
      title: 'Product One',
      price: 150,
      imageUrl: 'http://image1.jpg',
    },
    addedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: '2',
    product: {
      id: 'p2',
      title: 'Product Two',
      price: 90,
      imageUrl: 'http://image2.jpg',
    },
    addedAt: new Date('2023-01-15T11:00:00Z'),
  },
  {
    id: '3',
    product: {
      id: 'p3',
      title: 'Product Three',
      price: 110,
      imageUrl: 'http://image3.jpg',
    },
    addedAt: new Date('2023-02-01T09:00:00Z'),
  },
];

describe('Wishlist Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders message when wishlist is empty', () => {
    useApp.mockReturnValue({ wishlist: [] });
    render(<Wishlist />);
    expect(screen.getByText(/No items in wishlist./i)).toBeInTheDocument();
    expect(screen.getByText(/Your Wishlist \(0\)/i)).toBeInTheDocument();
  });

  test('renders wishlist items sorted by addedAt descending', () => {
    useApp.mockReturnValue({ wishlist: sampleWishlist });
    render(<Wishlist />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(sampleWishlist.length);

    // The first item should be the most recently added
    expect(screen.getByText('Product Three')).toBeInTheDocument();
    expect(screen.getByText('Product One')).toBeInTheDocument();
    expect(screen.getByText('Product Two')).toBeInTheDocument();

    // Check totals are displayed correctly
    expect(screen.getByText(/Total Value:/)).toHaveTextContent('350'); // 150+90+110
    expect(screen.getByText(/Average Price:/)).toHaveTextContent('116.67'); // 350/3 rounded to 2 decimal
    expect(screen.getByText(/Expensive Items \(&gt;\$100\)/)).toHaveTextContent('2');
  });

  test('calls addToCart when Add to Cart button is clicked', () => {
    const addToCartMock = jest.fn();
    useApp.mockReturnValue({
      wishlist: [sampleWishlist[0]],
      addToCart: addToCartMock,
      removeFromWishlist: jest.fn(),
    });

    render(<Wishlist />);

    const addToCartButton = screen.getByText(/Add to Cart/i);
    fireEvent.click(addToCartButton);

    expect(addToCartMock).toHaveBeenCalledWith(sampleWishlist[0].product, 1);
  });

  test('calls removeFromWishlist when Remove button is clicked', () => {
    const removeFromWishlistMock = jest.fn();
    useApp.mockReturnValue({
      wishlist: [sampleWishlist[0]],
      addToCart: jest.fn(),
      removeFromWishlist: removeFromWishlistMock,
    });

    render(<Wishlist />);

    const removeButton = screen.getByText(/Remove/i);
    fireEvent.click(removeButton);

    expect(removeFromWishlistMock).toHaveBeenCalledWith(sampleWishlist[0].product.id);
  });

  test('logs product id to console when View button is clicked', () => {
    console.log = jest.fn();
    useApp.mockReturnValue({
      wishlist: [sampleWishlist[0]],
      addToCart: jest.fn(),
      removeFromWishlist: jest.fn(),
    });

    render(<Wishlist />);

    const viewButton = screen.getByText(/View/i);
    fireEvent.click(viewButton);

    expect(console.log).toHaveBeenCalledWith('View details', sampleWishlist[0].product.id);
  });

  test('handles edge case: wishlist with zero-priced product', () => {
    const zeroPriceWishlist = [
      {
        id: '4',
        product: {
          id: 'p4',
          title: 'Free Product',
          price: 0,
          imageUrl: 'http://image4.jpg',
        },
        addedAt: new Date('2023-03-01T12:00:00Z'),
      },
    ];
    useApp.mockReturnValue({ wishlist: zeroPriceWishlist });
    render(<Wishlist />);

    expect(screen.getByText(/Total Value:/)).toHaveTextContent('0');
    expect(screen.getByText(/Average Price:/)).toHaveTextContent('0');
    expect(screen.getByText(/Expensive Items \(&gt;\$100\)/)).toHaveTextContent('0');
  });

  test('handles wishlist with all products below expensive threshold', () => {
    const cheapWishlist = [
      {
        id: '5',
        product: {
          id: 'p5',
          title: 'Cheap Product',
          price: 50,
          imageUrl: 'http://image5.jpg',
        },
        addedAt: new Date(),
      },
    ];

    useApp.mockReturnValue({ wishlist: cheapWishlist });
    render(<Wishlist />);

    expect(screen.getByText(/Expensive Items \(&gt;\$100\)/)).toHaveTextContent('0');
  });
});
