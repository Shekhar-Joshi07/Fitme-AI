
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Target, Globe } from "lucide-react";

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    country: ""
  });

  const goals = [
    "Lose weight",
    "Gain muscle",
    "Improve fitness",
    "Maintain health",
    "Reduce stress",
    "Better sleep"
  ];

  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", 
    "France", "Spain", "Italy", "Japan", "India", "Brazil", "Mexico", "Other"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.age;
      case 2:
        return formData.height && formData.weight;
      case 3:
        return formData.goal && formData.country;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to FitMe! 💪
          </CardTitle>
          <CardDescription className="text-gray-600">
            Let's personalize your health journey <br />
            Created with ❤️ by <a href="https://github.com/sahil-kumar-yadav" className="text-blue-500 hover:text-blue-600">Shekhar Joshi</a>
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
                  className="border-gray-200 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">How old are you?</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="border-gray-200 focus:border-purple-500"
                />
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
                  className="border-gray-200 focus:border-purple-500"
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
                  className="border-gray-200 focus:border-purple-500"
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
                  <SelectTrigger className="border-gray-200 focus:border-purple-500">
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
                  <SelectTrigger className="border-gray-200 focus:border-purple-500">
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
