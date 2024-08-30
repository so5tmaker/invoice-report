# Invoice Report Project

## Overview
This project consists of two microservices: `invoice-service` and `email-sender-service`. The `invoice-service` is responsible for managing invoices, while the `email-sender-service` handles the sending of emails based on processed messages.

## Prerequisites

- Node.js (v14.x or later)
- npm
- Docker (for RabbitMQ and MongoDB)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/invoice-report.git
cd invoice-report

2. Install Dependencies

You can install the dependencies for both services using npm:

npm install

This command will install dependencies in both invoice-service and email-sender-service using npm workspaces.

3. Set Up Docker Containers

To run RabbitMQ and MongoDB, you can use Docker:

docker-compose up -d

This command will start RabbitMQ and MongoDB containers in the background.

How to Run the Services

1. Running the invoice-service

To start the invoice-service:

npm run start:invoice

2. Running the email-sender-service

To start the email-sender-service:

npm run start:email

3. Running Tests

Each service has its own unit and e2e tests. You can run the tests with the following commands:

Running Unit Tests

For invoice-service:

npm run test:unit:invoice

For email-sender-service:

npm run test:unit:email

Running e2e Tests

For invoice-service:

npm run test:e2e:invoice

4. Stop Docker Containers

To stop the Docker containers:

docker-compose down

Additional Notes on the Implementation

	•	Error Handling: Both services include robust error handling. For example, in invoice-service, errors during invoice retrieval or creation are logged and re-thrown for further handling.
	•	Logging: Logging is implemented using NestJS’s built-in Logger service. All critical operations and error cases are logged for traceability.
	•	Message Queue: The RabbitMQ service is used for asynchronous communication between invoice-service and email-sender-service. When an invoice is created, a message is published to a RabbitMQ queue, which is then processed by the email-sender-service to send an email.
	•	Docker Integration: RabbitMQ and MongoDB are managed through Docker, making it easy to set up and tear down the necessary infrastructure.
	•	Testing: Unit and e2e tests are provided to ensure the stability and correctness of both services. These tests cover critical functions and edge cases, ensuring the system behaves as expected under various scenarios.

Conclusion

This project demonstrates a microservices-based architecture with a focus on scalability and maintainability. Feel free to modify and expand upon this implementation as needed.