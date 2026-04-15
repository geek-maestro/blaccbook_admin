import { getByFilters, update } from "@/lib/firestoreCrud";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebaseConfig";
import { IBusinessVerification } from "@/Types/businessVerification";

const getMyVerifiedBusinesses = async (): Promise<IBusinessVerification[]> => {
    try {
        const idToken = await auth.currentUser?.getIdToken(true);
        if (!idToken) {
            console.error("No ID token available for fetching merchant businesses.");
            return [];
        }

        console.log("Fetching businesses from merchant/businesses API...");
        const response = await fetch("https://api-wki5bofifq-uc.a.run.app/merchant/businesses", {
            headers: {
                "Authorization": `Bearer ${idToken}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Merchant businesses API error:", errorText);
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Merchant businesses API response:", data);
        console.log("data.items check:", { hasItems: 'items' in data, isArray: Array.isArray(data?.items) });

        // The API returns data in an items property
        let businesses: IBusinessVerification[] = [];

        if (Array.isArray(data)) {
            console.log("Path 1: data is direct array");
            businesses = data;
        } else if (data && typeof data === 'object') {
            console.log("Path 2: data is object, checking properties...");
            if (Array.isArray(data.items)) {
                console.log("Path 2a: Found data.items array with", data.items.length, "items");
                businesses = data.items;
            } else if (Array.isArray(data.businesses)) {
                console.log("Path 2b: Found data.businesses array");
                businesses = data.businesses;
            } else if (Array.isArray(data.data)) {
                console.log("Path 2c: Found data.data array");
                businesses = data.data;
            } else if (data.error) {
                console.error("API returned an error:", data.error);
                return [];
            } else {
                console.log("Path 2d: No recognized properties found. Data keys:", Object.keys(data));
            }
        }

        console.log("Processed businesses array:", businesses);
        console.log("Businesses count:", businesses.length);
        return businesses as IBusinessVerification[];
    } catch (error) {
        console.error("Error in getMyVerifiedBusinesses:", error);
        throw error;
    }
};

const getPendingBusinessVerifications = async () => {
    const result = await getByFilters("businessVerifications", [
        { key: "status", operator: "==", value: "pending" }
    ]);
    if (result.error) throw new Error(result.error);
    return result.data as IBusinessVerification[];
};

const editVerifiedBusiness = async (business: Partial<IBusinessVerification> & { id: string }) => {
    const { id, ...data } = business;
    return update("businessVerifications", id, data);
};

export const useMyVerifiedBusinesses = () => {
    return useQuery({
        queryKey: ["businessVerification", "mine"],
        queryFn: () => getMyVerifiedBusinesses(),
        staleTime: 0,
        gcTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const usePendingBusinessVerifications = () => {
    return useQuery({
        queryKey: ["businessVerification", "pending"],
        queryFn: () => getPendingBusinessVerifications(),
    });
};

export const useEditVerifiedBusiness = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (business: Partial<IBusinessVerification> & { id: string }) =>
            editVerifiedBusiness(business),
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: ["businessVerification"] });
            // qc.invalidateQueries({ queryKey: ["businessVerification", "mine"] });
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An error occurred while updating the business. Please try again.";
            console.error("Error updating verified business:", errorMessage);
            throw new Error(errorMessage);
        },
    });
};

export const useApproveBusinessVerification = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, adminId, notes }: { id: string; adminId?: string; notes?: string }) => {
            try {
                const idToken = await auth.currentUser?.getIdToken(true);
                const response = await fetch('https://api-wki5bofifq-uc.a.run.app/admin/verification/decision', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {})
                    },
                    body: JSON.stringify({
                        businessId: id,
                        approved: true
                    })
                });

                if (!response.ok) {
                    console.error("External decision API failed:", await response.text());
                }
            } catch (err) {
                console.error("Error calling external decision API:", err);
            }

            return update("businessVerifications", id, {
                status: "active",
                approvedBy: adminId,
                notes: notes,
                updatedAt: new Date().toISOString()
            });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["businessVerification"] });
            qc.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        },
    });
};

export const useRejectBusinessVerification = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, adminId, reason }: { id: string; adminId?: string; reason: string }) => {
            try {
                const idToken = await auth.currentUser?.getIdToken(true);
                const response = await fetch('https://api-wki5bofifq-uc.a.run.app/admin/verification/decision', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {})
                    },
                    body: JSON.stringify({
                        businessId: id,
                        approved: false
                    })
                });

                if (!response.ok) {
                    console.error("External decision API failed:", await response.text());
                }
            } catch (err) {
                console.error("Error calling external decision API:", err);
            }

            return update("businessVerifications", id, {
                status: "rejected",
                rejectedBy: adminId,
                rejectionReason: reason,
                updatedAt: new Date().toISOString()
            });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["businessVerification"] });
            qc.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        },
    });
};
