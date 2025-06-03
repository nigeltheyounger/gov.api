
export interface EcitizenPayment {
  serviceId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  referenceNumber: string;
}

export interface EcitizenApplication {
  serviceId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicationData: Record<string, any>;
  attachments?: ApplicationAttachment[];
}

interface ApplicationAttachment {
  name: string;
  type: string;
  data: string; // Base64 encoded
}