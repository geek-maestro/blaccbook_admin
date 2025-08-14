import { getAll, post, put, update, remove, getById } from "@/lib/firestoreCrud";
import { IMerchant } from "@/Types/merchant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebaseConfig";

const addMerchant = async (merchant: IMerchant) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");
  const { id, ...payload } = merchant as any;
  // write document with UID as ID
  return put("merchants", uid, { ...payload, ownerUserId: uid });
};

const editMerchant = async (merchant: Partial<IMerchant> & { id: string }) => {
  const { id, ...data } = merchant;
  return update("merchants", id, data);
};

const deleteMerchant = async (id: string) => {
  return remove("merchants", id);
};

const getMerchants = async () => {
  const res = await getAll("merchants");
  if (res.error) throw new Error(res.error);
  return res.data as Array<{ id: string } & IMerchant>;
};

const getMerchantById = async (id: string) => {
  const res = await getById("merchants", id);
  if (res.error) throw new Error(res.error);
  return res.data as ({ id: string } & IMerchant) | null;
};

export const useMerchants = () =>
  useQuery({ queryKey: ["merchants"], queryFn: getMerchants });

export const useAddMerchant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (m: IMerchant) => addMerchant(m),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["merchants"] }),
  });
};

export const useEditMerchant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (m: Partial<IMerchant> & { id: string }) => editMerchant(m),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["merchants"] });
      qc.invalidateQueries({ queryKey: ["merchants", vars.id] });
    },
  });
};

export const useDeleteMerchant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMerchant(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["merchants"] }),
  });
};

export const useMerchantById = (id: string) =>
  useQuery({ queryKey: ["merchants", id], queryFn: () => getMerchantById(id) });


