
import { useState, useEffect } from "react";
import Onboarding from "@/components/Onboarding";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const storedDetails = localStorage.getItem("userDetails");
    if (storedDetails) {
      setUserDetails(JSON.parse(storedDetails));
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (details) => {
    setUserDetails(details);
    localStorage.setItem("userDetails", JSON.stringify(details));
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
      ) : (
        <ChatInterface userDetails={userDetails} setUserDetails={setUserDetails} />
      )}
    </div>
  );
};

export default Index;
