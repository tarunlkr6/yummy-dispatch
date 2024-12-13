import React, { useEffect, useState } from "react";
import { useCancelBookingMutation, useGetTableBookingDetailsQuery} from "../../../slices/bookTableApiSlice";
import { useSelector } from "react-redux";
import {
  Typography,
  Button,
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
  Spinner,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'

const TableBookingDetails = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo._id;
  const navigate = useNavigate()

  const { data, isLoading, error } = useGetTableBookingDetailsQuery(id);
  // console.log(data)
  const [ cancelBooking, {isLoading:cancelLoading } ] = useCancelBookingMutation()
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6347]"></div>
    </div>
      </div>
    );

  // Create a shallow copy of the array before sorting
  const sortedBookings = data?.data
    ? [...data.data].sort(
        (a, b) => new Date(b.reservationDate) - new Date(a.reservationDate)
      )
    : [];
  const filteredBookings = sortedBookings?.filter(
    (booking) =>
      booking.bookingToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(booking.reservationDate)
        .toLocaleDateString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.restaurantId?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleCancel = async(bookingId, restaurant) => {
    try {
        // console.log(`Cancelling booking ${bookingId}`);
        const resid = restaurant._id
        const bookingid = bookingId._id;
        await cancelBooking({resid,bookingid}).unwrap();
        toast.success("Booking cancelled")
        window. location. reload(false);
        navigate('/table/details')
      } catch (err) {
        toast.error("Cancellation error:", err);
      }
  };


  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "Pending":
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case "Cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div>
      {isLoading && <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6347]"></div>
    </div>}
      {error && <Typography color="black" className="text-center mt-4">
        <p className="w-full p-4 bg-red-400 text-start">{"Failed to fetch data... ^_^" ||error.message}</p>
       </Typography>
      }
      <div className="container mx-auto px-4 py-8">
          <Link to="/">
              <Button
              size="medium"
                variant="outlined"
                color="black"
                className="mx-auto mt-4"
              >
                Go back
              </Button>
            </Link>
        <Typography variant="h2" className="text-center mb-6">
          Your Bookings
        </Typography>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="w-full max-w-sm min-w-[200px]">
              <div className="relative flex items-center">
                  <Input
                  type="text"
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Search by date, token, or restaurant"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  />
              </div>
              </div>
          </div>
  
        <Card className="w-full overflow-x-auto">
          <CardHeader floated={false} shadow={false} className="rounded-none p-4">
            <Typography variant="h5" color="blue-gray">
              Booking List
            </Typography>
          </CardHeader>
          <CardBody className="px-4 py-2">
            <table className="w-full min-w-max text-left">
              <thead>
                <tr>
                  {[
                    "Booking ID",
                    "Restaurant",
                    "Date",
                    "Time",
                    "Status",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-2 text-center"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBookings?.map((booking, index) => {
                  const isLast = index === filteredBookings.length - 1;
                  const classes = isLast
                    ? "p-2"
                    : "p-2 border-b border-blue-gray-50";
  
                  return (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-100 transition duration-200 ease-in-out cursor-pointer"
                    >
                      <td className={`${classes} text-center`}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {booking.bookingToken}
                        </Typography>
                      </td>
                      <td className={`${classes} text-center`}>
                        <Popover placement="top">
                          <PopoverHandler>
                            <Button
                              color="black"
                              size="sm"
                              className="text-xs sm:text-sm rounded-full w-full hover:bg-gray-800 hover:text-white"
                              variant="outlined"
                            >
                              {booking.restaurantId?.name || "N/A"}
                            </Button>
                          </PopoverHandler>
                          <PopoverContent className="z-[999] w-72 p-4">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className="mb-2"
                            >
                              Restaurant Details
                            </Typography>
                            <div className="flex items-center gap-2 mb-1">
                              <MapPinIcon className="h-4 w-4 text-blue-gray-500" />
                              <Typography
                                variant="small"
                                color="gray"
                                className="font-normal"
                              >
                                {booking.restaurantId?.address}
                              </Typography>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <PhoneIcon className="h-4 w-4 text-blue-gray-500" />
                              <Typography
                                variant="small"
                                color="gray"
                                className="font-normal"
                              >
                                {booking.restaurantId?.phoneNumber}
                              </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <StarIcon className="h-4 w-4 text-yellow-700" />
                              <Typography
                                variant="small"
                                color="gray"
                                className="font-normal"
                              >
                                Rating: {booking.restaurantId?.rating}
                              </Typography>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td className={`${classes} text-center`}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {new Date(booking.reservationDate).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={`${classes} text-center`}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {booking.reservationTime}
                        </Typography>
                      </td>
                      <td className={`${classes} text-center`}>
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(booking.status)}
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {booking.status}
                          </Typography>
                        </div>
                      </td>
                      <td className={`${classes} text-center`}>
                        <div className="flex items-center justify-center gap-2">
                          {booking.status === 'Confirmed' || booking.status === 'Cancelled' ? <Button
                            color="red"
                            size="sm"
                            variant="gradient"
                            onClick={() => handleCancel(booking, booking.restaurantId)}
                            className="text-xs sm:text-sm"
                            disabled
                          >
                            Cancel
                          </Button> : <Button
                            color="red"
                            size="sm"
                            variant="gradient"
                            onClick={() => handleCancel(booking, booking.restaurantId)}
                            className="text-xs sm:text-sm"
                          >
                            {cancelLoading ? "Cancelling" : "Cancel"}
                          </Button>
                          }
                          <Popover placement="top">
                            <PopoverHandler>
                              <Button
                                color="black"
                                variant="filled"
                                size="sm"
                                className="text-xs sm:text-sm rounded-full"
                              >
                                <InformationCircleIcon className="h-5 w-5" />
                              </Button>
                            </PopoverHandler>
                            <PopoverContent className="z-[999] w-72 p-4">
                              <Typography
                                variant="h6"
                                color="blue-gray"
                                className="mb-2"
                              >
                                Booking Details
                              </Typography>
                              <div className="space-y-2">
                                <div>
                                  <Typography
                                    variant="small"
                                    color="gray"
                                    className="font-semibold"
                                  >
                                    Name
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {booking.name}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography
                                    variant="small"
                                    color="gray"
                                    className="font-semibold"
                                  >
                                    Number of Guests
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {booking.numGuests}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography
                                    variant="small"
                                    color="gray"
                                    className="font-semibold"
                                  >
                                    Contact Email
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {booking.contactEmail}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography
                                    variant="small"
                                    color="gray"
                                    className="font-semibold"
                                  >
                                    Contact Phone
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {booking.contactPhone}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography
                                    variant="small"
                                    color="gray"
                                    className="font-semibold"
                                  >
                                    Special Requests
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {booking.specialRequests || "None"}
                                  </Typography>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default TableBookingDetails;
