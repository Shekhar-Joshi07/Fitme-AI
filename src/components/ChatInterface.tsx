import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, User, Settings, Zap, Heart, Brain, Apple, Trash2, ArrowLeft, Sparkles, Mic, MicOff, Volume2, VolumeX, Menu, X, MessageSquare, Calendar } from "lucide-react";
import { ThemeToggle } from "./ThemeProvider";
import { format, parseISO } from 'date-fns';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const ChatInterface = ({ userDetails, setUserDetails, onBackToDashboard }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(() => {
    const savedCurrentChat = localStorage.getItem(`current_chat_${userDetails.name}`);
    return savedCurrentChat || `chat_${Date.now()}`;
  });
  
  const [chatSessions, setChatSessions] = useState(() => {
    const savedSessions = localStorage.getItem(`chat_sessions_${userDetails.name}`);
    return savedSessions ? JSON.parse(savedSessions) : [];
  });


  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(`${currentChatId}_${userDetails.name}`);
    return savedMessages ? JSON.parse(savedMessages) : [
      {
        role: "assistant",
        content: `Hey ${userDetails.name}! 👋 Welcome to FitMe! I'm here to be your personal health and wellness coach. Ready to crush your goals together? 💪`
      }
    ];
  });


  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [currentSpeaking, setCurrentSpeaking] = useState(null);
  const messagesEndRef = useRef(null);
  const [shouldSaveToLocalStorage, setShouldSaveToLocalStorage] = useState(true);
  const recognitionRef = useRef(null);

  const quickPrompts = [
    { icon: Zap, text: "Suggest a 10-min workout", prompt: "Give me a quick 10-minute workout I can do right now" },
    { icon: Apple, text: "Healthy snack idea", prompt: "Suggest a healthy snack idea for me" },
    { icon: Heart, text: "I need motivation today", prompt: "I need some motivation and encouragement today" },
    { icon: Brain, text: "Help me with stress", prompt: "Give me some tips to manage stress and feel better" }
  ];

  // Initialize current chat session if it doesn't exist
  useEffect(() => {
    const existingSession = chatSessions.find(session => session.id === currentChatId);
    if (!existingSession && messages.length > 0) {
      const newSession = {
        id: currentChatId,
        title: generateChatTitle(messages),
        date: new Date().toISOString(),
        lastMessage: messages[messages.length - 1]?.content || ""
      };
      const updatedSessions = [newSession, ...chatSessions];
      setChatSessions(updatedSessions);
      localStorage.setItem(`chat_sessions_${userDetails.name}`, JSON.stringify(updatedSessions));
    }
  }, [currentChatId, chatSessions, messages, userDetails.name]);

  // Generate chat title based on first user message or default
  const generateChatTitle = (msgs) => {
    const firstUserMessage = msgs.find(msg => msg.role === "user");
    if (firstUserMessage) {
      return firstUserMessage.content.length > 40 
        ? firstUserMessage.content.substring(0, 40) + "..."
        : firstUserMessage.content;
    }
    return "New Chat";
  };

  // Update chat session when messages change
  useEffect(() => {
    if (messages.length > 1) { // More than just the welcome message
      setChatSessions(prevSessions => {
        const updatedSessions = prevSessions.map(session => {
          if (session.id === currentChatId) {
            return {
              ...session,
              title: generateChatTitle(messages),
              lastMessage: messages[messages.length - 1]?.content || "",
              date: session.date // Keep original date
            };
          }
          return session;
        });
        
        // If current chat doesn't exist in sessions, add it
        const existingSession = updatedSessions.find(session => session.id === currentChatId);
        if (!existingSession) {
          const newSession = {
            id: currentChatId,
            title: generateChatTitle(messages),
            date: new Date().toISOString(),
            lastMessage: messages[messages.length - 1]?.content || ""
          };
          updatedSessions.unshift(newSession);
        }
        
        localStorage.setItem(`chat_sessions_${userDetails.name}`, JSON.stringify(updatedSessions));
        return updatedSessions;
      });
    }
  }, [messages, currentChatId, userDetails.name]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0 && shouldSaveToLocalStorage) {
      localStorage.setItem(`${currentChatId}_${userDetails.name}`, JSON.stringify(messages));
    }
  }, [messages, currentChatId, userDetails.name, shouldSaveToLocalStorage]);

  // Save current chat ID
  useEffect(() => {
    localStorage.setItem(`current_chat_${userDetails.name}`, currentChatId);
  }, [currentChatId, userDetails.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create new chat
  const createNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    setCurrentChatId(newChatId);
    const welcomeMessage = {
      role: "assistant",
      content: `Hey ${userDetails.name}! 👋 Welcome to FitMe! I'm here to be your personal health and wellness coach. Ready to crush your goals together? 💪`
    };
    setMessages([welcomeMessage]);
    setSidebarOpen(false);
  };

  // Load existing chat
  const loadChat = (chatId) => {
    setCurrentChatId(chatId);
    const savedMessages = localStorage.getItem(`${chatId}_${userDetails.name}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Fallback to welcome message if no saved messages
      const welcomeMessage = {
        role: "assistant",
        content: `Hey ${userDetails.name}! 👋 Welcome to FitMe! I'm here to be your personal health and wellness coach. Ready to crush your goals together? 💪`
      };
      setMessages([welcomeMessage]);
    }
    setSidebarOpen(false);
  };

  // Delete individual chat
  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    
    // Remove from chat sessions
    const updatedSessions = chatSessions.filter(session => session.id !== chatId);
    setChatSessions(updatedSessions);
    localStorage.setItem(`chat_sessions_${userDetails.name}`, JSON.stringify(updatedSessions));
    
    // Remove chat messages from localStorage
    localStorage.removeItem(`${chatId}_${userDetails.name}`);
    
    // If we're deleting the current chat, load another chat or create new one
    if (chatId === currentChatId) {
      if (updatedSessions.length > 0) {
        loadChat(updatedSessions[0].id);
      } else {
        createNewChat();
      }
    }
  };

  // Clear all chats
  const clearAllChats = () => {
    // Remove all chat sessions
    chatSessions.forEach(session => {
      localStorage.removeItem(`${session.id}_${userDetails.name}`);
    });
    
    // Clear sessions list
    setChatSessions([]);
    localStorage.removeItem(`chat_sessions_${userDetails.name}`);
    
    // Create new chat
    createNewChat();
  };

  // Text-to-Speech function
  const speakText = (text, messageIndex) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      if (currentSpeaking === messageIndex) {
        setCurrentSpeaking(null);
        return;
      }

      const cleanText = text
        .replace(/<[^>]*>/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/^-\s/gm, '')
        .replace(/\n+/g, '. ');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        setCurrentSpeaking(messageIndex);
      };

      utterance.onend = () => {
        setCurrentSpeaking(null);
      };

      utterance.onerror = () => {
        setCurrentSpeaking(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech-to-Text function
  const toggleListening = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  // Function to format text with markdown-like syntax
  const formatMessage = (text) => {
    if (!text) return "";
    
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    formattedText = formattedText.replace(/^# (.*)$/gm, (_, title) => 
      `<h3 class="text-lg font-bold my-2">${title}</h3>`
    );
    formattedText = formattedText.replace(/^## (.*)$/gm, (_, title) => 
      `<h4 class="text-md font-semibold my-1">${title}</h4>`
    );
    
    formattedText = formattedText.replace(/^- (.*)$/gm, (_, content) => 
      `<li class="ml-4">${content}</li>`
    );
    
    formattedText = formattedText.replace(/\n\n/g, '<br/>');
    
    return formattedText;
  };
   
  const handleSubmit = async (e, directPrompt = null) => {
    e?.preventDefault();
    const messageContent = directPrompt || input.trim();
    if (!messageContent) return;

    const userMessage = { role: "user", content: messageContent };
    setInput("");
    
    setShouldSaveToLocalStorage(false);
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsStreaming(true);

    try {
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const conversationHistory = messages.map(msg => ({
        parts: [{ text: msg.content }],
        role: msg.role === "assistant" ? "model" : "user"
      }));

      conversationHistory.push({
        parts: [{ text: messageContent }],
        role: "user"
      });

      if (messages.length === 1) {
        const systemPrompt = `You are FitBuddy, a certified virtual health and wellness coach inside a stylish, lovable fitness app. You chat with the user on a beautifully designed interface with soft shadows, rounded corners, and quick-access buttons for health tips. This app stores user data locally and allows them to reset their profile anytime.
 
🚫 IMPORTANT: Do not entertain to any other topic except health, fitness, or wellness
🎯 User Profile:
Name: ${userDetails.name}
Age: ${userDetails.age}
Gender: ${userDetails.gender}
Height: ${userDetails.height} cm
Weight: ${userDetails.weight} kg
Goal: ${userDetails.goal}
Country: ${userDetails.country}

🌟 Your Role:
Be fun, friendly, supportive, and encouraging.
Offer science-backed advice tailored to the user's profile.
Focus on physical health, mental wellness, fitness routines, and healthy recipes.
Speak like a knowledgeable friend—warm, but concise.

⚙️ User Interface Guide (so your responses fit well visually):
You live in a stunning modern chat page with a glowing input box and a list of quick prompt buttons like:
"Suggest a 10-min workout"
"Give me a healthy snack idea"
"I need motivation today"
"Help me with stress"

The chat UI is minimal and delightful, so keep answers short and scannable, using bullet points and emojis when appropriate.

FORMAT GUIDELINES:
- Use # for main headers (e.g., # Workout Plan)
- Use ## for subheaders (e.g., ## Warmup)
- Use - for bullet points
- Use ** for bold text
- Use emojis to make content engaging

✅ Always:
Personalize suggestions to the user's profile.
Encourage realistic goals and consistency.
Include mental wellness tips when needed.

🎯 Response Style:
- Start responses with a friendly greeting when appropriate
- Include 2-4 emojis naturally throughout the response
- Place emojis at section headers, key points, or for emphasis
- Keep the tone upbeat and motivating without being overwhelming

🧘 Example tone:
"Hey ${userDetails.name}, great to see you! 💪 Ready for a quick energy-boosting stretch? Let's gooo!"
User Query: ${messageContent}`;

        conversationHistory[conversationHistory.length - 1] = {
          parts: [{ text: systemPrompt }],
          role: "user"
        };
      } else {
        const reminder = `[REMEMBER: You are FitBuddy. ONLY answer health/fitness/wellness topics. Redirect everything else.]
         User (${userDetails.name}): ${messageContent}`;
        conversationHistory[conversationHistory.length - 1] = {
          parts: [{ text: reminder }],
          role: "user"
        };
      }
    
      const VITE_GEMINI_URL = import.meta.env.VITE_GEMINI_URL;
      const response = await fetch(VITE_GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            topP: 0.8,
            topK: 10
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that request.";

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: "assistant", 
          content: aiResponse 
        };
        return newMessages;
      });

      setShouldSaveToLocalStorage(true);
    
      const updatedMessages = [...messages, userMessage, { role: "assistant", content: aiResponse }];
      localStorage.setItem(`${currentChatId}_${userDetails.name}`, JSON.stringify(updatedMessages));
    
    } catch (error) {
      console.error("Gemini API error:", error);
      let errorMessage = "⚠️ Error connecting to AI. Please try again.";

      if (error.message?.includes('quota')) {
        errorMessage = "⚠️ API quota exceeded. Please try again later.";
      } else if (error.message?.includes('rate')) {
        errorMessage = "⚠️ Rate limit exceeded. Please wait a moment and try again.";
      } else if (!navigator.onLine) {
        errorMessage = "⚠️ No internet connection. Please check your network.";
      }
  
      const updatedMessages = [...messages, userMessage, { role: "assistant", content: errorMessage }];
      setMessages(updatedMessages);
      localStorage.setItem(`${currentChatId}_${userDetails.name}`, JSON.stringify(updatedMessages));
      setShouldSaveToLocalStorage(true);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    handleSubmit(null, prompt);
  };

  const handleReset = () => {
    localStorage.clear();
    setUserDetails(null);
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Chat History</h2>
              </div>
              <div className="flex gap-1">
                <Button
                  onClick={clearAllChats}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Clear all chats"
                  disabled={chatSessions.length === 0}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <Button
                  onClick={() => setSidebarOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 lg:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button
              onClick={createNewChat}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto px-4">
            {chatSessions.length === 0  ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No chat history yet</p>
                <p className="text-sm">Start a conversation!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => loadChat(session.id)}
                    className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                      session.id === currentChatId
                        ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {session.title}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(parseISO(session.date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        {session.lastMessage && (
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {session.lastMessage.length > 50 
                              ? session.lastMessage.substring(0, 50) + "..."
                              : session.lastMessage
                            }
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={(e) => deleteChat(session.id, e)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
                 <Button
                 
                disabled={isStreaming}
                onClick={handleReset}
                
                variant="outline"
                size="sm"
                style={{ margin: "0.5rem 1rem" , cursor: "pointer"}}
                className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Settings className="h-4 w-4 mr-2" color="orange" />
                Reset Profile
              </Button>

        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm transition-colors duration-300">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setSidebarOpen(true)}
                variant="ghost"
                size="sm"
                className="lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  FitMe
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your <strong className="text-purple-500">AI<Sparkles className="inline-block w-4 h-4 mb-1 ml-1" /></strong> Health Coach</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={onBackToDashboard}
                variant="outline"
                size="sm"
                className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Button>
              <ThemeToggle />

            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500">
                    <AvatarFallback><Sparkles className="text-yellow-500 h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
                
                <div className="flex flex-col gap-2">
                  <Card className={`min-w-[200px] max-w-xs sm:max-w-md lg:max-w-lg p-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-transparent"
                  }`}>
                    {message.role === "assistant" ? (
                      message.content === "" && isStreaming ? (
                        <div className="flex gap-1 items-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mr-2">Thinking</p>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      ) : (
                        <div 
                          className="whitespace-pre-wrap text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                        />
                      )
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>
                    )}
                  </Card>

                  {/* Text-to-Speech button for assistant messages */}
                  {message.role === "assistant" && message.content && message.content !== "" && (
                    <Button
                      onClick={() => speakText(message.content, index)}
                      variant="ghost"
                      size="sm"
                      className="w-fit h-6 p-1 hover:bg-purple-100 dark:hover:bg-purple-900/20"
                      title={currentSpeaking === index ? "Stop speaking" : "Listen to response"}
                    >
                      {currentSpeaking === index ? (
                        <VolumeX className="h-3 w-3 text-purple-500" />
                      ) : (
                        <Volume2 className="h-3 w-3 text-purple-500" />
                      )}
                    </Button>
                  )}
                </div>

                {message.role === "user" && (
                  <Avatar className="w-8 h-8 bg-gray-100 dark:bg-gray-700">
                    <AvatarFallback><User className="h-4 w-4 dark:text-gray-300" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-colors duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  disabled={isLoading}
                  variant="outline"
                  className="h-auto p-3 text-left border-gray-200 dark:border-gray-700 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20 dark:hover:border-purple-600 transition-all duration-200 disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <prompt.icon className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-xs dark:text-gray-300">{prompt.text}</span>
                  </div>
                </Button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about health & fitness..."
                  className="flex-1 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80 dark:text-gray-100 backdrop-blur-sm pr-10"
                  disabled={isLoading}
                />
                {speechSupported && (
                  <Button
                    type="button"
                    onClick={toggleListening}
                    className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    disabled={isLoading}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4 text-purple-500" />
                    )}
                  </Button>
                )}
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {/* Speech status indicator */}
            {isListening && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Listening... Speak now
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;