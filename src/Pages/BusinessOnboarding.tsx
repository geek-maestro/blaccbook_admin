import React, { useState } from 'react';
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
  Clock
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
import { useUserProfile } from '@/services/profile.service';
import { auth } from '@/lib/firebaseConfig';
import { post } from '@/lib/firestoreCrud';

const BusinessOnboarding = () => {
  const navigate = useNavigate();
  const { data: profile } = useUserProfile();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    businessType: '',
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
          formData.description.trim() !== '' &&
          formData.categories.length > 0
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

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      console.error("No authenticated user found.");
      return;
    }

    try {
      setIsSubmitting(true);
      const idToken = await auth.currentUser.getIdToken(true);

      const documentUrls = [formData.featuredImage, ...formData.galleryImages].filter(url => url !== "");

      const payload = {
        businessName: formData.businessName || "Default Business Name",
        taxInfo: formData.taxId || "Not Provided yet",
        registrationInfo: formData.businessLicense || "Not Provided yet",
        address: formData.address || "Not Provided",
        location: {
          address: formData.address || "Not Provided",
          city: formData.city || "Not Provided",
          state: formData.state || "Not Provided",
          country: formData.country || "Not Provided",
          postalCode: formData.zipCode || "Not Provided"
        },
        coordinates: {
          lat: parseFloat(formData.lat) || 0,
          lng: parseFloat(formData.lng) || 0
        },
        contactPhone: formData.phone || "Not Provided",
        contactEmail: formData.email || "Not Provided",
        categories: formData.categories.length > 0 ? formData.categories : ["Not Provided"],
        documentUrls: documentUrls.length > 0 ? documentUrls : ["Not Provided"]
      };

      console.log('Submitting business data payload:', payload);

      const response = await fetch("https://api-wki5bofifq-uc.a.run.app/merchant/businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(payload)
      });

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
              <p className="text-gray-600">Tell us about your business</p>
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
                <Label>Business Categories *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {businessCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={formData.categories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label htmlFor={category} className="text-sm">{category}</Label>
                    </div>
                  ))}
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lat">Latitude (Optional)</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => handleInputChange('lat', e.target.value)}
                    placeholder="e.g. 40.7128"
                  />
                </div>

                <div>
                  <Label htmlFor="lng">Longitude (Optional)</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => handleInputChange('lng', e.target.value)}
                    placeholder="e.g. -74.0060"
                  />
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
                <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
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
                    <div className="flex items-center space-x-2">
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
      <div className="max-w-4xl mx-auto p-6">
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
