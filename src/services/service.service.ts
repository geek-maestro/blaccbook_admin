import { getAll, getByFilters, getById, post, remove, update } from "@/lib/firestoreCrud";
import { IService } from "@/Types/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const addService = async (service: IService) => {
  const { id, ...payload } = service as any;
  return post("services", payload);
};

const editService = async (service: Partial<IService> & { id: string }) => {
  const { id, ...payload } = service as any;
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

export const useServices = () => useQuery({ queryKey: ["services"], queryFn: getServices });
export const useServicesByMerchant = (merchantId: string) =>
  useQuery({ queryKey: ["services", merchantId], queryFn: () => getServicesByMerchant(merchantId), enabled: !!merchantId });
export const useServiceById = (id: string) => useQuery({ queryKey: ["services", id], queryFn: () => getServiceById(id), enabled: !!id });

export const useAddService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (s: IService) => addService(s),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
};

export const useEditService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (s: Partial<IService> & { id: string }) => editService(s),
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


