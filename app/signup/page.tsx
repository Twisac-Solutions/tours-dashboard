"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { axiosPublic } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/custom/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Logo from "@/components/logo";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CalendarIcon,
  Heart,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import { OnboardImage } from "@/components/onboard-image";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Step1 from "@/components/icons/setp1";
import Step2Half from "@/components/icons/setp2Half";
import Step3 from "@/components/icons/setp3";
import Step2 from "@/components/icons/setp2";
import SignupSlide from "@/components/signup-slide";
import CalendarHeart from "@/components/icons/CalendarHeart";
import MapPinHeart from "@/components/icons/MapPinHeart";

const SignupPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dateDeciding, setDateDeciding] = useState(false);
  const [locationDeciding, setLocationDeciding] = useState(false);
  const [celebrationSize, setCelebrationSize] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderProgressSteps = () => {
    return (
      <div className="flex items-center mb-8">
        {currentStep === 1 && (
          <div className="flex w-full">
            <Step1 className="w-full" />
          </div>
        )}
        {currentStep === 2 && (
          <div className="flex w-full">
            <Step2 className="w-full" />
          </div>
        )}
        {currentStep === 3 && (
          <div className="flex w-full">
            <Step2Half className="w-full" />
          </div>
        )}
        {currentStep === 4 && (
          <div className="flex w-full">
            <Step3 className="w-full" />
          </div>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl  font-bold mb-3 font-mauline">
              Hey lovebirds!
            </h1>

            <p className="text-muted-foreground text-base lg:text-lg mb-8">
              First things first, who’s saying “I do”?
            </p>

            <div className="space-y-8">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-3">Name</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Emily"
                    className="h-14 pl-4  border-[#e5e5e5] rounded-lg"
                  />
                </div>
              </div>

              {/* Partner's Name */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Partner&apos;s Name
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter your partner's name"
                    className="h-14 pl-4  border-[#e5e5e5] rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 font-mauline">
              When & Where is the Magic Happening?
            </h1>

            <p className="text-muted-foreground text-base lg:text-lg mb-8">
              If you&apos;ve picked a date and location, let&apos;s add it!
            </p>

            <div className="space-y-8">
              {/* Wedding Date */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Wedding date
                </label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={dateDeciding}
                        className="w-full justify-start text-left p-6 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent  pl-4 pr-12 text-[#b9b9b9] border-[#e5e5e5] [&_svg]:size-5"
                      >
                        <span className="rounded-full absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-primary/10 text-primary flex justify-center items-center">
                          <CalendarHeart className="lucide h-5 w-5" />
                        </span>
                        {/* {formData.date
                          ? format(formData.date, "PPP p")
                          : "Pick a date"} */}
                        Choose date
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="center" className="w-auto">
                      <Calendar
                        mode="single"
                        // selected={formData.date}
                        // onSelect={handleDateChange}
                        // initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Checkbox
                    id="date-deciding"
                    checked={dateDeciding}
                    onCheckedChange={setDateDeciding}
                    className="border-[#c4c4c4] rounded  data-[state=checked]:bg-[#e82d63] data-[state=checked]:border-[#e82d63]"
                  />
                  <label
                    htmlFor="date-deciding"
                    className="text-muted-foreground cursor-pointer"
                  >
                    We&apos;re still deciding
                  </label>
                </div>
              </div>

              {/* Wedding Location */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Wedding location
                </label>
                <div className="relative">
                  <Input
                    placeholder="Find your city"
                    className="w-full p-6 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent  pl-4 pr-12 text-[#b9b9b9] border-[#e5e5e5] "
                    disabled={locationDeciding}
                  />
                  <button
                    type="button"
                    className="rounded-full absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-primary/10 text-primary flex justify-center items-center"
                  >
                    <MapPinHeart className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Checkbox
                    id="location-deciding"
                    checked={locationDeciding}
                    onCheckedChange={setLocationDeciding}
                    className="border-[#c4c4c4] rounded data-[state=checked]:bg-[#e82d63] data-[state=checked]:border-[#e82d63]"
                  />
                  <label
                    htmlFor="location-deciding"
                    className="text-muted-foreground cursor-pointer"
                  >
                    We&apos;re still deciding
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 font-mauline">
              How big is the celebration?
            </h1>

            <p className="text-muted-foreground text-base lg:text-lg mb-8">
              Are we talking intimate gathering or full-on festival vibes?
            </p>

            <div className="space-y-6">
              <RadioGroup
                value={celebrationSize}
                onValueChange={setCelebrationSize}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="intimate"
                    id="intimate"
                    className="border-[#c4c4c4] h-5 w-5 text-[#e82d63] focus:ring-[#e82d63]"
                  />
                  <Label htmlFor="intimate" className="cursor-pointer flex-1">
                    Intimate: &amp;50
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="crowd"
                    id="crowd"
                    className="h-5 w-5 border-[#c4c4c4] text-[#e82d63] focus:ring-[#e82d63]"
                  />
                  <Label htmlFor="crowd" className="cursor-pointer flex-1">
                    A solid crowd: 51-150
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="big-celebration"
                    id="big-celebration"
                    className="h-5 w-5 border-[#c4c4c4] text-[#e82d63] focus:ring-[#e82d63]"
                  />
                  <Label
                    htmlFor="big-celebration"
                    className="cursor-pointer flex-1"
                  >
                    Big celebration: 151-300
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="huge-party"
                    id="huge-party"
                    className="h-5 w-5 border-[#c4c4c4] text-[#e82d63] focus:ring-[#e82d63]"
                  />
                  <Label htmlFor="huge-party" className="cursor-pointer flex-1">
                    Huge party: 300+
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="deciding"
                    id="deciding"
                    className="h-5 w-5 border-[#c4c4c4] text-[#e82d63] focus:ring-[#e82d63]"
                  />
                  <Label htmlFor="deciding" className="cursor-pointer flex-1">
                    Still deciding
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl  font-bold mb-3 font-mauline">
              Sign up to your wedding space
            </h1>

            <p className="text-muted-foreground text-base lg:text-lg mb-8">
              Let&apos;s lock this in! Create your account to start customizing.
            </p>

            <div className="space-y-8">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Email
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-4  border-[#e5e5e5] rounded-lg"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Create Password
                </label>
                <div className="relative">
                  <PasswordInput
                    id="password"
                    name="password"
                    autoComplete="password"
                    required
                    className="w-full p-6 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent  pl-4 pr-12 border-[#e5e5e5]"
                    placeholder="*********"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 1:
      case 2:
        return "Next";
      case 3:
        return "Next";
      case 4:
        return "Create Account";
      default:
        return "Next";
    }
  };

  return (
    <div className="max-h-[100vh]  h-dvh flex lg:p-8 p-0">
      {/* Left Side*/}
      <div className="flex-1 flex lg:items-center justify-center lg:p-8 p-4">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <Logo />
          </div>
          {/* Progress Steps */}
          {renderProgressSteps()}
          <form className="space-y-8 mb-8">
            {/* Step Content */}
            {renderStepContent()}
            <Button
              type="button"
              onClick={handleNext}
              className={`rounded-md py-6 ${currentStep == 4 ? "w-full" : "px-16"}`}
              disabled={isVerifying}
            >
              {getButtonText()}
            </Button>
            {currentStep == 4 && (
              <div className="text-center">
                <span className="text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary ml-2">
                    Login
                  </Link>
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
      {/* Right Side */}
      {currentStep !== 4 && (
        <OnboardImage
          imageSrc={`${currentStep == 1 ? "/assets/signup-couple.png" : "/assets/signup-party.png"}`}
        />
      )}
      {currentStep === 4 && <SignupSlide />}
    </div>
  );
};

export default SignupPage;
