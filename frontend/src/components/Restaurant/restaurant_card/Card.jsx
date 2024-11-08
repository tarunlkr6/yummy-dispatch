import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

function RestaurantCard({
  _id,
  name,
  description,
  avatar,
  isOpen,
  openingTime,
  closingTime,
}) {
  const navigate = useNavigate();

  const onClickHandler = (id, event) => {
    event.stopPropagation(); // Prevents the event from bubbling to parent elements
    if (id) {
      navigate(`/restaurant/${id}/view`);
    }
  };

  return (
    <Card
      onClick={(event) => onClickHandler(_id, event)}
      className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700"
      role="button"
    >
      <CardHeader floated={false} className="h-48 m-0 rounded-none">
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      </CardHeader>
      <CardBody className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-center">
          <Typography variant="h4" color="blue-gray" className="font-semibold">
            {name}
          </Typography>
          <div className="flex items-center">
            <span
              className={`w-3 h-3 rounded-full mr-2 ${
                isOpen ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <Typography
              color={isOpen ? "green" : "red"}
              className="text-sm font-medium"
            >
              {isOpen ? "Open" : "Closed"}
            </Typography>
          </div>
        </div>

        <Typography color="gray" className="mb-2 text-sm">
          Hours:{" "}
          <span className="font-medium">
            {openingTime} - {closingTime}
          </span>
        </Typography>
        <Typography
          color="gray"
          className="text-sm line-clamp-3 overflow-hidden flex-grow"
        >
          {description}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0 flex justify-between p-4">
        <Link to={`/restaurant/${_id}/menu`} className="w-full">
          <button
            type="button"
            onClick={(event) => event.stopPropagation()} // Prevents parent click event
            className="w-full h-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 transition-colors duration-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            <box-icon
              name="qr-scan"
              animation="flashing"
              color="white"
            ></box-icon>
          </button>
        </Link>
        <Link to={`/${_id}/book-table`} className="w-full ml-2">
          <Button
            fullWidth
            onClick={(event) => event.stopPropagation()} // Prevents parent click event
            className="w-full h-full bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-300"
          >
            Book Table
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default RestaurantCard;