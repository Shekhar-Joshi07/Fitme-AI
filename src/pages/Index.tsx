import { useState, useEffect } from "react";
import Onboarding from "@/components/Onboarding";
import ChatInterface from "@/components/ChatInterface";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const storedDetails = localStorage.getItem("userDetails");
    if (storedDetails) {
      setUserDetails(JSON.parse(storedDetails));
      
      // Check if the user has a preference to go directly to chat
      const directToChat = localStorage.getItem("directToChat");
      if (directToChat === "true") {
        setShowChat(true);
      }
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (details) => {
    setUserDetails(details);
    localStorage.setItem("userDetails", JSON.stringify(details));
  };

  const handleStartChat = () => {
    setShowChat(true);
    localStorage.setItem("directToChat", "true");
  };

  const handleBackToDashboard = () => {
    setShowChat(false);
    localStorage.setItem("directToChat", "false");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900/20 dark:via-gray-900 dark:to-blue-900/20 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900/20 dark:via-gray-900 dark:to-blue-900/20 transition-colors duration-300">
      {!userDetails ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : showChat ? (
        <ChatInterface 
          userDetails={userDetails} 
          setUserDetails={setUserDetails} 
          onBackToDashboard={handleBackToDashboard}
        />
      ) : (
        <Dashboard 
          userDetails={userDetails} 
          setUserDetails={setUserDetails} 
          startChat={handleStartChat} 
        />
      )}
    </div>
  );
};

export default Index;
