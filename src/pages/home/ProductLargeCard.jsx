import React from "react";
import { Link } from "react-router-dom";

function ProductLargeCard({ title, description, image }) {
  return (
    <div className="shadow-md">
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 duration-300"
          src={image}
          alt={title}
        />
      </div>
      <div className="p-4 text-center">
        <div>
          <h3 className="uppercase text-2xl my-2">{title}</h3>
          <p>{description}</p>
        </div>
        <div className="mt-4">
          <Link to="/shop" className="uppercase text-xl">Shop now</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductLargeCard;
