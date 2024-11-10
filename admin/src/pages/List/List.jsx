import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import bgvideo from './bgvideo.mp4';

const List = ({ url }) => {
  const resid = '67251d6a3e030e9e961800b0';
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isVegFilter, setIsVegFilter] = useState(null); // true for Veg, false for Non-Veg, null for all
  const [filteredItems, setFilteredItems] = useState([]);
  const itemsPerPage = 4;

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/${resid}/menu`);
      if (response.data.success) {
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

  // Toggle Filter Modal
  const toggleFilterModal = () => setFilterModal(!filterModal);

  // Handle Veg/Non-Veg Filter
  const handleVegFilterChange = (value) => {
    setIsVegFilter(value);
    filterItems(value, selectedCategories);
  };

  // Handle Category Selection
  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updatedCategories);
    filterItems(isVegFilter, updatedCategories);
  };

  // Filter Items
  const filterItems = (vegFilter, categories) => {
    const updatedFilteredItems = list.filter((item) => {
      const matchesVeg = vegFilter === null || item.isVeg === vegFilter;
      const matchesCategory = categories.length === 0 || categories.includes(item.category);
      return matchesVeg && matchesCategory;
    });
    setFilteredItems(updatedFilteredItems);
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Keyword Filter Buttons
  const filterByKeyword = (keyword) => {
    setFilteredItems(
      list.filter((item) =>
        item.itemName.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    setCurrentPage(1);
  };

  // Pagination logic
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
    <div className="list-container fade-in">
      <div className="content-overlay fade-in">
        <video autoPlay loop muted src={bgvideo} className="background-video">
          Your browser does not support the video tag.
        </video>

        <header className="list-header">
          <h1>Our Delicious Menu</h1>
          <p>Discover a variety of amazing dishes just for you!</p>
        </header>

        {/* Filter and Keyword Buttons */}
        <div className="filter-buttons">
          <button onClick={toggleFilterModal} className="filter-btn">
            Filter
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

        {/* Filter Modal */}
        {filterModal && (
          <div className="filter-modal">
            <div className="filter-modal-content">
              <h2>Select Categories</h2>
              <label>
                <input
                  type="checkbox"
                  checked={isVegFilter === true}
                  onChange={() => handleVegFilterChange(true)}
                />
                Veg
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={isVegFilter === false}
                  onChange={() => handleVegFilterChange(false)}
                />
                Non-Veg
              </label>
              {['Dessert', 'MainCourse'].map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
              <button onClick={toggleFilterModal} className="close-btn">
                Close
              </button>
            </div>
          </div>
        )}

        <div className="list-grid">
          {currentItems.map((item) => (
            <div
              key={item._id}
              className={`list-card ${!item.isAvailable ? 'grayscale' : ''} ${
                item.isVeg ? 'veg-card' : 'non-veg-card'
              }`}
            >
              <div className="list-card-image">
                <img src={item.image[0]?.url} alt={item.itemName} />
              </div>
              <div className="list-card-content">
                <h3>
                  <span
                    className="veg-icon"
                    style={{ color: item.isVeg ? 'green' : 'red' }}
                  >
                    <i className="fa-regular fa-square-caret-up text-2xl"></i>
                  </span>
                  {item.itemName}
                </h3>
                <p className="category">{item.category}</p>
                <p className="price">${item.price}</p>
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
