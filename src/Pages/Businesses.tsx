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

const BusinessCard = ({ business }: { business: IBusiness }) => {
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
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex gap-4">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                <AvatarImage src={business.featuredImage} alt={business.name} />
                <AvatarFallback>{business.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg sm:text-xl break-words">{business.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="break-words">{business.contact.city}, {business.contact.state}</span>
                </CardDescription>
              </div>
            </div>
            {business.rating && (
              <Badge variant="secondary" className="flex items-center gap-1 w-fit">
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
                <Badge key={feature} variant="outline" className="break-words">
                  {feature}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="break-words">{business.contact.countryCode} {business.contact.telephone}</span>
              </div>
              {business.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1 flex-shrink-0" />
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-blue-500 break-words"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Website
                  </a>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="break-words">{formatDate(business.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          {business.isBookable && (
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
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
              className="w-full sm:w-auto"
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
  return (
    <div className="flex flex-col sm:flex-row h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Our Businesses</h1>
            <AddBusinessForm />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessList;