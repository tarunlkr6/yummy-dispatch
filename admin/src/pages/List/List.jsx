import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import bgvideo from './bgvideo.mp4';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isVegFilter, setIsVegFilter] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const itemsPerPage = 4;

  const fetchList = async () => {
    try {
      const restaurantId = JSON.parse(localStorage.getItem('restaurantId'));
      const response = await axios.get(`${url}/${restaurantId}/menu`);
      //console.log(response)
      if (response.data.success) {
        setList(response.data.data);
        setFilteredItems(response.data.data); // Initialize with full list
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
    //console.log(foodId)
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const restaurantId = JSON.parse(localStorage.getItem('restaurantId'));
      const updatedData = { isAvailable: !list.find(item => item._id === foodId).isAvailable };
      // console.log(updatedData)
      // console.log(token)
      // console.log(restaurantId)
      // console.log(url)

      await axios.patch(`${url}/${restaurantId}/menu/${foodId}`, updatedData, {
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
    const restaurantId = JSON.parse(localStorage.getItem('restaurantId'));

    try {
      await axios.delete(`${url}/${restaurantId}/menu/${foodId}`, {
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
    filterItems(value, searchTerm); // Apply filters when changing veg option
  };


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterItems(isVegFilter, e.target.value); // Re-filter based on search term
  }; 


  const filterItems = (vegFilter, keyword) => {
    let updatedFilteredItems = list;

    if (vegFilter !== null) {
      updatedFilteredItems = updatedFilteredItems.filter(item => item.isVeg === vegFilter);
    }

    if (keyword) {
      updatedFilteredItems = updatedFilteredItems.filter(item =>
        item.itemName.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    setFilteredItems(updatedFilteredItems);
    setCurrentPage(1); // Reset to first page after applying filters
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

  const openEditModal = (item) => {
    setEditItem(item);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditItem({ ...editItem, [e.target.name]: e.target.value });
  };

  const saveEdit = async (foodId) => {
    //console.log(foodId)
    try {
      const restaurantId = JSON.parse(localStorage.getItem('restaurantId'));
      const token = JSON.parse(localStorage.getItem('token'));
      //console.log(editItem);
      const updatedData = editItem;
      // const updatedData = editItem ;
      await axios.put(`${url}/${restaurantId}/menu/${foodId}`, updatedData , {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success("Item updated successfully");
      fetchList();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error saving edit:", error);
      toast.error("Error saving item changes");
    }
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


      <div className="search-bar glass">
        <span class="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by item name..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
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
            <button className="edit-btn" onClick={() => openEditModal(item)}>
              <i className="fa-solid fa-edit"></i>
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

      {showEditModal && editItem && (
        <div className={`modal-overlay ${showEditModal ? 'show' : ''}`} onClick={() => setShowEditModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowEditModal(false)}>&times;</button>
            <div className="edit-modal-content">
              <h2>Edit Item</h2>
              <label>
                Name:
                <input
                  type="text"
                  name="itemName"
                  value={editItem.itemName}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Price:
                <input
                  type="Number"
                  name="price"
                  value={editItem.price}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={editItem.description}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Category:
                <input
                  type="text"
                  name="category"
                  value={editItem.category}
                  onChange={handleEditChange}
                />
              </label>
              <button onClick={() => saveEdit(editItem._id)} className="save-btn">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
