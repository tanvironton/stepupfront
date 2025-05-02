/* eslint-disable react/prop-types */
import React from 'react';
import ProductCard from "@/pages/home/ProductCard";
import { Link } from "react-router-dom";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import required modules
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

export default function SlickSlider({ data, categoryName }) {
  // Group products by category if categoryName is provided
  const groupByCategories = categoryName
    ? data.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {})
    : { all: data }; // If no categoryName, return all products as a single group

  const products = categoryName ? groupByCategories[categoryName] || [] : data;

  // Ensure that products are unique based on their _id
  const uniqueProducts = Array.from(
    new Set(products.map(item => item?._id))
  ).map(id => {
    return products.find(item => item?._id === id);
  }).filter(Boolean);

  return (
    <div className="product-slider-container py-6">
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          // when window width is >= 480px
          480: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          // when window width is >= 640px
          640: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 3,
            spaceBetween: 30
          },
          // when window width is >= 1024px
          1024: {
            slidesPerView: 4,
            spaceBetween: 30
          }
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="mySwiper"
      >
        {uniqueProducts && uniqueProducts.length > 0 ? (
          uniqueProducts.map((item) => (
            <SwiperSlide key={item._id} className="pb-12">
              <Link to={`/shop/${item._id}`} className="block">
                <ProductCard item={item} />
              </Link>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="text-center py-8">
              <p className="text-gray-500">No products available in this category.</p>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
}