import React, { useState, useEffect } from 'react';
import { IconButton } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { offer_list } from '../../assets/assets';

// Simulating an API call to fetch offers, throwing an error for demonstration purposes
const fetchOffers = async () => {
  throw new Error('Failed to fetch offers');
};

export default function OfferSlider() {
  // State hooks for managing the offers, the active slide index, loading state, and error state
  const [offers, setOffers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to load offers, attempting to fetch from API and falling back to local data on failure
    const loadOffers = async () => {
      try {
        setIsLoading(true); // Set loading state to true before fetching
        const fetchedOffers = await fetchOffers(); // Attempt API call
        setOffers(fetchedOffers); // Set offers if API call is successful
      } catch (error) {
        // Handle fetch failure by logging error and using local data as fallback
        console.error('Failed to fetch from backend, using local data', error);
        setError(error); // Set error state

        // Convert `offer_list` entries to an array and filter out any undefined values
        const localOffers = Object.entries(offer_list)
          .filter(([key, value]) => value !== undefined)
          .map(([key, value]) => ({
            id: key,
            imageUrl: value,
          }));
        
        setOffers(localOffers); // Set offers from local data
      } finally {
        setIsLoading(false); // Reset loading state after attempt
      }
    };
    loadOffers(); // Call the function when component mounts
  }, []);

  // Variables for total number of slides and settings for how many slides to show/scroll at once
  const totalSlides = offers.length;
  const slidesToShow = Math.min(3, totalSlides); // Display up to 3 slides or fewer if less available
  const slidesToScroll = 1;

  // Function to move to the next slide
  const nextSlide = () => {
    setActiveIndex((current) => (current + slidesToScroll) % totalSlides);
  };

  // Function to move to the previous slide
  const prevSlide = () => {
    setActiveIndex((current) => (current - slidesToScroll + totalSlides) % totalSlides);
  };

  // Auto-scroll effect that sets an interval to move to the next slide every 3 seconds
  useEffect(() => {
    if (totalSlides > 0) {
      const interval = setInterval(nextSlide, 3000);
      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [totalSlides]);

  // Function to get the currently visible slides based on activeIndex and slidesToShow
  const getVisibleSlides = () => {
    let visibleSlides = [];
    for (let i = 0; i < slidesToShow; i++) {
      const index = (activeIndex + i) % totalSlides;
      visibleSlides.push(offers[index]); // Add slides based on calculated index
    }
    return visibleSlides;
  };

  // Display loading message while data is being fetched
  if (isLoading) {
    return <div>Loading offers...</div>;
  }

  // Display error message if an error occurred and there are no offers to show
  if (error && offers.length === 0) {
    return <div>Error loading offers. Please try again later.</div>;
  }

  // Display a message if there are no offers available to show
  if (offers.length === 0) {
    return <div>No offers available at the moment.</div>;
  }

  // Main component rendering the offer slider with navigation buttons and slides
  return (
    <div className="relative w-full overflow-hidden">
      {/* Container for visible slides with smooth transition effect */}
      <div className="flex transition-transform duration-500 ease-in-out">
        {getVisibleSlides().map((offer) => (
          <div 
            key={offer.id} 
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-2"
          >
            <div className="max-w-[420px] max-h-[200px] mx-auto">
              {/* Image for each offer */}
              <img
                src={offer.imageUrl}
                alt={`Offer ${offer.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Conditional rendering for navigation buttons if total slides exceed slidesToShow */}
      {totalSlides > slidesToShow && (
        <>
          <div className="absolute inset-y-0 left-0 flex items-center">
            <IconButton
              variant="text"
              color="white"
              size="lg"
              onClick={prevSlide}
              className="rounded-full bg-white/20 text-white hover:bg-white/50 active:bg-white/20"
            >
              <ChevronLeftIcon strokeWidth={2} className="h-6 w-6" />
            </IconButton>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <IconButton
              variant="text"
              color="white"
              size="lg"
              onClick={nextSlide}
              className="rounded-full bg-white/20 text-white hover:bg-white/50 active:bg-white/20"
            >
              <ChevronRightIcon strokeWidth={2} className="h-6 w-6" />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
}
