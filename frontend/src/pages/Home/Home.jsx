import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import AppDownload from '../../components/AppDownload/AppDownload';
import OfferSlider from '../../components/OfferSlider/OfferSlider';
import RestaurantCard from '../../components/Restaurant/restaurant_card/RestaurantCard';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [category, setCategory] = useState("All");
  const location = useLocation();

  // Extract the keyword from the query string
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';

  return (
    <div>
      <Header />
      <OfferSlider />
      {/* Uncomment the lines below if you need to use these components */}
      {/* <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />  */}
      <RestaurantCard keyword={keyword}/>
      <AppDownload />
    </div>
  );
};

export default Home;
