import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';
import OfferSlider from '../../components/OfferSlider/OfferSlider';
import RestaurantCard from '../../components/Restaurant/restaurant_card/RestaurantCard';

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <Header />
      <OfferSlider />
      {/* Uncomment the lines below if you need to use these components */}
      {/* <ExploreMenu category={category} setCategory={setCategory} /> */}
      {/* <FoodDisplay category={category} /> */}
      <RestaurantCard />
      <AppDownload />
    </div>
  );
};

export default Home;
