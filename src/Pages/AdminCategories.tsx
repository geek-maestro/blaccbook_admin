import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { auth } from '@/lib/firebaseConfig';

const fetchCategories = async () => {
  const response = await fetch('https://api-wki5bofifq-uc.a.run.app/content/categories');
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

const addCategory = async (categoryData: { id: string, name: string, dbIdentifier: string, type: string }) => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("User not authenticated.");

  const response = await fetch("https://api-wki5bofifq-uc.a.run.app/admin/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(categoryData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create category: ${response.statusText} ${errorText}`);
  }

  return response.json();
};

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCat, setNewCat] = useState({ id: '', name: '', dbIdentifier: '', type: 'product' });
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchCategories
  });

  const { mutate: createCategory, isPending } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsDialogOpen(false);
      setNewCat({ id: '', name: '', dbIdentifier: '', type: 'product' });
    },
    onError: (err: any) => alert(err.message)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory(newCat);
  };

  // The API might return an array directly or an object with an items array
  const categories = Array.isArray(data) ? data : (data?.items || data?.data || []);

  const filteredCategories = categories.filter((cat: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (cat.name && cat.name.toLowerCase().includes(searchLower)) ||
      (cat.title && cat.title.toLowerCase().includes(searchLower)) ||
      (cat.description && cat.description.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
              <p className="text-gray-600">View and manage service categories</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="catId">ID</Label>
                    <Input id="catId" placeholder="e.g. hair-product-1" value={newCat.id} onChange={(e) => setNewCat({...newCat, id: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="catName">Name</Label>
                    <Input id="catName" placeholder="e.g. Hair Care" value={newCat.name} onChange={(e) => setNewCat({...newCat, name: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="catDbId">Database Identifier</Label>
                    <Input id="catDbId" placeholder="e.g. HAIR_CARE" value={newCat.dbIdentifier} onChange={(e) => setNewCat({...newCat, dbIdentifier: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={newCat.type} onValueChange={(v) => setNewCat({...newCat, type: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isPending}>{isPending ? 'Creating...' : 'Create'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">
               Error loading categories. Please try again later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCategories.map((cat: any, i: number) => (
                <Card key={cat.id || i} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{cat.name || cat.title || 'Unnamed Category'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cat.description && (
                      <p className="text-sm text-gray-600 mb-2">{cat.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cat.isActive !== undefined && (
                        <span className={`text-xs px-2 py-1 rounded-full ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      )}
                      {cat.id && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-mono">
                          ID: {cat.id}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredCategories.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border">
                  No categories found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
