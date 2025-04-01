# Langchain Agent Backend

This project is a backend service for managing chat conversations using OpenAI's GPT model. It integrates with AWS S3 for storing chat histories and provides APIs for fetching and updating chat data.

## Prerequisites

- **Node.js**: Version `18.19.0`
- **Yarn**: Package manager for installing dependencies
- **AWS S3**: Ensure you have an S3 bucket set up with the correct credentials and permissions.

## Installation

Follow these steps to set up the project:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend/langchain-agent
   ```

2. Install dependencies using Yarn:
   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
   AWS_REGION=<your-aws-region>
   S3_BUCKET_NAME=<your-s3-bucket-name>
   PORT=3000
   LANGSMITH_TRACING=true
   LANGSMITH_ENDPOINT=https://api.smith.langchain.com
   LANGSMITH_API_KEY=<langshchain-api-key>
   LANGSMITH_PROJECT=<project-name>
   OPENAI_API_KEY=<openai-key>
   ```

4. Build the project:
   ```bash
   yarn build
   ```

5. Start the server:
   ```bash
   yarn start
   ```

6. For development, use:
   ```bash
   yarn dev
   ```

## Project Logic

### Overview

The backend provides APIs for managing chat conversations. It uses OpenAI's GPT model for generating responses and AWS S3 for storing chat histories. The project is structured into controllers, routes, middleware, models, and utility functions for better modularity and maintainability.

### Key Features

1. **Chat History Management**:
   - Fetch chat history from S3.
   - Create a new chat history file in S3 if it does not exist.

2. **Ongoing Chat Management**:
   - Append user messages and AI responses to the chat history.
   - Save the updated chat history back to S3.

3. **Error Handling**:
   - Centralized error handling middleware for consistent error responses.

### Project Structure

- **`src\Controllers\ChatController.ts`**:
  - Contains the logic for handling chat-related API requests.
  - Fetches and updates chat history in S3.
  - Uses `ChatHandler` to interact with OpenAI's GPT model.

- **`src\Models\ChatModel.ts`**:
  - Defines the structure of chat messages and chat history.

- **`src\Routes\ChatRoutes.ts`**:
  - Defines the API endpoints for chat operations:
    - `GET /api/chat/history`: Fetch chat history.
    - `POST /api/chat/ongoingagent`: Append a new message and response to the chat history.

- **`src\middleware\ErrorHandler.ts`**:
  - Middleware for handling errors and returning consistent error responses.

- **`src\utils\S3Utils.ts`**:
  - Utility functions for interacting with AWS S3 (e.g., fetching and saving objects).

- **`src\Core\ChatHandler.ts`**:
  - Handles the logic for interacting with OpenAI's GPT model.
  - Maintains a local history of messages for context-aware responses.

### API Endpoints

1. **`GET /api/chat/history?key=<key>`**:
   - Fetches the chat history for the given `key` from S3.
   - If the file does not exist, it creates a new file with an empty history.

2. **`POST /api/chat/ongoingagent`**:
   - Accepts a `key` and `content` in the request body.
   - Fetches the existing chat history from S3.
   - Appends the user message and AI response to the history.
   - Saves the updated history back to S3.

### Node.js Version

This project requires **Node.js version 18.19.0**. Ensure you have the correct version installed by running:
```bash
node -v
```

### Running the Project

1. Start the server:
   ```bash
   yarn start
   ```

2. Access the APIs:
   - Fetch chat history:
     ```bash
     curl http://localhost:3000/api/chat/history?key=<key>
     ```
   - Append a new message:
     ```bash
     curl -X POST http://localhost:3000/api/chat/ongoingagent \
     -H "Content-Type: application/json" \
     -d '{"key": "exampleKey", "content": "Hello, AI!"}'
     ```

### Notes

- Ensure the AWS credentials and S3 bucket are correctly configured in the `.env` file.
- Use the `yarn dev` command during development for automatic server restarts with `nodemon`.

### License

This project is licensed under the MIT License.