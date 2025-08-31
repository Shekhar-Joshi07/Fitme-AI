import { useState } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "./ConfirmDialog";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  RefreshCw, 
  Trash2, 
  Settings, 
  Heart,
  Activity,
  Target,
  Clock
} from "lucide-react";

export function ProfileManager() {
  const { user } = useFirebaseUser();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Get user details from localStorage
  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");

  const handleResetProfile = async () => {
    try {
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('profile') || key.includes('fitness') || key.includes('user-data') || key.includes('userDetails')
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      toast.success("Profile has been reset successfully!");
      setShowResetDialog(false);
      
      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Failed to reset profile. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      localStorage.clear();
      await user?.delete();
      toast.success("Account deleted successfully!");
      setShowDeleteDialog(false);
    } catch (error) {
      console.log(error.message)
      toast.error("Failed to delete account. Please contact support.");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const formatDate = (dateString: any | null | undefined): any => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-20 h-20 md:w-24 md:h-24 ring-4 ring-white dark:ring-gray-800 shadow-lg">
              <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xl font-bold">
                {getInitials(user.fullName || user.firstName || "User")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left space-y-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {user.primaryEmailAddress?.emailAddress || "No email available"}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Account
                </Badge>
                <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  Joined {formatDate(user.createdAt)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Fitness Profile Card */}
      {userDetails.name && (
        <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Fitness Profile
            </CardTitle>
            <CardDescription>Your health and fitness information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Age</span>
                </div>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{userDetails.age} years</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-300">Height</span>
                </div>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">{userDetails.height} cm</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Weight</span>
                </div>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{userDetails.weight} kg</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-300">Goal</span>
                </div>
                <p className="text-sm font-bold text-orange-900 dark:text-orange-100 capitalize">{userDetails.goal?.replace('_', ' ')}</p>
              </div>
            </div>
            
            {userDetails.activityLevel && (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Activity Level</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {userDetails.activityLevel.replace('_', ' ')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Account Management Card */}
      <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Account Management
          </CardTitle>
          <CardDescription>
            Manage your account settings and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Data Management</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Reset your fitness profile data while keeping your account active.
              </p>
              <Button
                variant="outline"
                onClick={() => setShowResetDialog(true)}
                className="w-full md:w-auto border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Profile Data
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Danger Zone</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full md:w-auto bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title="Reset Profile Data"
        description="Are you sure you want to reset your profile? This will clear all your fitness data, preferences, and progress. This action cannot be undone."
        confirmText="Yes, Reset Profile"
        cancelText="Cancel"
        onConfirm={handleResetProfile}
        variant="destructive"
      />

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Account"
        description="Are you sure you want to delete your account? This will permanently remove all your data and cannot be undone. You will be signed out immediately."
        confirmText="Yes, Delete Account"
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
        variant="destructive"
      />
    </div>
  );
}