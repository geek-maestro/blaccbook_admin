import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Image, 
  Video, 
  FileText, 
  Flag, 
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Ban,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import RoleBasedRoute from '@/components/RoleBasedRoute';
import AdminSidebar from '@/components/AdminSidebar';

const AdminContentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock reviews data
  const reviews = [
    {
      id: '1',
      businessName: 'Soul Kitchen Restaurant',
      businessId: 'biz-001',
      reviewerName: 'John Smith',
      reviewerEmail: 'john@email.com',
      rating: 5,
      review: 'Amazing food and great service! The staff was very friendly and the atmosphere was perfect for a family dinner.',
      status: 'approved',
      flagged: false,
      createdAt: '2024-04-05T14:30:00Z',
      helpful: 12,
      reported: 0,
      images: ['review1.jpg', 'review2.jpg']
    },
    {
      id: '2',
      businessName: 'Black Excellence Barber Shop',
      businessId: 'biz-002',
      reviewerName: 'Mike Johnson',
      reviewerEmail: 'mike@email.com',
      rating: 4,
      review: 'Great haircut and professional service. Will definitely come back again.',
      status: 'pending',
      flagged: false,
      createdAt: '2024-04-05T12:15:00Z',
      helpful: 8,
      reported: 0,
      images: []
    },
    {
      id: '3',
      businessName: 'Tech Solutions LLC',
      businessId: 'biz-003',
      reviewerName: 'Sarah Wilson',
      reviewerEmail: 'sarah@email.com',
      rating: 2,
      review: 'Poor service and unprofessional behavior. Would not recommend.',
      status: 'flagged',
      flagged: true,
      createdAt: '2024-04-04T16:45:00Z',
      helpful: 2,
      reported: 3,
      images: []
    }
  ];

  // Mock content items
  const contentItems = [
    {
      id: '1',
      type: 'image',
      title: 'Restaurant Interior Photo',
      businessName: 'Soul Kitchen Restaurant',
      uploader: 'Marcus Johnson',
      status: 'approved',
      flagged: false,
      uploadedAt: '2024-04-05T10:00:00Z',
      fileSize: '2.3 MB',
      dimensions: '1920x1080',
      tags: ['interior', 'restaurant', 'dining']
    },
    {
      id: '2',
      type: 'video',
      title: 'Barber Shop Demo Video',
      businessName: 'Black Excellence Barber Shop',
      uploader: 'James Wilson',
      status: 'pending',
      flagged: false,
      uploadedAt: '2024-04-05T09:30:00Z',
      fileSize: '15.7 MB',
      dimensions: '1080x1920',
      tags: ['demo', 'barber', 'styling']
    },
    {
      id: '3',
      type: 'image',
      title: 'Inappropriate Content',
      businessName: 'Unknown Business',
      uploader: 'Anonymous User',
      status: 'flagged',
      flagged: true,
      uploadedAt: '2024-04-04T20:15:00Z',
      fileSize: '1.8 MB',
      dimensions: '800x600',
      tags: ['inappropriate', 'flagged']
    }
  ];

  // Mock community posts
  const communityPosts = [
    {
      id: '1',
      title: 'Black Business Spotlight: Soul Kitchen',
      author: 'Community Manager',
      authorEmail: 'community@blaccbook.com',
      content: 'This week we\'re highlighting Soul Kitchen Restaurant, a family-owned business serving the community for over 20 years...',
      type: 'news',
      status: 'published',
      flagged: false,
      publishedAt: '2024-04-05T08:00:00Z',
      views: 1250,
      likes: 89,
      comments: 23,
      tags: ['spotlight', 'restaurant', 'community']
    },
    {
      id: '2',
      title: 'Black Business Friday Event',
      author: 'Event Coordinator',
      authorEmail: 'events@blaccbook.com',
      content: 'Join us this Friday for our monthly Black Business Friday event featuring local vendors and special discounts...',
      type: 'event',
      status: 'draft',
      flagged: false,
      publishedAt: null,
      views: 0,
      likes: 0,
      comments: 0,
      tags: ['event', 'friday', 'vendors']
    }
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.review.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'flagged':
        return 'destructive';
      case 'rejected':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'news':
        return FileText;
      case 'event':
        return Calendar;
      default:
        return FileText;
    }
  };

  return (
    <RoleBasedRoute requiredPermission="canManageContent">
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Content & Community Management</h1>
              <p className="text-gray-600">Moderate reviews, content, and community posts</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reviews.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {reviews.filter(r => r.status === 'approved').length} approved
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reviews.filter(r => r.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting moderation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
                  <Flag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reviews.filter(r => r.flagged).length + contentItems.filter(c => c.flagged).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requires attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Community Posts</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{communityPosts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {communityPosts.filter(p => p.status === 'published').length} published
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Review Moderation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Moderate user reviews and ratings</p>
                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Review Pending Items
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Image className="h-5 w-5" />
                    <span>Content Moderation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Review uploaded images and videos</p>
                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Review Content
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Community Posts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Manage community news and events</p>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="reviews" className="space-y-6">
              <TabsList>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                <TabsTrigger value="content">Content ({contentItems.length})</TabsTrigger>
                <TabsTrigger value="community">Community ({communityPosts.length})</TabsTrigger>
                <TabsTrigger value="flagged">Flagged Items</TabsTrigger>
              </TabsList>

              <TabsContent value="reviews" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Review Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search reviews by business, reviewer, or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="flagged">Flagged</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" className="w-full md:w-auto">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <Card>
                  <CardHeader>
                    <CardTitle>User Reviews</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {filteredReviews.length} reviews found
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredReviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Star className="h-5 w-5 text-yellow-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold">{review.businessName}</h3>
                                  <Badge variant={getStatusBadgeVariant(review.status)}>
                                    {review.status}
                                  </Badge>
                                  {review.flagged && (
                                    <Badge variant="destructive">
                                      <Flag className="h-3 w-3 mr-1" />
                                      Flagged
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-4 mb-2">
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-600">by {review.reviewerName}</span>
                                  <span className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                
                                <p className="text-sm text-gray-700 mb-3">{review.review}</p>
                                
                                {review.images.length > 0 && (
                                  <div className="flex space-x-2 mb-3">
                                    {review.images.map((image, index) => (
                                      <div key={index} className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Image className="h-6 w-6 text-gray-500" />
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <ThumbsUp className="h-3 w-3" />
                                    <span>{review.helpful} helpful</span>
                                  </span>
                                  {review.reported > 0 && (
                                    <span className="flex items-center space-x-1 text-red-600">
                                      <Flag className="h-3 w-3" />
                                      <span>{review.reported} reports</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Approve Review
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject Review
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Review
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-orange-600">
                                    <Flag className="h-4 w-4 mr-2" />
                                    Flag for Review
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Review
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Moderation</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Review uploaded images, videos, and other content
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contentItems.map((item) => {
                        const ContentIcon = getContentTypeIcon(item.type);
                        return (
                          <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <ContentIcon className="h-6 w-6 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <Badge variant={getStatusBadgeVariant(item.status)}>
                                      {item.status}
                                    </Badge>
                                    {item.flagged && (
                                      <Badge variant="destructive">
                                        <Flag className="h-3 w-3 mr-1" />
                                        Flagged
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium">{item.businessName}</span> • 
                                    Uploaded by {item.uploader}
                                  </div>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span>Type: {item.type}</span>
                                    <span>Size: {item.fileSize}</span>
                                    <span>Dimensions: {item.dimensions}</span>
                                    <span>Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {item.tags.map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Approve Content
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject Content
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Tags
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-orange-600">
                                      <Flag className="h-4 w-4 mr-2" />
                                      Flag Content
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Content
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="community" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Community Posts</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Manage community news, events, and cultural content
                        </p>
                      </div>
                      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Post
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Create Community Post</DialogTitle>
                            <DialogDescription>
                              Create a new community post, news article, or event announcement
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="title">Title</Label>
                              <Input id="title" placeholder="Post title" />
                            </div>
                            <div>
                              <Label htmlFor="type">Type</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="news">News Article</SelectItem>
                                  <SelectItem value="event">Event</SelectItem>
                                  <SelectItem value="spotlight">Business Spotlight</SelectItem>
                                  <SelectItem value="community">Community Update</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="content">Content</Label>
                              <Textarea id="content" placeholder="Post content" rows={6} />
                            </div>
                            <div>
                              <Label htmlFor="tags">Tags</Label>
                              <Input id="tags" placeholder="Enter tags separated by commas" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={() => setIsCreateDialogOpen(false)}>
                              Create Post
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {communityPosts.map((post) => {
                        const PostIcon = getContentTypeIcon(post.type);
                        return (
                          <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <PostIcon className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-semibold">{post.title}</h3>
                                    <Badge variant={getStatusBadgeVariant(post.status)}>
                                      {post.status}
                                    </Badge>
                                    <Badge variant="outline">
                                      {post.type}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-gray-600 mb-2">
                                    by {post.author} • {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                                  </div>
                                  <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                                    <span className="flex items-center space-x-1">
                                      <Eye className="h-3 w-3" />
                                      <span>{post.views} views</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <ThumbsUp className="h-3 w-3" />
                                      <span>{post.likes} likes</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <MessageSquare className="h-3 w-3" />
                                      <span>{post.comments} comments</span>
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {post.tags.map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Publish Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Clock className="h-4 w-4 mr-2" />
                                      Schedule Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <TrendingUp className="h-4 w-4 mr-2" />
                                      Boost Post
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Post
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flagged" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Flagged Items</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Review items that have been flagged by users or automated systems
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No flagged items at this time</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </RoleBasedRoute>
  );
};

export default AdminContentManagement;
