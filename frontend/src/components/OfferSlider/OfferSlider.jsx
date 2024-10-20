import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // Import autoplay styles
import { Autoplay } from 'swiper/modules'

// Import required modules
import { Navigation, Pagination } from 'swiper/modules';

function OfferSlider() { 
    const { offer_list } = useContext(StoreContext);

    return (
        <div className='container mb-10'>
            <Swiper
                slidesPerView={3} // Corrected to use 3 slides
                spaceBetween={30}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Pagination, Navigation, Autoplay]}
                className="mySwiper"

                autoplay={{
                    delay: 1500,
                    disableOnInteraction: false,
                }}
            >
                    <SwiperSlide className="offer-card"> 
                        <img src={offer_list.offer_card_1} />
                    </SwiperSlide>

                    <SwiperSlide className="offer-card"> 
                        <img src={offer_list.offer_card_2} />
                    </SwiperSlide>

                    <SwiperSlide className="offer-card"> 
                        <img src={offer_list.offer_card_3} />
                    </SwiperSlide>

                    <SwiperSlide className="offer-card"> 
                        <img src={offer_list.offer_card_4} />
                    </SwiperSlide>

                    <SwiperSlide className="offer-card"> 
                        <img src={offer_list.offer_card_5} />
                    </SwiperSlide>

                    <SwiperSlide className="offer-card"> 
                        <img src={offer_list.offer_card_6} />
                    </SwiperSlide>

                    <SwiperSlide className="offer-card"> 
                        <img src={offer_list.offer_card_7} />
                    </SwiperSlide>
            </Swiper>
        </div>
    );
}

export default OfferSlider;
