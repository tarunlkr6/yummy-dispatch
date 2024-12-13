import React, { useState, useEffect } from "react";
import { useGetMyOrdersQuery } from "../../slices/orderApiSlice";
import { Link } from "react-router-dom";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { PDFDownloadLink, Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { invoiceStyles } from './InvoiceStyle';
import { assets } from '../../assets/assets'
import { useGetRestaurantDetailsQuery } from "../../slices/restaurantApitSlice";

const ITEMS_PER_PAGE = 5;

// PDF Document component
const InvoicePDF = ({ order = {} }) => {
  const {
    orderNo = "N/A",
    createdAt = new Date(),
    orderStatus = "Pending",
    isPaid = false,
    restaurantId = "Unknown",
    items = [],
    totalPrice = 0,
    taxPrice = 0,
    serviceCharge = 0,
  } = order;
  // const { data: restaurantDetails, isLoading, error } = useGetRestaurantDetailsQuery(restaurantId);
  // console.log(restaurantDetails)
  // const restaurantName = isLoading
  // ? "Loading..."
  // : error
  // ? "Unknown Restaurant"
  // : restaurantDetails?.name || "Unnamed Restaurant";

  // Calculate subtotal
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Document>
      <Page size="A4" style={invoiceStyles.page}>
        {/* Logo and Header */}
        <View style={invoiceStyles.headerSection}>
          <Image style={invoiceStyles.logo} src={assets.app} />
          <Text style={invoiceStyles.header}>Invoice</Text>
        </View>

        {/* Restaurant Information */}
        <View style={invoiceStyles.section}>
          <Text style={invoiceStyles.text}>Scan&Dine</Text>
          {/* <Text style={invoiceStyles.text}>{}</Text>
          <Text style={invoiceStyles.text}>123 Main Street, City, State</Text>
          <Text style={invoiceStyles.text}>Phone: (123) 456-7890</Text> */}
        </View>

        {/* Order Details */}
        <View style={invoiceStyles.section}>
          <Text style={invoiceStyles.subheader}>Order Details</Text>
          <Text style={invoiceStyles.text}>Order No: {orderNo}</Text>
          <Text style={invoiceStyles.text}>Date: {new Date(createdAt).toLocaleDateString()}</Text>
          <Text style={invoiceStyles.text}>Status: {orderStatus}</Text>
          <Text style={invoiceStyles.text}>Payment Status: {isPaid ? "Paid" : "Not Paid"}</Text>
          <Text style={invoiceStyles.text}>Restaurant ID: {restaurantId}</Text>
        </View>

        {/* Items Section */}
        <View style={invoiceStyles.section}>
          <Text style={invoiceStyles.subheader}>Items Ordered:</Text>
          {items.length > 0 ? (
            items.map((item, index) => (
              <View key={index} style={invoiceStyles.itemRow}>
                <Text style={invoiceStyles.itemText}>{item.name || "Unnamed Item"}</Text>
                <Text style={invoiceStyles.itemText}>Qty: {item.quantity || 0}</Text>
                <Text style={invoiceStyles.itemPrice}>Price: ${item.price || "0.00"}</Text>
                <Text style={invoiceStyles.itemPrice}>
                  Total: ${(item.price * item.quantity) || "0.00"}
                </Text>
              </View>
            ))
          ) : (
            <Text style={invoiceStyles.text}>No items ordered.</Text>
          )}
        </View>

        {/* Summary Section */}
        <View style={invoiceStyles.section}>
          <Text style={invoiceStyles.subheader}>Summary</Text>
          <View style={invoiceStyles.summaryRow}>
            <Text style={invoiceStyles.itemText}>Subtotal:</Text>
            <Text style={invoiceStyles.itemPrice}>${subtotal}</Text>
          </View>
          <View style={invoiceStyles.summaryRow}>
            <Text style={invoiceStyles.itemText}>Service Charge:</Text>
            <Text style={invoiceStyles.itemPrice}>${serviceCharge}</Text>
          </View>
          <View style={invoiceStyles.summaryRow}>
            <Text style={invoiceStyles.itemText}>GST:</Text>
            <Text style={invoiceStyles.itemPrice}>${taxPrice}</Text>
          </View>
          <View style={invoiceStyles.summaryRow}>
            <Text style={invoiceStyles.totalLabel}>Total:</Text>
            <Text style={invoiceStyles.totalAmount}>${totalPrice}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={invoiceStyles.footer}>
          <Text>Thank you for dining with us!</Text>
          <Text>Visit again!</Text>
        </View>
      </Page>
    </Document>
  );
};

