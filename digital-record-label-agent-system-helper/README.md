# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Checking API Status

To ensure the AI Assistant's connection to the Gemini API is working correctly:

1.  **Set API Key**:
    *   Ensure you have a Gemini API key.
    *   In the root of the project, create a file named `.env.local` if it doesn't already exist.
    *   Add your API key to this file. The application code currently expects the key as `API_KEY`. For example:
        ```
        API_KEY=your_gemini_api_key_here
        ```
    *   Note: The original README mentions `GEMINI_API_KEY`. While Vite supports loading various `.env` files, the application code in `AiAssistantPage.tsx` specifically looks for `process.env.API_KEY`. For clarity and to ensure functionality, use `API_KEY` in your `.env.local` file.

2.  **Run the Application**:
    ```bash
    npm install
    npm run dev
    ```

3.  **Open Developer Console**: Open your web browser's developer console (usually by pressing F12) and navigate to the "Console" tab.

4.  **Navigate to AI Assistant**: Go to the AI Assistant page in the application.

5.  **Observe Console Logs**:
    *   You should see a log message like: "Attempting to retrieve API_KEY from process.env.API_KEY".
    *   If the key is found, you'll see: "API_KEY found in process.env.API_KEY: Retrieved (value hidden for security)".
    *   Then, you should see: "GoogleGenAI client initialized successfully."
    *   If you see warnings like "API_KEY not found..." or "Failed to initialize GoogleGenAI...", double-check your `.env.local` file and the API key itself.

6.  **Test by Sending a Message**:
    *   If the console logs indicate successful initialization, try sending a simple message through the AI Assistant chat interface.
    *   A successful response from the AI confirms that the API communication is working end-to-end.
    *   If you encounter errors in the UI (e.g., "Failed to get response from AI"), check the console for more detailed error messages from the API.
