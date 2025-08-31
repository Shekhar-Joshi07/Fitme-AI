import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { toast } from "sonner";

export function AuthButton({ onShowProfile, isOnboarded = false }) {
  const { isSignedIn, user } = useFirebaseUser();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      const result = await signInWithPopup(auth, provider);
      console.log("Google sign in successful:", result.user);
      toast.success("Successfully signed in with Google!");
    } catch (error: any) {
      console.error("Google sign in error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign in was cancelled.");
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup was blocked. Please allow popups and try again.");
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        toast.error(
          "An account already exists with the same email address but different sign-in credentials."
        );
      } else if (error.code === "auth/configuration-not-found") {
        toast.error(
          "Google sign-in is not configured. Please contact support."
        );
      } else {
        toast.error("Failed to sign in with Google. Please try again.");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Successfully signed out!");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isSignedIn && user) {
    return (
      <div className="flex items-center gap-2">
        {/* Welcome message - hidden on mobile */}
        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
          Welcome, {user?.firstName || user?.username || "User"}!
        </span>
        {/* User dropdown with better styling */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 md:h-9 md:w-9 rounded-full ring-2 ring-purple-200 dark:ring-purple-800 hover:ring-purple-300 dark:hover:ring-purple-700 transition-all duration-200"
            >
              <Avatar className="h-8 w-8 md:h-9 md:w-9">
                <AvatarImage
                  src={user.imageUrl}
                  alt={user.fullName || "User"}
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs font-bold">
                  {getInitials(user.fullName || user.firstName || "User")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm"
            align="end"
            forceMount
          >
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">
                  {user.fullName || user.firstName || "User"}
                </p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            {/* Only show profile options if user is onboarded */}
            {isOnboarded && (
              <>
                <DropdownMenuItem
                  className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  onClick={onShowProfile}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg transition-all duration-200 px-4 md:px-8 py-2 md:py-3 text-sm md:text-base"
    >
      Sign In
    </Button>
  );
}
