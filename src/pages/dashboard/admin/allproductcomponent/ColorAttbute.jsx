import  { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getBaseUrl } from '@/utils/getBaseUrl';
const ColorAttribute = () => {
  const [colors, setColors] = useState([]);
  const [name, setName] = useState('');
  const [hexCode, setHexCode] = useState('#000000');
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

 

  // Fetch all colors
  const fetchColors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${getBaseUrl()}/api/colors/all`);
      if (!response.ok) throw new Error('Failed to fetch colors');
      
      const data = await response.json();
      setColors(data);
    //   toast.success('Colors loaded successfully');
    } catch (error) {
      toast.error('Error fetching colors: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new color
  const createColor = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${getBaseUrl()}/api/colors/create-color`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, hexCode }),
      });
      
      if (!response.ok) throw new Error('Failed to create color');
      
      await fetchColors();
      resetForm();
      toast.success('Color created successfully');
    } catch (error) {
      toast.error('Error creating color: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing color
  const updateColor = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${getBaseUrl()}/api/colors/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, hexCode }),
      });
      
      if (!response.ok) throw new Error('Failed to update color');
      
      await fetchColors();
      resetForm();
      toast.success('Color updated successfully');
    } catch (error) {
      toast.error('Error updating color: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a color
  const deleteColor = async (id) => {
   
    
    setIsLoading(true);
    try {
      const response = await fetch(`${getBaseUrl()}/api/colors/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete color');
      
      await fetchColors();
      toast.success('Color deleted successfully');
    } catch (error) {
      toast.error('Error deleting color: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up form for editing
  const startEdit = (color) => {
    setName(color.name);
    setHexCode(color.hexCode);
    setEditId(color._id);
  };

  // Reset the form
  const resetForm = () => {
    setName('');
    setHexCode('#000000');
    setEditId(null);
  };

  // Load colors on component mount
  useEffect(() => {
    fetchColors();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
   
      
      <h1 className="text-3xl font-bold text-center mb-8">Color Management</h1>
      
      {/* Color Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? 'Edit Color' : 'Add New Color'}
        </h2>
        
        <form onSubmit={editId ? updateColor : createColor} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Color Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Hex Code</label>
            <div className="flex items-center mt-1">
              <input
                type="color"
                value={hexCode}
                onChange={(e) => setHexCode(e.target.value)}
                className="h-10 w-10 border border-gray-300 rounded mr-2"
              />
              <input
                type="text"
                value={hexCode}
                onChange={(e) => setHexCode(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                pattern="^#([A-Fa-f0-9]{6})$"
                title="Hex code must be in format #RRGGBB"
                required
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : editId ? 'Update Color' : 'Add Color'}
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
      
      {/* Color List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-4">Color List</h2>

  {isLoading && <p className="text-center text-gray-500">Loading colors...</p>}

  {!isLoading && colors.length === 0 && (
    <p className="text-center text-gray-500">No colors found. Add some!</p>
  )}

  {!isLoading && colors.length > 0 && (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Hex Code</th>
            <th className="border px-4 py-2 text-left">Preview</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((color) => (
            <tr key={color._id} className="border-b">
              <td className="border px-4 py-2">{color.name}</td>
              <td className="border px-4 py-2">{color.hexCode}</td>
              <td className="border px-4 py-2">
                <div
                  className="h-6 w-12 rounded"
                  style={{ backgroundColor: color.hexCode }}
                ></div>
              </td>
              <td className="border px-4 py-2 flex space-x-2">
                <button
                  onClick={() => startEdit(color)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteColor(color._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

    </div>
  );
};

export default ColorAttribute;
