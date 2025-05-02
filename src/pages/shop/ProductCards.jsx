/* eslint-disable react/prop-types */

import RatingStars from "../../components/RatingStars";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { priceDisplay } from "@/utils";

const ProductCards = ({ products }) => {
  const navigate = useNavigate();
  const [hoverStates, setHoverStates] = useState(
    Array(products.length).fill(false)
  );

  const handleMouseEnter = (index) => {
    setHoverStates((prev) =>
      prev.map((state, i) => (i === index ? true : state))
    );
  };

  const handleMouseLeave = (index) => {
    setHoverStates((prev) =>
      prev.map((state, i) => (i === index ? false : state))
    );
  };

  // console.log(products)
  const hanleAddToCart = (e, product) => {
    e.stopPropagation();
    navigate(`/shop/${product._id}`);
    //  dispatch(addToCart({ ...product }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.length > 0 ? (
        products.map((product, index) => (
          <Link className="block" key={index} to={`/shop/${product._id}`}>
            <div
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              className="product__card relative"
            >
              {product?.discount > 0 && (
                <div className="absolute top-0 left-0 z-20">
                  <span className="inline-block p-2 bg-black text-slate-100 font-bold w-16 rounded-full">
                    -{product?.discount}%
                  </span>
                </div>
              )}

              <div className="relative">
                <img
                  src={
                    hoverStates[index]
                      ? product?.gallery[1]
                        ? product?.gallery[1]
                        : product?.image
                      : product?.image
                  }
                  alt="Casual Pants for Women"
                  className="max-h-96 md:h-64 w-full object-cover hover:scale-105 transition-all duration-300"
                />
                <div className="hover:block absolute top-3 right-3">
                  <button onClick={(e) => hanleAddToCart(e, product)}>
                    <FontAwesomeIcon color="white" icon={faCartShopping} />
                  </button>
                </div>
              </div>
              <div className="product__card__content">
                <h4 className="text-left">{product?.name}</h4>
                <p className="flex items-center space-x-2 text-lg font-medium">
                  {product?.discount > 0 && (
                    <del className="text-slate-400">
                      &#x9F3;{product?.price}{" "}
                    </del>
                  )}{" "}
                  &nbsp;
                  {product?.discount === 0 && product?.salePrice && (
                    <del className="text-slate-400">
                      &#x9F3;{product?.price}{" "}
                    </del>
                  )}
                  <span className="text-gray-700">&#x9F3;</span>
                  {priceDisplay(
                    product?.discount,
                    product?.salePrice,
                    product?.discountedPrice
                  )}
                </p>
                <RatingStars rating={product?.rating} />
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div>No products found!</div>
      )}
    </div>
  );
};

export default ProductCards;
