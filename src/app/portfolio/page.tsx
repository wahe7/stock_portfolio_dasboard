'use client';

import { useEffect, useState } from 'react';
import PortfolioTable from './PortfolioTable';
import Navbar from '@/components/navbar';
import { API } from '@/config';

export default function PortfolioPage() {
  const [stocks, setStocks] = useState([]);
  const [formData, setFormData] = useState({ name: '', quantity: '', price: '', exchange: '' });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchPortfolio = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const res = await fetch(`${API.PORTFOLIO}/${userId}`);
    const data = await res.json();
    setStocks(data.userPortfolio);
  };

  useEffect(() => {
    fetchPortfolio();

    // Optionally auto-refresh every 15 seconds
    const interval = setInterval(fetchPortfolio, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = parseInt(localStorage.getItem("userId") || "0");
  
    if (!userId || !formData.name || !formData.quantity || !formData.price) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);
    const res = await fetch(API.PORTFOLIO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          stockName: formData.name,
          stockExchange: formData.exchange,
          stockQuantity: parseInt(formData.quantity),
          stockPurchasePrice: parseFloat(formData.price)
        })
      });

    setLoading(false);
      setFormData({ name: '', quantity: '', price: '', exchange: '' });
      setShowForm(false);

    if (res.ok) {
      alert("Stock added successfully");
      fetchPortfolio();
    } else {
      const error = await res.json();
      alert(error.message || "Error adding stock");
    }
  };


  return (
    <div>
      <Navbar />
      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Your Portfolio</h1>
          <button
            onClick={() => setShowForm(prev => !prev)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            {showForm ? 'Cancel' : '➕ Add Stock'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleAddStock}
            className="mb-6 bg-white border border-gray-200 p-6 rounded-lg shadow-lg max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Stock</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-black">Stock Name</label>
              <input
                type="text"
                placeholder="e.g. HDFCBANK"
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-black">Exchange</label>
              <select
                className="w-full border border-gray-300 px-3 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={formData.exchange}
                onChange={e => setFormData({ ...formData, exchange: e.target.value })}
                required
              >
                <option value="">Select Exchange</option>
                <option value="NSE">NSE</option>
                <option value="BSE">BSE</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-black">Quantity</label>
              <input
                type="number"
                placeholder="e.g. 10"
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-black">Purchase Price</label>
              <input
                type="number"
                placeholder="e.g. 1800"
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? 'Adding...' : 'Add Stock'}
            </button>
          </form>
        )}

        <PortfolioTable stocks={stocks} fetchPortfolio={fetchPortfolio} />
      </main>
    </div>
  );
}