const OrderDetails = () => {
  const { data: ordersData, isLoading, error } = useGetMyOrdersQuery();
  // console.log(ordersData)
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedOrders, setPaginatedOrders] = useState([]);

  useEffect(() => {
    if (ordersData?.data) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setPaginatedOrders(ordersData.data.slice(startIndex, endIndex));
    }
  }, [ordersData, currentPage]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6347]"></div>
    </div>
    );

  const totalPages = ordersData?.data ? Math.ceil(ordersData.data.length / ITEMS_PER_PAGE) : 0;

  return (
    <div>
      <Link to="/">
        <Button
          size="medium"
          color="black"
          variant="outlined"
          className="mx-auto mt-4"
        >
          Go back
        </Button>
      </Link>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        {error && (
          <p className="w-full p-4 bg-red-400">Error loading orders.</p>
        )}
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <div className="gap-4 sm:flex sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                My orders
              </h2>
            </div>

            <div className="mt-6 flow-root sm:mt-8">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex flex-wrap items-center gap-y-4 py-6"
                  >
                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Order No:
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        {order.orderNo}
                      </dd>
                    </dl>
                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Date:
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Status:
                      </dt>
                      <dd
                        className={`me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${
                          order.orderStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {order.orderStatus}
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Paid:
                      </dt>
                      <dd
                        className={`me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${
                          order.isPaid
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Not Paid"}
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Payment:
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        <Link to={`/order/${order._id}`}>
                          <Button
                            variant="outlined"
                            size="sm"
                            color="black"
                            className="rounded-full"
                            disabled={order.isPaid === true}
                          >
                            Pay
                          </Button>
                        </Link>
                      </dd>
                    </dl>

                    <Popover>
                      <PopoverHandler>
                        <Button
                          color="black"
                          variant="outlined"
                          size="sm"
                          className="rounded-full hover:fill-black"
                        >
                          Order Details
                        </Button>
                      </PopoverHandler>
                      <PopoverContent className="p-4 w-80">
                        <div className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          Items in Order:
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {order.items.map((item) => (
                            <div key={item._id} className="py-2">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {item.name}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  Quantity: {item.quantity}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Price: ${item.price}
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                  Total: ${item.price * item.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Total Price: ${order.totalPrice}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <PDFDownloadLink document={<InvoicePDF order={order} />} fileName={`invoice-${order.orderNo}.pdf`}>
                      {({ blob, url, loading, error }) =>
                        loading ? (
                          <Button color="blue" size="sm" disabled>
                            Loading invoice...
                          </Button>
                        ) : (
                          <Button color="black" size="sm" variant="outlined">
                            <i className="fa-solid fa-download fa-lg"></i>
                          </Button>
                        )
                      }
                    </PDFDownloadLink>
                  </div>
                ))}
              </div>
            </div>

            <nav
              className="mt-6 flex items-center justify-center sm:mt-8"
              aria-label="Page navigation example"
            >
              <ul className="flex h-8 items-center -space-x-px text-sm">
                <li>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-4 w-4 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m15 19-7-7 7-7"
                      />
                    </svg>
                  </Button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index}>
                    <Button
                      onClick={() => setCurrentPage(index + 1)}
                      className={`flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight ${
                        currentPage === index + 1
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      } dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                    >
                      {index + 1}
                    </Button>
                  </li>
                ))}
                <li>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-4 w-4 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m9 5 7 7-7 7"
                      />
                    </svg>
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderDetails;