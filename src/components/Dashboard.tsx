import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar,AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeProvider";
import { Heart, Dumbbell, Utensils, Calculator, MapPin, ArrowRight, Settings, MessageSquare, Sparkles, Info, ShoppingBag, Package, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import amazonIcon from "@/assets/icons/icons8-amazon-shopping-app-48.png";
import flipkartIcon from "@/assets/icons/flipkart-icon.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// Body type SVG components
const UnderweightSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 180" className="h-32 mx-auto mb-4 text-blue-500">
      {/* Head */}
      <ellipse cx="50" cy="25" rx="12" ry="15" fill="currentColor" opacity="0.15" />
      <circle cx="50" cy="25" r="10" fill="currentColor" stroke="currentColor" strokeWidth="1" opacity="0.8" />
      
      {/* Face features */}
      <circle cx="46" cy="22" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="54" cy="22" r="1" fill="currentColor" opacity="0.6" />
      <path d="M48,27 Q50,29 52,27" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.6" />
      
      {/* Neck */}
      <rect x="47" y="35" width="6" height="8" fill="currentColor" opacity="0.1" />
      
      {/* Torso - very slim */}
      <path d="M42,43 Q38,50 40,70 Q41,85 42,100 Q43,110 44,120 L56,120 Q57,110 58,100 Q59,85 60,70 Q62,50 58,43 Z" 
            fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Arms - thin */}
      <line x1="42" y1="50" x2="28" y2="65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="65" x2="25" y2="85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="50" x2="72" y2="65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="72" y1="65" x2="75" y2="85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Hands */}
      <circle cx="25" cy="85" r="2.5" fill="currentColor" opacity="0.3" />
      <circle cx="75" cy="85" r="2.5" fill="currentColor" opacity="0.3" />
      
      {/* Legs - thin */}
      <line x1="46" y1="120" x2="42" y2="155" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="54" y1="120" x2="58" y2="155" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      
      {/* Feet */}
      <ellipse cx="42" cy="158" rx="6" ry="3" fill="currentColor" opacity="0.3" />
      <ellipse cx="58" cy="158" rx="6" ry="3" fill="currentColor" opacity="0.3" />
    </svg>
  );
  
  const NormalWeightSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 180" className="h-32 mx-auto mb-4 text-green-500">
      {/* Head */}
      <ellipse cx="50" cy="25" rx="13" ry="16" fill="currentColor" opacity="0.15" />
      <circle cx="50" cy="25" r="11" fill="currentColor" stroke="currentColor" strokeWidth="1" opacity="0.8" />
      
      {/* Face features */}
      <circle cx="46" cy="22" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="54" cy="22" r="1" fill="currentColor" opacity="0.6" />
      <path d="M47,27 Q50,29 53,27" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.6" />
      
      {/* Neck */}
      <rect x="46" y="36" width="8" height="8" fill="currentColor" opacity="0.1" rx="2" />
      
      {/* Torso - normal proportions */}
      <path d="M38,44 Q35,52 37,72 Q38,88 40,105 Q41,115 43,125 L57,125 Q59,115 60,105 Q62,88 63,72 Q65,52 62,44 Z" 
            fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Chest definition */}
      <path d="M42,55 Q50,58 58,55" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
      
      {/* Arms - normal */}
      <line x1="38" y1="52" x2="25" y2="68" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="25" y1="68" x2="22" y2="88" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="62" y1="52" x2="75" y2="68" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="75" y1="68" x2="78" y2="88" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      
      {/* Hands */}
      <circle cx="22" cy="88" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="78" cy="88" r="3" fill="currentColor" opacity="0.3" />
      
      {/* Legs - normal */}
      <line x1="45" y1="125" x2="40" y2="160" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="55" y1="125" x2="60" y2="160" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      
      {/* Feet */}
      <ellipse cx="40" cy="163" rx="7" ry="3.5" fill="currentColor" opacity="0.3" />
      <ellipse cx="60" cy="163" rx="7" ry="3.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
  
  const OverweightSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 180" className="h-32 mx-auto mb-4 text-yellow-500">
      {/* Head */}
      <ellipse cx="55" cy="25" rx="14" ry="16" fill="currentColor" opacity="0.15" />
      <circle cx="55" cy="25" r="12" fill="currentColor" stroke="currentColor" strokeWidth="1" opacity="0.8" />
      
      {/* Face features */}
      <circle cx="50" cy="22" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="60" cy="22" r="1" fill="currentColor" opacity="0.6" />
      <path d="M52,27 Q55,29 58,27" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.6" />
      
      {/* Neck */}
      <rect x="50" y="37" width="10" height="8" fill="currentColor" opacity="0.1" rx="3" />
      
      {/* Torso - wider, rounder */}
      <path d="M35,45 Q30,55 32,75 Q33,90 35,108 Q36,118 38,130 L72,130 Q74,118 75,108 Q77,90 78,75 Q80,55 75,45 Z" 
            fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Belly curve */}
      <path d="M38,75 Q55,85 72,75" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
      
      {/* Arms - thicker */}
      <line x1="35" y1="55" x2="20" y2="72" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="20" y1="72" x2="16" y2="92" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="75" y1="55" x2="90" y2="72" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="90" y1="72" x2="94" y2="92" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      
      {/* Hands */}
      <circle cx="16" cy="92" r="3.5" fill="currentColor" opacity="0.3" />
      <circle cx="94" cy="92" r="3.5" fill="currentColor" opacity="0.3" />
      
      {/* Legs - thicker */}
      <line x1="45" y1="130" x2="38" y2="165" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="65" y1="130" x2="72" y2="165" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      
      {/* Feet */}
      <ellipse cx="38" cy="168" rx="8" ry="4" fill="currentColor" opacity="0.3" />
      <ellipse cx="72" cy="168" rx="8" ry="4" fill="currentColor" opacity="0.3" />
    </svg>
  );
  
  const ObeseSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 180" className="h-32 mx-auto mb-4 text-red-500">
      {/* Head */}
      <ellipse cx="65" cy="25" rx="15" ry="17" fill="currentColor" opacity="0.15" />
      <circle cx="65" cy="25" r="13" fill="currentColor" stroke="currentColor" strokeWidth="1" opacity="0.8" />
      
      {/* Face features */}
      <circle cx="59" cy="22" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="71" cy="22" r="1" fill="currentColor" opacity="0.6" />
      <path d="M61,27 Q65,29 69,27" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.6" />
      
      {/* Neck - wider */}
      <rect x="58" y="38" width="14" height="8" fill="currentColor" opacity="0.12" rx="4" />
      
      {/* Torso - much wider and rounder */}
      <path d="M30,46 Q22,58 25,80 Q27,100 30,120 Q32,135 35,140 L95,140 Q98,135 100,120 Q103,100 105,80 Q108,58 100,46 Z" 
            fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Additional belly definition */}
      <ellipse cx="65" cy="85" rx="25" ry="20" fill="currentColor" opacity="0.1" />
      <path d="M42,70 Q65,85 88,70" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
      <path d="M40,95 Q65,105 90,95" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
      
      {/* Arms - thick */}
      <line x1="30" y1="60" x2="12" y2="78" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="12" y1="78" x2="8" y2="98" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="100" y1="60" x2="118" y2="78" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="118" y1="78" x2="122" y2="98" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      
      {/* Hands */}
      <circle cx="8" cy="98" r="4" fill="currentColor" opacity="0.3" />
      <circle cx="122" cy="98" r="4" fill="currentColor" opacity="0.3" />
      
      {/* Legs - thick */}
      <line x1="50" y1="140" x2="42" y2="170" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <line x1="80" y1="140" x2="88" y2="170" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      
      {/* Feet */}
      <ellipse cx="42" cy="173" rx="9" ry="4.5" fill="currentColor" opacity="0.3" />
      <ellipse cx="88" cy="173" rx="9" ry="4.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
  

