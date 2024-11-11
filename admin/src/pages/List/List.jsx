import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import bgvideo from './bgvideo.mp4'

const List = ({ url }) => {
  const resid = '67309331287f4addfc376298';
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isVegFilter, setIsVegFilter] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const itemsPerPage = 4;

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/${resid}/menu`);
      if (response.data.success) {
        console.log(response.data.data);
        setList(response.data.data);
        setFilteredItems(response.data.data);
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
      const token = JSON.parse(localStorage.getItem('token'));
      const updatedData = { isAvailable: !list.find(item => item._id === foodId).isAvailable };

      await axios.patch(`${url}/${resid}/menu/${foodId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      fetchList();
      toast.success(`Item availability updated successfully`);
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

  const handleVegFilterChange = (value) => {
    setIsVegFilter(value);
    filterItems(value);
  };

  const filterItems = (vegFilter) => {
    const updatedFilteredItems = list.filter((item) =>
      vegFilter === null || item.isVeg === vegFilter
    );
    setFilteredItems(updatedFilteredItems);
    setCurrentPage(1);
  };

  const filterByKeyword = (keyword) => {
    setFilteredItems(
      list.filter((item) =>
        item.itemName.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

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
    <div className="list-container">
                  <video autoPlay loop muted src={bgvideo} className="background-video">
        Your browser does not support the video tag.
      </video>
      <header className="list-header">
        <h1>Our Delicious Menu</h1>
        <p>Discover a variety of amazing dishes just for you!</p>
      </header>

      <div className="filter-buttons">
        <button onClick={() => handleVegFilterChange(true)} className="veg-btn">
          🌱 Veg
        </button>
        <button onClick={() => handleVegFilterChange(false)} className="non-veg-btn">
          🍗 Non-Veg
        </button>
        <button onClick={() => handleVegFilterChange(null)} className="all-btn">
          All
        </button>
        {['Chicken', 'Ice-Cream', 'Biriyani', 'Paneer'].map((keyword) => (
          <button
            key={keyword}
            onClick={() => filterByKeyword(keyword)}
            className="keyword-btn"
          >
            {keyword}
          </button>
        ))}
      </div>

      <div className="list-grid">
        {currentItems.map((item) => (
          <div
            key={item._id}
            className={`list-card ${!item.isAvailable ? 'grayscale' : ''} ${item.isVeg ? 'veg-card' : 'non-veg-card'}`}
          >
            <button className="remove-btn" onClick={() => removeFood(item._id)}>
              <i className="fa-solid fa-trash"></i>
            </button>
            <div className="list-card-image">
              <img src={item.image[0]?.url} alt={item.itemName} />
            </div>
            <div className="list-card-content">
              <div className="veg-icon">
                {item.isVeg ? (
                  <span role="img" aria-label="Veg">🌱</span>
                ) : (
                  <span role="img" aria-label="Non-Veg">🍗</span>
                )}
              </div>
              <h3 className="item-name-centered">
                {item.itemName}
              </h3>
              <p className="category">{item.category}</p>
              <p className="price">${item.price}</p>

              <label className="availability-toggle">
                <span>Available:</span>
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
  );
};

export default List;
