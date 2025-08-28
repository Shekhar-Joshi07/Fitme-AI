import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Onboarding from "@/components/Onboarding";
import ChatInterface from "@/components/ChatInterface";
import Dashboard from "@/components/Dashboard";
import { AuthButton } from "@/components/AuthButton";
import { ProfileManager } from "@/components/ProfileManager";
import { ThemeToggle } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
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
    }
    setIsLoading(false);
  }, [isSignedIn, isLoaded]);

  const handleOnboardingComplete = (details: any) => {
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

  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900/20 dark:via-gray-900 dark:to-blue-900/20 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    );
  }

  // Show authentication screen if user is not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900/20 dark:via-gray-900 dark:to-blue-900/20 flex items-center justify-center transition-colors duration-300">
        {/* Theme toggle in top right */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center space-y-8">
            {/* Logo and Title */}
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FitMe AI
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Your personal AI fitness companion that understands your goals, tracks your progress, and guides you every step of the way.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 my-12">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart AI Coach</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get personalized workout plans and nutrition advice powered by advanced AI.</p>
              </div>

              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
                {/* Coming Soon Badge - positioned at top right */}
                <div className="absolute top-3 right-3">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                    Coming Soon
                  </div>
                </div>
                
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 mx-auto opacity-75">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 opacity-75">Progress Tracking</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 opacity-75">Monitor your fitness journey with detailed analytics and insights.</p>
                
                {/* Subtle overlay to indicate coming soon */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-100/20 to-transparent dark:from-gray-900/20 pointer-events-none"></div>
              </div>

              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
                {/* Coming Soon Badge - positioned at top right */}
                <div className="absolute top-3 right-3">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                    Coming Soon
                  </div>
                </div>
                
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 mx-auto opacity-75">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 opacity-75">Community Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 opacity-75">Connect with like-minded fitness enthusiasts and share your journey.</p>
                
                {/* Subtle overlay to indicate coming soon */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-100/20 to-transparent dark:from-gray-900/20 pointer-events-none"></div>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <AuthButton />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Join thousands of users who've transformed their fitness journey with FitMe AI
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900/20 dark:via-gray-900 dark:to-blue-900/20 transition-colors duration-300">
      {/* Auth button in top right corner */}
      <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
        <AuthButton />
      </div>

      {showProfile ? (
        <div className="min-h-screen p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <Button
              onClick={() => setShowProfile(false)}
              variant="ghost"
              className="mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              ← Back to Dashboard
            </Button>
            <ProfileManager />
          </div>
        </div>
      ) : !userDetails ? (
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
          onShowProfile={() => setShowProfile(true)}
        />
      )}
    </div>
  );
};

export default Index;
