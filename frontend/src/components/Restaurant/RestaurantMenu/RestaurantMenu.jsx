import React, { useEffect, useState } from 'react';
import { useGetMenuByRestaurantIdQuery } from '../../../slices/menuApiSlice';
import { useParams } from 'react-router-dom';
import './RestaurantMenu.css'; // Import CSS for styling

const RestaurantMenu = () => {
  const { id } = useParams();
  const [menuData, setMenuData] = useState([]);
  const {
    data,
    isLoading: menuLoading,
    error: menuError,
  } = useGetMenuByRestaurantIdQuery(id);

  useEffect(() => {
    if (data) {
      setMenuData(
        data.data.map((item) => ({
          id: item._id,
          name: item.itemName,
          description: item.description,
          price: item.price,
          image: item.image[0]?.url || '', // Fallback if no image URL
          category: item.category,
          isVeg: item.isVeg,
          isAvailable: item.isAvailable,
        }))
      );
    }
  }, [data]);

  if (menuLoading) return <div>Loading...</div>;
  if (menuError) return <div>Error loading menu.</div>;

  return (
    <div className="menu-container">
      {menuData.map((item) => (
        <div key={item.id} className="menu-card">
          <img src={item.image} alt={item.name} className="menu-image" />
          <div className="menu-details">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className="menu-price">Price: ${item.price}</p>
            <p className={`menu-category ${item.isVeg ? 'veg' : 'non-veg'}`}>{item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</p>
            <p className={`menu-availability ${item.isAvailable ? 'available' : 'unavailable'}`}>{item.isAvailable ? 'Available' : 'Not Available'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantMenu;
