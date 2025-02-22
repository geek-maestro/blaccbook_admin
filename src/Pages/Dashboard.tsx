import  { useState } from 'react';

import Sidebar from '@/components/Sidebar';
import { Search, Star, TrendingUp, Users, DollarSign, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function BusinessDashboard() {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("week");

 

  const metrics = [
    {
      title: "Total Reviews",
      value: "1,234",
      change: "+12.3%",
      icon: Star,
    },
    {
      title: "Avg Rating",
      value: "4.5",
      change: "+0.3",
      icon: TrendingUp,
    },
    {
      title: "Monthly Visitors",
      value: "45.2K",
      change: "+8.1%",
      icon: Users,
    },
    {
      title: "Revenue",
      value: "$12.5K",
      change: "+23.1%",
      icon: DollarSign,
    },
  ];

  const recentReviews = [
    {
      id: 1,
      author: "Sarah M.",
      rating: 5,
      comment: "Amazing service and atmosphere! Will definitely come back.",
      date: "2 hours ago",
      avatar: "/api/placeholder/32/32",
      helpful: 12
    },
    {
      id: 2,
      author: "John D.",
      rating: 4,
      comment: "Great experience overall, but parking was a bit difficult.",
      date: "5 hours ago",
      avatar: "/api/placeholder/32/32",
      helpful: 8
    },
    {
      id: 3,
      author: "Mike R.",
      rating: 3,
      comment: "Food was good but service was slow during peak hours.",
      date: "1 day ago",
      avatar: "/api/placeholder/32/32",
      helpful: 5
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
     
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
              <p className="text-gray-500">Welcome back, Daniel</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reviews..."
                  className="pl-10 w-64"
                />
              </div>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Last 24 Hours</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {metric.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-green-500 mt-1">
                      {metric.change} from last period
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>Overview of customer ratings</CardDescription>
              </CardHeader>
              <CardContent>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">{rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <span className="text-sm text-gray-500">
                        {rating === 5 ? '68%' : 
                         rating === 4 ? '22%' :
                         rating === 3 ? '7%' :
                         rating === 2 ? '2%' : '1%'}
                      </span>
                    </div>
                    <Progress 
                      value={rating === 5 ? 68 : 
                             rating === 4 ? 22 :
                             rating === 3 ? 7 :
                             rating === 2 ? 2 : 1} 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Latest customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="flex space-x-4">
                      <Avatar>
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{review.author}</h4>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-400">{review.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="secondary">
                            {review.helpful} people found this helpful
                          </Badge>
                          <Button variant="ghost" size="sm">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessDashboard;