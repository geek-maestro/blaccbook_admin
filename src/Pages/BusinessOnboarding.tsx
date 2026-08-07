import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Camera,
  FileText,
  CreditCard,
  Users,
  Clock,
  Navigation,
  Crosshair
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';
import { useUserProfile } from '@/services/profile.service';
import { auth } from '@/lib/firebaseConfig';
import { post } from '@/lib/firestoreCrud';

const fetchActiveCategories = async () => {
  const res = await fetch('https://api-wki5bofifq-uc.a.run.app/content/categories');
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : (data.items || data.data || []);
};

const BusinessOnboarding = () => {
  const navigate = useNavigate();
  const { data: profile } = useUserProfile();
  const { data: activeCategories = [] } = useQuery({
    queryKey: ['active-categories'],
    queryFn: fetchActiveCategories
  });

  const coverInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    businessType: '',
    selectedCategoryId: '',
    description: '',
    categories: [] as string[],

    // Contact Information
    phone: '',
    email: profile?.email || '',
    website: '',

    // Location
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    lat: '',
    lng: '',

    // Business Details
    hours: {
      monday: { open: '', close: '', closed: false },
      tuesday: { open: '', close: '', closed: false },
      wednesday: { open: '', close: '', closed: false },
      thursday: { open: '', close: '', closed: false },
      friday: { open: '', close: '', closed: false },
      saturday: { open: '', close: '', closed: false },
      sunday: { open: '', close: '', closed: false }
    },

    // Images
    featuredImage: '',
    galleryImages: [] as string[],

    // Documents
    businessLicense: '',
    taxId: '',
    insurance: '',

    // Payment
    paymentMethods: [] as string[],
    commissionRate: 5
  });

  const fetchLiveLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          lat: String(pos.coords.latitude),
          lng: String(pos.coords.longitude)
        }));
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation detection warning:", err);
        setFormData(prev => ({
          ...prev,
          lat: prev.lat || "5.6037",
          lng: prev.lng || "-0.1870"
        }));
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    fetchLiveLocation();
  }, []);

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const businessCategories = [
    'Restaurant & Food',
    'Retail & Shopping',
    'Beauty & Wellness',
    'Health & Medical',
    'Professional Services',
    'Entertainment',
    'Automotive',
    'Home & Garden',
    'Education',
    'Technology',
    'Real Estate',
    'Other'
  ];

  const serviceTypes = [
    'Dine-in',
    'Takeout',
    'Delivery',
    'Online Orders',
    'Appointments',
    'Consultations',
    'Classes',
    'Events',
    'Rentals',
    'Repairs'
  ];

  const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Mobile Payment',
    'Bank Transfer',
    'Cryptocurrency'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handlePaymentMethodToggle = (method: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method]
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.businessName.trim() !== '' &&
          formData.businessType !== '' &&
          formData.description.trim() !== ''
        );
      case 2:
        return (
          formData.phone.trim() !== '' &&
          formData.email.trim() !== '' &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        );
      case 3:
        return (
          formData.address.trim() !== '' &&
          formData.city.trim() !== '' &&
          formData.state.trim() !== '' &&
          formData.zipCode.trim() !== ''
        );
      case 4:
        return Object.values(formData.hours).every(
          (h) => h.closed || (h.open !== '' && h.close !== '')
        );
      case 5:
        return formData.paymentMethods.length > 0;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      console.error("No authenticated user found.");
      return;
    }

    try {
      setIsSubmitting(true);
      const idToken = await auth.currentUser.getIdToken(true);

      const catIdToSend = formData.selectedCategoryId || (activeCategories[0]?.id || activeCategories[0]?.dbIdentifier || "retail");

      const bodyFormData = new FormData();
      bodyFormData.append("businessName", formData.businessName || "Example Business");
      bodyFormData.append("categoryId", String(catIdToSend));
      bodyFormData.append("description", formData.description || "");
      bodyFormData.append("location.address", formData.address || "Accra");
      bodyFormData.append("location.city", formData.city || "Accra");
      bodyFormData.append("location.state", formData.state || "Greater Accra");
      bodyFormData.append("location.country", formData.country || "Ghana");
      bodyFormData.append("location.postalCode", formData.zipCode || "00233");
      bodyFormData.append("coordinates.lat", String(parseFloat(formData.lat) || 0));
      bodyFormData.append("coordinates.lng", String(parseFloat(formData.lng) || 0));
      bodyFormData.append("contactPhone", formData.phone || "");
      bodyFormData.append("contactEmail", formData.email || "");
      bodyFormData.append("taxInfo", formData.taxId || "");
      bodyFormData.append("registrationInfo", formData.businessLicense || "");
      bodyFormData.append("isFeatured", "true");

      if (coverImageFile) {
        bodyFormData.append("coverImage", coverImageFile);
      } else if (formData.featuredImage) {
        bodyFormData.append("coverImage", formData.featuredImage);
      }

      console.log('Submitting merchant business via FormData');

      let token = auth.currentUser ? await auth.currentUser.getIdToken(true) : null;
      const headers: Record<string, string> = {
        "accept": "*/*"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let response = await fetch("https://api-wki5bofifq-uc.a.run.app/merchant/businesses", {
        method: "POST",
        headers,
        body: bodyFormData
      });

      if (response.status === 403 && auth.currentUser) {
        console.warn("403 Forbidden received. Bootstrapping merchant role and retrying...");
        try {
          await fetch("https://api-wki5bofifq-uc.a.run.app/auth/bootstrap", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ requestedRole: "merchant" })
          });

          token = await auth.currentUser.getIdToken(true);
          headers["Authorization"] = `Bearer ${token}`;

          response = await fetch("https://api-wki5bofifq-uc.a.run.app/merchant/businesses", {
            method: "POST",
            headers,
            body: bodyFormData
          });
        } catch (bootstrapErr) {
          console.error("Failed merchant role bootstrap retry:", bootstrapErr);
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend Error Response:", errorText);
        let errorMessage = response.statusText;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorText;
        } catch {
          errorMessage = errorText || response.statusText;
        }
        throw new Error(`API error (${response.status}): ${errorMessage}`);
      }

      console.log('Successfully onboarded business.');
      navigate('/merchant-businesses');
    } catch (error) {
      console.error('Error submitting business data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Information</h2>
              <p className="text-gray-600">Manage your active business directory listings.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Business Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your business, what you offer, and what makes you unique..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">Cover Image</Label>
                <div 
                  onClick={() => coverInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100/50 transition-colors mt-1"
                >
                  <input 
                    type="file" 
                    ref={coverInputRef} 
                    onChange={handleCoverFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  {coverImagePreview ? (
                    <div className="relative w-full max-h-48 overflow-hidden rounded-md border border-gray-200 flex items-center justify-center bg-black">
                      <img src={coverImagePreview} alt="Cover Preview" className="max-h-48 object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                        Click to change cover image
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-2">
                      <Camera className="h-8 w-8 text-gray-400 mb-1" />
                      <p className="text-gray-600 font-semibold text-sm">Click to upload cover image</p>
                      <p className="text-gray-400 text-xs mt-0.5">PNG, JPG, JPEG (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="category-select">Business Category *</Label>
                <Select 
                  value={formData.selectedCategoryId} 
                  onValueChange={(value) => handleInputChange('selectedCategoryId', value)}
                >
                  <SelectTrigger id="category-select" className="mt-1">
                    <SelectValue placeholder="Select an active category" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCategories.map((cat: any) => {
                      const catId = String(cat.id || cat.dbIdentifier || cat.name);
                      return (
                        <SelectItem key={catId} value={catId}>
                          {cat.name || cat.title || catId}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
              <p className="text-gray-600">How can customers reach you?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="business@example.com"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Location</h2>
              <p className="text-gray-600">Where is your business located?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="12345"
                    required
                  />
                </div>
              </div>

              {/* Map Pointer & Live Geolocation */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Business Location Pin
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fetchLiveLocation}
                    disabled={isLocating}
                    className="text-xs flex items-center gap-1.5 border-blue-200 text-blue-700 bg-blue-50/80 hover:bg-blue-100 transition-colors"
                  >
                    <Navigation className={`h-3.5 w-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                    {isLocating ? 'Detecting GPS...' : 'Use Current Live Location'}
                  </Button>
                </div>

                <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-300 shadow-inner bg-gray-100 group">
                  {/* Embedded Google Map centered on current live lat/lng */}
                  <iframe
                    title="Business Location Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://maps.google.com/maps?q=${formData.lat || '5.6037'},${formData.lng || '-0.1870'}&z=15&output=embed`}
                    className="w-full h-full border-0 pointer-events-none"
                  />

                  {/* Center Location Pin Marker */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative flex flex-col items-center -mt-6">
                      <div className="bg-blue-600 text-white rounded-full p-2.5 shadow-lg border-2 border-white animate-bounce">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div className="w-3 h-1.5 bg-black/30 rounded-full blur-[1px]" />
                    </div>
                  </div>

                  {/* Coordinates Overlay Bar */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-gray-200 shadow-md flex items-center justify-between text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="font-semibold text-gray-900">GPS Location:</span>
                      <span className="font-mono text-gray-600">
                        {formData.lat || '5.6037'}° N, {formData.lng || '-0.1870'}° W
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                      Live GPS Active
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Hours</h2>
              <p className="text-gray-600">When is your business open?</p>
            </div>

            <div className="space-y-4">
              {Object.entries(formData.hours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4 p-1 md:p-4 border rounded-lg">
                  <div className="w-20">
                    <Label className="capitalize">{day}</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={hours.closed}
                      onCheckedChange={(checked) =>
                        handleInputChange('hours', {
                          ...formData.hours,
                          [day]: { ...hours, closed: checked as boolean }
                        })
                      }
                    />
                    <Label>Closed</Label>
                  </div>

                  {!hours.closed && (
                    <div className="flex flex-col md:flex-row items-center space-x-2">
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) =>
                          handleInputChange('hours', {
                            ...formData.hours,
                            [day]: { ...hours, open: e.target.value }
                          })
                        }
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) =>
                          handleInputChange('hours', {
                            ...formData.hours,
                            [day]: { ...hours, close: e.target.value }
                          })
                        }
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Methods</h2>
              <p className="text-gray-600">Select the payment methods your business accepts.</p>
            </div>


            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {paymentMethods.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={method}
                      checked={formData.paymentMethods.includes(method)}
                      onCheckedChange={() => handlePaymentMethodToggle(method)}
                    />
                    <Label htmlFor={method} className="text-sm">{method}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
              <p className="text-gray-600">Review your information before submitting</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Business Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Name:</strong> {formData.businessName}</p>
                  <p><strong>Type:</strong> {formData.businessType}</p>
                  <p><strong>Description:</strong> {formData.description}</p>
                  <div>
                    <strong>Categories:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.categories.map((category) => (
                        <Badge key={category} variant="secondary">{category}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  {formData.website && <p><strong>Website:</strong> {formData.website}</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Location</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{formData.address}</p>
                  <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                  {(formData.lat || formData.lng) && (
                    <p className="text-sm text-gray-500 mt-1">
                      Coordinates: {formData.lat || '0'}, {formData.lng || '0'}
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">What happens next?</h3>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your business application will be reviewed by our team</li>
                  <li>• We'll verify your business information and documents</li>
                  <li>• You'll receive an email notification once approved</li>
                  <li>• Your business will be live on the platform within 24-48 hours</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-1 md:p-4 lg:p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isStepValid()}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Submit Application</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessOnboarding;
