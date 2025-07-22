'use client';

import React from 'react';
import SectorPieChart from './sectorPieChart';


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
  pe:number;
};

type Props = {
  stocks: Stock[];
  fetchPortfolio: () => void;
};

const PortfolioTable: React.FC<Props> = ({ stocks, fetchPortfolio }) => {
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
    { accessorKey: 'Edit', header: 'Edit', cell: info => (
      <button
        onClick={() => handleEdit(info.row.original.id)}
        className="text-blue-600 hover:cursor-pointer hover:scale-110 transition-all"
      >
        📝
      </button>
    )},
    { accessorKey: 'delete', header: 'Remove', cell: info => (
      <button
        onClick={() => handleDelete(info.row.original.id)}
        className="text-red-600 hover:cursor-pointer hover:scale-110 transition-all"
      >
        🗑️
      </button>
    )},
  ];

  const table = useReactTable({
    data: stocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const sectorData = stocks.reduce((acc, stock) => {
    const investment = stock.investment;
    if (acc[stock.sector]) {
      acc[stock.sector] += investment;
    } else {
      acc[stock.sector] = investment;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const pieChartData = Object.entries(sectorData).map(([sector, value]) => ({
    name: sector,
    value,
  }));

  const handleDelete = async (stockId: number) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in");
      return;
    }
  
    const confirmed = confirm("Are you sure you want to delete this stock?");
    if (!confirmed) return;
  
    try {
      const res = await fetch(`http://localhost:3001/api/portfolio/${userId}/${stockId}`, {
        method: 'DELETE',
      });
  
      if (res.ok) {
        fetchPortfolio();
        alert("Stock deleted successfully");
      } else {
        alert("Failed to delete stock.");
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
      alert("An error occurred while deleting the stock.");
    }
  };

  const handleEditStock = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
  
    const res = await fetch(`http://localhost:3001/api/portfolio/${userId}/${editFormData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stockPurchasePrice: editFormData.price,
        stockQuantity: editFormData.quantity,
      }),
    });
  
    const data = await res.json();
    alert(data.message);
    setShowEditForm(false);
    fetchPortfolio(); // refresh portfolio
  };

  return (
    <div className="border rounded shadow flex flex-col bg-white" style={{ height: '90vh' }}>
      <div className="overflow-x-auto overflow-y-auto flex-1 relative">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100 sticky top-0 z-10">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stocks?.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
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
      <div className="flex justify-center border-t py-4">
        <SectorPieChart data={pieChartData} />
      </div>
    </div>
  );
};

export default PortfolioTable;
