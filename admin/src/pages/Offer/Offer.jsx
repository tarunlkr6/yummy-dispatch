import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Offer.css';
import offerVideo from './offer.mp4';


const Offer = ({ url }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deletingOfferId, setDeletingOfferId] = useState(null);
  const [offerName, setOfferName] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerImage, setOfferImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 3;

  const resid =  JSON.parse(localStorage.getItem('restaurantId'));

  useEffect(() => {
    const fetchOffers = async () => {
        const resid =  JSON.parse(localStorage.getItem('restaurantId'));
      try {
        const response = await axios.get(`${url}/${resid}/offers`);
        setOffers(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load offers:', err);
        setLoading(false);
      }
    };
    fetchOffers();
  }, [url, `${resid}`]);

  const handleDelete = async (offerId) => {
    setDeletingOfferId(offerId);
    const token = JSON.parse(localStorage.getItem('token'));
    const resid =  JSON.parse(localStorage.getItem('restaurantId'));

    try {
      await axios.delete(`${url}/${resid}/offer/delete/${offerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOffers((prevOffers) => prevOffers.filter((offer) => offer._id !== offerId));
    } catch (err) {
      alert('Failed to delete offer');
    } finally {
      setDeletingOfferId(null);
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const formData = new FormData();
    formData.append('offerName', offerName);
    formData.append('offerDescription', offerDescription);
    formData.append('offerImage', offerImage);

    const token = JSON.parse(localStorage.getItem('token'));
    const resid =  JSON.parse(localStorage.getItem('restaurantId'));

    try {
      const response = await axios.post(`${url}/${resid}/offer/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setOffers((prevOffers) => [...prevOffers, response.data.data]);
      setOfferName('');
      setOfferDescription('');
      setOfferImage(null);
    } catch (err) {
      alert('Failed to create offer');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="offer-page-container">
      <video autoPlay loop muted src={offerVideo} className="background-video">
        Your browser does not support the video tag.
      </video>

      {/* Offer Container */}
      <div className="offer-container">
        <h2>Available Offers</h2>
        <div className="offer-list">
          {loading ? (
            <p>Loading offers...</p>
          ) : (
            currentOffers.map((offer) => (
              <div key={offer._id} className="offer-card">
                <img src={offer.offerImage} alt={offer.offerName} className="offer-image" />
                <div className="offer-info">
                  <h3>{offer.offerName}</h3>
                  <p>{offer.offerDescription}</p>
                </div>
                <button
                  onClick={() => handleDelete(offer._id)}
                  className="delete-button"
                  disabled={deletingOfferId === offer._id}
                >
                  {deletingOfferId === offer._id ? 'Deleting...' : 'Delete Offer'}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {offers.length > offersPerPage && (
          <div className="pagination">
            {[...Array(Math.ceil(offers.length / offersPerPage))].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Form for Adding Offer */}
      <form onSubmit={handleCreateOffer} className="offer-form mt-20">
        <input
          type="text"
          placeholder="Offer Name"
          value={offerName}
          onChange={(e) => setOfferName(e.target.value)}
          required
        />
        <textarea
          placeholder="Offer Description"
          value={offerDescription}
          onChange={(e) => setOfferDescription(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setOfferImage(e.target.files[0])}
          required
        />
        <button type="submit" disabled={submitLoading}>
          {submitLoading ? 'Creating...' : 'Create Offer'}
        </button>
      </form>
    </div>
  );
};

export default Offer;
