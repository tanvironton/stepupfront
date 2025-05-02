import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const CategoryAttribute = () => {
  const [categories, setCategories] = useState([]);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [discount, setDiscount] = useState(0);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = "http://localhost:5100/api/categories";

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}`);
      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      console.log("Fetched Categories:", data);

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Error fetching categories: " + error.message);
      setCategories([]); // Prevent undefined issue
    } finally {
      setIsLoading(false);
    }
  };

  // Create category
  const createCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}/create-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, value, discount }),
      });

      if (!response.ok) throw new Error("Failed to create category");

      await fetchCategories();
      resetForm();
      toast.success("Category created successfully");
    } catch (error) {
      toast.error("Error creating category: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update category
  const updateCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, value, discount }),
      });

      if (!response.ok) throw new Error("Failed to update category");

      await fetchCategories();
      resetForm();
      toast.success("Category updated successfully");
    } catch (error) {
      toast.error("Error updating category: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete category");

      await fetchCategories();
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Error deleting category: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Set form for editing
  const startEdit = (category) => {
    setLabel(category.label);
    setValue(category.value);
    setDiscount(category.discount);
    setEditId(category._id);
  };

  // Reset form
  const resetForm = () => {
    setLabel("");
    setValue("");
    setDiscount(0);
    setEditId(null);
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Category Management</h1>

      {/* Category Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Category" : "Add New Category"}
        </h2>

        <form onSubmit={editId ? updateCategory : createCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category Value</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
              max="100"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : editId ? "Update Category" : "Add Category"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Category Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Category List</h2>

        {isLoading && <p className="text-center text-gray-500">Loading categories...</p>}

        {!isLoading && categories.length === 0 && (
          <p className="text-center text-gray-500">No categories found. Add some!</p>
        )}

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Label</th>
              <th className="border p-2">Value</th>
              <th className="border p-2">Discount</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(categories) &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td className="border p-2">{category.label}</td>
                  <td className="border p-2">{category.value}</td>
                  <td className="border p-2">{category.discount}%</td>
                  <td className="border p-2 flex space-x-2">
                    <button onClick={() => startEdit(category)} className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </button>
                    <button onClick={() => deleteCategory(category._id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryAttribute;
