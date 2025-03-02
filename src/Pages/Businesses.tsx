import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Globe, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from '@/components/Sidebar';
import { IBusiness } from '@/Data/business';
import { mockBusinesses } from '@/Data/business';
import AddBusinessForm from '@/components/AddBusinessForm';
import { useBusinesses } from '@/services/business.service';

const BusinessCard = ({ business }: { business: IBusiness }) => {
  

  // const business = businesses.find((b: IBusiness) => b.id === id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/businesses/${business.id}`}>
      <Card className="w-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={business.featuredImage} alt={business.name} />
                <AvatarFallback>{business.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{business.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {business.contact.city}, {business.contact.state}
                </CardDescription>
              </div>
            </div>
            {business.rating && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {business.rating}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {business.features?.map((feature) => (
                <Badge key={feature} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                {business.contact.countryCode} {business.contact.telephone}
              </div>
              {business.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Website
                  </a>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(business.createdAt)}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {business.isBookable && (
            <Button 
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Book {business.bookableDetails?.bookableItemName}
            </Button>
          )}
          {business.hasMenu && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              View Menu
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

const BusinessList = () => {

  const { data:businesses, isLoading, error: fetchError } = useBusinesses();
  console.log(businesses, "data", fetchError, "Error fetching");
  // const businesses = data?.data || [];

  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (fetchError) {
    return <div>Error loading businesses</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Our Businesses</h1>
            <AddBusinessForm />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businesses?.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessList;