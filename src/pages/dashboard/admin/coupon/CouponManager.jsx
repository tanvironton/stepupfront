import { useEffect, useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/utils/getBaseUrl";
import toast from "react-hot-toast";
export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    title: "",
    code: "",
    discountPercentage: "",
    startDate: "",
    endDate: ""
  });
  const [editId, setEditId] = useState(null);

  const fetchCoupons = async () => {
    const res = await axios.get(`${getBaseUrl()}/api/coupons/`);
    setCoupons(res.data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${getBaseUrl()}/api/coupons/${editId}`, form);
        setEditId(null);
        toast.success("Coupons Update done");
      } else {
        await axios.post(`${getBaseUrl()}/api/coupons/create`, form);
        toast.success("Coupons add done");
      }
      setForm({
        title: "",
        code: "",
        discountPercentage: "",
        startDate: "",
        endDate: ""
      });
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.error || "Error occurred");
    }
  };

  const handleDelete = async (id) => {
 
      await axios.delete(`${getBaseUrl()}/api/coupons/${id}`);
      fetchCoupons();
      toast.success("Coupons delete done");
  };

  const handleEdit = (coupon) => {
    setEditId(coupon._id);
    setForm({
      title: coupon.title,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      startDate: coupon.startDate.slice(0, 10),
      endDate: coupon.endDate.slice(0, 10)
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">{editId ? "Edit" : "Create"} Coupon</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="p-2 border rounded w-full" required />
          <input type="text" placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="p-2 border rounded w-full" required />
          <input type="number" placeholder="Discount (%)" value={form.discountPercentage} onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })} className="p-2 border rounded w-full" required />
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="p-2 border rounded w-full" required />
          <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="p-2 border rounded w-full" required />
          <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded transition">
            {editId ? "Update" : "Create"} Coupon
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">All Coupons</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 font-semibold text-gray-700">Title</th>
                <th className="p-3 font-semibold text-gray-700">Code</th>
                <th className="p-3 font-semibold text-gray-700">Discount</th>
                <th className="p-3 font-semibold text-gray-700">Start</th>
                <th className="p-3 font-semibold text-gray-700">End</th>
                <th className="p-3 font-semibold text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c, idx) => (
                <tr key={c._id} className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="p-3">{c.title}</td>
                  <td className="p-3">{c.code}</td>
                  <td className="p-3">{c.discountPercentage}%</td>
                  <td className="p-3">{new Date(c.startDate).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(c.endDate).toLocaleDateString()}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button onClick={() => handleEdit(c)} className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white transition">Edit</button>
                    <button onClick={() => handleDelete(c._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white transition">Delete</button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">No coupons found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
