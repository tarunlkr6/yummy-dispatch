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
          //console.log(response.data.data);
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
        //console.log("Response:", response);
  
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
  
      // Fetch restaurant name from local storage
      const resname = JSON.parse(localStorage.getItem("resname"));
      const resphno = JSON.parse(localStorage.getItem("resphno"));
      const resmailid = JSON.parse(localStorage.getItem("resmailid"));
      const resadd = JSON.parse(localStorage.getItem("resadd"));
  
      // Header: Restaurant Details
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(resname, 105, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Address: ${resadd}`, 105, 22, { align: 'center' });
      doc.text(`Phone: ${resphno} | Email: ${resmailid} `, 105, 28, { align: 'center' });
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);
  
      // Invoice Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Order Invoice', 105, 40, { align: 'center' });
  
      // Order Details Section
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Order Number: #${selectedOrder.orderNo}`, 20, 50);
      doc.text(`User: ${selectedOrder.user}`, 20, 60);
      doc.text(`Status: ${selectedOrder.orderStatus}`, 20, 70);
      doc.text(`Restaurant ID: ${selectedOrder.restaurantId}`, 20, 80);
      doc.text(`Order Date: ${new Date(selectedOrder.createdAt).toLocaleDateString()}`, 20, 90);
  
      // Separator Line
      doc.setLineWidth(0.5);
      doc.line(20, 95, 190, 95);
  
      // Item Details Table Header
      doc.setFont('helvetica', 'bold');
      doc.text('Item Name', 20, 105);
      doc.text('Quantity', 120, 105);
      doc.text('Price', 160, 105);
  
      // Item Details Table Rows
      let startY = 115;
      doc.setFont('helvetica', 'normal');
      let totalAmount = 0;
  
      selectedOrder.items.forEach((item, index) => {
        const rowY = startY + (index * 10); // Adjust row height
        doc.text(item.name, 20, rowY);
        doc.text(`${item.quantity}`, 120, rowY);
        const itemPrice = (parseFloat(item.price) * parseInt(item.quantity)).toFixed(2);
        doc.text(`$${itemPrice}`, 160, rowY);
        totalAmount += parseFloat(itemPrice);
      });


  
      // Summary Section
      const summaryStartY = startY + selectedOrder.items.length * 10 + 10;

      doc.setLineWidth(0.5);
      doc.line(20, summaryStartY - 5, 190, summaryStartY - 5);

      doc.setFont('helvetica', 'bold');
      doc.text('Summary:', 20, summaryStartY);
      doc.setFont('helvetica', 'normal');
      doc.text(`Tax: $${selectedOrder.taxPrice.toFixed(2)}`, 150 , summaryStartY + 10);
      doc.text(`Service Charge: $${selectedOrder.serviceCharge.toFixed(2)}`, 150, summaryStartY + 20);
      doc.text(`Total: $${(totalAmount + selectedOrder.taxPrice + selectedOrder.serviceCharge).toFixed(2)}`, 150, summaryStartY + 30);
  
      // Footer Section
      const footerStartY = doc.internal.pageSize.height - 30;
      doc.setLineWidth(0.5);
      doc.line(20, footerStartY - 5, 190, footerStartY - 5); // Footer separator line
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.text('Thank you for your purchase!', 105, footerStartY, { align: 'center' });
      doc.text('For inquiries, contact us at scandine69@gmail.com', 105, footerStartY + 10, { align: 'center' });
  
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
              <div className="order-summary tend">
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
