import { useState, useEffect } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import Onboarding from "@/components/Onboarding";
import ChatInterface from "@/components/ChatInterface";
import Dashboard from "@/components/Dashboard";
import { AuthButton } from "@/components/AuthButton";
import { ProfileManager } from "@/components/ProfileManager";
import { ThemeToggle } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isSignedIn, isLoaded } = useFirebaseUser();
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
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-400 dark:text-gray-200">
                Sign in to get started
              </h2>
              <button
                onClick={async () => {
                  try {
                    const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
                    const { auth } = await import("@/lib/firebase");
                    const { toast } = await import("sonner");
                    
                    const provider = new GoogleAuthProvider();
                    provider.addScope("email");
                    provider.addScope("profile");

                    const result = await signInWithPopup(auth, provider);
                    // console.log("Google sign in successful:", result.user);
                    toast.success("Successfully signed in with Google!");
                  } catch (error: any) {
                    const { toast } = await import("sonner");
                    console.error("Google sign in error:", error);

                    if (error.code === "auth/popup-closed-by-user") {
                      toast.error("Sign in was cancelled.");
                    } else if (error.code === "auth/popup-blocked") {
                      toast.error("Popup was blocked. Please allow popups and try again.");
                    } else {
                      toast.error("Failed to sign in with Google. Please try again.");
                    }
                  }
                }}
className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-10 py-4 text-lg font-semibold rounded-full flex items-center justify-center gap-3 mx-auto"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
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


      {showProfile ? (
        <div className="min-h-screen p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <Button
              onClick={() => setShowProfile(false)}
              variant="ghost"
              className="mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              ← Dashboard
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
