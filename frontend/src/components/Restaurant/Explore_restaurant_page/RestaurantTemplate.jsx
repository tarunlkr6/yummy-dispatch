'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  MapPin, 
  ChefHat, 
  Star, 
  Clock, 
  Phone, 
  Mail, 
  Plus, 
  Minus, 
  Home, 
  Menu as MenuIcon, 
  Info, 
  Gift, 
  Users, 
  MessageSquare, 
  MapPin as LocationIcon, 
  Send, 
  X 
} from 'lucide-react'
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Textarea,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  IconButton,
  ThemeProvider
} from "@material-tailwind/react"

// Your existing data constants
const menuItems = [
  { id: 1, name: 'Margherita Pizza', description: 'Classic tomato and mozzarella', price: 12.99, image: '/placeholder.svg?height=100&width=100' },
  { id: 2, name: 'Spaghetti Carbonara', description: 'Creamy pasta with pancetta', price: 14.99, image: '/placeholder.svg?height=100&width=100' },
  { id: 3, name: 'Grilled Salmon', description: 'Fresh salmon with lemon butter', price: 18.99, image: '/placeholder.svg?height=100&width=100' },
  { id: 4, name: 'Caesar Salad', description: 'Crisp romaine with parmesan', price: 9.99, image: '/placeholder.svg?height=100&width=100' },
]

const specialOffers = [
  { id: 1, name: 'Happy Hour', description: '50% off all drinks from 4-6 PM', image: '/placeholder.svg?height=200&width=300' },
  { id: 2, name: 'Family Sunday', description: 'Kids eat free on Sundays', image: '/placeholder.svg?height=200&width=300' },
]

const chefs = [
  { id: 1, name: 'Chef John Doe', specialty: 'Italian Cuisine', image: '/placeholder.svg?height=200&width=200' },
  { id: 2, name: 'Chef Jane Smith', specialty: 'French Pastry', image: '/placeholder.svg?height=200&width=200' },
]

const feedbacks = [
  { id: 1, name: 'Alice Johnson', comment: 'Absolutely loved the ambiance and the food!', rating: 5 },
  { id: 2, name: 'Bob Williams', comment: 'Great service and delicious meals. Will come back!', rating: 4 },
]

const navItems = [
  { id: 'home', icon: Home },
  { id: 'menu', icon: MenuIcon },
  { id: 'about', icon: Info },
  { id: 'offers', icon: Gift },
  { id: 'chefs', icon: ChefHat },
  { id: 'feedback', icon: MessageSquare },
  { id: 'location', icon: LocationIcon },
  { id: 'contact', icon: Send },
]

