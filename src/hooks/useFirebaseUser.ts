import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useMemo } from "react";
import { deleteUser } from "firebase/auth";

// Interface to match Clerk's user structure
interface FirebaseUser {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  username?: string;
  imageUrl?: string;
  primaryEmailAddress?: {
    emailAddress: string;
  };
  createdAt?: string;
  delete?: () => Promise<void>;
}

export function useFirebaseUser() {
  const [firebaseUser, loading, error] = useAuthState(auth);

  const user: FirebaseUser | null = useMemo(() => {
    if (!firebaseUser) return null;

    const displayName = firebaseUser.displayName || "";
    const nameParts = displayName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    return {
      id: firebaseUser.uid,
      firstName,
      lastName,
      fullName: displayName,
      username: firebaseUser.email?.split("@")[0],
      imageUrl: firebaseUser.photoURL || undefined,
      primaryEmailAddress: {
        emailAddress: firebaseUser.email || "",
      },
      createdAt: firebaseUser.metadata.creationTime,
      delete: async () => {
        if (firebaseUser) {
          try {
            await deleteUser(firebaseUser);
          } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
          }
        }
      },
    };
  }, [firebaseUser]);

  // Log any authentication errors
  if (error) {
    console.error("Firebase Auth Error:", error);
  }

  return {
    user,
    isSignedIn: !!firebaseUser,
    isLoaded: !loading,
    error,
  };
}
