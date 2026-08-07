import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { auth } from '@/lib/firebaseConfig';
import { uploadCategoryImage } from '@/services/imageUpload.service';

const fetchCategories = async () => {
  const response = await fetch('https://api-wki5bofifq-uc.a.run.app/content/categories');
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

const addCategory = async (categoryData: { id: string; name: string; dbIdentifier: string; type: string; categoryIcon?: File | null }) => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("User not authenticated.");

  let categoryIconUrl: string | undefined = undefined;
  if (categoryData.categoryIcon) {
    categoryIconUrl = await uploadCategoryImage(categoryData.categoryIcon);
  }

  const payload: Record<string, any> = {
    id: categoryData.id,
    name: categoryData.name,
    dbIdentifier: categoryData.dbIdentifier || categoryData.id,
    type: categoryData.type,
  };

  if (categoryIconUrl) {
    payload.categoryIcon = categoryIconUrl;
  }

  const response = await fetch("https://api-wki5bofifq-uc.a.run.app/admin/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create category: ${response.statusText} ${errorText}`);
  }

  return response.json();
};

const updateCategory = async (categoryData: { id: string; name: string; dbIdentifier: string; type: string; categoryIcon?: File | null; existingIconUrl?: string }) => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("User not authenticated.");

  let categoryIconUrl: string | undefined = categoryData.existingIconUrl;
  if (categoryData.categoryIcon) {
    categoryIconUrl = await uploadCategoryImage(categoryData.categoryIcon);
  }

  const payload: Record<string, any> = {
    id: categoryData.id,
    name: categoryData.name,
    dbIdentifier: categoryData.dbIdentifier || categoryData.id,
    type: categoryData.type,
  };

  if (categoryIconUrl) {
    payload.categoryIcon = categoryIconUrl;
  }

  let response = await fetch("https://api-wki5bofifq-uc.a.run.app/admin/categories", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok && (response.status === 404 || response.status === 405)) {
    response = await fetch("https://api-wki5bofifq-uc.a.run.app/admin/categories", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  }

  if (!response.ok && (response.status === 404 || response.status === 405)) {
    response = await fetch(`https://api-wki5bofifq-uc.a.run.app/admin/categories/${categoryData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  }

  if (!response.ok && (response.status === 404 || response.status === 405)) {
    response = await fetch("https://api-wki5bofifq-uc.a.run.app/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update category: ${response.statusText} ${errorText}`);
  }

  return response.json();
};

