# Kenya Government APIs TypeScript Application

This application provides a framework for integrating with Kenya's government APIs, including eTIMS, eCitizen, and other GavaConnect services.

## Project Structure

- **src/**: Contains the source code for the application.
  - **clients/**: API client implementations for eTIMS, eCitizen, and GavaConnect.
  - **interfaces/**: TypeScript interfaces defining the structure of data used in API interactions.
  - **services/**: Business logic for handling payments, taxes, and applications.
  - **utils/**: Utility functions for authentication and hashing.
  - **app.ts**: Main entry point of the application.
  - **index.ts**: Module entry point for exporting components.

- **tests/**: Contains unit tests for the application.
  - **clients/**: Tests for API client classes.
  - **services/**: Tests for service functions.

- **.env.example**: Example environment configuration file.
- **.gitignore**: Specifies files and directories to ignore in Git.
- **package.json**: npm configuration file.
- **tsconfig.json**: TypeScript configuration file.

## Setup Instructions

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Create a `.env` file based on the `.env.example` file and fill in the required environment variables.
4. Run the application using `npm start`.

## Usage Examples

- To submit a tax invoice, use the `submitTaxInvoice` method from the tax service.
- To initiate a payment, use the `initiatePayment` method from the payment service.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
````