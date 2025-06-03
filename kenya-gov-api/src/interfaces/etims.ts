
export interface EtimsInvoice {
  tin: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerTin?: string;
  items: EtimsInvoiceItem[];
  totalAmount: number;
  taxAmount: number;
  currency: string;
}

export interface EtimsInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  totalAmount: number;
}