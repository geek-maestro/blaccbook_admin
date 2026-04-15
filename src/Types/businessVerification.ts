export type IBusinessVerification = {
    email?: string; // Kept for future use if added
    phone?: string; // Kept for future use if added
    address?: string; // Kept for future use if added
    description?: string; // Kept for future use if added
    notes?: string | null;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    submittedAt?: any; // Firestore Timestamp
    documentUrls?: string[];
    featuredImage?: string; // Kept for future use if added
    [key: string]: any; // Allow other properties
}
