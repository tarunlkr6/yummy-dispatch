import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';
import { toast } from 'react-toastify';

const Orders = ({ url }) => {
  const restaurantId = '67251d6a3e030e9e961800b0';
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    console.log(token);

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${url}/orders/${restaurantId}`, // API endpoint
          {
            headers: { Authorization: `Bearer ${token}` }, // Authorization header
          }
        );
        console.log(response.data.data);

        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          toast.error('Error fetching orders');
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error('Error fetching orders');
      }
    };

    if (token) {
      fetchOrders();
    } else {
      console.error("No token provided");
      toast.error("No token provided");
    }
  }, [url]);

  const calculateTotalBill = (order) => {
    const totalItemsPrice = order.items.reduce((sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity), 0);
    return totalItemsPrice + order.taxPrice + order.serviceCharge;
  };

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleClosePopup = () => {
    setSelectedOrder(null);
  };
  return (
    <div className="orders-container">
      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <p><strong>User:</strong> {order.user.name}</p>
                <p><strong>Order No:</strong> {order.orderNo}</p>
                <p><strong>Restaurant ID:</strong> {order.restaurantId}</p>
                <p><strong>Status:</strong> {order.orderStatus}</p>
                <p><strong>Total Price:</strong> ${calculateTotalBill(order).toFixed(2)}</p>
                <button className="order-details-btn" onClick={() => handleOrderDetails(order)}>
                  View Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No Orders</p>
      )}

      {selectedOrder && (
        <div className="order-details-popup">
          <div className="order-details-content">
            <button className="back-btn" onClick={handleClosePopup}>Back</button>
            <h2>Order Details - {selectedOrder.orderNo}</h2>
            <div className="order-items">
              {selectedOrder.items.map((item) => (
                <div key={item.menu._id} className="order-item">
                  <div className="order-item-name">{item.name}</div>
                  <div className="order-item-price">
                    ${parseFloat(item.price) * parseInt(item.quantity)} (x{item.quantity})
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <p><strong>Tax Price:</strong> ${selectedOrder.taxPrice}</p>
              <p><strong>Service Charge:</strong> ${selectedOrder.serviceCharge}</p>
              <p><strong>Total Bill:</strong> ${calculateTotalBill(selectedOrder).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
