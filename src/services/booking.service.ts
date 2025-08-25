import { getAll, getByFilters, getById, post, remove, update } from "@/lib/firestoreCrud";
import { IBooking } from "@/Types/booking";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const addBooking = async (booking: IBooking) => {
  const { id, ...payload } = booking as any;
  return post("bookings", payload);
};

const editBooking = async (booking: Partial<IBooking> & { id: string }) => {
  const { id, ...payload } = booking as any;
  return update("bookings", id, payload);
};

const deleteBooking = async (id: string) => remove("bookings", id);

const getBookings = async () => {
  const res = await getAll("bookings");
  if (res.error) throw new Error(res.error);
  return res.data as Array<{ id: string } & IBooking>;
};

const getBookingById = async (id: string) => {
  const res = await getById("bookings", id);
  if (res.error) throw new Error(res.error);
  return res.data as ({ id: string } & IBooking) | null;
};

export const useBookings = (options?: any) => useQuery({ queryKey: ["bookings"], queryFn: getBookings, ...(options || {}) });
export const useBookingById = (id: string, options?: any) => useQuery({ queryKey: ["bookings", id], queryFn: () => getBookingById(id), enabled: !!id, ...(options || {}) });

export const useAddBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (b: IBooking) => addBooking(b),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
};

export const useEditBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (b: Partial<IBooking> & { id: string }) => editBooking(b),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["bookings", vars.id] });
    },
  });
};

export const useDeleteBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
};


