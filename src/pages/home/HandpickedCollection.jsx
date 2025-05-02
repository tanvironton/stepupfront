/* eslint-disable react/prop-types */
import ProductLargeCard from "./ProductLargeCard";
import northstar from "@/assets/Promo-Banner-1.png";
function HandpickedCollection({ title, grid }) {
  const data = [
    {
      "id": 1,
      "title": "North Star Curated Sneakers",
      "description": "Here goes the trendiest lifestyle sneakers to redefine all your moves! Ensuring a look brimming with coolness.",
      "image": northstar // Use the imported image here
    },
    {
      "id": 2,
      "title": "North Star Curated Sneakers",
      "description": "Here goes the trendiest lifestyle sneakers to redefine all your moves! Ensuring a look brimming with coolness.",
      "image": northstar // Use the imported image here
    },
    {
      "id": 3,
      "title": "North Star Curated Sneakers",
      "description": "Here goes the trendiest lifestyle sneakers to redefine all your moves! Ensuring a look brimming with coolness.",
      "image": northstar // Use the imported image here
    }
  ];

  const gridClass =
    {
      1: "md:grid-cols-1",
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
      5: "md:grid-cols-5",
      6: "md:grid-cols-6",
    }[grid] || "grid-cols-1";

  return (
    <section className="p-5">
      <div className="mb-5">
        <h2 className="text-3xl font-bold text-center my-4">{title}</h2>
      </div>
      <div className={`grid grid-cols-1 ${gridClass} gap-5`}>
        {data.map((product) => (
          <ProductLargeCard
            key={product.id}
            title={product.title}
            description={product.description}
            image={product.image}
          />
        ))}
      </div>
    </section>
  );
}

export default HandpickedCollection;
