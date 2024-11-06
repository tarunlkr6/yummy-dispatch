import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import MenuList from "../../Menulist/menuList";

function RestaurantCard({
  _id,
  name,
  description,
  avatar,
  isOpen,
  openingTime,
  closingTime,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700">
      <CardHeader floated={false} className="h-48 m-0 rounded-none">
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      </CardHeader>
      <CardBody className="flex-1 flex flex-col p-4">
        <Typography variant="h5" color="blue-gray" className="mb-2 font-semibold">
          {name}
        </Typography>
        <div className="flex items-center mb-2">
          <span className={`w-3 h-3 rounded-full mr-2 ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <Typography
            color={isOpen ? "green" : "red"}
            className="text-sm font-medium"
          >
            {isOpen ? "Open" : "Closed"}
          </Typography>
        </div>
        <Typography color="gray" className="mb-2 text-sm">
          Hours: <span className="font-medium">{openingTime} - {closingTime}</span>
        </Typography>
        <Typography
          color="gray"
          className="text-sm line-clamp-3 overflow-hidden flex-grow"
        >
          {description}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0 flex justify-between p-4">
        <Link to={`/restaurant/${_id}`} className="w-[48%]">
          <Button fullWidth className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300">View</Button>
        </Link>
        <Link to={`/${_id}/book-table`} className="w-[48%]">
          <Button fullWidth className="bg-green-500 hover:bg-green-600 transition-colors duration-300">Book Table</Button>
        </Link>
      </CardFooter>
      {/* <MenuList
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        restaurantId={_id}
      /> */}
    </Card>
  );
}

export default RestaurantCard;