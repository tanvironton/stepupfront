import { useNavigate } from 'react-router-dom';
import men_1 from "@/assets/images/men_1.webp";
import women from "@/assets/images/women_1.webp";
import accessories from "@/assets/images/accessories_1.webp";
import kid from "@/assets/images/kids_1.webp";

const categories = [
  {
    id: 1,
    categoryId: "67fdf14fe3dd0cdce6baa37e", // Replace with actual category ID from your API
    label: "men's",
    bgImage: men_1,
  },
  {
    id: 2,
    categoryId: "67fdf157e3dd0cdce6baa382", // Replace with actual category ID from your API
    label: "women",
    bgImage: women,
  },
  {
    id: 3,
    categoryId: "67fdf16ce3dd0cdce6baa38a", // Replace with actual category ID from your API
    label: "accessories",
    bgImage: accessories,
  },
  {
    id: 4,
    categoryId: "67fdf160e3dd0cdce6baa386", // Replace with actual category ID from your API
    label: "kids",
    bgImage: kid,
  },
];

function OurProducts() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    // Navigate to shop page and pass the category ID as a URL parameter
    navigate(`/shop?category=${categoryId}`);
  };

  return (
    <section className="p-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {categories?.map((item) => (
          <div 
            className="w-full cursor-pointer relative group overflow-hidden" 
            key={item?.id}
            onClick={() => handleCategoryClick(item.categoryId)}
          >
            <img 
              src={item?.bgImage} 
              alt={item?.label} 
              className="w-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-xl font-bold">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OurProducts;