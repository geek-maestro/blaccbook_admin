import { getAll, getByFilters, IFilters, post, update, getById } from "@/lib/firestoreCrud";
import { IBusiness } from "@/Types/business";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebaseConfig";

const addBusiness = async (business: IBusiness & { coverImage?: File | string; description?: string }) => {
  let token = auth.currentUser ? await auth.currentUser.getIdToken(true) : null;
  const bodyFormData = new FormData();

  bodyFormData.append("businessName", business.name || "Example Business");
  bodyFormData.append("categoryId", business.categories && business.categories[0] ? business.categories[0] : "retail");
  bodyFormData.append("description", business.description || "");
  bodyFormData.append("location.address", business.address || "Accra");
  bodyFormData.append("location.city", "Accra");
  bodyFormData.append("location.state", "Greater Accra");
  bodyFormData.append("location.country", "Ghana");
  bodyFormData.append("location.postalCode", "00233");
  bodyFormData.append("coordinates.lat", "0");
  bodyFormData.append("coordinates.lng", "0");
  bodyFormData.append("isFeatured", "true");

  if (business.coverImage) {
    bodyFormData.append("coverImage", business.coverImage as any);
  }

  const headers: Record<string, string> = {
    "accept": "*/*"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch("https://api-wki5bofifq-uc.a.run.app/merchant/businesses", {
    method: "POST",
    headers,
    body: bodyFormData
  });

  if (response.status === 403 && auth.currentUser) {
    try {
      await fetch("https://api-wki5bofifq-uc.a.run.app/auth/bootstrap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ requestedRole: "merchant" })
      });

      token = await auth.currentUser.getIdToken(true);
      headers["Authorization"] = `Bearer ${token}`;

      response = await fetch("https://api-wki5bofifq-uc.a.run.app/merchant/businesses", {
        method: "POST",
        headers,
        body: bodyFormData
      });
    } catch (bootstrapErr) {
      console.error("Failed merchant role bootstrap retry:", bootstrapErr);
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to submit business: ${response.statusText} ${errorText}`);
  }

  return response.json();
};

const editBusiness = async ({
  id,
  name,
  email,
  featuredImage,
  categories,
  images,
  website,
  contact,
  features,
  description,
  isEcommerce,
  isBookable,
  hasMenu,
  address,
  rating,
  products,
  createdAt,
  isBanned,
}: Partial<IBusiness> & { id: string }) => {
  return update("business", id, {
    name,
    email,
    categories,
    images,
    website,
    contact,
    features,
    isEcommerce,
    isBookable,
    hasMenu,
    address,
    description,
    rating,
    featuredImage,
    products,
    createdAt,
    isBanned
  });
};

export const useAddBizz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (business: IBusiness) => addBusiness(business),

    onSuccess: () => {
      console.log("Business added successfully!");
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },

    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while adding the business. Please try again.";
      console.error("Error adding business:", errorMessage);
      throw new Error(errorMessage);
    },
  });
};

export const useEditBizz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (business: Partial<IBusiness> & { id: string }) =>
      editBusiness(business),

    onSuccess: (_, variables) => {
      // Invalidate both the specific business and the list to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ["business", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },

    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the business. Please try again.";
      console.error("Error updating business:", errorMessage);
      throw new Error(errorMessage);
    },
  });
};

const getBusiness = async () => {
  const businessMap = new Map<string, any>();

  const token = await auth.currentUser?.getIdToken();
  const headers: Record<string, string> = { "accept": "*/*" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 1. Fetch from /content/businesses
  try {
    const res = await fetch("https://api-wki5bofifq-uc.a.run.app/content/businesses", { method: "GET", headers });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.items || data.data || []);
      list.forEach((b: any) => {
        const id = String(b.id || b.businessId || b._id || '');
        if (id) businessMap.set(id, b);
      });
    }
  } catch (e) {
    console.warn("Failed to fetch /content/businesses:", e);
  }

  // 2. Fetch from /merchant/businesses
  try {
    const res = await fetch("https://api-wki5bofifq-uc.a.run.app/merchant/businesses", { method: "GET", headers });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.items || data.data || []);
      list.forEach((b: any) => {
        const id = String(b.id || b.businessId || b._id || '');
        if (id) {
          if (businessMap.has(id)) {
            businessMap.set(id, { ...businessMap.get(id), ...b });
          } else {
            businessMap.set(id, b);
          }
        }
      });
    }
  } catch (e) {
    console.warn("Failed to fetch /merchant/businesses:", e);
  }

  // 3. Fetch from Firestore "business" collection
  try {
    const result = await getAll("business");
    if (!result.error && Array.isArray(result.data)) {
      result.data.forEach((b: any) => {
        const id = String(b.id || b.businessId || b._id || '');
        if (id) {
          if (businessMap.has(id)) {
            businessMap.set(id, { ...b, ...businessMap.get(id) });
          } else {
            businessMap.set(id, b);
          }
        }
      });
    }
  } catch (e) {
    console.warn("Failed to fetch firestore businesses:", e);
  }

  return Array.from(businessMap.values()).map((business: any) => ({
    ...business,
    id: String(business.id || business.businessId || business._id),
    name: business.businessName || business.name || 'Unnamed Business',
    businessName: business.businessName || business.name || 'Unnamed Business',
    category: business.categoryId || business.category || business.type || 'General',
    description: business.description || '',
    location: typeof business.location === 'object' 
      ? `${business.location?.address || ''}${business.location?.city ? ', ' + business.location.city : ''}` 
      : (business.location || business.address || ''),
    address: typeof business.location === 'object' ? business.location?.address : (business.address || business.location || ''),
    phone: business.contactPhone || business.phone || '',
    email: business.contactEmail || business.email || '',
    status: business.status || (business.isActive ? 'active' : 'pending'),
    featured: business.isFeatured ?? business.featured ?? false,
    isFeatured: business.isFeatured ?? business.featured ?? false,
    images: Array.isArray(business.documentUrls) && business.documentUrls.length > 0 
      ? business.documentUrls 
      : (business.coverImage ? [business.coverImage] : (Array.isArray(business.images) ? business.images : [])),
    featuredImage: business.coverImage || business.featuredImage || (Array.isArray(business.documentUrls) ? business.documentUrls[0] : null)
  }));
};

const getMyBusinesses = async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) return [] as IBusiness[];
  const result = await getByFilters("business", [{ key: "ownerUserId", operator: "==", value: uid }]);
  if (result.error) throw new Error(result.error);
  return result.data as IBusiness[];
};

const getBusinessById = async (id: string) => {
  return await getById("business", id)
    .then((res: { data: IBusiness | null; error: string }) => {
      if (res.error) {
        throw new Error(res.error);
      }
      return res.data;
    })
    .catch((error: unknown) => {
      console.error("Error fetching business by id:", error);
      throw new Error("An error occurred while fetching business.");
    });
};

export const useBusinessById = (id: string) => {
  return useQuery({
    queryKey: ["business", id],
    queryFn: () => getBusinessById(id),
  });
};

export const useBusinesses = () => {
  return useQuery({
    queryKey: ["business"],
    queryFn: getBusiness,
  });
};

export const useMyBusinesses = () => {
  return useQuery({
    queryKey: ["business","mine"],
    queryFn: getMyBusinesses,
  });
};

// Hook for public business listings - only shows approved businesses
export const useApprovedBusinesses = () => {
  return useQuery({
    queryKey: ["business", "approved"],
    queryFn: async () => {
      const result = await getByFilters("business", []);
      if (result.error) throw new Error(result.error);
      // Filter to only show approved businesses
      return (result.data as IBusiness[]).filter(b => b.status === 'approved');
    },
  });
};

export const useApiBusinesses = () => {
  return useQuery({
    queryKey: ["apiBusinesses"],
    queryFn: async () => {
      const response = await fetch("https://api-wki5bofifq-uc.a.run.app/content/businesses");
      if (!response.ok) throw new Error("Failed to fetch businesses");
      const data = await response.json();
      return data.items || [];
    }
  });
};