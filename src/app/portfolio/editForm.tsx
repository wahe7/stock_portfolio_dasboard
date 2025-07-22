'use client';

import React from 'react';

interface EditFormProps {
  showEditForm: boolean;
  setShowEditForm: (value: boolean) => void;
  editFormData: {
    id: number;
    name: string;
    exchange: string;
    quantity: string;
    price: string;
  };
  setEditFormData: React.Dispatch<
    React.SetStateAction<{
      id: number;
      name: string;
      exchange: string;
      quantity: string;
      price: string;
    }>
  >;
  handleEditStock: (e: React.FormEvent) => void;
}

const EditForm: React.FC<EditFormProps> = ({
  showEditForm,
  setShowEditForm,
  editFormData,
  setEditFormData,
  handleEditStock,
}) => {
  if (!showEditForm) return null;

  return (
    <div className="bg-white border border-gray-300 p-4 rounded shadow-md w-full max-w-md">
      <h3 className="text-lg font-semibold mb-3">Edit Stock</h3>
      <form onSubmit={handleEditStock}>
        <div className="mb-3">
          <label className="block text-sm font-medium text-black mb-1">Stock Name</label>
          <input
            type="text"
            value={editFormData.name}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-black text-gray-700 mb-1">Exchange</label>
          <input
            type="text"
            value={editFormData.exchange}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-black mb-1">Quantity</label>
          <input
            type="number"
            value={editFormData.quantity}
            onChange={e =>
              setEditFormData({ ...editFormData, quantity: e.target.value })
            }
            required
            className="w-full border px-3 py-2 text-gray-700 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (₹)</label>
          <input
            type="number"
            value={editFormData.price}
            onChange={e =>
              setEditFormData({ ...editFormData, price: e.target.value })
            }
            required
            className="w-full border px-3 py-2 text-gray-700 rounded"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setShowEditForm(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
