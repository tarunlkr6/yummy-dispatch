import React, { useState } from "react";
import { useBookTableMutation } from "../../../slices/bookTableApiSlice";
import {
  Button,
  Typography,
  Select,
  Option,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

const TableBooking = ({ isDarkMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookTable, { isLoading }] = useBookTableMutation();
  
  const [formData, setFormData] = useState({
    name: "",
    reservationDate: "",
    reservationTime: "",
    numGuests: "",
    specialRequests: "",
    contactPhone: "",
    contactEmail: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target ? event.target : event;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const bookTableHandler = async (e) => {
    e.preventDefault();
    try {
      const bookResponse = await bookTable({ id, ...formData }).unwrap();
      toast.success("Table booked successfully!");
      // Reset form fields
      setFormData({
        name: "",
        reservationDate: "",
        reservationTime: "",
        numGuests: "",
        specialRequests: "",
        contactPhone: "",
        contactEmail: "",
      });
      navigate(`/table/details`);
    } catch (error) {
      console.error("Booking error:", error);
      if (error.status === "PARSING_ERROR" && error.originalStatus === 500) {
        if (error.data.includes("E11000 duplicate key error")) {
          toast.error(
            "You already have a booking for this date. Please choose a different date."
          );
        } else if (error.data.includes("Cast to date failed")) {
          toast.error("Invalid date format. Please use DD/MM/YYYY format.");
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      } else {
        toast.error(
          error.data?.message || "Failed to book the table. Please try again."
        );
      }
    }
  };
  
  return (
    <>
      <div className="mb-5">
        <Link to="/">
          <Button size="medium" variant="outlined" className="mx-auto mt-4">
            Go back
          </Button>
        </Link>
        </div>
        <div
          className={`max-w-md mx-auto p-6 shadow-lg border rounded-lg sm:p-8 md:max-w-lg`}
        >
          <Typography
            variant="h4"
            className={`mb-6 text-center font-bold ${
              isDarkMode ? "text-white" : "text-indigo-900"
            }`}
          >
            Book Your Table
          </Typography>
          <form className="space-y-6" onSubmit={bookTableHandler}>
            {/* Name field */}
            <div>
              <Typography
                variant="h6"
                className={`${isDarkMode ? "text-white" : "text-indigo-900"}`}
              >
                Name
              </Typography>
              <Input
                onChange={handleInputChange}
                type="text"
                placeholder="Your Name"
                name="name"
                value={formData.name}
                className={`!border !border-indigo-300 ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-indigo-900"
                } shadow-md focus:!border-indigo-500`}
                containerProps={{ className: "min-w-[100px]" }}
                required
              />
            </div>

            {/* Email field */}
            <div>
              <Typography
                variant="h6"
                className={`${isDarkMode ? "text-white" : "text-indigo-900"}`}
              >
                Email
              </Typography>
              <Input
                name="contactEmail"
                onChange={handleInputChange}
                value={formData.contactEmail}
                type="email"
                placeholder="your@email.com"
                className={`!border !border-indigo-300 ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-indigo-900"
                } shadow-md focus:!border-indigo-500`}
                containerProps={{ className: "min-w-[100px]" }}
                required
              />
            </div>

            {/* Phone Number field */}
            <div>
              <Typography
                variant="h6"
                className={`${isDarkMode ? "text-white" : "text-indigo-900"}`}
              >
                Phone Number
              </Typography>
              <Input
                name="contactPhone"
                onChange={handleInputChange}
                value={formData.contactPhone}
                type="tel"
                placeholder="+91 012-3456789"
                className={`!border !border-indigo-300 ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-indigo-900"
                } shadow-md focus:!border-indigo-500`}
                containerProps={{ className: "min-w-[100px]" }}
                required
              />
            </div>

            {/* Number of Guests field */}
            <Select
              name="numGuests"
              label="Select number of guests"
              className={
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-white text-indigo-900"
              }
              value={formData.numGuests}
              onChange={(value) =>
                handleInputChange({ name: "numGuests", value })
              }
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <Option key={num} value={num.toString()}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </Option>
              ))}
            </Select>

            {/* Date field */}
            <div>
              <Typography
                variant="h6"
                className={`${isDarkMode ? "text-white" : "text-indigo-900"}`}
              >
                Date
              </Typography>
              <Input
                placeholder="DD/MM/YYYY"
                name="reservationDate"
                onChange={handleInputChange}
                value={formData.reservationDate}
                type="date"
                className={`!border !border-indigo-300 ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-indigo-900"
                } shadow-md focus:!border-indigo-500`}
                containerProps={{ className: "min-w-[100px]" }}
                required
              />
            </div>

            {/* Time Slot field */}
            <Select
              name="reservationTime"
              onChange={(value) =>
                handleInputChange({
                  target: { name: "reservationTime", value },
                })
              }
              value={formData.reservationTime}
              className={
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-white text-indigo-900"
              }
              label="Select time slot"
              required
            >
              {[
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "19:00",
                "20:00",
                "21:00",
              ].map((time) => (
                <Option key={time} value={time}>
                  {time}
                </Option>
              ))}
            </Select>

            {/* Special Requests field */}
            <div>
              <Typography
                variant="h6"
                className={`${isDarkMode ? "text-white" : "text-indigo-900"}`}
              >
                Special Requests
              </Typography>
              <Textarea
                name="specialRequests"
                onChange={handleInputChange}
                value={formData.specialRequests}
                placeholder="Any dietary requirements or special requests?"
                className={`!border !border-indigo-300 ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-indigo-900"
                } shadow-md focus:!border-indigo-500`}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="relative h-[50px] w-full overflow-hidden border border-indigo-500 bg-white px-3 text-indigo-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-indigo-500 before:transition-all before:duration-500 hover:text-white hover:shadow-indigo-500 hover:before:left-0 hover:before:w-full"
            >
              <span className="relative z-10">
                {isLoading ? "Booking..." : "Book Table"}
              </span>
            </button>
          </form>
        </div>

    </>
  );
};

export default TableBooking;