export default function RestaurantTemplate() {
  const [cart, setCart] = useState({})
  const [activeSection, setActiveSection] = useState('home')
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  // Your existing helper functions
  const addToCart = (item) => {
    setCart((prevCart) => ({
      ...prevCart,
      [item.id]: (prevCart[item.id] || 0) + 1,
    }))
  }

  const removeFromCart = (item) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart }
      if (newCart[item.id] > 1) {
        newCart[item.id]--
      } else {
        delete newCart[item.id]
      }
      return newCart
    })
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  }

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [itemId, quantity]) => {
      const item = menuItems.find((item) => item.id === parseInt(itemId))
      return sum + item.price * quantity
    }, 0)
  }

  const scrollTo = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const AnimatedText = ({ text }) => {
    const letters = Array.from(text)
    const container = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
      }),
    }
    const child = {
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: 'spring',
          damping: 12,
          stiffness: 100,
        },
      },
      hidden: {
        opacity: 0,
        x: 20,
        transition: {
          type: 'spring',
          damping: 12,
          stiffness: 100,
        },
      },
    }

    return (
      <motion.div
        style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center' }}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {letters.map((letter, index) => (
          <motion.span key={index} variants={child}>
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.div>
    )
  }

  const Section = ({ id, title, children }) => {
    const [ref, inView] = useInView({
      threshold: 0.5,
      triggerOnce: true,
    })

    return (
      <section id={id} ref={ref} className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {title && (
            <Typography variant="h2" className="text-3xl font-bold mb-8 text-center">
              {title}
            </Typography>
          )}
          {children}
        </motion.div>
      </section>
    )
  }

  return (
    <ThemeProvider>
    <div className="min-h-screen bg-gray-100">
      <nav className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50">
        <ul className="flex flex-col space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <IconButton
                  variant={activeSection === item.id ? 'filled' : 'outlined'}
                  className="rounded-full w-12 h-12 flex items-center justify-center"
                  color="blue"
                  onClick={() => scrollTo(item.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{item.id.charAt(0).toUpperCase() + item.id.slice(1)}</span>
                </IconButton>
              </li>
            )
          })}
        </ul>
      </nav>

      <main className="container mx-auto px-6">
        <Section id="home" title="">
          <div className="text-center">
            <AnimatedText text="Welcome to Our Restaurant" />
            <AnimatedText text="Experience Culinary Excellence" />
            <div className="mt-8 space-x-4">
              <Button onClick={() => scrollTo('menu')} color="blue" size="lg" ripple={true} className="px-6">Our Menu</Button>
              <Button variant="outlined" color="blue" size="lg" ripple={true} onClick={() => setIsBookingOpen(true)} className="px-6">
                Book a Table
              </Button>
            </div>
          </div>
        </Section>

        <Section id="menu" title="Our Menu">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <Card key={item.id} className="w-full">
                <CardHeader>
                  <Typography variant="h5">{item.name}</Typography>
                  <Typography color="gray" className="mt-1">
                    {item.description}
                  </Typography>
                </CardHeader>
                <CardBody>
                  <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-md" />
                  <Typography variant="h6" color="blue-gray" className="mt-2">
                    ${item.price.toFixed(2)}
                  </Typography>
                </CardBody>
                <CardFooter className="flex justify-between">
                  <Button onClick={() => addToCart(item)} color="blue" size="sm" ripple={true}>
                    <Plus className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                  {cart[item.id] && (
                    <div className="flex items-center">
                      <IconButton variant="outlined" color="blue" size="sm" onClick={() => removeFromCart(item)}>
                        <Minus className="h-4 w-4" />
                      </IconButton>
                      <Typography className="mx-2">{cart[item.id]}</Typography>
                      <IconButton variant="outlined" color="blue" size="sm" onClick={() => addToCart(item)}>
                        <Plus className="h-4 w-4" />
                      </IconButton>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-right">
            <Typography variant="h6">Total Items: {getTotalItems()}</Typography>
            <Typography variant="h5" color="blue">Total Price: ${getTotalPrice().toFixed(2)}</Typography>
          </div>
        </Section>

        <Section id="about" title="About Us">
          <Card>
            <CardBody>
              <Typography>
                Welcome to our restaurant, where culinary excellence meets warm hospitality. Our passion for food and
                dedication to quality ingredients shine through in every dish we serve. With a team of skilled chefs and
                attentive staff, we strive to create memorable dining experiences for our guests.
              </Typography>
              <Typography className="mt-4">
                Our menu is a celebration of both local and international flavors, carefully crafted to satisfy diverse
                palates. We believe in supporting local farmers and producers, ensuring that our ingredients are always
                fresh and of the highest quality.
              </Typography>
              <Typography className="mt-4">
                Whether you're joining us for a romantic dinner, a family celebration, or a casual meal with friends,
                we're committed to providing you with exceptional food and service in a welcoming atmosphere.
              </Typography>
            </CardBody>
          </Card>
        </Section>

        <Section id="offers" title="Special Offers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialOffers.map((offer) => (
              <Card key={offer.id}>
                <CardHeader>
                  <Typography variant="h5">{offer.name}</Typography>
                </CardHeader>
                <CardBody>
                  <img src={offer.image} alt={offer.name} className="w-full h-48 object-cover rounded-md" />
                  <Typography className="mt-4">{offer.description}</Typography>
                </CardBody>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="chefs" title="Our Chefs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chefs.map((chef) => (
              <Card key={chef.id}>
                <CardHeader>
                  <Typography variant="h5">{chef.name}</Typography>
                  <Typography color="gray">{chef.specialty}</Typography>
                </CardHeader>
                <CardBody className="flex items-center">
                  <img src={chef.image} alt={chef.name} className="w-32 h-32 rounded-full mr-4" />
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

        <Section id="feedback" title="Customer Feedback">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader>
                  <Typography variant="h5">{feedback.name}</Typography>
                  <div className="flex">
                    {[...Array(feedback.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
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
                <Typography variant="h5" className="mb-2">Visit Us</Typography>
                <Typography className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                  123 Gourmet Street, Foodie City, FC 12345
                </Typography>
                <Typography className="flex items-center mb-2">
                  <Phone className="w-5 h-5 mr-2 text-blue-500" />
                  (555) 123-4567
                </Typography>
                <Typography className="flex items-center mb-2">
                  <Mail className="w-5 h-5 mr-2 text-blue-500" />
                  info@ourrestaurant.com
                </Typography>
                <Typography className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Mon-Sat: 11AM-10PM, Sun: 12PM-9PM
                </Typography>
              </div>
            </CardBody>
          </Card>
        </Section>
      </main>

      <Dialog open={isBookingOpen} handler={setIsBookingOpen} size="md">
        <DialogHeader>
          <Typography variant="h5">Book a Table</Typography>
        </DialogHeader>
        <DialogBody divider>
          <form className="space-y-4">
            <div>
              <Typography variant="h6">Name</Typography>
              <Input type="text" placeholder="Your Name" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" labelProps={{
                className: "hidden",
              }} containerProps={{ className: "min-w-[100px]" }}/>
            </div>
            <div>
              <Typography variant="h6">Email</Typography>
              <Input type="email" placeholder="your@email.com" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" labelProps={{
                className: "hidden",
              }} containerProps={{ className: "min-w-[100px]" }}/>
            </div>
            <div>
              <Typography variant="h6">Phone Number</Typography>
              <Input type="tel" placeholder="(123) 456-7890" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" labelProps={{
                className: "hidden",
              }} containerProps={{ className: "min-w-[100px]" }}/>
            </div>
            <div>
              <Typography variant="h6">Number of Guests</Typography>
              <Select label="Select number of guests">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <Option key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <Typography variant="h6">Date</Typography>
              <Input type="date" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" labelProps={{
                className: "hidden",
              }} containerProps={{ className: "min-w-[100px]" }}/>
            </div>
            <div>
              <Typography variant="h6">Time</Typography>
              <Input type="time" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" labelProps={{
                className: "hidden",
              }} containerProps={{ className: "min-w-[100px]" }}/>
            </div>
            <div>
              <Typography variant="h6">Special Requests</Typography>
              <Textarea placeholder="Any dietary requirements or special requests?" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"/>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setIsBookingOpen(false)} className="mr-1">
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="blue" onClick={() => setIsBookingOpen(false)} size="lg" ripple={true} className="px-6">
            <span>Book Now</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
    </ThemeProvider>
  )
}