import Loading from "@/components/Loading";
import { useState } from "react";

import { useFetchAllCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import CategoryDiscountModal from "./CategoryDiscountModal";

function CategoriesDiscountTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const {
    data: categoriesData = {},
    error,
    isLoading,
    refetch,
  } = useFetchAllCategoriesQuery();

  if (isLoading) return <Loading />;

  const categories = categoriesData?.data || {};

  const handleEdit = (item) => {
    // console.log(order)
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <section>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 border-b text-left">Name</th>
            <th className="py-3 px-4 border-b text-left">Discount</th>
            <th className="py-3 px-4 border-b text-left">Offer a discount</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((item) => (
            <tr key={item._id}>
              <td className="py-3 px-4 border-b">{item.label}</td>
              <td className="py-3 px-4 border-b">{item?.discount}%</td>{" "}
              <td className="py-3 px-4 border-b text-center">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-green-500 hover:underline"
                >
                  Set Discount
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Order Modal */}
      {selectedItem && (
        <CategoryDiscountModal
          type="category"
          refetch={refetch}
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}

export default CategoriesDiscountTable;
