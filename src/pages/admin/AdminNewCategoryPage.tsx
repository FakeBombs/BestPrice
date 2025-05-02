
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation } from 'react-router-dom';
import CategoryForm from '@/components/admin/categories/CategoryForm';

const AdminNewCategoryPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const parentId = searchParams.get('parentId');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Category</h1>
      
      <Card>
        <CardContent className="pt-6">
          <CategoryForm 
            mode="create"
            parentId={parentId || undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNewCategoryPage;
