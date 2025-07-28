'use client';

import React, { useState } from 'react';
import SectorPieChart from './sectorPieChart';
import EditForm from './editForm';
import { API } from '@/config';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

type Stock = {
  id: number;
  name: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  cmp: number;
  presentValue: number;
  gainLoss: number;
  sector: string;
  pe: number;
  recommendation: string;
};

type Props = {
  stocks: Stock[];
  fetchPortfolio: () => void;
};

const PortfolioTable: React.FC<Props> = ({ stocks, fetchPortfolio }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: 0,
    name: '',
    exchange: '',
    quantity: '',
    price: '',
  });
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEdit = (stockId: number) => {
    const stock = stocks.find(s => s.id === stockId);
    if (stock) {
      setEditFormData({
        id: stock.id,
        name: stock.name,
        exchange: stock.name.includes('.NS') ? 'NSE' : 'BSE',
        quantity: String(stock.quantity),
        price: String(stock.purchasePrice),
      });
      setShowEditForm(true);
    }
  };

  const handleDelete = async (stockId: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return alert('User not logged in');
    if (!confirm('Are you sure you want to delete this stock?')) return;
    setIsLoading(true);

    try {
      const res = await fetch(`${API.PORTFOLIO}/${userId}/${stockId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchPortfolio();
        alert('Stock deleted successfully');
      } else {
        alert('Failed to delete stock.');
      }
    } catch (error) {
      console.error('Error deleting stock:', error);
      alert('An error occurred while deleting the stock.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStock = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    setIsLoading(true);

    const res = await fetch(`${API.PORTFOLIO}/api/portfolio/${userId}/${editFormData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stockPurchasePrice: parseFloat(editFormData.price),
        stockQuantity: parseInt(editFormData.quantity),
      }),
    });

    try {
      const data = await res.json();
      alert(data.message);
      setShowEditForm(false);
      await fetchPortfolio();
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<Stock>[] = [
    { accessorKey: 'name', header: 'Stock Name' },
    { accessorKey: 'purchasePrice', header: 'Purchase Price (₹)' },
    { accessorKey: 'quantity', header: 'Quantity' },
    { accessorKey: 'sector', header: 'Sector' },
    { accessorKey: 'investment', header: 'Investment (₹)' },
    { accessorKey: 'cmp', header: 'CMP (₹)' },
    { accessorKey: 'presentValue', header: 'Present Value (₹)' },
    { accessorKey: 'pe', header: 'PE' },
    {
      accessorKey: 'gainLoss',
      header: 'Gain / Loss (₹)',
      cell: info => {
        const value = info.getValue<number>();
        return (
          <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
            ₹{value.toFixed(2)}
          </span>
        );
      },
    },
    { accessorKey: 'recommendation', header: 'Recommendation' },
    {
      accessorKey: 'Edit',
      header: 'Edit',
      cell: info => (
        <button
          onClick={() => handleEdit(info.row.original.id)}
          className="text-blue-600 hover:cursor-pointer hover:scale-110 transition-all"
        >
          📝
        </button>
      ),
    },
    {
      accessorKey: 'delete',
      header: 'Remove',
      cell: info => (
        <button
          onClick={() => handleDelete(info.row.original.id)}
          className="text-red-600 hover:cursor-pointer hover:scale-110 transition-all"
        >
          🗑️
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: stocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const sectorData = stocks.reduce((acc, stock) => {
    acc[stock.sector] = (acc[stock.sector] || 0) + stock.investment;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(sectorData).map(([sector, value]) => ({
    name: sector,
    value,
  }));

  // Shimmer effect component
  const ShimmerRow = () => (
    <tr className="animate-pulse">
      {Array(8).fill(0).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="space-y-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="border rounded shadow flex flex-col bg-white" style={{ height: '90vh' }}>
        <div className="overflow-x-auto overflow-y-auto flex-1 relative">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 relative">
              {isLoading ? (
                <>
                  <ShimmerRow />
                  <ShimmerRow />
                  <ShimmerRow />
                </>
              ) : stocks?.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-4 text-gray-500">
                    No stocks added yet.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-2 text-sm text-gray-800">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center border-t py-4">
          <SectorPieChart data={pieChartData} />
        </div>
      </div>
      
      {showEditForm && (
        <div className="fixed inset-0 z-50 bg-opacity-80 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative z-10">
            <EditForm
              showEditForm={showEditForm}
              setShowEditForm={setShowEditForm}
              editFormData={editFormData}
              setEditFormData={setEditFormData}
              handleEditStock={handleEditStock}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioTable;
