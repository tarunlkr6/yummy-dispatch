"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";
import { useGetRestaurantDetailsQuery } from "../../../slices/restaurantApitSlice";
import {
  ChefHat,
  Star,
  Clock,
  Plus,
  Minus,
  Home,
  Menu as MenuIcon,
  Info,
  Gift,
  Users,
  MessageSquare,
  MapPin as LocationIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  IconButton,
  ThemeProvider,
  Input,
  Textarea,
  Carousel,
} from "@material-tailwind/react";

// Default data for menu items, special offers, chefs, and feedbacks
const defaultData = {
  menuItems: [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Classic tomato and mozzarella",
      price: 12.99,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Spaghetti Carbonara",
      description: "Creamy pasta with pancetta",
      price: 14.99,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Grilled Salmon",
      description: "Fresh salmon with lemon butter",
      price: 18.99,
      image: "/placeholder.svg?height=100&width=100",
    },
  ],
  specialOffers: [
    {
      id: 1,
      name: "Happy Hour",
      description: "50% off all drinks from 4-6 PM",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Family Sunday",
      description: "Kids eat free on Sundays",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Date Night Special",
      description: "3-course meal for two at $59.99",
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
  chefs: [
    {
      id: 1,
      name: "Chef John Doe",
      specialty: "Italian Cuisine",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "Chef Jane Smith",
      specialty: "French Pastry",
      image: "/placeholder.svg?height=200&width=200",
    },
  ],
  feedbacks: [
    {
      id: 1,
      name: "Alice Johnson",
      comment: "Absolutely loved the ambiance and the food!",
      rating: 5,
    },
    {
      id: 2,
      name: "Bob Williams",
      comment: "Great service and delicious meals. Will come back!",
      rating: 4,
    },
  ],
};

const navItems = [
  { id: "home", icon: Home },
  { id: "menu", icon: MenuIcon },
  { id: "about", icon: Info },
  { id: "offers", icon: Gift },
  { id: "chefs", icon: ChefHat },
  { id: "feedback", icon: MessageSquare },
  { id: "location", icon: LocationIcon },
];

export default function RestaurantTemplate() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetRestaurantDetailsQuery(id);

  // State for restaurant data
  const [restaurantData, setRestaurantData] = useState(null);

  // States for UI interaction
  const [cart, setCart] = useState({});
  const [activeSection, setActiveSection] = useState("home");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Fetch restaurant data on component mount
  useEffect(() => {
    if (data) {
      setRestaurantData({
        ...defaultData,
        restaurantInfo: {
          name: data.data.name,
          address: data.data.address,
          phone: data.data.phoneNumber,
          email: data.data.email,
          hours: `${data.data.openingTime} - ${data.data.closingTime}`,
          isOpen: data.data.isOpen,
          description: data.data.description,
          avatar: data.data.avatar,
        },
      });
    }
  }, [data]);
  console.log("restaurantData", restaurantData);

  // Cart management functions
  const addToCart = (item) => {
    setCart((prevCart) => ({
      ...prevCart,
      [item.id]: (prevCart[item.id] || 0) + 1,
    }));
  };

  const removeFromCart = (item) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[item.id] > 1) {
        newCart[item.id]--;
      } else {
        delete newCart[item.id];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [itemId, quantity]) => {
      const item = restaurantData?.menuItems.find(
        (item) => item.id === parseInt(itemId)
      );
      return sum + (item ? item.price * quantity : 0);
    }, 0);
  };

  // Navigation function
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Set up intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Animated text component
  const AnimatedText = ({ text }) => {
    const letters = Array.from(text);
    const container = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
      }),
    };
    const child = {
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      },
      hidden: {
        opacity: 0,
        x: 20,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      },
    };

    return (
      <motion.div
        style={{
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
        }}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {letters.map((letter, index) => (
          <motion.span key={index} variants={child}>
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  // Section component with animation
  const Section = ({ id, title, children }) => {
    const [ref, inView] = useInView({
      threshold: 0.5,
      triggerOnce: true,
    });
/** ------------------------------- id section -------------------------------------- */
    return (
      <section id={id} ref={ref} className="py-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {title && (
            <Typography
              variant="h2"
              className="text-3xl font-bold mb-8 text-center"
            >
              {title}
            </Typography>
          )}
          {children}
        </motion.div>
      </section>
    );
  };

  // Render loading state if data is not yet fetched
  if (isLoading || !restaurantData) {
    return (
      <div className="flex justify-center items-center">
        {<Spinner className="h-16 w-16 text-gray-900/50 " />}
      </div>
    );
  }

  if (error) {
    return <div>{toast.error("Error: ", error)}</div>;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white">
        {/* Floating navigation */}
        <nav className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50">
          <ul className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <IconButton
                    variant={activeSection === item.id ? "filled" : "outlined"}
                    className="rounded-full w-12 h-12 flex items-center justify-center"
                    color="blue"
                    onClick={() => scrollTo(item.id)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">
                      {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
                    </span>
                  </IconButton>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="container mx-auto px-4">
          <Link to="/" size="sm">
            <Button color="blue" className="mx-auto mt-2">
              Go back
            </Button>
          </Link>

          {/* Home Section */}
          <Section id="home" title="">
            <div
              className="text-center bg-cover bg-center h-screen flex flex-col justify-center items-center"
              style={{
                backgroundImage: `url(${restaurantData.restaurantInfo.avatar})`,
              }}
            >
              <div className="bg-black bg-opacity-50 p-8 rounded text-white">
                <AnimatedText
                  text={`Welcome to ${restaurantData.restaurantInfo.name}`}
                />
                <AnimatedText text="Experience Culinary Excellence" />
                <div className="mt-8 space-x-4">
                  <Button
                    onClick={() => scrollTo("menu")}
                    color="blue"
                    size="lg"
                    ripple={true}
                    className="px-6"
                  >
                    Our Menu
                  </Button>
                  <Button
                    variant="outlined"
                    color="blue"
                    size="lg"
                    ripple={true}
                    onClick={() => setIsBookingOpen(true)}
                    className="px-6"
                  >
                    Book a Table
                  </Button>
                </div>
              </div>
            </div>
          </Section>

          {/* Menu Section */}
          <Section id="menu" title="Our Menu">
            {/* TODO: Replace this with actual menu data from the backend when available */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {restaurantData.menuItems.map((item) => (
                <Card key={item.id} className="w-full">
                  <CardHeader>
                    <Typography variant="h5">{item.name}</Typography>
                    <Typography color="gray" className="mt-1">
                      {item.description}
                    </Typography>
                  </CardHeader>
                  <CardBody>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Typography variant="h6" color="blue-gray" className="mt-2">
                      ${item.price.toFixed(2)}
                    </Typography>
                  </CardBody>
                  <CardFooter className="flex justify-between">
                    <Button
                      onClick={() => addToCart(item)}
                      color="blue"
                      size="sm"
                      ripple={true}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                    {cart[item.id] && (
                      <div className="flex items-center">
                        <IconButton
                          variant="outlined"
                          color="blue"
                          size="sm"
                          onClick={() => removeFromCart(item)}
                        >
                          <Minus className="h-4 w-4" />
                        </IconButton>
                        <Typography className="mx-2">
                          {cart[item.id]}
                        </Typography>
                        <IconButton
                          variant="outlined"
                          color="blue"
                          size="sm"
                          onClick={() => addToCart(item)}
                        >
                          <Plus className="h-4 w-4" />
                        </IconButton>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-right">
              <Typography variant="h6">
                Total Items: {getTotalItems()}
              </Typography>
              <Typography variant="h5" color="blue">
                Total Price: ${getTotalPrice().toFixed(2)}
              </Typography>
            </div>
          </Section>

          {/* About Section */}
          <Section id="about" title="About Us">
            <Card>
              <CardBody>
                <Typography>
                  {restaurantData.restaurantInfo.description
                    ? restaurantData.restaurantInfo.description
                    : "Description not available"}
                </Typography>
              </CardBody>
            </Card>
          </Section>

          {/* Special Offers Section */}
          <Section id="offers" title="Special Offers">
            {/* TODO: Replace this with actual special offers data from the backend when available */}
            <Carousel
              className="rounded-xl"
              navigation={({ setActiveIndex, activeIndex, length }) => (
                <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                  {new Array(length).fill("").map((_, i) => (
                    <span
                      key={i}
                      className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                        activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                      }`}
                      onClick={() => setActiveIndex(i)}
                    />
                  ))}
                </div>
              )}
              prevArrow={({ handlePrev }) => (
                <IconButton
                  variant="text"
                  color="white"
                  size="lg"
                  onClick={handlePrev}
                  className="!absolute top-2/4 left-4 -translate-y-2/4"
                >
                  <ChevronLeft strokeWidth={2} className="w-6 h-6" />
                </IconButton>
              )}
              nextArrow={({ handleNext }) => (
                <IconButton
                  variant="text"
                  color="white"
                  size="lg"
                  onClick={handleNext}
                  className="!absolute top-2/4 !right-4 -translate-y-2/4"
                >
                  <ChevronRight strokeWidth={2} className="w-6 h-6" />
                </IconButton>
              )}
            >
              {restaurantData.specialOffers.map((offer) => (
                <div key={offer.id} className="relative h-full w-full">
                  <img
                    src={offer.image}
                    alt={offer.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/75">
                    <div className="w-3/4 text-center md:w-2/4">
                      <Typography
                        variant="h1"
                        color="white"
                        className="mb-4 text-3xl md:text-4xl lg:text-5xl"
                      >
                        {offer.name}
                      </Typography>
                      <Typography
                        variant="lead"
                        color="white"
                        className="mb-12 opacity-80"
                      >
                        {offer.description}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </Section>

          {/* Chefs Section */}
          <Section id="chefs" title="Our Chefs">
            {/* TODO: Replace this with actual chef data from the backend when available */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurantData.chefs.map((chef) => (
                <Card key={chef.id}>
                  <CardHeader>
                    <Typography variant="h5">{chef.name}</Typography>
                    <Typography color="gray">{chef.specialty}</Typography>
                  </CardHeader>
                  <CardBody className="flex items-center">
                    <img
                      src={chef.image}
                      alt={chef.name}
                      className="w-32 h-32 rounded-full mr-4"
                    />
                    <div>
                      <ChefHat className="w-6 h-6 mb-2 text-blue-500" />
                      <Typography>Years of Experience: 10+</Typography>
                      <Typography>Signature Dish: To be announced</Typography>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Section>

          {/* Feedback Section */}
          <Section id="feedback" title="Customer Feedback">
            {/* TODO: Replace this with actual customer feedback data from the backend when available */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurantData.feedbacks.map((feedback) => (
                <Card key={feedback.id}>
                  <CardHeader>
                    <Typography variant="h5">{feedback.name}</Typography>
                    <div className="flex">
                      {[...Array(feedback.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Typography>{feedback.comment}</Typography>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Section>

          {/* Location Section */}
          <Section id="location" title="Our Location">
            <Card>
              <CardBody className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 mb-4 md:mb-0 md:mr-4">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Restaurant Location"
                    className="w-full h-64 object-cover rounded-md"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Typography variant="h5" className="mb-2">
                    Visit Us
                  </Typography>
                  <Typography className="flex items-center mb-2">
                    <LocationIcon className="w-5 h-5 mr-2 text-blue-500" />
                    {restaurantData.restaurantInfo.address}
                  </Typography>
                  <Typography className="flex items-center mb-2">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    {restaurantData.restaurantInfo.hours}
                  </Typography>
                  <Typography className="flex items-center mb-2">
                    {restaurantData.restaurantInfo.isOpen ? (
                      <span className="text-green-500 font-bold">Open Now</span>
                    ) : (
                      <span className="text-red-500 font-bold">Closed</span>
                    )}
                  </Typography>
                </div>
              </CardBody>
            </Card>
          </Section>
        </main>

        {/* Book a Table Dialog */}
        <Dialog open={isBookingOpen} handler={setIsBookingOpen} size="md">
          <DialogHeader>
            <Typography variant="h5">Book a Table</Typography>
          </DialogHeader>
          <DialogBody divider>
            <form className="space-y-4">
              <div>
                <Typography variant="h6">Name</Typography>
                <Input
                  type="text"
                  placeholder="Your Name"
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
              </div>
              <div>
                <Typography variant="h6">Email</Typography>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
              </div>
              <div>
                <Typography variant="h6">Phone Number</Typography>
                <Input
                  type="tel"
                  placeholder="(123) 456-7890"
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
              </div>
              <div>
                <Typography variant="h6">Number of Guests</Typography>
                <Select label="Select number of guests">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <Option key={num} value={num.toString()}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <Typography variant="h6">Date</Typography>
                <Input
                  type="date"
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
              </div>
              <div>
                <Typography variant="h6">Time</Typography>
                <Input
                  type="time"
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
              </div>
              <div>
                <Typography variant="h6">Special Requests</Typography>
                <Textarea
                  placeholder="Any dietary requirements or special requests?"
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                />
              </div>
            </form>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => setIsBookingOpen(false)}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button
              variant="gradient"
              color="blue"
              onClick={() => setIsBookingOpen(false)}
              size="lg"
              ripple={true}
              className="px-6"
            >
              <span>Book Now</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
