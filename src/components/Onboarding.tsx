import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Target, Globe, Sparkles, User, CheckCircle, Zap, Calculator, Dumbbell } from "lucide-react";
import { ThemeToggle } from "./ThemeProvider";

const Onboarding = ({ onComplete }) => {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    country: "",
    gender: ""
  });

  // Auto-fill user data from Clerk when component mounts
  useEffect(() => {
    if (user) {
      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim() || user.username || "";
      
      // Try to get age from user's public metadata if available
      let calculatedAge = "";
      if (user.publicMetadata?.age) {
        calculatedAge = user.publicMetadata.age.toString();
      }

      setFormData(prev => ({
        ...prev,
        name: fullName,
        age: calculatedAge,
        gender: (user.publicMetadata?.gender as string) || ""
      }));
    }
  }, [user]);

  const goals = [
    "Lose weight",
    "Gain weight",
    "Gain muscle",
    "Improve overall fitness",
    "Maintain health",
    "Reduce stress",
    "Better sleep",
    "Mental wellness",
  ];

  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", 
    "France", "Spain", "Italy", "Japan", "India", "Brazil", "Mexico", "Other"
  ];

  const genders = [
    "Male", "Female", "Non-binary", "Prefer not to say"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Start loading process
      setIsLoading(true);
    }
  };

  // Handle loading completion
  useEffect(() => {
    if (isLoading) {
      // Simulate processing time (2.5 seconds)
      const timer = setTimeout(() => {
        onComplete(formData);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, formData, onComplete]);

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.age && formData.gender;
      case 2:
        return formData.height && formData.weight;
      case 3:
        return formData.goal && formData.country;
      default:
        return false;
    }
  };

  //Loading Component
  const LoadingScreen = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);

    const loadingSteps = [
      { 
        icon: User, 
        text: "Analyzing your profile...", 
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
      },
      { 
        icon: Calculator, 
        text: "Calculating your BMI & BMR...", 
        color: "text-purple-500",
        bgColor: "bg-purple-500/10"
      },
      { 
        icon: Target, 
        text: "Personalizing your goals...", 
        color: "text-green-500",
        bgColor: "bg-green-500/10"
      },
      { 
        icon: Dumbbell, 
        text: "Preparing your dashboard...", 
        color: "text-orange-500",
        bgColor: "bg-orange-500/10"
      },
      { 
        icon: Sparkles, 
        text: "Almost ready!", 
        color: "text-pink-500",
        bgColor: "bg-pink-500/10"
      }
    ];

    useEffect(() => {
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next <= loadingSteps.length) {
            setCompletedSteps(prevCompleted => [...prevCompleted, prev]);
            return next;
          }
          return prev;
        });
      }, 500);

      return () => clearInterval(stepInterval);
    }, []);

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Setting up FitMe
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                We're preparing your personalized experience
              </p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4 mb-8">
              {loadingSteps.map((stepData, index) => {
                const isCompleted = completedSteps.includes(index);
                const isCurrent = currentStep === index;
                const isPending = index > currentStep;

                return (
                  <div
                    key={index}
                    className={`flex items-center p-3 rounded-lg transition-all duration-500 ${
                      isCompleted
                        ? 'bg-green-50 dark:bg-green-900/20 scale-95 opacity-80'
                        : isCurrent
                        ? `${stepData.bgColor} scale-100 opacity-100`
                        : 'bg-gray-50 dark:bg-gray-800/50 scale-95 opacity-60'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? `${stepData.color} ${stepData.bgColor}`
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <stepData.icon className={`h-4 w-4 ${isCurrent ? 'animate-bounce' : ''}`} />
                      )}
                    </div>
                    
                    <div className="ml-3 flex-grow">
                      <p className={`text-sm font-medium transition-colors duration-300 ${
                        isCompleted
                          ? 'text-green-700 dark:text-green-400'
                          : isCurrent
                          ? 'text-gray-800 dark:text-gray-200'
                          : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {stepData.text}
                      </p>
                    </div>

                    {/* Loading animation for current step */}
                    {isCurrent && (
                      <div className="flex space-x-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${stepData.color.replace('text', 'bg')} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${stepData.color.replace('text', 'bg')} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${stepData.color.replace('text', 'bg')} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Overall Progress Bar */}
            {/* <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round((completedSteps.length / loadingSteps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${(completedSteps.length / loadingSteps.length) * 100}%` 
                  }}
                />
              </div>
            </div> */}

            {/* Welcome Message */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <p className="text-center text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Welcome, {formData.name}!</span>
                <br />
                Your personalized health journey is about to begin ✨
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Show loading screen if loading
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/90">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center">
            Welcome to FitMe AI <Sparkles className="h-6 w-6 text-purple-500 dark:text-white ml-2 mt-2" />
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Let's personalize your health journey <br />
            <span className="text-gray-500 dark:text-gray-400 text-xs">Created with ❤️ by <a href="https://www.shekharjoshi.dpdns.org" target= "_blank" className="text-blue-500 hover:text-blue-600 text-xs">Shekhar Joshi</a></span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-600 mb-4">
                <Heart className="h-5 w-5" />
                <span className="font-medium">Tell us about yourself</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">What's your name?</Label>
                <Input
                  id="name"
                  placeholder="Enter your first name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-gray-200 focus:border-purple-500 dark:bg-gray-200 dark:text-gray-800"
                />
                {formData.name && user && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Auto-filled from your account
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">How old are you?</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="border-gray-200 focus:border-purple-500 dark:bg-gray-200 dark:text-gray-800"
                />
                {formData.age && user?.publicMetadata?.age && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Auto-filled from your account
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>What's your gender?</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 dark:bg-gray-200 dark:text-gray-800">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.gender && user?.publicMetadata?.gender && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Auto-filled from your account
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  For accurate health metrics calculation
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-600 mb-4">
                <Target className="h-5 w-5" />
                <span className="font-medium">Physical details</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  className="border-gray-200 focus:border-purple-500 dark:bg-gray-200 dark:text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="border-gray-200 focus:border-purple-500 dark:bg-gray-200 dark:text-gray-800"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-600 mb-4">
                <Globe className="h-5 w-5" />
                <span className="font-medium">Your goals & location</span>
              </div>

              <div className="space-y-2">
                <Label>What's your main health goal?</Label>
                <Select onValueChange={(value) => handleInputChange("goal", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 dark:bg-gray-200 dark:text-gray-800">
                    <SelectValue placeholder="Choose your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((goal) => (
                      <SelectItem key={goal} value={goal}>
                        {goal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Where are you located?</Label>
                <Select onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 dark:bg-gray-200 dark:text-gray-800">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-200"
            >
              {step === 3 ? "Start My Journey! 🚀" : "Next"}
            </Button>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? "bg-purple-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;