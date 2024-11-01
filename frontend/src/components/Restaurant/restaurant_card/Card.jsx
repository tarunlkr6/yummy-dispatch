import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

function RestaurantCard({ _id, name, description, avatar, isOpen, openingTime, closingTime }) {
  return (
    <Card className="w-full max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <CardHeader floated={false} className="h-48">
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover object-center"
        />
      </CardHeader>
      <CardBody className="flex-1 flex flex-col">
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {name}
        </Typography>
        <Typography
          color={isOpen ? "green" : "red"}
          className="text-sm font-medium mb-2"
        >
          {isOpen ? "Open" : "Closed"}
        </Typography>
        <Typography color="gray" className="mb-2 text-sm">
          Hours: {openingTime} - {closingTime}
        </Typography>
        <Typography color="gray" className="text-sm line-clamp-3 overflow-hidden">
          {description}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0 flex justify-between">
        <Link to={`/restaurant/${_id}`} className="w-[48%]">
          <Button fullWidth>View</Button>
        </Link>
        <Link to="#" className="w-[48%]">
          <Button fullWidth>Menu</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default RestaurantCard;
