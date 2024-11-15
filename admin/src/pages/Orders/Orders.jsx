import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';
import { toast } from 'react-toastify';
import order from './order.mp4';
import jsPDF from 'jspdf';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewedOrders, setViewedOrders] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    const restaurantId = JSON.parse(localStorage.getItem('restaurantId'));

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
          setFilteredOrders(response.data.data); // Set both orders and filteredOrders
          console.log(response.data.data);
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
    const updatedViewedOrders = new Set(viewedOrders).add(order._id);
    setViewedOrders(updatedViewedOrders);
    localStorage.setItem('viewedOrders', JSON.stringify(Array.from(updatedViewedOrders)));
  };

  const handleClosePopup = () => {
    setSelectedOrder(null);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredOrders.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    const token = JSON.parse(localStorage.getItem('token'));
  
    console.log("Order ID:", orderId);
    console.log("Status:", status);
    status = String(status)
  
    try {
      // Wrap the status in an object for the request body
      const response = await axios.patch(
        `${url}/order/${orderId}/update`, 
        { status: status }, // Correctly formatted request body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data.success) {
        toast.success(`Order status updated to ${status}`);
        console.log("Response:", response);
  
        // Update the local state for the order status
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: status } : order
          )
        );
  
        // Update selectedOrder state if it matches the orderId
        setSelectedOrder((prevSelectedOrder) =>
          prevSelectedOrder && prevSelectedOrder._id === orderId
            ? { ...prevSelectedOrder, orderStatus: status }
            : prevSelectedOrder
        );
      } else {
        toast.error('Error updating status');
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error('Error updating status');
    }
  };
  
  

  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      setFilteredOrders(
        orders.filter((order) =>
          order.orderNo.toLowerCase().includes(query.toLowerCase())
        )
      );
      setCurrentPage(1);
    } else {
      setFilteredOrders(orders);
    }
  };


  const downloadInvoiceAsPDF = () => {
    if (selectedOrder) {
      const doc = new jsPDF();
  
      // Set title and style
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Order Invoice', 20, 20);
  
      // Add order number
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Order Number: #${selectedOrder.orderNo}`, 20, 30);
      
      // Order Details
      doc.text(`User: ${selectedOrder.user}`, 20, 40);
      doc.text(`Status: ${selectedOrder.orderStatus}`, 20, 50);
      doc.text(`Restaurant ID: ${selectedOrder.restaurantId}`, 20, 60);
      doc.text(`Order Date: ${new Date(selectedOrder.createdAt).toLocaleDateString()}`, 20, 70);
      
      // Draw a line for separation
      doc.setLineWidth(0.5);
      doc.line(20, 80, 190, 80);
  
      // Create table for items
      doc.text('Item Details', 20, 90);
      
      let startY = 100;
      const columnWidths = [100, 30, 40]; // Adjust widths for item name, quantity, price
      const itemHeaderY = startY;
  
      // Item headers
      doc.setFont('helvetica', 'bold');
      doc.text('Item Name', 20, itemHeaderY);
      doc.text('Quantity', 120, itemHeaderY);
      doc.text('Price', 160, itemHeaderY);
  
      // Adjust the Y-coordinate for the first row of data
      const rowStartY = itemHeaderY + 10;  // Move the first row down by 10 units
  
      doc.setFont('helvetica', 'normal');
      let totalAmount = 0;
  
      // Loop through items and add them to table
      selectedOrder.items.forEach((item, index) => {
        const rowY = rowStartY + (index * 10);  // Start at rowStartY and add 10 units per item
        doc.text(item.name, 20, rowY);
        doc.text(`${item.quantity}`, 120, rowY);
        const itemPrice = (parseFloat(item.price) * parseInt(item.quantity)).toFixed(2);
        doc.text(`$${itemPrice}`, 160, rowY);
        totalAmount += parseFloat(itemPrice);
      });
  
      // Draw lines below item list
      doc.line(20, rowStartY + selectedOrder.items.length * 10, 190, rowStartY + selectedOrder.items.length * 10);
  
      // Add summary details below the item list
      const summaryY = rowStartY + selectedOrder.items.length * 10 + 10;
  
      doc.text(`Tax: $${selectedOrder.taxPrice.toFixed(2)}`, 120, summaryY);
      doc.text(`Service Charge: $${selectedOrder.serviceCharge.toFixed(2)}`, 120, summaryY + 10);
      doc.text(`Total: $${calculateTotalBill(selectedOrder).toFixed(2)}`, 120, summaryY + 20);
  
      // Draw footer with company info (optional)
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('Thank you for your purchase!', 20, doc.internal.pageSize.height - 20);
      doc.text('For questions, contact us at support@restaurant.com', 20, doc.internal.pageSize.height - 10);
      
      // Save PDF
      doc.save(`Order_Invoice_${selectedOrder.orderNo}.pdf`);
    }
  };
  
  



  return (
    <div className="orders-container relative">
      <video autoPlay loop muted src={order} className="background-video absolute inset-0 w-full h-full object-cover z-[-1]">
        Your browser does not support the video tag.
      </video>
      
      {/* Search bar */}
      <div className="search-bar flex justify-center mt-4 mb-6 bgcolor:black">
        <input
          type="text"
          placeholder="Search by Order Number"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input p-2 rounded border border-gray-300 w-1/2 focus:outline-none focus:border-blue-500 "
        />
      </div>

      {filteredOrders.length > 0 ? (
        <div className="orders-list grid gap-4 mt-6">
          {[...currentOrders].reverse().map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <p><strong>User:</strong> {order.user}</p>
                <p><strong>Order No:</strong> {order.orderNo}</p>
                <p><strong>Status:</strong> {order.orderStatus}</p>
                <p><strong>Total Price:</strong> ${calculateTotalBill(order).toFixed(2)}</p>
                <button
                  className={`order-details-btn ${viewedOrders.has(order._id) ? 'viewed' : ''}`}
                  onClick={() => handleOrderDetails(order)}
                >
                  View Order Details
                </button>

                <div
                  className={`payment-status mt-4 p-2 text-white text-center font-semibold w-20 mr-5 rounded ${
                    order.isPaid ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {order.isPaid ? 'Paid' : 'Not Paid'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No Orders</p>
      )}

      <div className="pagination mt-8 flex items-center justify-center space-x-4 mb-8">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Back
        </button>
        <span className="page-indicator">
          Page {currentPage} of {Math.ceil(filteredOrders.length / itemsPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(filteredOrders.length / itemsPerPage)}
          className="pagination-btn"
        >
          Next
        </button>
      </div>

      {selectedOrder && (
        <div className="order-details-popup">
          <div className="order-details-content">
            <button className="back-btn" onClick={handleClosePopup}>Back</button>
            {selectedOrder.orderStatus === 'Pending' && (
              <div className="">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder._id, "Recieved")}
                  className="back-btn1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Mark as Recieved
                </button>
              </div>
            )}

            {selectedOrder.orderStatus === 'Recieved' && (
              <div className="">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder._id, "Served")}
                  className="back-btn1 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                  Mark as Served
                </button>
              </div>
            )}

            {selectedOrder.orderStatus === 'Served' && (
            <button

            onClick={downloadInvoiceAsPDF}
            
            className="back-btn1 bg-blue-500 text-white rounded hover:bg-blue-600 "
            >Download Invoice as PDF</button>
            )}

            <h2 className="text-2xl">Order Invoice</h2>

            <div className="order-invoice">
              <div className="order-header">
                <h3>Order #{selectedOrder.orderNo}</h3>
                <p><strong>User:</strong> {selectedOrder.user}</p>
                <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
                <p><strong>Restaurant ID:</strong> {selectedOrder.restaurantId}</p>
                <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="order-items">
                {selectedOrder.items.map((item) => (
                  <div key={item._id} className="order-item">
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
                
                <div className="total-price mt-2">
                  <p><strong>Total:</strong> ${calculateTotalBill(selectedOrder).toFixed(2)}</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
