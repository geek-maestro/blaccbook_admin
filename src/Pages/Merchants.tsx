import React from "react";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MerchantForm from "@/components/MerchantForm";
import { useDeleteMerchant, useMerchants } from "@/services/merchant.service";

const MerchantsPage: React.FC = () => {
  const { data: merchants, isLoading, error } = useMerchants();
  const { mutate: remove } = useDeleteMerchant();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="list">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="list">Merchants</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
            </TabsList>
            <MerchantForm />
          </div>
          <TabsContent value="list">
            {isLoading && <div>Loading...</div>}
            {error && <div>Failed to load merchants</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {merchants?.map((m: any) => (
                <Card key={m.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{m.name}</CardTitle>
                      <Badge variant={m.approvalStatus === 'approved' ? 'default' : m.approvalStatus === 'rejected' ? 'destructive' : 'secondary'}>
                        {m.approvalStatus || 'pending'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{m.email}</div>
                      <div>{m.phone}</div>
                      <div className="truncate">{m.address}</div>
                      {m.image && (
                        <img src={m.image} alt={m.name} className="mt-2 h-32 w-full object-cover rounded" />
                      )}
                      {m.website && (
                        <a className="text-blue-600" href={m.website} target="_blank" rel="noreferrer">Website</a>
                      )}
                      {m.pricing && (
                        <div>Pricing: {m.pricing.fixedPrice ? `$${m.pricing.fixedPrice}` : '--'} / hr {m.pricing.hourlyRate ?? '--'}</div>
                      )}
                      {m.reviews && (
                        <div>Reviews: {m.reviews.average} ({m.reviews.count})</div>
                      )}
                      {m.serviceTypes?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {m.serviceTypes.map((s: string) => (
                            <Badge key={s} variant="outline">{s}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => remove(m.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create Merchant</CardTitle>
              </CardHeader>
              <CardContent>
                <MerchantForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MerchantsPage;


