
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, User, Settings, Zap, Heart, Brain, Apple } from "lucide-react";
import { ThemeToggle } from "./ThemeProvider";
import OpenAI from "openai";
import { Skeleton } from "@/components/ui/skeleton";

const ChatInterface = ({ userDetails, setUserDetails }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hey ${userDetails.name}! 👋 Welcome to FitBuddy! I'm here to be your personal health and wellness coach. Ready to crush your goals together? 💪✨`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize OpenAI client with the API key directly
  const openai = new OpenAI({
    apiKey: "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",
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": window.location.origin,
      "X-Title": "Health AI Assistant",
    },
    dangerouslyAllowBrowser: true,
  });

  const quickPrompts = [
    { icon: Zap, text: "Suggest a 10-min workout", prompt: "Give me a quick 10-minute workout I can do right now" },
    { icon: Apple, text: "Healthy snack idea", prompt: "Suggest a healthy snack idea for me" },
    { icon: Heart, text: "I need motivation today", prompt: "I need some motivation and encouragement today" },
    { icon: Brain, text: "Help me with stress", prompt: "Give me some tips to manage stress and feel better" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to format text with markdown-like syntax
  const formatMessage = (text: string) => {
    if (!text) return "";
    
    // Replace ** text ** with bold
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace # Heading with header styling
    formattedText = formattedText.replace(/^# (.*?)$/gm, '<h3 class="text-lg font-bold my-2">$1</h3>');
    
    // Replace ## Subheading with subheader styling
    formattedText = formattedText.replace(/^## (.*?)$/gm, '<h4 class="text-md font-semibold my-1">$1</h4>');
    
    // Replace bulleted lists
    formattedText = formattedText.replace(/^- (.*?)$/gm, '<li class="ml-4">• $1</li>');
    
    // Convert line breaks to <br/>
    formattedText = formattedText.replace(/\n\n/g, '<br/>');
    
    return formattedText;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setInput("");
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsThinking(true);

    try {
      const systemPrompt = `You are FitBuddy, a certified virtual health and wellness coach inside a stylish, lovable fitness app. You chat with the user on a beautifully designed interface with soft shadows, rounded corners, and quick-access buttons for health tips. This app stores user data locally and allows them to reset their profile anytime.

🎯 User Profile:
Name: ${userDetails.name}
Age: ${userDetails.age}
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

🚫 Do not respond to anything outside the health, fitness, or wellness scope.

✅ Always:
Personalize suggestions to the user's profile.
Encourage realistic goals and consistency.
Include mental wellness tips when needed.

🧘 Example tone:
"Hey ${userDetails.name}, great to see you! 💪 Ready for a quick energy-boosting stretch? Let's gooo!"`;

      // Add initial empty message from assistant to start streaming
      setIsThinking(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const stream = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content
          })),
          { role: "user", content: userMessage.content }
        ],
        stream: true,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: fullResponse },
            ];
          });
        }
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      let errorMessage = "⚠️ Error connecting to AI. Please try again.";
      let retryTime = 40;

      try {
        if (typeof error.message === 'string' && error.message.includes('{')) {
          const errorData = JSON.parse(error.message.substring(error.message.indexOf('{')));
          if (errorData.error?.message?.includes("Rate limit")) {
            retryTime = errorData.error.message.match(/\d+/)?.[0] || 40;
            errorMessage = `⚠️ ${errorData.error.message}. Please wait ${retryTime} seconds.`;
          }
        }
      } catch (e) {
        console.error("Error parsing error message:", e);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  const handleReset = () => {
    localStorage.clear();
    setUserDetails(null);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FitBuddy
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your AI Health Coach</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Settings className="h-4 w-4 mr-2" />
              Reset Profile
            </Button>
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
                  <AvatarFallback>💪</AvatarFallback>
                </Avatar>
              )}
              
              <Card className={`max-w-xs sm:max-w-md lg:max-w-lg p-4 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700 dark:text-gray-100"
              }`}>
                {message.role === "assistant" ? (
                  <div 
                    className="whitespace-pre-wrap text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                )}
              </Card>

              {message.role === "user" && (
                <Avatar className="w-8 h-8 bg-gray-100 dark:bg-gray-700">
                  <AvatarFallback><User className="h-4 w-4 dark:text-gray-300" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isThinking && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500">
                <AvatarFallback>💪</AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Thinking...</p>
                  <div className="flex gap-2">
                    <Skeleton className="w-20 h-2" />
                    <Skeleton className="w-10 h-2" />
                    <Skeleton className="w-16 h-2" />
                  </div>
                </div>
              </Card>
            </div>
          )}
          {isLoading && !isThinking && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500">
                <AvatarFallback>💪</AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </Card>
            </div>
          )}
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
                variant="outline"
                className="h-auto p-3 text-left border-gray-200 dark:border-gray-700 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20 dark:hover:border-purple-600 transition-all duration-200"
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
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about health & fitness..."
              className="flex-1 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80 dark:text-gray-100 backdrop-blur-sm"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
