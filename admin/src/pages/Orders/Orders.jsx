import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';
import { toast } from 'react-toastify';
import order from './order.mp4';

const Orders = ({ url }) => {
  const restaurantId = '67309331287f4addfc376298';
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewedOrders, setViewedOrders] = useState(new Set());

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${url}/orders/${restaurantId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          toast.error('Error fetching orders');
        }
      } catch (error) {
        toast.error('Error fetching orders');
      }
    };

    if (token) {
      fetchOrders();
    } else {
      toast.error('No token provided');
    }

    // Load viewed orders from localStorage
    const storedViewedOrders = JSON.parse(localStorage.getItem('viewedOrders')) || [];
    setViewedOrders(new Set(storedViewedOrders));
  }, [url]);

  const calculateTotalBill = (order) => {
    const totalItemsPrice = order.items.reduce(
      (sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity),
      0
    );
    return totalItemsPrice + order.taxPrice + order.serviceCharge;
  };

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    // Add order ID to the viewedOrders Set
    const updatedViewedOrders = new Set(viewedOrders).add(order._id);
    setViewedOrders(updatedViewedOrders);

    // Save updated viewed orders to localStorage
    localStorage.setItem('viewedOrders', JSON.stringify(Array.from(updatedViewedOrders)));
  };

  const handleClosePopup = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="orders-container">
                        <video autoPlay loop muted src={order} className="background-video">
        Your browser does not support the video tag.
      </video>
      {orders.length > 0 ? (
        <div className="orders-list">
          {/* Reverse the order array so the newly viewed order is at the top */}
          {[...orders].reverse().map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <p><strong>User:</strong> {order.user.fullName}</p>
                <p><strong>Order No:</strong> {order.orderNo}</p>
                <p><strong>Status:</strong> {order.orderStatus}</p>
                <p><strong>Total Price:</strong> ${calculateTotalBill(order).toFixed(2)}</p>
                <button
                  className={`order-details-btn ${viewedOrders.has(order._id) ? 'viewed' : ''}`}
                  onClick={() => handleOrderDetails(order)}
                >
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
            <h2 className="text-2xl ">Order Invoice</h2>
            <div className="order-invoice">
              <div className="order-header">
                <h3>Order #{selectedOrder.orderNo}</h3>
                <p><strong>User:</strong> {selectedOrder.user.fullName}</p>
                <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
                <p><strong>Restaurant ID:</strong> {selectedOrder.restaurantId}</p>
                <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="order-items">
                {selectedOrder.items.map((item) => (
                  <div key={item.menu._id} className="order-item">
                    <div className="item-details">
                      <p>{item.name} (x{item.quantity})</p>
                      <p>${parseFloat(item.price) * parseInt(item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-summary">
                <p><strong>Tax:</strong> ${selectedOrder.taxPrice}</p>
                <p><strong>Service Charge:</strong> ${selectedOrder.serviceCharge}</p>
                <p><strong>Total:</strong> ${calculateTotalBill(selectedOrder).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
