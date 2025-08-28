import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        {/* Welcome message - hidden on mobile */}
        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
          Welcome, {user?.firstName || user?.username || 'User'}!
        </span>
        {/* User button with better styling */}
        <div className="relative">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 md:w-9 md:h-9 ring-2 ring-purple-200 dark:ring-purple-800 hover:ring-purple-300 dark:hover:ring-purple-700 transition-all duration-200",
                userButtonPopoverCard: "shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm",
                userButtonPopoverActionButton: "hover:bg-purple-50 dark:hover:bg-purple-900/20"
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg transition-all duration-200 px-4 md:px-8 py-2 md:py-3 text-sm md:text-base">
        Get Started
      </Button>
    </SignInButton>
  );
}