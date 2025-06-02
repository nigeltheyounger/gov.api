import { EtimsInvoice } from '../interfaces/etims';
import { ApiConfig } from '../interfaces/config';
import { EtimsApiClient } from '../clients/etims';

class TaxService {
  private etimsClient: EtimsApiClient;

  constructor(config: ApiConfig) {
    this.etimsClient = new EtimsApiClient(config);
  }

  async submitTaxInvoice(invoiceData: EtimsInvoice): Promise<any> {
    return await this.etimsClient.submitInvoice(invoiceData);
  }

  async getTaxpayerInformation(tin: string): Promise<any> {
    return await this.etimsClient.getTaxpayerInfo(tin);
  }

  async getTaxRates(): Promise<any> {
    return await this.etimsClient.getTaxRates();
  }
}

export default TaxService;