const Dashboard = ({ userDetails, setUserDetails, startChat }) => {
  const { toast } = useToast();
  const [location, setLocation] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showBmiInfo, setShowBmiInfo] = useState(false);
  const [showBmrInfo, setShowBmrInfo] = useState(false);

  // Calculate BMI
  const calculateBMI = () => {
    const heightInM = userDetails.height / 100;
    const bmi = (userDetails.weight / (heightInM * heightInM)).toFixed(1);
    let category = "";
    
    if (parseFloat(bmi) < 18.5) category = "Underweight";
    else if (parseFloat(bmi) < 25) category = "Normal weight";
    else if (parseFloat(bmi) < 30) category = "Overweight";
    else category = "Obesity";
    
    return { bmi, category };
  };

  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    const age = parseInt(userDetails.age);
    const weight = parseFloat(userDetails.weight);
    const height = parseFloat(userDetails.height);
    const gender = userDetails.gender || "Male"; // Use gender from userDetails with fallback
    const isMale = gender === "Male"; // Check if gender is male

    let bmr: number;
    if (isMale) {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    return Math.round(bmr);
  };

  // Mock recipes - in a real app you might fetch these from an API
  const quickRecipes = [
    { name: "Protein Smoothie", description: "Blend banana, protein powder, almond milk, and berries." },
    { name: "Greek Yogurt Bowl", description: "Greek yogurt topped with honey, nuts, and fresh fruit." },
    { name: "Avocado Toast", description: "Whole grain toast with mashed avocado, salt, pepper, and a poached egg." }
  ];

  // Mock workouts - in a real app you might fetch these from an API
  const quickWorkouts = [
    { name: "HIIT Circuit", description: "30s jumping jacks, 30s pushups, 30s squats, 30s plank. Repeat 5x." },
    { name: "Morning Stretch", description: "5 min gentle stretching routine to wake up your body." },
    { name: "Core Blast", description: "5 min plank variations followed by 5 min of different ab exercises." }
  ];

  // Find nearby gyms using Google Maps API
  const findNearbyGyms = () => {
    setLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          toast({
            title: "Location Found!",
            description: "Opening Google Maps to show gyms near you.",
          });
          
          // Open Google Maps directly
          openMapsApp(latitude, longitude);
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Unable to access your location. Please check your browser settings.",
          });
          setLoadingLocation(false);
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
      });
      setLoadingLocation(false);
    }
  };
  
  // Function to open the appropriate maps app based on device
  const openMapsApp = (latitude, longitude) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    let mapsUrl = "";
    
    if (isMobile) {
      if (isIOS) {
        // iOS uses a different URL scheme
        mapsUrl = `maps://search/?q=gym&sll=${latitude},${longitude}&z=14`;
      } else if (isAndroid) {
        // Android uses geo: or maps.google.com
        mapsUrl = `geo:${latitude},${longitude}?q=gym`;
      } else {
        mapsUrl = `https://www.google.com/maps/search/gym/@${latitude},${longitude},14z`;
      }
    } else {
      mapsUrl = `https://www.google.com/maps/search/gym/@${latitude},${longitude},14z`;
    }
    
    window.open(mapsUrl, '_blank');
  };

  const handleReset = () => {
    localStorage.clear();
    setUserDetails(null);
  };

  // BMI Info Modal Content
  const BmiInfoModal = () => (
    <Dialog open={showBmiInfo} onOpenChange={setShowBmiInfo}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Calculator className="h-5 w-5 text-purple-500 mr-2" />
            Understanding Body Mass Index (BMI)
          </DialogTitle>
          <DialogDescription>
            Learn what BMI is, how it's calculated, and what it means for your health.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {/* What is BMI */}
          <div>
            <h3 className="font-medium text-lg mb-2">What is BMI?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Body Mass Index (BMI) is a numerical value of your weight in relation to your height. It's an indicator of body fatness and a screening tool for weight categories that may lead to health problems.
            </p>
          </div>
          
          {/* How it's calculated */}
          <div>
            <h3 className="font-medium text-lg mb-2">How BMI is Calculated</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              BMI = weight(kg) / height(m)²<br />
              For example, if you weigh 70kg and are 1.75m tall:<br />
              BMI = 70 / (1.75 × 1.75) = 22.9
            </p>
          </div>
          
          {/* BMI Categories */}
          <div>
            <h3 className="font-medium text-lg mb-2">BMI Categories</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0">
                  &lt;
                </div>
                <div>
                  <h4 className="font-medium">Underweight: BMI below 18.5</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    May indicate insufficient nutrition, an underlying illness, or other health concerns.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-3 flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-medium">Normal weight: BMI 18.5 to 24.9</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Generally considered healthy for most adults with a decreased risk for many diseases.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0">
                  !
                </div>
                <div>
                  <h4 className="font-medium">Overweight: BMI 25 to 29.9</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    May increase risk for health problems like heart disease, high blood pressure, and type 2 diabetes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mr-3 flex-shrink-0">
                  !!
                </div>
                <div>
                  <h4 className="font-medium">Obesity: BMI 30 or higher</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Higher risk for serious health problems, including heart disease, stroke, type 2 diabetes, and certain cancers.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Your BMI */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2">Your BMI: {calculateBMI().bmi}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Category: <span className={`font-medium ${
                calculateBMI().category === "Underweight" ? "text-blue-600 dark:text-blue-400" : 
                calculateBMI().category === "Normal weight" ? "text-green-600 dark:text-green-400" : 
                calculateBMI().category === "Overweight" ? "text-yellow-600 dark:text-yellow-400" : 
                "text-red-600 dark:text-red-400"
              }`}>{calculateBMI().category}</span>
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {calculateBMI().category === "Underweight" && "Consider speaking with a healthcare provider about strategies to reach a healthy weight."}
              {calculateBMI().category === "Normal weight" && "You're at a healthy weight according to the BMI scale. Focus on maintaining your healthy habits."}
              {calculateBMI().category === "Overweight" && "Consider making lifestyle changes to reduce health risks. Speak with a healthcare provider for personalized advice."}
              {calculateBMI().category === "Obesity" && "It's recommended to speak with a healthcare professional about strategies to reduce health risks."}
            </p>
          </div>
          
          {/* Limitations */}
          <div>
            <h3 className="font-medium text-lg mb-2">Limitations of BMI</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              BMI doesn't directly measure body fat and doesn't account for factors like:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <li>Muscle mass (athletes may have high BMI despite low body fat)</li>
              <li>Age-related loss of muscle mass</li>
              <li>Body fat distribution</li>
              <li>Different body compositions across ethnic groups</li>
            </ul>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
              BMI is best used as one of several tools for assessing health risks, not as the sole indicator.
            </p>
          </div>
        </div>
        
        <DialogClose asChild>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );

  // BMR Info Modal Content
  const BmrInfoModal = () => (
    <Dialog open={showBmrInfo} onOpenChange={setShowBmrInfo}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Calculator className="h-5 w-5 text-blue-500 mr-2" />
            Understanding Basal Metabolic Rate (BMR)
          </DialogTitle>
          <DialogDescription>
            Learn what BMR is, how it's calculated, and why it matters for your health goals.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {/* What is BMR */}
          <div>
            <h3 className="font-medium text-lg mb-2">What is BMR?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Basal Metabolic Rate (BMR) represents the minimum amount of energy your body needs when at complete rest to keep functioning. This includes breathing, blood circulation, cell production, and maintaining body temperature.
            </p>
          </div>
          
          {/* How it's calculated */}
          <div>
            <h3 className="font-medium text-lg mb-2">How BMR is Calculated</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We use the Mifflin-St Jeor Equation to calculate your BMR:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md text-sm mt-2 font-mono">
              <p className="dark:text-gray-300">For men:<br />
              BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5</p>
              <p className="mt-2 dark:text-gray-300">For women:<br />
              BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161</p>
            </div>
          </div>
          
          {/* Why BMR Matters */}
          <div>
            <h3 className="font-medium text-lg mb-2">Why Your BMR Matters</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Understanding your BMR helps with:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <li>Creating effective weight management plans</li>
              <li>Establishing calorie goals for weight loss or gain</li>
              <li>Understanding your body's baseline energy needs</li>
              <li>Adjusting nutrition based on your unique metabolism</li>
            </ul>
          </div>
          
          {/* Your BMR */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2">Your BMR: {calculateBMR()} calories/day</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This is your base calorie burn without any physical activity.
            </p>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Daily calorie needs based on activity level:</span>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                • Sedentary (little/no exercise): {Math.round(calculateBMR() * 1.2)} calories
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                • Light activity (1-3 days/week): {Math.round(calculateBMR() * 1.375)} calories
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                • Moderate activity (3-5 days/week): {Math.round(calculateBMR() * 1.55)} calories
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                • Very active (6-7 days/week): {Math.round(calculateBMR() * 1.725)} calories
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                • Extra active (physical job/training): {Math.round(calculateBMR() * 1.9)} calories
              </p>
            </div>
          </div>
          
          {/* Factors affecting BMR */}
          <div>
            <h3 className="font-medium text-lg mb-2">Factors That Affect BMR</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Age</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    BMR typically decreases with age as muscle mass decreases.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 text-xs">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Gender</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Males generally have higher BMRs due to greater muscle mass and less body fat.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 text-xs">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Body Composition</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Muscle burns more calories at rest than fat does, so more muscle = higher BMR.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 text-xs">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Other Factors</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Genetics, hormonal factors, environmental temperature, and health status can all influence BMR.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogClose asChild>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );

  const { bmi, category } = calculateBMI();
  const bmr = calculateBMR();

  // Define a CSS class for glowing animation
  const glowingIconClass = "animate-pulse text-gray-500 hover:text-purple-500 group-hover:animate-none";

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 transition-colors duration-300">
      {/* Render Info Modals */}
      <BmiInfoModal />
      <BmrInfoModal />
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FitMe
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, <span className="font-semibold">{userDetails.name}</span>!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button
              onClick={startChat}
              variant="outline"
              size="sm"
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat<Sparkles className="h-4 w-4 ml-2" />
            </Button> */}
            {/* <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Settings className="h-4 w-4 mr-2" />
              Reset Profile
            </Button> */}
              
            <Button 
              onClick={startChat}
              className="w-30 sm:w-30 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg transition-all duration-200 py-3"
            >
              <Sparkles className="h-5 w-5 mr-0.3" />
              AI Health Coach
            </Button>
            {/* <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Get personalized advice and answers to all your fitness questions
            </p> */}
        
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              Your Health Dashboard <Sparkles className="inline-block w-5 h-5 mb-1 ml-1 text-yellow-500" />
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Here's your personalized health information and recommendations.
            </p>
          </div>

          {/* Health Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* BMI Card */}
            <Card className="shadow-md border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Calculator className="h-5 w-5 text-purple-500 mr-2" />
                    <CardTitle className="text-lg">Body Mass Index (BMI)</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-full relative group"
                    onClick={() => setShowBmiInfo(true)}
                  >
                    <span className="absolute inset-0 rounded-full bg-purple-500/10 animate-ping opacity-75 group-hover:opacity-0"></span>
                    <Info className={glowingIconClass} />
                    <span className="sr-only">BMI Information</span>
                  </Button>
                </div>
                <CardDescription>Based on your height and weight</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row items-center justify-between py-4 gap-4">
                  {/* Left side: SVG illustration */}
                  <div className="flex-shrink-0 w-1/3">
                    {/* Show SVG illustration based on BMI category */}
                    {category === "Underweight" && <UnderweightSVG />}
                    {category === "Normal weight" && <NormalWeightSVG />}
                    {category === "Overweight" && <OverweightSVG />}
                    {category === "Obesity" && <ObeseSVG />}
                  </div>
                  
                  {/* Right side: BMI information */}
                  <div className="flex flex-col items-center flex-grow">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {bmi}
                    </div>
                    
                    <div 
                      className={`text-lg font-medium mb-2 ${
                        category === "Underweight" ? "text-blue-600 dark:text-blue-400" : 
                        category === "Normal weight" ? "text-green-600 dark:text-green-400" : 
                        category === "Overweight" ? "text-yellow-600 dark:text-yellow-400" : 
                        "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {category}
                    </div>
                    
                    {/* BMI Progress Bar */}
                    <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          category === "Underweight" ? "bg-blue-500" : 
                          category === "Normal weight" ? "bg-green-500" : 
                          category === "Overweight" ? "bg-yellow-500" : 
                          "bg-red-500"
                        }`}
                        style={{ 
                          width: `${Math.min(100, Math.max(0, (parseFloat(bmi) - 10) * 3))}%` 
                        }}
                      ></div>
                    </div>
                    <div className="w-full flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>Underweight</span>
                      <span>Normal</span>
                      <span>Overweight</span>
                      <span>Obese</span>
                    </div>
                  </div>
                </div>
                
                {/* Explanation - full width */}
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                  {category === "Underweight" && "You may need to gain some weight. Consider a nutrition plan to reach a healthier weight."}
                  {category === "Normal weight" && "Great job! Your BMI is within the healthy range. Keep up your healthy habits."}
                  {category === "Overweight" && "You may benefit from losing some weight. Focus on healthy eating and regular exercise."}
                  {category === "Obesity" && "For your health, it's advisable to lose weight. Consider consulting with a healthcare provider."}
                </p>
              </CardContent>
            </Card>

            {/* BMR Card */}
            <Card className="shadow-md border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Calculator className="h-5 w-5 text-blue-500 mr-2" />
                    <CardTitle className="text-lg">Basal Metabolic Rate (BMR)</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-full relative group"
                    onClick={() => setShowBmrInfo(true)}
                  >
                    <span className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping opacity-75 group-hover:opacity-0"></span>
                    <Info className={glowingIconClass} />
                    <span className="sr-only">BMR Information</span>
                  </Button>
                </div>
                <CardDescription>Daily calories your body needs at rest</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-4">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {bmr}
                  </div>
                  <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    calories/day
                  </div>
                  
                  <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center">
                      Based on: {userDetails.gender || "Male"}
                    </span>
                  </div>
                  
                  <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                    This is the minimum calories your body needs for basic functions like breathing and cell production.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Ideas Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Recipes Card */}
            <Card className="shadow-md border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <Utensils className="h-5 w-5 text-green-500 mr-2" />
                  <CardTitle className="text-lg">Quick Healthy Recipes</CardTitle>
                </div>
                <CardDescription>Simple nutritious meals to try today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quickRecipes.map((recipe, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-3 mt-0.5">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">{recipe.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{recipe.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={startChat} 
                  variant="outline" 
                  className="w-full border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                >
                  Get More Recipe Ideas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Workouts Card */}
            <Card className="shadow-md border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <Dumbbell className="h-5 w-5 text-orange-500 mr-2" />
                  <CardTitle className="text-lg">10-Minute Workouts</CardTitle>
                </div>
                <CardDescription>Quick exercises for busy days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quickWorkouts.map((workout, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mr-3 mt-0.5">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">{workout.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{workout.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={startChat} 
                  variant="outline" 
                  className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20"
                >
                  Get More Workout Ideas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Gyms Near Me Card */}
          <Card className="shadow-md border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-red-500 mr-2" />
                <CardTitle className="text-lg">Find Gyms Near You</CardTitle>
              </div>
              <CardDescription>Discover fitness centers in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-6">
                <Button 
                  onClick={findNearbyGyms} 
                  disabled={loadingLocation}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                >
                  {loadingLocation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Finding your location...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Find Gyms Near Me
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                  We'll open Google Maps to show gyms near your location.
                  <br />On mobile devices, this will open in your Maps app.
                </p>
              </div>
            </CardContent>
          </Card>
           {/* Fitness Shop Card */}
            <Card className="shadow-md border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <ShoppingBag className="h-5 w-5 text-indigo-500 mr-2" />
                  <CardTitle className="text-lg">Fitness Equipment & Supplements</CardTitle>
                </div>
                <CardDescription>Shop for your fitness journey needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => window.open('https://www.amazon.in/s?k=home+gym+equipment&crid=2XN4VWZ6N4X6L&sprefix=home+gym+equip%2Caps%2C201', '_blank')}
                      variant="outline" 
                      className="text-xs border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                    >
                      <Package className="h-3 w-3 mr-1" />
                      Home Gym
                    </Button>
                    <Button 
                      onClick={() => window.open('https://www.flipkart.com/search?q=dumbbells&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=off&as=off', '_blank')}
                      variant="outline" 
                      className="text-xs border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                    >
                      <Dumbbell className="h-3 w-3 mr-1" />
                      Dumbbells
                    </Button>
                    <Button 
                      onClick={() => window.open('https://www.amazon.in/s?k=whey+protein&crid=2IMOVHD1A3QWM&sprefix=whey+protei%2Caps%2C210', '_blank')}
                      variant="outline" 
                      className="text-xs border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Protein
                    </Button>
                    <Button 
                      onClick={() => window.open('https://www.flipkart.com/search?q=yoga%20mat&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=off&as=off', '_blank')}
                      variant="outline" 
                      className="text-xs border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      Yoga Mat
                    </Button>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Popular Categories:</p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { name: "Resistance Bands", url: "https://www.amazon.in/s?k=resistance+bands" },
                        { name: "Fitness Tracker", url: "https://www.flipkart.com/search?q=fitness+tracker" },
                        { name: "Vitamins", url: "https://www.amazon.in/s?k=multivitamins" },
                        { name: "Running Shoes", url: "https://www.flipkart.com/search?q=running+shoes" }
                      ].map((item, index) => (
                        <button
                          key={index}
                          onClick={() => window.open(item.url, '_blank')}
                          className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 w-full">
                
                  <Button 
                    onClick={() => window.open('https://www.amazon.in/s?k=fitness+equipment', '_blank')}
                    variant="outline" 
                    className="flex-1 text-xs border-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                  >
                     <img className="w-8" src={amazonIcon} alt="amazonicon"  />
                    <span className="text-orange-600 dark:text-orange-400">Amazon</span>
                  </Button>
                  <Button 
                    onClick={() => window.open('https://www.flipkart.com/sports/fitness/pr?sid=qoc%2Cacb', '_blank')}
                    variant="outline" 
                    className="flex-1 text-xs border-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                  <img className="w-6" src={flipkartIcon} alt="flipkarticon"  />
                    <span className="text-blue-600 dark:text-blue-400">Flipkart</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          {/* Bottom Reset Button */}
          <br />
           {/* <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Settings className="h-4 w-4 mr-2" />
              Reset Profile
            </Button> */}
        </div>
      </div>
  );
};

export default Dashboard; 