const deleteCategory = async (id: string) => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("User not authenticated.");

  let response = await fetch(`https://api-wki5bofifq-uc.a.run.app/admin/categories?id=${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok && (response.status === 404 || response.status === 405)) {
    response = await fetch(`https://api-wki5bofifq-uc.a.run.app/admin/categories?categoryId=${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  }

  if (!response.ok && (response.status === 404 || response.status === 405)) {
    response = await fetch(`https://api-wki5bofifq-uc.a.run.app/admin/categories`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ id, categoryId: id })
    });
  }

  if (!response.ok && (response.status === 404 || response.status === 405)) {
    response = await fetch(`https://api-wki5bofifq-uc.a.run.app/admin/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete category: ${response.statusText} ${errorText}`);
  }

  return response.json();
};

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newCat, setNewCat] = useState<{ id: string; name: string; dbIdentifier: string; type: string; categoryIcon: File | null }>({
    id: '',
    name: '',
    dbIdentifier: '',
    type: 'product',
    categoryIcon: null
  });
  const [editingCat, setEditingCat] = useState<{ id: string; name: string; dbIdentifier: string; type: string; categoryIcon: File | null; existingIconUrl?: string } | null>(null);
  const [deletingCat, setDeletingCat] = useState<any | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchCategories
  });

  const { mutate: createCategory, isPending } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsDialogOpen(false);
      setNewCat({ id: '', name: '', dbIdentifier: '', type: 'product', categoryIcon: null });
    },
    onError: (err: any) => alert(err.message)
  });

  const { mutate: mutateUpdateCategory, isPending: isUpdating } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsEditOpen(false);
      setEditingCat(null);
    },
    onError: (err: any) => alert(err.message)
  });

  const { mutate: mutateDeleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsDeleteOpen(false);
      setDeletingCat(null);
    },
    onError: (err: any) => alert(err.message)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory(newCat);
  };

  const handleOpenEdit = (cat: any) => {
    setEditingCat({
      id: cat.id || '',
      name: cat.name || cat.title || '',
      dbIdentifier: cat.dbIdentifier || '',
      type: cat.type || 'product',
      categoryIcon: null,
      existingIconUrl: cat.categoryIcon || cat.icon || '',
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      mutateUpdateCategory(editingCat);
    }
  };

  const handleOpenDelete = (cat: any) => {
    setDeletingCat(cat);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingCat?.id) {
      mutateDeleteCategory(deletingCat.id);
    }
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
                  {/* <div>
                    <Label htmlFor="catDbId">Database Identifier</Label>
                    <Input id="catDbId" placeholder="e.g. HAIR_CARE" value={newCat.dbIdentifier} onChange={(e) => setNewCat({...newCat, dbIdentifier: e.target.value})} />
                  </div> */}
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
                  <div>
                    <Label htmlFor="catIcon">Category Icon</Label>
                    <Input
                      id="catIcon"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setNewCat({ ...newCat, categoryIcon: file });
                      }}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isPending}>{isPending ? 'Creating...' : 'Create'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                {editingCat && (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="editCatId">ID</Label>
                      <Input id="editCatId" value={editingCat.id} disabled className="bg-gray-100 cursor-not-allowed font-mono" />
                    </div>
                    <div>
                      <Label htmlFor="editCatName">Name</Label>
                      <Input
                        id="editCatName"
                        placeholder="e.g. Hair Care"
                        value={editingCat.name}
                        onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                        required
                      />
                    </div>
                    {/* <div>
                      <Label htmlFor="editCatDbId">Database Identifier</Label>
                      <Input
                        id="editCatDbId"
                        placeholder="e.g. HAIR_CARE"
                        value={editingCat.dbIdentifier}
                        onChange={(e) => setEditingCat({ ...editingCat, dbIdentifier: e.target.value })}
                      />
                    </div> */}
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={editingCat.type}
                        onValueChange={(v) => setEditingCat({ ...editingCat, type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="editCatIcon">Category Icon</Label>
                      {editingCat.existingIconUrl && !editingCat.categoryIcon && (
                        <div className="flex items-center gap-2 my-1">
                          <img
                            src={editingCat.existingIconUrl}
                            alt="Current Icon"
                            className="w-8 h-8 object-cover rounded border"
                          />
                          <span className="text-xs text-gray-500">Current Icon</span>
                        </div>
                      )}
                      <Input
                        id="editCatIcon"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setEditingCat({ ...editingCat, categoryIcon: file });
                        }}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>

            {/* Delete Category Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Category</DialogTitle>
                </DialogHeader>
                <p className="text-gray-600">
                  Are you sure you want to delete category <strong className="text-gray-900">{deletingCat?.name || deletingCat?.title || deletingCat?.id}</strong>? This action cannot be undone.
                </p>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                  <Button type="button" variant="destructive" disabled={isDeleting} onClick={handleDeleteConfirm}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </DialogFooter>
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
                  <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {(cat.categoryIcon || cat.icon) ? (
                        <img
                          src={cat.categoryIcon || cat.icon}
                          alt={cat.name || cat.title || 'Category Icon'}
                          className="w-10 h-10 object-cover rounded-md border bg-white flex-shrink-0"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg truncate">{cat.name || cat.title || 'Unnamed Category'}</CardTitle>
                        {cat.dbIdentifier && (
                          <p className="text-xs text-gray-500 font-mono">{cat.dbIdentifier}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => handleOpenEdit(cat)}
                        title="Edit Category"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleOpenDelete(cat)}
                        title="Delete Category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {cat.description && (
                      <p className="text-sm text-gray-600 mb-2">{cat.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cat.type && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 capitalize">
                          {cat.type}
                        </span>
                      )}
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
