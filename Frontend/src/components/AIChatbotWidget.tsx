import React, { useState, useEffect, useRef, useCallback } from 'react';
// We assume lucide-react and Tailwind CSS are available in the environment.
// For the purpose of this single file, we will define the component and the necessary logic.
import { Bot, Send, X, Loader2, Search } from 'lucide-react';
import { env } from 'process';

/**
 * Global variables provided by the environment for API calls.
 * We set them to empty strings to avoid runtime errors if run outside the target environment.
 */
const apiKey = 'AIzaSyBgOjyl1idu2naIR7UUqw2QOynwS-v-o_E' ;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

// --- Type Definitions ---
interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

interface Source {
  uri: string;
  title: string;
}

// Custom types for Gemini API interaction (replacing 'any')
interface Part {
  text: string;
}

interface Content {
  role: 'user' | 'model';
  parts: Part[];
}

// --- NEW/UPDATED API Response Types for Type Safety ---
// Resolves errors related to 'any' and complex object access
interface GroundingAttribution {
  web?: {
    uri: string;
    title: string;
  };
}

interface GroundingMetadata {
  groundingAttributions: GroundingAttribution[];
}

interface Candidate {
  content?: {
    parts?: Part[];
  };
  groundingMetadata?: GroundingMetadata;
}

// The complete expected response structure
interface GeminiResponse {
  candidates?: Candidate[];
}

interface GeminiPayload {
    contents: Content[];
    tools?: { "google_search": {} }[];
    systemInstruction?: { parts: Part[] };
}

// --- Utility Functions for API (with Exponential Backoff) ---

/**
 * Delays execution for a specified duration.
 * @param ms Milliseconds to wait.
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calls the Gemini API with exponential backoff for retries.
 * @param payload The request body for the generateContent API, now strictly typed.
 * @param maxRetries Maximum number of retries.
 * @returns The API response JSON (now strictly typed as GeminiResponse).
 */
async function callGeminiApiWithBackoff(payload: GeminiPayload, maxRetries = 5): Promise<GeminiResponse> { // UPDATED return type
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // If it's a 429 (Rate Limit), attempt retry
                if (response.status === 429 && attempt < maxRetries - 1) {
                    const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
                    // console.log(`Attempt ${attempt + 1} failed (Rate Limit). Retrying in ${delay}ms...`);
                    await sleep(delay);
                    continue;
                }
                throw new Error(`API call failed with status: ${response.status} ${response.statusText}`);
            }

            // Cast the JSON result to the strict GeminiResponse interface
            return await response.json() as GeminiResponse;

        } catch (error) {
            if (attempt === maxRetries - 1) {
                // FIX for Line 62 area: Safely cast the error to a string for use in the Error constructor
                throw new Error(`API call failed after ${maxRetries} attempts: ${error instanceof Error ? error.message : String(error)}`);
            }
            // For network errors or other non-429 errors, still use backoff
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
            // console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
            await sleep(delay);
        }
    }
    // Should never reach here if maxRetries > 0, but required for Promise return type
    throw new Error("Exhausted all API retries.");
}


// --- Main Chatbot Widget Component ---

const AIChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat window on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
        // Send initial welcome message when opening for the first time
        setMessages([{ id: Date.now(), role: 'bot', text: "Hello! I'm your professional AI assistant. How can I help you with your queries today?" }]);
    }
  };

  const handleSend = useCallback(async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory: Content[] = messages.map(msg => ({ // Explicitly typed as Content[]
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      // Add the new user message to the history for context
      chatHistory.push({ role: 'user', parts: [{ text: userMessage.text }] });

      const systemPrompt = "You are a helpful, professional, and knowledgeable AI assistant for a modern website. Your goal is to answer user queries concisely, accurately, and politely. Maintain a friendly yet formal tone.";
      
      const payload: GeminiPayload = { // Explicitly typed as GeminiPayload
        contents: chatHistory,
        // Using Google Search grounding for up-to-date and accurate information
        tools: [{ "google_search": {} }], 
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
      };

      const result: GeminiResponse = await callGeminiApiWithBackoff(payload); 
      
      const candidate = result.candidates?.[0];
      let botResponseText = "I'm sorry, I couldn't generate a helpful response right now. Please try again or rephrase your question.";
      const newSources: Source[] = [];

      if (candidate && candidate.content?.parts?.[0]?.text) {
        botResponseText = candidate.content.parts[0].text;
        
        // Extracting Grounding Sources
        const groundingMetadata = candidate.groundingMetadata;
        
        if (groundingMetadata && groundingMetadata.groundingAttributions) {
            // We can now safely iterate over groundingAttributions
            groundingMetadata.groundingAttributions.forEach((attribution) => {
                if (attribution.web?.uri && attribution.web?.title) {
                    newSources.push({
                        uri: attribution.web.uri,
                        title: attribution.web.title,
                    });
                }
            });
        }
      }

      // Format sources nicely for the bot's message
      const sourceText = newSources.length > 0 
        ? "\n\n**Sources:**\n" + newSources.map(s => `- [${s.title}](${s.uri})`).join('\n')
        : "";

      const botMessage: Message = { 
        id: Date.now() + 1, 
        role: 'bot', 
        text: botResponseText + sourceText 
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMessage: Message = { 
        id: Date.now() + 1, 
        role: 'bot', 
        text: "I encountered an error connecting to the AI service. Please check your connection or try again shortly." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  // Custom message rendering function to parse markdown (basic)
  // FIX for Line 239 area: Added explicit return type of JSX.Element
  const renderMessageText = (text: string): JSX.Element => {
    // Basic Markdown parsing for bold and links (sources)
    
    // Links (for sources)
    let renderedText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, title, url) => 
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline hover:text-blue-400 text-xs">${title}</a>`
    );

    // Bold text (e.g., **Sources:**)
    renderedText = renderedText.replace(/\*\*([^\*]+)\*\*/g, (match, content) => 
        `<strong class="font-semibold">${content}</strong>`
    );

    // Newlines to break tags
    renderedText = renderedText.replace(/\n/g, '<br/>');

    // VS Code might still warn about dangerouslySetInnerHTML, but it is necessary for markdown rendering.
    return <span dangerouslySetInnerHTML={{ __html: renderedText }} />;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-['Inter']">
      
      {/* --- Chat Window --- */}
      {isOpen && (
        <div 
          className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col w-[300px] sm:w-[350px] h-[450px] border border-gray-100 transition-all duration-300 ease-in-out transform scale-100"
          style={{ 
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            transformOrigin: 'bottom right'
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-indigo-600 text-white shadow-md">
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              <h2 className="text-lg font-bold">AI Helper Bot</h2>
            </div>
            <button 
              onClick={toggleChat} 
              className="p-1 rounded-full hover:bg-indigo-700 transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg text-sm shadow-md transition-all duration-300 ease-in-out ${
                    msg.role === 'user' 
                      ? 'bg-indigo-500 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                  }`}
                >
                  {renderMessageText(msg.text)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-white text-gray-600 text-sm border border-gray-200 rounded-tl-none flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-indigo-500" />
                    Typing...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="flex-grow p-3 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all duration-200"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className={`p-3 rounded-r-xl text-white transition-all duration-200 flex items-center justify-center shadow-md ${
                isLoading || input.trim() === '' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              disabled={isLoading || input.trim() === ''}
              aria-label="Send Message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* --- Floating Bot Icon --- */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-indigo-700' : 'bg-indigo-600'
        }`}
        style={{
            zIndex: 100, // Ensure it floats above other content
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
        }}
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

    </div>
  );
};

export default AIChatbotWidget;
