import React from "react";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ServiceForm from "@/components/ServiceForm";
import { useDeleteService, useApiServices, useApiProducts } from "@/services/service.service";
import { useUserProfile } from "@/services/profile.service";
import { auth } from "@/lib/firebaseConfig";

const ServicesPage: React.FC = () => {
  const [uid, setUid] = React.useState<string | undefined>(undefined);
  const [isFetchingAuth, setIsFetchingAuth] = React.useState(true);

  React.useEffect(() => {
    const fetchAuthUid = async () => {
      try {
        if (!auth.currentUser) {
          setIsFetchingAuth(false);
          return;
        }

        const idToken = await auth.currentUser.getIdToken();
        const response = await fetch("https://api-wki5bofifq-uc.a.run.app/auth/me", {
          headers: {
            "Authorization": `Bearer ${idToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const fetchedUid = data?.uid || data?.user?.uid || data?.userId;
          if (fetchedUid) {
            setUid(fetchedUid);
          }
        }
      } catch (err) {
        console.error("Error fetching user data from /auth/me for Services:", err);
      } finally {
        setIsFetchingAuth(false);
      }
    };

    fetchAuthUid();
  }, [auth.currentUser]);

  const { data: profile } = useUserProfile();
  const isSuperAdmin = profile?.role === 'super_admin';
  
  const { data: allServicesData, isLoading: loadingSvc, error: errSvc } = useApiServices();
  const { data: allProductsData, isLoading: loadingProd, error: errProd } = useApiProducts();

  const allServicesList = Array.isArray(allServicesData) ? allServicesData : (allServicesData?.items || allServicesData?.data || []);
  const allProductsList = Array.isArray(allProductsData) ? allProductsData : (allProductsData?.items || allProductsData?.data || []);
  
  const allListings = [
    ...allServicesList.map((s:any) => ({...s, isProduct: false})),
    ...allProductsList.map((p:any) => ({...p, isProduct: true}))
  ];

  const isLoading = loadingSvc || loadingProd;
  const error = errSvc || errProd;
  const services = isSuperAdmin 
    ? allListings 
    : allListings.filter((item: any) => item.merchantUid === uid || item.businessId === uid || item.merchantId === uid);

  const { mutate: remove } = useDeleteService();

  const formatAvailability = (value: any) => {
    if (!value) return "--";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (value.isOpen === false) return "Closed";
      const start = value.start ?? value.open ?? "";
      const end = value.end ?? value.close ?? "";
      if (start || end) return `${start}-${end}`;
      return "--";
    }
    return String(value);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="list">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="list">All Listings</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
            </TabsList>
            <ServiceForm defaultMerchantId={uid} />
          </div>
          <TabsContent value="list">
            {(isLoading || isFetchingAuth) && <div>Loading...</div>}
            {error && <div>Failed to load services</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(services as any[]).map((s: any) => (
                <Card key={s.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{s.name || s.title || 'Unnamed Service'}</CardTitle>
                      <Badge variant={s.isProduct ? 'default' : 'secondary'}>
                        {s.isProduct ? 'Product' : 'Service'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {(s.imageUrl || s.icon) && (
                      <img src={s.imageUrl || s.icon} alt={s.name || s.title} className="mb-3 h-32 w-full object-cover rounded" />)
                    }
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Merchant: {s.merchantId}</div>
                      <div>
                        Type: {s.categoryId || (typeof s.serviceType === 'string' ? s.serviceType : (s.serviceType?.title ?? ''))}
                      </div>
                      {(s.details || s.description) && (
                        <div className="text-gray-500 italic text-xs mt-1 mb-2 line-clamp-2">
                          {s.details || s.description}
                        </div>
                      )}
                      <div>Fixed Price: ${s.price}</div>
                      {typeof s.hourlyPrice === 'number' && s.hourlyPrice > 0 && (
                        <div>Hourly Price: ${s.hourlyPrice}</div>
                      )}
                      {s.locationAddress && (
                        <div className="text-xs mt-1 text-gray-500">
                          Location: {s.locationAddress}
                        </div>
                      )}
                      {s.availability && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <div>Mon: {formatAvailability(s.availability.monday)}</div>
                          <div>Tue: {formatAvailability(s.availability.tuesday)}</div>
                          <div>Wed: {formatAvailability(s.availability.wednesday)}</div>
                          <div>Thu: {formatAvailability(s.availability.thursday)}</div>
                          <div>Fri: {formatAvailability(s.availability.friday)}</div>
                          <div>Sat: {formatAvailability(s.availability.saturday)}</div>
                          <div>Sun: {formatAvailability(s.availability.sunday)}</div>
                        </div>
                      )}
                      {typeof s.stock === 'number' && <div>Stock: {s.stock}</div>}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <ServiceForm serviceToEdit={s} defaultMerchantId={uid} />
                      <Button variant="outline" size="sm" onClick={() => remove(s.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create Service/Product</CardTitle>
              </CardHeader>
              <CardContent>
                <ServiceForm defaultMerchantId={uid} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ServicesPage;


