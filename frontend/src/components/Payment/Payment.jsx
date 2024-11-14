import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { Card, CardBody, Typography, Button, Radio } from "@material-tailwind/react";
import { useGetOrderDetailsByIdQuery, usePayOrderMutation, useGetPayPalClientIdQuery } from '../../slices/orderApiSlice';
import { savePaymentMethod } from '../../slices/cartSlice';

const Payment = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();
  const { data: ordersData, isLoading, error } = useGetOrderDetailsByIdQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery();
  
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      paypalDispatch({
        type: 'resetOptions',
        value: { 'client-id': paypal.clientId, currency: 'USD' },
      });
      paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
    }
  }, [paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    toast.success('Payment method saved');
  };

  async function onApprove(data, actions) {
    try {
      const details = await actions.order.capture();
     const res = await payOrder({ orderId, details });
      toast.success("Order paid successfully!");
    } catch (error) {
      toast.error(error?.data?.message || error.message || "An error occurred during payment");
    }
  }

  function onError(error) {
    toast.error(error.message || "An error occurred with PayPal");
  }

  function createOrder(data, actions) {
    const orderAmount = ordersData?.data?.totalPrice;
  
    if (!orderAmount || isNaN(orderAmount)) {
      toast.error("Invalid order total price. Please check the order details.");
      return Promise.reject("Invalid order amount");
    }
  
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: orderAmount.toFixed(2),
          },
        },
      ],
    });
  }

  if (isLoading) return <Typography className="text-center p-4">Loading...</Typography>;
  if (error) return <Typography className="text-center p-4 text-red-500">Error loading order details: {error.message}</Typography>;

  const order = ordersData?.data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/vieworders">
        <Button size='sm' variant="outlined" className="mb-2" color='black'>
          Go back
        </Button>
      </Link>
      <Card className="mb-8 overflow-hidden">
        <CardBody>
          <Typography variant="h4" className="mb-6 text-center">Order Details</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Order Number" value={order?.orderNo} />
            <DetailItem label="Order Status" value={order?.orderStatus} />
            <DetailItem label="Payment Method" value={order?.paymentMethod} />
            <DetailItem label="Restaurant ID" value={order?.restaurantId} />
          </div>
          {order?.isPaid && (
            <div className="mt-4 p-2 bg-green-500 text-white text-center rounded-md">
              Paid
            </div>
          )}
        </CardBody>
      </Card>

      <Card className="overflow-hidden">
        {!order.isPaid && <CardBody 
        >
          <Typography variant="h4" className="mb-6 text-center">Order Summary</Typography>
          <div className="space-y-4">
            <SummaryItem label="Service Charge" value={order?.serviceCharge.toFixed(2)} />
            <SummaryItem label="Tax" value={order?.taxPrice.toFixed(2)} />
            <SummaryItem label="Total Price" value={order?.totalPrice.toFixed(2)} isBold />
          </div>

          <form onSubmit={submitHandler} className="mt-8 space-y-4">
            <Typography variant="h6" className="text-center">Choose Payment Method</Typography>
            <div className="flex flex-wrap justify-center gap-4">
              {['PayPal', 'Credit Card', 'Google Pay', 'Cash'].map((method) => (
                <Radio
                  key={method}
                  name="paymentMethod"
                  label={method}
                  value={method}
                  onChange={() => setPaymentMethod(method)}
                  checked={paymentMethod === method}
                  className="hover:before:opacity-10"
                  containerProps={{
                    className: "p-2 border rounded-lg cursor-pointer transition-all hover:bg-gray-100",
                  }}
                />
              ))}
            </div>
            <Button 
              type="submit" 
              color="blue" 
              className="w-full py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Confirm Payment Method
            </Button>
          </form>

          {paymentMethod === 'PayPal' && !order?.isPaid && (
            <div className="mt-6">
              {isPending ? (
                <Typography className="text-center">Loading PayPal...</Typography>
              ) : (
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                  style={{ layout: "vertical" }}
                />
              )}
            </div>
          )}
        </CardBody>
        }
        
      </Card>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between p-2 border-b border-gray-200 last:border-b-0">
    <Typography className="font-semibold">{label}:</Typography>
    <Typography>{value}</Typography>
  </div>
);

const SummaryItem = ({ label, value, isBold = false }) => (
  <div className={`flex justify-between ${isBold ? 'font-bold text-lg' : ''}`}>
    <Typography>{label}:</Typography>
    <Typography>${value}</Typography>
  </div>
);

export default Payment;