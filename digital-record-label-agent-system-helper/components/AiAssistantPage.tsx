
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai"; // Part type might be needed if Content construction requires it.
import { ChatMessage, GroundingChunk } from '../types';
import { SendIcon, AiIcon } from './icons';

// Function to safely retrieve API_KEY from process.env
function getApiKey(): string {
  console.log("Attempting to retrieve API_KEY from process.env.API_KEY"); // New log
  try {
    if (
      typeof process !== 'undefined' &&
      process.env &&
      typeof process.env.API_KEY === 'string' &&
      process.env.API_KEY.trim() !== '' // Ensure it's not just whitespace
    ) {
      console.log("API_KEY found in process.env.API_KEY:", process.env.API_KEY ? 'Retrieved (value hidden for security)' : 'Not found or empty'); // Modified log
      return process.env.API_KEY;
    } else {
      console.log("API_KEY not found or is empty in process.env.API_KEY."); // New log
    }
  } catch (e) {
    console.warn("Error attempting to access process.env.API_KEY:", e);
  }
  return "";
}

const API_KEY = getApiKey();

const systemInstructionText = "You are an expert AI assistant for the 'Digital Record Label Agent System'. Your knowledge base includes details about its architecture (Orchestrator, MCP Server, various agents like Audio Analysis, Metadata, Distribution, Marketing, Rights Licensing, Customer Support, Analytics Reporting), Docker & Kubernetes deployment (Dockerfiles, docker-compose.yml, k8s manifests like ConfigMaps, Secrets, Deployments, Ingress), and verification procedures. Answer questions clearly and concisely, focusing on providing helpful information related to this specific system. If asked about general topics, politely state that you are specialized for the Digital Record Label Agent System. If providing information that might come from external sources via search grounding, clearly state this and list the sources if available.";

const AiAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const ai = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    if (API_KEY) {
      try {
        ai.current = new GoogleGenAI({ apiKey: API_KEY });
        console.log("GoogleGenAI client initialized successfully."); // New log
      } catch (e) {
        console.error("Failed to initialize GoogleGenAI:", e);
        setError("Failed to initialize AI. Please check API key configuration.");
      }
    } else {
      setError("API Key is not configured. AI Assistant is disabled.");
      console.warn("API_KEY from environment is not set or accessible. AI Assistant will be disabled.");
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || !ai.current) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const history: Content[] = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }], 
      }));
      
      const currentMessageContent: Content = { 
        role: 'user', 
        parts: [{ text: userMessage.text }] 
      };

      const contentsForApi: Content[] = [...history, currentMessageContent];
      
      const response: GenerateContentResponse = await ai.current.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: contentsForApi,
        config: {
          systemInstruction: systemInstructionText,
        }
      });
      
      const aiResponseText = response.text;
      const groundingChunks: GroundingChunk[] | undefined = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

      let fullAiText = aiResponseText;
      if (groundingChunks && groundingChunks.length > 0) {
        const sourcesText = groundingChunks
          .map((chunk, index) => {
            const uri = chunk.web?.uri || chunk.retrievedContext?.uri;
            const title = chunk.web?.title || chunk.retrievedContext?.title || uri;
            if (uri && (uri.startsWith('http://') || uri.startsWith('https://'))) {
               return `${index + 1}. [${title}](${uri})`;
            }
            return title ? `${index + 1}. ${title} (No valid link)` : null;
          })
          .filter(Boolean)
          .join('\n');
        if (sourcesText) {
          fullAiText += `\n\n**Sources:**\n${sourcesText}`;
        }
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: fullAiText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (e: any) {
      console.error("Gemini API error:", e);
      setError(`Failed to get response from AI: ${e.message || 'Unknown error'}`);
      const errorMessageText = `Sorry, I encountered an error: ${e.message || 'Please try again later.'}`;
      const errorAiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: errorMessageText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, isLoading, messages]);

  const renderMessageText = (text: string) => {
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;"); 

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, 
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-light hover:underline inline-flex items-center">$1 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 ml-1 inline-block"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg></a>');
    
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-700 p-2 rounded-md my-2 text-sm overflow-x-auto"><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>');
    
    html = html.replace(/\n/g, '<br />');
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };


  if (!API_KEY) { 
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <AiIcon className="w-24 h-24 text-gray-600 mb-6" />
        <h2 className="text-2xl font-semibold text-text-dark-primary mb-4">AI Assistant Disabled</h2>
        <p className="text-gray-400 max-w-md">
          The API key for the AI service is not configured. Please ensure the <code>API_KEY</code> 
          environment variable is set correctly and accessible in your deployment environment to enable this feature.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-800 rounded-t-lg">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl lg:max-w-2xl px-4 py-3 rounded-xl shadow ${
                msg.sender === 'user' 
                  ? 'bg-primary-DEFAULT text-white' 
                  : 'bg-neutral-dark text-text-dark-secondary'
              }`}
            >
              <div className="prose prose-sm prose-invert max-w-none text-text-dark-secondary">
                {renderMessageText(msg.text)}
              </div>
              <div className={`text-xs mt-1 opacity-70 ${msg.sender === 'user' ? 'text-gray-200' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      {error && <div className="p-3 text-sm text-red-400 bg-red-900/50 text-center">{error}</div>}
      <div className="p-4 border-t border-gray-700 bg-neutral-dark rounded-b-lg">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Ask about the Digital Record Label System..."
            className="flex-grow p-3 bg-gray-700 text-text-dark-primary rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-shadow"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-primary-light outline-none"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <SendIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;
    