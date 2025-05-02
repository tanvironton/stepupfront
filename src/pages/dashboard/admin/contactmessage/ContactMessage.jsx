import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // For showing toast alerts
import { getBaseUrl } from '@/utils/getBaseUrl';

const ContactMessage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all contacts on component mount
  useEffect(() => {
    axios.get(`${getBaseUrl()}/api/contacts`)
      .then((response) => {
        setContacts(response.data); // Assuming the response contains the contact list
      })
      .catch((error) => {
        toast.error('Error fetching contacts');
        console.error(error);
      });
  }, []);

  // Handle delete message
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${getBaseUrl()}/api/contact/${id}`);
      setContacts(contacts.filter(contact => contact._id !== id)); // Remove deleted contact from list
      toast.success('Message deleted successfully');
    } catch (error) {
      toast.error('Error deleting message');
      console.error(error);
    }
  };

  // Handle view single message in modal
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Contact Messages Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id} className="border-b">
                <td className="px-6 py-4">{contact.name}</td>
                <td className="px-6 py-4">{contact.email}</td>
                <td className="px-6 py-4">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                    onClick={() => handleViewMessage(contact)}
                  >
                    View
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded"
                    onClick={() => handleDelete(contact._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing single message */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-1/2">
            <h2 className="text-2xl font-bold mb-4">Message Details</h2>
            <p><strong>Name:</strong> {selectedMessage.name}</p>
            <p><strong>Email:</strong> {selectedMessage.email}</p>
            <p><strong>Phone:</strong> {selectedMessage.phone}</p>
            <p><strong>Message:</strong> {selectedMessage.message}</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessage;

