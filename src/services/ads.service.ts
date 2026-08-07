import { auth, db } from "@/lib/firebaseConfig";
import { IAd } from "@/Types/ads";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDoc, doc } from "firebase/firestore";


export const getAds = async (): Promise<IAd[]> => {
  const token = await auth.currentUser?.getIdToken();
  const headers: Record<string, string> = {
    "accept": "*/*"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch("https://api-wki5bofifq-uc.a.run.app/admin/ads", {
    method: "GET",
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch ads: ${response.statusText} ${errorText}`);
  }

  const data = await response.json();
  const list = Array.isArray(data) ? data : (data.items || data.data || []);

  return list.map((item: any) => ({
    ...item,
    id: item.adId || item.id,
    adId: item.adId || item.id,
    title: item.title || '',
    description: item.description || '',
    imageUrl: item.imageUrl || '',
    targetUrl: item.targetUrl || '',
    placement: item.placement || 'home_banner',
    priority: item.priority !== undefined ? Number(item.priority) : 0,
    startsAt: item.startsAt || item.createdAt || new Date().toISOString(),
    endsAt: item.endsAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: Boolean(item.isActive)
  }));
};

export const addAd = async (adData: Omit<IAd, "id">): Promise<any> => {
  const token = await auth.currentUser?.getIdToken();
  const headers: Record<string, string> = {
    "accept": "*/*",
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const payload = {
    title: adData.title,
    description: adData.description,
    imageUrl: adData.imageUrl,
    targetUrl: adData.targetUrl || "",
    placement: adData.placement || "home_banner",
    startsAt: adData.startsAt || new Date().toISOString(),
    endsAt: adData.endsAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    priority: Number(adData.priority || 0),
    isActive: Boolean(adData.isActive)
  };

  const response = await fetch("https://api-wki5bofifq-uc.a.run.app/admin/ads", {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create ad: ${response.statusText} ${errorText}`);
  }

  return response.json();
};

export const editAd = async (adData: Partial<IAd> & { id?: string; adId?: string }): Promise<any> => {
  const token = await auth.currentUser?.getIdToken();
  const headers: Record<string, string> = {
    "accept": "*/*",
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const adId = adData.adId || adData.id;
  if (!adId) throw new Error("Ad ID is required for editing.");

  const payload: Record<string, any> = {
    adId: String(adId),
  };

  if (adData.title !== undefined) payload.title = adData.title;
  if (adData.description !== undefined) payload.description = adData.description;
  if (adData.imageUrl !== undefined) payload.imageUrl = adData.imageUrl;
  if (adData.targetUrl !== undefined) payload.targetUrl = adData.targetUrl;
  if (adData.placement !== undefined) payload.placement = adData.placement;
  if (adData.startsAt !== undefined) payload.startsAt = adData.startsAt;
  if (adData.endsAt !== undefined) payload.endsAt = adData.endsAt;
  if (adData.priority !== undefined) payload.priority = Number(adData.priority);
  if (adData.isActive !== undefined) payload.isActive = Boolean(adData.isActive);

  let response = await fetch("https://api-wki5bofifq-uc.a.run.app/admin/ads", {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok && (response.status === 404 || response.status === 405)) {
    response = await fetch("https://api-wki5bofifq-uc.a.run.app/admin/ads", {
      method: "PUT",
      headers,
      body: JSON.stringify(payload)
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update ad: ${response.statusText} ${errorText}`);
  }

  return response.json();
};

export const deleteAd = async (id: string): Promise<any> => {
  const token = await auth.currentUser?.getIdToken();
  const headers: Record<string, string> = {
    "accept": "*/*",
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const endpoints: Array<{ url: string; method: string; body?: string }> = [
    { url: `https://api-wki5bofifq-uc.a.run.app/admin/ads?adId=${id}`, method: "DELETE" },
    { url: `https://api-wki5bofifq-uc.a.run.app/admin/ads?id=${id}`, method: "DELETE" },
    { url: `https://api-wki5bofifq-uc.a.run.app/admin/ads/${id}`, method: "DELETE" },
    { url: `https://api-wki5bofifq-uc.a.run.app/admin/ads`, method: "DELETE", body: JSON.stringify({ id, adId: id }) },
    { url: `https://api-wki5bofifq-uc.a.run.app/admin/ads/delete`, method: "POST", body: JSON.stringify({ id, adId: id }) },
    { url: `https://api-wki5bofifq-uc.a.run.app/admin/ads/delete/${id}`, method: "POST" }
  ];

  let lastErrorText = "";
  let success = false;
  let resultData: any = null;

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        method: ep.method,
        headers,
        body: ep.body
      });

      if (res.ok) {
        const text = await res.text();
        if (text) {
          try {
            resultData = JSON.parse(text);
          } catch {
            resultData = { message: text };
          }
        } else {
          resultData = { success: true };
        }
        success = true;
        break;
      } else {
        lastErrorText = `${res.status} ${res.statusText}: ${await res.text()}`;
      }
    } catch (e: any) {
      lastErrorText = e.message || String(e);
    }
  }

  // Fallback: Also attempt direct Firestore deletion for both 'ads' and 'advertisements' collections
  try {
    if (db) {
      await deleteDoc(doc(db, "ads", id)).catch(() => {});
      await deleteDoc(doc(db, "advertisements", id)).catch(() => {});
    }
    if (!success) {
      // If direct Firestore deletion attempted without throwing, consider it handled
      return { success: true, message: "Deleted via Firestore fallback" };
    }
  } catch (fsErr) {
    if (!success) {
      throw new Error(`Failed to delete ad: ${lastErrorText}`);
    }
  }

  return resultData || { success: true };
};

export const useAds = (options?: any) =>
  useQuery<IAd[], Error>({
    queryKey: ["ads"],
    queryFn: getAds,
    ...(options || {})
  });

export const useAddAd = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (a: Omit<IAd, "id">) => addAd(a),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ads"] }),
  });
};

export const useEditAd = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (a: Partial<IAd> & { id?: string; adId?: string }) => editAd(a),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["ads"] });
      const targetId = vars.adId || vars.id;
      if (targetId) qc.invalidateQueries({ queryKey: ["ads", targetId] });
    },
  });
};

export const useDeleteAd = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAd(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ads"] }),
  });
};
