import { getAll, getByFilters, getById, post, remove, update } from "@/lib/firestoreCrud";
import { IService } from "@/Types/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebaseConfig";

type ServicePayload = IService & { iconFile?: File };

const addService = async (service: ServicePayload) => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("User not authenticated.");

  const formData = new FormData();
  formData.append("businessId", service.businessId || service.merchantId || "string");
  formData.append("name", service.title || "string");
  formData.append("categoryId", service.serviceType || "string");
  formData.append("isAppointmentBased", "true");
  formData.append("appointmentConfig", JSON.stringify(service.availability && Object.keys(service.availability).length > 0 ? service.availability : { additionalProp1: {} }));
  formData.append("price", String(service.price || 0));
  formData.append("hourlyPrice", String(service.hourlyPrice || 0));
  formData.append("details", service.description || "string");
  
  if (service.iconFile) {
    console.log("[addService] Appending image:", service.iconFile.name, service.iconFile.size);
    formData.append("image", service.iconFile, service.iconFile.name);
  } else {
    console.warn("[addService] No iconFile provided!");
  }

  const response = await fetch("https://api-wki5bofifq-uc.a.run.app/merchant/services", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to submit service: ${response.statusText} ${errorText}`);
  }

  return response.json();
};

export const addProduct = async (product: ServicePayload) => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("User not authenticated.");

  const formData = new FormData();
  formData.append("businessId", product.businessId || product.merchantId || "string");
  formData.append("name", product.title || "string");
  formData.append("categoryId", product.serviceType || "string");
  formData.append("price", String(product.price || 0));
  formData.append("orderQuantity", String(product.stock || 0));
  formData.append("details", product.description || "string");
  
  if (product.iconFile) {
    console.log("[addProduct] Appending image:", product.iconFile.name, product.iconFile.size);
    formData.append("image", product.iconFile, product.iconFile.name);
  } else {
    console.warn("[addProduct] No iconFile provided!");
  }

  const response = await fetch("https://api-wki5bofifq-uc.a.run.app/merchant/products", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to submit product: ${response.statusText} ${errorText}`);
  }

  return response.json();
};

const editService = async (service: Partial<IService> & { id: string; iconFile?: File }) => {
  const { id, iconFile, ...payload } = service as any;
  // Note: iconFile is not persisted to Firestore; it would need separate API call if needed for edits
  return update("services", id, payload);
};

const deleteService = async (id: string) => remove("services", id);

const getServices = async () => {
  const res = await getAll("services");
  if (res.error) throw new Error(res.error);
  return res.data as Array<{ id: string } & IService>;
};

const getServicesByMerchant = async (merchantId: string) => {
  const res = await getByFilters("services", [{ key: "merchantId", operator: "==", value: merchantId }]);
  if (res.error) throw new Error(res.error);
  return res.data as Array<{ id: string } & IService>;
};

const getServiceById = async (id: string) => {
  const res = await getById("services", id);
  if (res.error) throw new Error(res.error);
  return res.data as ({ id: string } & IService) | null;
};

export const useServices = (options?: any) => useQuery({ queryKey: ["services"], queryFn: getServices, ...(options || {}) });
export const useServicesByMerchant = (merchantId: string, options?: any) =>
  useQuery({ queryKey: ["services", merchantId], queryFn: () => getServicesByMerchant(merchantId), enabled: !!merchantId, ...(options || {}) });
export const useServiceById = (id: string, options?: any) => useQuery({ queryKey: ["services", id], queryFn: () => getServiceById(id), enabled: !!id, ...(options || {}) });

export const useApiServices = () => {
  return useQuery({
    queryKey: ["apiServices"],
    queryFn: async () => {
      const response = await fetch("https://api-wki5bofifq-uc.a.run.app/content/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    }
  });
};

export const useApiProducts = () => {
  return useQuery({
    queryKey: ["apiProducts"],
    queryFn: async () => {
      const response = await fetch("https://api-wki5bofifq-uc.a.run.app/content/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    }
  });
};

export const useApiServiceById = (serviceId: string) => {
  return useQuery({
    queryKey: ["apiService", serviceId],
    queryFn: async () => {
      const response = await fetch(`https://api-wki5bofifq-uc.a.run.app/content/service?serviceId=${serviceId}`);
      if (!response.ok) throw new Error("Failed to fetch service");
      return response.json();
    },
    enabled: !!serviceId
  });
};

export const useApiProductById = (productId: string) => {
  return useQuery({
    queryKey: ["apiProduct", productId],
    queryFn: async () => {
      const response = await fetch(`https://api-wki5bofifq-uc.a.run.app/content/product?productId=${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return response.json();
    },
    enabled: !!productId
  });
};

export const useAddService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (s: ServicePayload) => addService(s),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
};

export const useAddProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (s: ServicePayload) => addProduct(s),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }), // Assuming services/products share query lists for now or just generic invalidation
  });
};

export const useEditService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (s: Partial<IService> & { id: string; iconFile?: File }) => editService(s),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["services", vars.id] });
    },
  });
};

export const useDeleteService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
};



