import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import bgvideo from './bgvideo.mp4';

const List = ({ url }) => {
  const resid = '67251d6a3e030e9e961800b0';
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/${resid}/menu`);
      if (response.data.success) {
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

  const toggleAvailability = async (foodId) => {
    try {
      const itemResponse = await axios.get(`${url}/${resid}/menu/${foodId}`);
      const currentItem = itemResponse.data.data;
      const token = JSON.parse(localStorage.getItem('token'));

      const updatedData = {
        isAvailable: !currentItem.isAvailable,
      };

      await axios.patch(`${url}/${resid}/menu/${foodId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      fetchList();
      toast.success(
        `Item ${!currentItem.isAvailable ? 'enabled' : 'disabled'} successfully`
      );
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error('Error updating item availability');
    }
  };

  const removeFood = async (foodId) => {
    const token = JSON.parse(localStorage.getItem('token'));

    try {
      await axios.delete(`${url}/${resid}/menu/${foodId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchList();
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Error removing item");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(list.length / itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <div className="list-container fade-in">
      <div className="content-overlay fade-in">
        <video autoPlay loop muted src={bgvideo} className="background-video">
          Your browser does not support the video tag.
        </video>
        <header className="list-header">
          <h1>Our Delicious Menu</h1>
          <p>Discover a variety of amazing dishes just for you!</p>
        </header>

        <div className="list-grid">
          {currentItems.map((item) => (
            <div 
              key={item._id} 
              className={`list-card ${!item.isAvailable ? 'grayscale' : ''} ${item.isVeg ? 'veg-card' : 'non-veg-card'}`}
            >
              <div className="list-card-image">
                <img src={item.image[0]?.url} alt={item.itemName} />
              </div>
              <div className="list-card-content">
                <h3>
                  <span className="veg-icon" style={{ color: item.isVeg ? 'green' : 'red' }}>
                    <i className="fa-regular fa-square-caret-up text-2xl"></i>
                  </span>
                  {item.itemName}
                </h3>
                <p className="category">{item.category}</p>
                <p className="price">${item.price}</p>
                <button className="remove-btn" onClick={() => removeFood(item._id)}>
                  <i className="fa-solid fa-trash"></i>
                </button>

                <label className="availability-toggle">
                  Available:
                  <div className="switch">
                    <input
                      type="checkbox"
                      checked={item.isAvailable}
                      onChange={() => toggleAvailability(item._id)}
                    />
                    <span className="slider round"></span>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Back
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? 'active' : ''}
              onClick={() => handlePageClick(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default List;
