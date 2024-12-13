import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateOrderMutation,
  useAddMoreItemOrderMutation,
} from "../../slices/orderApiSlice";
import { useGetMenuByRestaurantIdQuery } from "../../slices/menuApiSlice";
import {
  addToCart,
  clearAllCartItems,
  decrementQty,
  incrementQty,
} from "../../slices/cartSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverHandler,
  Card,
  CardBody,
  Typography,
  Input,
  Spinner,
} from "@material-tailwind/react";

export default function PlaceOrder() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const [menuData, setMenuData] = useState([]);
  const [createOrder, { isLoading: orderLoading }] = useCreateOrderMutation();
  const [addMoreItemOrder, { isLoading: addMoreItemLoading }] =
    useAddMoreItemOrderMutation();
  const { data, isLoading: menuLoading } = useGetMenuByRestaurantIdQuery(
    cart.restaurantId
  );
  const [showAddItemsButton, setShowAddItemsButton] = useState(false);
  const [newOrderItems, setNewOrderItems] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [showAddItemsPopover, setShowAddItemsPopover] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [orderData, setOrderData] = useState({
    name: "",
    tableNumber: "",
    items: [],
    totalPrice: 0,
    taxPrice: 0,
    serviceCharge: 0,
    restaurantId: "",
  });

  useEffect(() => {
    if (data) {
      setMenuData(
        data.data.map((item) => ({
          id: item._id,
          name: item.itemName,
          description: item.description,
          price: item.price,
          image: item.image[0]?.url || "",
          category: item.category,
          isVeg: item.isVeg,
          isAvailable: item.isAvailable,
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    setOrderData((prevData) => ({
      ...prevData,
      items: cartItems.map((item) => ({
        name: item.item.name,
        price: item.item.price,
        quantity: item.qty,
        menu: item.item.id,
      })),
      totalPrice: cart.totalPrice,
      taxPrice: cart.taxPrice,
      serviceCharge: cart.serviceCharge,
      restaurantId: cartItems[0]?.resId || "",
    }));
  }, [cartItems, cart]);

  useEffect(() => {
    const savedOrderPlaced = localStorage.getItem("orderPlaced");
    if (savedOrderPlaced) {
      setOrderPlaced(JSON.parse(savedOrderPlaced));
      setShowAddItemsButton(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addToCartHandler = useCallback(
    (item) => {
      dispatch(addToCart({ item, qty: 1, resId: cart.restaurantId }));
      setNewOrderItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === item.id);
        if (existingItem) {
          return prevItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          return [...prevItems, { ...item, quantity: 1 }];
        }
      });
    },
    [dispatch, cart.restaurantId]
  );

  const incrementQuantityHandler = (item) => {
    dispatch(incrementQty({ id: item.id }));
    setNewOrderItems((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decrementQuantityHandler = (item) => {
    dispatch(decrementQty({ id: item.id }));
    setNewOrderItems((prevItems) =>
      prevItems
        .map((i) =>
          i.id === item.id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const orderPayload = {
        ...orderData,
        items: cartItems.map((item) => ({
          name: item.item.name,
          price: item.item.price,
          quantity: item.qty,
          menu: item.item.id,
        })),
      };
      const res = await createOrder(orderPayload).unwrap();
      setOrderId(res.data.placedOrder._id);
      toast.success(`Order placed successfully!`);
      setOrderPlaced(true);
      setShowAddItemsButton(true);
      localStorage.setItem("orderPlaced", JSON.stringify(true));
    } catch (err) {
      console.error("Error placing order: ", err);
      toast.error(
        err.data?.message || "Failed to place order. Please try again."
      );
    }
  };

  const reOrderHandler = async (e) => {
    e.preventDefault();
    try {
      await addMoreItemOrder({
        orderId: String(orderId),
        items: newOrderItems,
      }).unwrap();
      toast.success("Additional items ordered successfully!");
      dispatch(clearAllCartItems());
      setNewOrderItems([]);
      setShowAddItemsPopover(false);
    } catch (err) {
      console.error("Error adding more items to order: ", err);
      toast.error(
        err.data?.message || "Failed to add more items. Please try again."
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/cart">
        <Button variant="outlined" className="mb-4">
          Go back
        </Button>
      </Link>
      <form className="grid md:grid-cols-2 gap-8">
        <Card className="w-full">
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Order Details
            </Typography>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Item Name
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Quantity
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((food, index) => (
                    <tr
                      key={food.item.id || index}
                      className="even:bg-blue-gray-50/50"
                    >
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {food.item.name}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {food.qty}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                label="Enter your name"
                name="name"
                value={orderData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                type="number"
                label="Table No."
                name="tableNumber"
                value={orderData.tableNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardBody>
        </Card>

        <Card className="w-full">
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Cart Total
            </Typography>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Typography color="blue-gray">Subtotal</Typography>
                <Typography color="blue-gray">${cart.totalPrice}</Typography>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <Typography color="blue-gray" className="font-bold">
                  Total
                </Typography>
                <Typography color="blue-gray" className="font-bold">
                  ${cart.totalPrice}
                </Typography>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {cartItems && (
                <Button
                  onClick={submitHandler}
                  className="w-full"
                  disabled={orderLoading || cartItems.length === 0}
                >
                  {orderLoading ? "Placing Order..." : "Place Order"}
                </Button>
              )}
              {showAddItemsButton && (
                <>
                  <Popover placement="bottom">
                    <PopoverHandler>
                      <Button
                        color="blue"
                        className="w-full"
                        disabled={cartItems.length === 0}
                      >
                        Add More Items
                      </Button>
                    </PopoverHandler>
                    <PopoverContent className="w-96">
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="mb-4"
                      >
                        Add More Items
                      </Typography>
                      {menuLoading ? (
                        <div className="flex justify-center">
                          <div className="flex justify-center items-center h-screen">
                            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6347]"></div>
                          </div>
                        </div>
                      ) : menuData.length > 0 ? (
                        <div className="space-y-4 max-h-60 overflow-y-auto">
                          {menuData.map((menuItem) => (
                            <div
                              key={menuItem.id}
                              className="flex justify-between items-center"
                            >
                              <Typography variant="small">
                                {menuItem.name}
                              </Typography>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  color="blue-gray"
                                  className="px-2 py-1 min-w-[36px]"
                                  onClick={() => addToCartHandler(menuItem)}
                                >
                                  Add
                                </Button>
                                <Button
                                  size="sm"
                                  color="blue-gray"
                                  className="px-2 py-1 min-w-[36px]"
                                  onClick={() =>
                                    decrementQuantityHandler(menuItem)
                                  }
                                >
                                  -
                                </Button>
                                <Typography variant="small">
                                  {newOrderItems.find(
                                    (item) => item.id === menuItem.id
                                  )?.quantity || 0}
                                </Typography>
                                <Button
                                  size="sm"
                                  color="blue-gray"
                                  className="px-2 py-1 min-w-[36px]"
                                  onClick={() =>
                                    incrementQuantityHandler(menuItem)
                                  }
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Typography color="red">
                          No menu items available.
                        </Typography>
                      )}
                      <Button
                        color="blue"
                        className="mt-4 w-full"
                        onClick={() => setShowAddItemsPopover(false)}
                      >
                        Done
                      </Button>
                    </PopoverContent>
                  </Popover>
                  <Button
                    onClick={reOrderHandler}
                    color="green"
                    className="w-full"
                    disabled={addMoreItemLoading || newOrderItems.length === 0}
                  >
                    {addMoreItemLoading ? "Ordering..." : "Reorder"}
                  </Button>
                </>
              )}
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
