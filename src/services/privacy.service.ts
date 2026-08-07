import { auth } from "@/lib/firebaseConfig";
import { IPrivacyPolicy } from "@/Types/privacy";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const getPrivacyPolicy = async (): Promise<IPrivacyPolicy | null> => {
  const token = await auth.currentUser?.getIdToken();
  const headers: Record<string, string> = {
    "accept": "*/*"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch("https://api-wki5bofifq-uc.a.run.app/admin/privacy-policy", {
    method: "GET",
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch privacy policy: ${response.statusText} ${errorText}`);
  }

  const data = await response.json();
  if (!data) return null;

  const policy = Array.isArray(data) ? data[0] : (data.data || data.policy || data);
  if (!policy || typeof policy !== 'object') return null;

  return {
    id: policy.id || "privacy-policy",
    content: policy.content || "",
    version: policy.version || "1.0",
    effectiveDate: policy.effectiveDate || new Date().toISOString().split('T')[0],
    isPublished: policy.isPublished !== undefined ? Boolean(policy.isPublished) : true,
    createdAt: policy.createdAt,
    updatedAt: policy.updatedAt
  };
};

export const updatePrivacyPolicy = async (payload: {
  content: string;
  version: string;
  effectiveDate: string;
  isPublished: boolean;
}): Promise<any> => {
  const token = await auth.currentUser?.getIdToken();
  const headers: Record<string, string> = {
    "accept": "*/*",
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch("https://api-wki5bofifq-uc.a.run.app/admin/privacy-policy", {
    method: "PUT",
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update privacy policy: ${response.statusText} ${errorText}`);
  }

  return response.json();
};

export const usePrivacyPolicy = (options?: any) => 
  useQuery<IPrivacyPolicy | null, Error>({ 
    queryKey: ["privacy-policy"], 
    queryFn: getPrivacyPolicy,
    ...(options || {})
  });

export const useUpdatePrivacyPolicy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updatePrivacyPolicy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["privacy-policy"] });
      qc.invalidateQueries({ queryKey: ["privacies"] });
    },
  });
};

// Aliases for component imports
export const usePrivacies = usePrivacyPolicy;
export const useAddPrivacy = useUpdatePrivacyPolicy;
export const useEditPrivacy = useUpdatePrivacyPolicy;
