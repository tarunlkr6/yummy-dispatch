import { Order } from "../models/order.model.js"
import { Restaurant } from "../models/restaurant.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import crypto from "crypto"

// generate unique booking number
const generateOrderToken = async () => {

    try {
        let unique = false
        let token
        while (!unique) {

            token = crypto.randomInt(10000000, 100000000)
            const existingBooking = await Order.findOne({ bookingToken: token })

            if (!existingBooking) {
                unique = true
            }
        }
        return token
    } catch (err) {
        console.log("booking no generation err", err)
        throw new ApiError(500, "Something went wrong while generating booking number")
    }
}

// Place order controller   @CUSTOMER
const placeOrder = asyncHandler(async (req, res) => {
    const { resid } = req.params
    const { items, taxPrice, totalPrice, serviceCharge } = req.body

    if (items && items.length === 0) {
        throw new ApiError(400, "No items in order")
    }

    const orderNo = await generateOrderToken()
    const order = await Order.create({
        user: req.user?._id,
        restaurantId: resid,
        orderNo,
        items: items.map((item) => ({
            ...item,
            menu: item.menu,
        })),
        taxPrice,
        totalPrice,
        serviceCharge,
    })

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        resid,
        { $push: { orders: order._id } },
        { new: true,}
      );

    const placedOrder = await Order.findById(order._id)

    if (!placedOrder) {
        throw new ApiError(500, "Something went wrong while placing order")
    }

    if (!updatedRestaurant) {
        throw new ApiError(500, "Failed to associate order with the restaurant");
      }
    return res
        .status(200)
        .json(new ApiResponse(200, {placedOrder, updatedRestaurant}, "Order placed successfully"))

})

// Get Order           @USER only
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user?._id })

    if (!orders) {
        throw new ApiError(400, "No orders found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "Orders fetched successfully."))
})

// Get Order by ID           @USER only
const getOrderById = asyncHandler(async (req, res) => {
    const { orderid } = req.params
    const order = await Order.findById(orderid)

    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order fetched successfully."))
})

// Get All Orders           @ADMIN only
const getOrders = asyncHandler(async (req, res) => {
    console.log("Restaurant ID:", req.user?.restaurantId); // Log restaurantId
    const orders = await Order.find({ restaurantId: req.user?.restaurantId })
    console.log("Orders: ", orders)

    if (!orders && orders.length === 0) {
        throw new ApiError(404, "Order not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "Orders fetched successfully."))
})

// Add additional item           @USER Only
const addItem = asyncHandler(async (req, res) => {
    const { orderid } = req.params
    const { items } = req.body

    const order = await Order.findById(orderid)

    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    order.items.push(...items.map((item) => ({
        ...item,
        menu: item._id,
    })));

    order.totalPrice += items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (order.status === 'Served') {
        order.status = 'Pending'
    }

    await order.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order added successfully."))
})

// Update Order status           @ADMIN only
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderid } = req.params
    const { status } = req.body

    const order = await Order.findById(orderid)


    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    if (order.status === status) {
        throw new ApiError(402, `Order is already in${order.status}`)
    }

    order.status = status
    await order.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Status updated successfully."))
})

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const { orderid } = req.params;


    // Find and update the order's status
    const order = await Order.findById(orderid);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Set order properties to reflect payment
    order.isPaid = 'true'
    order.status = 'Paid'
    order.paidAt = Date.now()
    order.paymentMethod = 'PayPal'

    // Destructure payment result from request body
    const { id, status, update_time, email_address } = req.body;
    order.paymentResult = {
        id,
        status,
        update_time,
        email_address,
    };

    // Save the updated order
    const updatedOrder = await order.save({validateBeforeSave: false});
    console.log(updatedOrder)

    return res
        .status(200)
        .json(new ApiResponse(200, updatedOrder, "Order updated to Paid successfully."));
});

export {
    placeOrder,             // user
    getMyOrders,           // user
    addItem,             // user
    getOrders,            // restaurant owner
    updateOrderStatus,  // restaurant owner
    updateOrderToPaid,   // private
    getOrderById,        // user
}