import React from "react";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ServiceForm from "@/components/ServiceForm";
import { useDeleteService, useServices, useMyServices } from "@/services/service.service";
import { useUserProfile } from "@/services/profile.service";

const ServicesPage: React.FC = () => {
  const { data: profile } = useUserProfile();
  const isSuperAdmin = profile?.role === 'super_admin';
  const { data: allServices, isLoading: loadingAll, error: errorAll } = useServices();
  const { data: myServices, isLoading: loadingMine, error: errorMine } = useMyServices();
  const services: any[] = isSuperAdmin ? (allServices as any[] || []) : (myServices as any[] || []);
  const isLoading = isSuperAdmin ? loadingAll : loadingMine;
  const error = isSuperAdmin ? errorAll : errorMine;
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
              <TabsTrigger value="list">Services</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
            </TabsList>
            <ServiceForm />
          </div>
          <TabsContent value="list">
            {isLoading && <div>Loading...</div>}
            {error && <div>Failed to load services</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(services as any[]).map((s: any) => (
                <Card key={s.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{s.title}</CardTitle>
                      <Badge variant={s.isProduct ? 'default' : 'secondary'}>
                        {s.isProduct ? 'Product' : 'Service'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {s.icon && (
                      <img src={s.icon} alt={s.title} className="mb-3 h-32 w-full object-cover rounded" />)
                    }
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Merchant: {s.merchantId}</div>
                      <div>
                        Type: {typeof s.serviceType === 'string' ? s.serviceType : (s.serviceType?.title ?? '')}
                      </div>
                      <div>Price: ${s.price}</div>
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
                <CardTitle>Create Service</CardTitle>
              </CardHeader>
              <CardContent>
                <ServiceForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ServicesPage;


