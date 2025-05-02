import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AdminHeader from '@/components/admin/AdminHeader';
import { products, vendors } from '@/data/mockData';
import normalizeProducts from '@/utils/importMockData';

const AdminDashboard: React.FC = () => {
  const [productCount, setProductCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    // Calculate product and vendor counts
    setProductCount(products.length);
    setVendorCount(vendors.length);

    // Aggregate product counts by category
    const categoryCounts = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Convert category counts to array format for Recharts
    const categoryDataArray = Object.keys(categoryCounts).map(category => ({
      name: category,
      count: categoryCounts[category],
    }));

    setCategoryData(categoryDataArray);
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      <div className="dashboard-content">
        <div className="overview-cards">
          <div className="card">
            <h3>Total Products</h3>
            <p>{productCount}</p>
          </div>
          <div className="card">
            <h3>Total Vendors</h3>
            <p>{vendorCount}</p>
          </div>
        </div>

        <div className="category-chart">
          <h2>Products by Category</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
