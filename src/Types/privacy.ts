export interface IPrivacyPolicy {
  id?: string;
  content: string;
  version: string;
  effectiveDate: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type IPrivacy = IPrivacyPolicy;
