import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './Book.css';
import book from './book.mp4';

const BookTable = ({ url }) => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [searchDate, setSearchDate] = useState(null);
  const restaurantId = '67251d6a3e030e9e961800b0';

  const fetchBookings = async (date) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.get(`${url}/booking/${restaurantId}/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { date },
      });

      if (response.data.data.length === 0) {
        setBookings([]);
        setError('');
      } else {
        setBookings(response.data.data);
      }
    } catch (err) {
      setBookings([]);
      setError('Error fetching bookings. Please check your authentication and try again.');
    }
  };

  const handleDateChange = (date) => {
    setSearchDate(date);
    const formattedDate = date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : '';
    fetchBookings(formattedDate);
  };

  const handleShowDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedBooking(null);
  };

  const handleCancelBooking = (bookingId) => {
    setConfirmAction(() => () => cancelBooking(bookingId));
    setShowConfirmationPopup(true);
  };

  const handleUpdateBookingStatus = (bookingId) => {
    setConfirmAction(() => () => updateBookingStatus(bookingId));
    setShowConfirmationPopup(true);
  };

  const confirmActionHandler = async () => {
    if (confirmAction) await confirmAction();
    setShowConfirmationPopup(false);
    setConfirmAction(null);
  };

  const cancelConfirmationHandler = () => {
    setShowConfirmationPopup(false);
    setConfirmAction(null);
  };

  const cancelBooking = async (bookingId) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      await axios.delete(`${url}/booking/cancel/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };

  const updateBookingStatus = async (bookingId) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.patch(`${url}/booking/update/${bookingId}`, token, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: 'Confirmed' } : booking
        )
      );
    } catch (err) {
      console.error('Error confirming booking:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="book-table fade-in">
      <video autoPlay loop muted src={book} className="background-video">
        Your browser does not support the video tag.
      </video>
      <h2>Book Table</h2>

      <DatePicker
        selected={searchDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="Select a date"
        className="date-picker"
      />

      {error && <p className="error">{error}</p>}
      {bookings.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer Name</th>
              <th>Reservation Date</th>
              <th>Status</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.bookingToken}</td>
                <td>{booking.name}</td>
                <td>{new Date(booking.reservationDate).toLocaleDateString()}</td>
                <td
                  style={{
                    color: booking.status === 'Confirmed' ? 'green' : 'yellow',
                    fontWeight: 'bold',
                  }}
                >
                  {booking.status}
                </td>
                <td>
                  <button onClick={() => handleShowDetails(booking)} className="view-details">
                    View Details
                  </button>
                </td>
                <td>
                  {booking.status !== 'Cancelled' && booking.status !== 'Confirmed' && (
                    <button onClick={() => handleCancelBooking(booking._id)} className="cancel">
                      Cancel
                    </button>
                  )}
                  {booking.status === 'Pending' && (
                    <button onClick={() => handleUpdateBookingStatus(booking._id)} className="confirm">
                      Confirm
                    </button>
                  )}
                  {booking.status === 'Confirmed' && <span className="confirmed">Confirmed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings found.</p>
      )}

      {showDetails && selectedBooking && (
        <div className="modal fade-in">
          <div className="modal-content">
            <span className="close" onClick={handleCloseDetails}>&times;</span>
            <h3>Booking Details</h3>
            <p><strong>Contact Email:</strong> {selectedBooking.contactEmail}</p>
            <p><strong>Contact Phone:</strong> {selectedBooking.contactPhone}</p>
            <p><strong>Created At:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}</p>
            <p><strong>Name:</strong> {selectedBooking.name}</p>
            <p><strong>Number of Guests:</strong> {selectedBooking.numGuests}</p>
            <p><strong>Reservation Date:</strong> {new Date(selectedBooking.reservationDate).toLocaleDateString()}</p>
            <p><strong>Reservation Time:</strong> {selectedBooking.reservationTime}</p>
          </div>
        </div>
      )}

      {showConfirmationPopup && (
        <div className="confirmation-popup fade-in">
          <div className="popup-content">
            <h3>Are you sure?</h3>
            <p>Do you want to proceed with this action?</p>
            <button onClick={confirmActionHandler}>Yes</button>
            <button onClick={cancelConfirmationHandler}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTable;
