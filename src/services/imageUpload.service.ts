import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";

export const uploadBusinessImage = async (file: File, businessId: string, imageType: 'featured' | 'gallery' = 'gallery'): Promise<string> => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Validate businessId
    if (!businessId || businessId.trim() === '') {
      throw new Error('Business ID is required');
    }

    // Create a unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${businessId}_${imageType}_${timestamp}.${fileExtension}`;
    
    // Create storage reference
    const storageRef = ref(storage, `business-images/${businessId}/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('storage/unauthorized')) {
        throw new Error('Upload unauthorized. Please check your permissions.');
      } else if (error.message.includes('storage/quota-exceeded')) {
        throw new Error('Storage quota exceeded. Please try again later.');
      } else if (error.message.includes('storage/network-request-failed')) {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw new Error(`Upload failed: ${error.message}`);
      }
    } else {
      throw new Error('Failed to upload image. Please try again.');
    }
  }
};

export const deleteBusinessImage = async (imageUrl: string): Promise<void> => {
  try {
    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    // Extract the path from the URL
    const url = new URL(imageUrl);
    const path = decodeURIComponent(url.pathname.split('/o/')[1]?.split('?')[0] || '');
    
    if (!path) {
      throw new Error('Could not extract file path from URL');
    }
    
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    
  } catch (error) {
    console.error('Error deleting image:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('storage/object-not-found')) {
        throw new Error('Image not found. It may have already been deleted.');
      } else {
        throw new Error(`Delete failed: ${error.message}`);
      }
    } else {
      throw new Error('Failed to delete image. Please try again.');
    }
  }
};

export const uploadProductImage = async (file: File, businessId: string, productId: string): Promise<string> => {
  try {
    // Validate inputs
    if (!file) {
      throw new Error('No file provided');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    if (!businessId || !productId) {
      throw new Error('Business ID and Product ID are required');
    }

    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${businessId}_product_${productId}_${timestamp}.${fileExtension}`;
    
    const storageRef = ref(storage, `product-images/${businessId}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading product image:', error);
    throw new Error('Failed to upload product image');
  }
}; 

export const uploadMerchantImage = async (file: File, merchantId: string): Promise<string> => {
  try {
    if (!file) throw new Error('No file provided');
    if (!file.type.startsWith('image/')) throw new Error('File must be an image');
    if (!merchantId || merchantId.trim() === '') throw new Error('Merchant ID is required');

    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${merchantId}_featured_${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, `merchant-images/${merchantId}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading merchant image:', error);
    throw new Error('Failed to upload merchant image');
  }
};