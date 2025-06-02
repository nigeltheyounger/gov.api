import { EtimsApiClient } from './clients/etims';
import { EcitizenApiClient } from './clients/ecitizen';
import { GavaConnectApiClient } from './clients/gavaconnect';
import { ApiConfig } from './interfaces/config';

class KenyaGovernmentApiApp {
  private etimsClient: EtimsApiClient;
  private ecitizenClient: EcitizenApiClient;
  private gavaConnectClient: GavaConnectApiClient;

  constructor(config: ApiConfig) {
    this.etimsClient = new EtimsApiClient(config);
    this.ecitizenClient = new EcitizenApiClient(config);
    this.gavaConnectClient = new GavaConnectApiClient(config);
  }

  // Example method to check the health of the API clients
  async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    try {
      await this.etimsClient.getTaxRates();
      results.etims = true;
    } catch {
      results.etims = false;
    }

    try {
      await this.ecitizenClient.getAvailableServices();
      results.ecitizen = true;
    } catch {
      results.ecitizen = false;
    }

    try {
      await this.gavaConnectClient.getIntegratedServices();
      results.gavaconnect = true;
    } catch {
      results.gavaconnect = false;
    }

    return results;
  }
}

// Export the application class for use in other modules
export default KenyaGovernmentApiApp;