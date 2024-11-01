import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import Login from './components/Loginc/LoginPage'
import Partner from './components/Partner/Partner'
import RestaurantTemplate from './components/Restaurant/Explore_restaurant_page/RestaurantTemplate'
import { ThemeProvider } from "@material-tailwind/react"
import { materialTheme } from './configs/theme.js'
import { ToastContainer } from 'react-toastify'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <ThemeProvider value={materialTheme}>
      <ToastContainer/>
      {showLogin ? <Login setShowLogin={setShowLogin}/> : null}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path='/' element={<Home/>} exact/>
          <Route path='/cart' element={<Cart/>} />
          <Route path='/order' element={<PlaceOrder/>} />
          <Route path='/partner' element={<Partner/>} />
          <Route path='/restaurant/:id' element={<RestaurantTemplate/>}/>
        </Routes>
      </div>
      <Footer/>
    </ThemeProvider>
  )
}

export default App