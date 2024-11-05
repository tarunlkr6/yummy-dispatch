import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import bgvideo from './bgvideo.mp4'; // Import the video file

const List = ({ url }) => {
  const resid = '67251d6a3e030e9e961800b0';
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/${resid}/menu`);
      if (response.data.success) {
        console.log(response.data);
        setList(response.data.data);
      } else {
        toast.error('Error fetching list');
      }
    } catch (error) {
      console.error("Error fetching list:", error);
      toast.error('Error fetching list');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const removeFood = async(foodId) => {
    // console.log(foodId); 
    // /:resid/menu/:itemid

    const response = await axios.delete(`${url}/${resid}/menu/${foodId}` , {id:foodId})

    await fetchList();

  }
  
  return (
    <div className="list-container">
      {/* Background video */}
      {/* Page content */}
      <div className="content-overlay">
      <video autoPlay loop muted src={bgvideo} className="background-video">
        Your browser does not support the video tag.
      </video>
        <header className="list-header">
          <h1>Our Delicious Menu</h1>
          <p>Discover a variety of amazing dishes just for you!</p>
        </header>

        <div className="list-grid">
          {list.map((item, index) => (
            <div key={index} className="list-card">
              <div className="list-card-image">
                <img src={item.image[0]?.url} alt={item.itemName} />
              </div>
              <div className="list-card-content">
                <h3>{item.itemName}</h3>
                <p className="category">{item.category}</p>
                <p className="price">${item.price}</p>
                <button className="remove-btn" onClick={() => removeFood(item._id)}>
                  <i className="fa-solid fa-trash"></i> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
