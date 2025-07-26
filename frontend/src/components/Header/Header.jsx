import React from 'react';
import './Header.css';
import {assets} from '../../assets/assets'; // Import your video

const Header = () => {
    const textContent = [
    {
      title: "Discover Your Favourite Restaurant",
      subtitle: "Experience culinary excellence with every bite",
    },
    {
      title: "Fresh Ingredients, Bold Flavors",
      subtitle: "Crafted with passion by our master chefs",
    },
    {
      title: "Unforgettable Dining Experience",
      subtitle: "Where taste meets perfection",
    },
  ]
  
  return (
    <div className='header'>
      {/* Uncomment and adjust content as needed */}
      <div className="header-contents">
        <h2>Discover your favourite restaurant here</h2>
        <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our delicious meal at a time.</p>
        {/* <button>View Menu</button> */}
      </div>
      <video autoPlay muted loop id="myVideo" className="video-background">
        <source src={assets.burger} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Header;
