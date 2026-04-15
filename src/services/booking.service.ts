import { getAll, getByFilters, getById, post, remove, update } from "@/lib/firestoreCrud";
import { IBooking, IApiBooking, BookingStatus } from "@/Types/booking";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebaseConfig";

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

const getMyBookings = async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) return [] as Array<{ id: string } & IBooking>;

  const res = await getByFilters("bookings", [{ key: "merchantId", operator: "==", value: uid }]);
  if (res.error) throw new Error(res.error);
  return res.data as Array<{ id: string } & IBooking>;
};

const getBookingById = async (id: string) => {
  const res = await getById("bookings", id);
  if (res.error) throw new Error(res.error);
  return res.data as ({ id: string } & IBooking) | null;
};

export const useBookings = (options?: any) => useQuery({ queryKey: ["bookings"], queryFn: getBookings, ...(options || {}) });
export const useMyBookings = (options?: any) => useQuery({ queryKey: ["bookings", "mine"], queryFn: getMyBookings, ...(options || {}) });
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

export const useApiMerchantBookings = () => {
  return useQuery({
    queryKey: ["api-merchant-bookings"],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("User not authenticated.");

      const response = await fetch("https://api-wki5bofifq-uc.a.run.app/merchant/bookings", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch merchant bookings");
      }

      const data = await response.json();
      return (Array.isArray(data) ? data : (data.bookings || data.items || [])) as IApiBooking[];
    },
    refetchInterval: 30000,
  });
};

export const useUpdateApiBookingDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId, decision }: { bookingId: string; decision: BookingStatus }) => {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("User not authenticated.");

      const response = await fetch("https://api-wki5bofifq-uc.a.run.app/bookings/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId, decision })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update booking decision: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-merchant-bookings"] });
    },
  });
};


