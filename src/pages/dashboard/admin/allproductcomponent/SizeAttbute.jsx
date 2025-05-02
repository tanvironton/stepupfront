import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";
import { getBaseUrl } from '@/utils/getBaseUrl';
const SizeAttribute = () => {
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newSize, setNewSize] = useState({ name: '', value: '' });
    const [editingId, setEditingId] = useState(null);
    const [editingSize, setEditingSize] = useState({ name: '', value: '' });
   
    const itemsPerPage = 10;
    
    // Fetch sizes from API
    const fetchSizes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${getBaseUrl()}/api/sizes/`);
            setSizes(response.data);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch sizes');
            toast.error('Failed to fetch sizes',err);
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSizes();
    }, []);
    
    // Create new size
    const handleCreateSize = async (e) => {
        e.preventDefault();
        if (!newSize.name.trim() || !newSize.value.trim()) return;
        
        try {
            await axios.post(`${getBaseUrl()}/api/sizes/create-size`, newSize);
            setNewSize({ name: '', value: '' });
            fetchSizes(); // Refresh the list
            toast.success('Size created successfully!');
        } catch (err) {
            setError('Failed to create size');
            toast.error('Failed to create size',err);
        }
    };
    
    // Delete size
    const handleDeleteSize = async (id) => {
        try {
            await axios.delete(`${getBaseUrl()}/api/sizes/${id}`);
            fetchSizes(); // Refresh the list
            toast.success('Size deleted successfully!');
        } catch (err) {
            setError('Failed to delete size');
            toast.error('Failed to delete size',err);
        }
    };
    
    // Start editing a size
    const startEditing = (id, size) => {
        setEditingId(id);
        setEditingSize({ name: size.name, value: size.value });
    };
    
    // Cancel editing
    const cancelEditing = () => {
        setEditingId(null);
        setEditingSize({ name: '', value: '' });
    };
    
    // Update size
    const handleUpdateSize = async (id) => {
        if (!editingSize.name.trim() || !editingSize.value.trim()) return;
        
        try {
            await axios.put(`${getBaseUrl()}/api/sizes/${id}`, editingSize);
            setEditingId(null);
            setEditingSize({ name: '', value: '' });
            fetchSizes(); // Refresh the list
            toast.success('Size updated successfully!');
        } catch (err) {
            setError('Failed to update size');
            toast.error('Failed to update size',err);
        }
    };
    
    // Handle form input changes for creating new size
    const handleNewSizeChange = (e) => {
        const { name, value } = e.target;
        setNewSize(prev => ({ ...prev, [name]: value }));
    };
    
    // Handle form input changes for editing size
    const handleEditSizeChange = (e) => {
        const { name, value } = e.target;
        setEditingSize(prev => ({ ...prev, [name]: value }));
    };
    
    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sizes.slice(indexOfFirstItem, indexOfLastItem);
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    return (
        <div className="container mx-auto p-4">
            {/* <h1 className="text-2xl font-bold mb-6">Size Attributes Management</h1> */}
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                    <button className="float-right" onClick={() => setError(null)}>×</button>
                </div>
            )}
            
            {/* Create Size Form */}
            <div className="bg-white shadow-md rounded p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New Size</h2>
                <form onSubmit={handleCreateSize} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Size Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={newSize.name}
                                onChange={handleNewSizeChange}
                                placeholder="e.g., Small, Medium, Large"
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                                Size Value
                            </label>
                            <input
                                id="value"
                                name="value"
                                type="text"
                                value={newSize.value}
                                onChange={handleNewSizeChange}
                                placeholder="e.g., S, M, L"
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Add Size
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Sizes Table */}
            <div className="bg-white shadow-md rounded overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center">Loading...</td>
                            </tr>
                        ) : currentItems.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center">No sizes found</td>
                            </tr>
                        ) : (
                            currentItems.map((size, index) => (
                                <tr key={size._id || index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {indexOfFirstItem + index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingId === size._id ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={editingSize.name}
                                                onChange={handleEditSizeChange}
                                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-gray-900">{size.name}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingId === size._id ? (
                                            <input
                                                type="text"
                                                name="value"
                                                value={editingSize.value}
                                                onChange={handleEditSizeChange}
                                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-900">{size.value}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(size.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {editingId === size._id ? (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleUpdateSize(size._id)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => startEditing(size._id, size)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSize(size._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-3 flex justify-between items-center border-t">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                                <span className="font-medium">
                                    {indexOfLastItem > sizes.length ? sizes.length : indexOfLastItem}
                                </span>{" "}
                                of <span className="font-medium">{sizes.length}</span> results
                            </p>
                        </div>
                        <nav className="flex space-x-1">
                            <button
                                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded ${
                                    currentPage === 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Previous
                            </button>
                            {[...Array(totalPages).keys()].map(number => (
                                <button
                                    key={number + 1}
                                    onClick={() => paginate(number + 1)}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === number + 1
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    {number + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded ${
                                    currentPage === totalPages
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SizeAttribute;