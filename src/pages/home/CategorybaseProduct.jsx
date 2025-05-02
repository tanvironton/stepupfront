import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import ProductCard from "@/pages/home/ProductCard"; // Make sure to import ProductCard
import { Link } from 'react-router-dom';

const CategorybaseProduct = ({ data, category }) => {
    // Log the data to inspect the category field
    console.log("CategorybaseProduct data:", data);
    console.log("Selected category:", category);

    // Check if data is an array and filter products based on category
    const filteredProducts = Array.isArray(data)
        ? category
            ? data.filter((item) => {
                // Ensure item.category.value is a string before calling .toLowerCase()
                if (item.category && typeof item.category.value === 'string') {
                    return item.category.value.toLowerCase() === category.value.toLowerCase();
                } else {
                    console.log(`Invalid category value for item ${item._id}:`, item.category);
                    return false; // Filter out products with invalid category data
                }
            })
            : data // Show all products if no category selected
        : [];

    return (
        <div className="p-5">
            <h2  className="flex text-[20px] font-bold justify-center mb-6 bg-gray-100 p-2 rounded-lg">
             All Products
            </h2>
            
            {/* Display Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((item) => (
                        <ProductCard key={item._id} item={item} />
                    ))
                ) : (
                    <p>No products available in this category.</p>
                )}
                
            </div>
           <div className='mt-10 flex justify-center'> <Link to className='btn bg-black  mt-3'>show Now</Link></div>
        </div>
    );
};

// PropTypes Validation
CategorybaseProduct.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            category: PropTypes.shape({
                value: PropTypes.string.isRequired, // 'value' in category must be a string
                label: PropTypes.string.isRequired,
            }).isRequired,
            // Add any other properties that are part of your item object here, e.g.
            label: PropTypes.string,
            price: PropTypes.number,
        })
    ).isRequired,
    category: PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    }),
};

export default CategorybaseProduct;
