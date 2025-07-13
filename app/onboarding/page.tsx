"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Heart, Calendar, Users, MessageCircle } from "lucide-react";
import Logo from "@/components/logo";
import Image from "next/image";

const styles = [
  {
    id: 1,
    name: "Rustic Green",
    image: "/placeholder.svg?height=160&width=240&text=Rustic+Green+Style",
  },
  {
    id: 2,
    name: "Floral Romance",
    image: "/placeholder.svg?height=160&width=240&text=Floral+Romance",
  },
  {
    id: 3,
    name: "Modern Black",
    image: "/placeholder.svg?height=160&width=240&text=Modern+Black",
  },
  {
    id: 4,
    name: "Classic White",
    image: "/placeholder.svg?height=160&width=240&text=Classic+White",
  },
  {
    id: 5,
    name: "Vintage Pink",
    image: "/placeholder.svg?height=160&width=240&text=Vintage+Pink",
  },
  {
    id: 6,
    name: "Sage Green",
    image: "/placeholder.svg?height=160&width=240&text=Sage+Green",
  },
  {
    id: 7,
    name: "Terracotta",
    image: "/placeholder.svg?height=160&width=240&text=Terracotta",
  },
  {
    id: 8,
    name: "Sky Blue",
    image: "/placeholder.svg?height=160&width=240&text=Sky+Blue",
  },
  {
    id: 9,
    name: "Dark Moody",
    image: "/placeholder.svg?height=160&width=240&text=Dark+Moody",
  },
  {
    id: 10,
    name: "Blush Pink",
    image: "/placeholder.svg?height=160&width=240&text=Blush+Pink",
  },
];

const colors = [
  { id: 1, name: "Pink", value: "#E91E63", selected: true },
  { id: 2, name: "Blue", value: "#4285F4" },
  { id: 3, name: "Purple", value: "#9C27B0" },
  { id: 4, name: "Green", value: "#4CAF50" },
  { id: 5, name: "Orange", value: "#FF9800" },
  { id: 6, name: "Beige", value: "#D4B896" },
];

export default function WeddingAppPersonalization() {
  const [selectedTab, setSelectedTab] = useState("style");
  const [selectedStyle, setSelectedStyle] = useState(2);
  const [selectedColor, setSelectedColor] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);

  const currentColor = colors.find((color) => color.id === selectedColor);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-lg text-center">
            <h1 className="text-5xl font-mauline mb-4">
              {"Your wedding space is ready!"}
            </h1>
            <p className="text-muted-foreground text-lg mb-4">
              How about we personalize it a bit? Just two fun steps and you're
              done!
            </p>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl font-mauline mb-4">
                {"Let's personalize your wedding app"}
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                {selectedTab === "style"
                  ? "What style feels like you? You can always update this later!"
                  : "What colour feels like you? You can always update this later!"}
              </p>
            </div>
            {/* Tab Navigation */}
            <div className="border-b w-full">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setSelectedTab("style")}
                    className={`py-4 px-12 font-medium border-b-4 transition-colors ${
                      selectedTab === "style"
                        ? "border-primary "
                        : "border-transparent text-muted-foreground hover:text-gray-700"
                    }`}
                  >
                    Style
                  </button>
                  <button
                    onClick={() => setSelectedTab("colors")}
                    className={`py-4 px-12 font-medium border-b-4 transition-colors ${
                      selectedTab === "colors"
                        ? "border-primary "
                        : "border-transparent text-muted-foreground hover:text-gray-700"
                    }`}
                  >
                    Colours
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-8">
              {selectedTab === "colors" && (
                <div className="space-y-8">
                  {/* Color Selection */}
                  <div className="flex justify-center gap-4">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`relative w-8 h-8 md:w-16 md:h-16 rounded-full transition-all duration-200 ${
                          selectedColor === color.id
                            ? "ring-4 ring-gray-300 ring-offset-4"
                            : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                      >
                        {selectedColor === color.id && (
                          <Check className="absolute inset-0 m-auto w-6 h-6 text-white" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Mobile Preview */}
                  <div className="flex justify-center">
                    <div className="relative">
                      {/* Phone Frame */}
                      <div className="w-80 h-[640px] bg-black rounded-[3rem] p-2">
                        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                          {/* Status Bar */}
                          <div className="flex justify-between items-center px-6 py-2 text-sm">
                            <span className="font-medium">9:41</span>
                            <div className="flex items-center gap-1">
                              <div className="flex gap-1">
                                <div className="w-1 h-1 bg-black rounded-full"></div>
                                <div className="w-1 h-1 bg-black rounded-full"></div>
                                <div className="w-1 h-1 bg-black rounded-full"></div>
                                <div className="w-1 h-1 bg-black rounded-full"></div>
                              </div>
                              <div className="w-6 h-3 border border-black rounded-sm">
                                <div className="w-4 h-1 bg-black rounded-sm m-0.5"></div>
                              </div>
                            </div>
                          </div>

                          {/* App Header */}
                          <div className="px-6 py-4 border-b">
                            <div className="flex items-center justify-center mb-2">
                              <Heart
                                className="w-6 h-6 mr-2"
                                style={{ color: currentColor?.value }}
                              />
                            </div>
                            <h2 className="text-xl font-bold text-center">
                              Emma & John
                            </h2>
                            <p className="text-sm text-gray-600 text-center">
                              Dinner Service at 6:30pm
                            </p>
                          </div>

                          {/* Content */}
                          <div className="p-6 space-y-6">
                            {/* Trivia Section */}
                            <div
                              className="rounded-2xl p-4"
                              style={{
                                backgroundColor: `${currentColor?.value}20`,
                              }}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h3
                                  className="font-bold"
                                  style={{ color: currentColor?.value }}
                                >
                                  Trivia Time!
                                </h3>
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                  style={{
                                    backgroundColor: currentColor?.value,
                                  }}
                                >
                                  01
                                </div>
                              </div>
                              <div
                                className="rounded-xl p-4"
                                style={{ backgroundColor: currentColor?.value }}
                              >
                                <p className="text-white text-center font-medium">
                                  {"What was Emma's first impression of John?"}
                                </p>
                              </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-4">
                              <div className="flex items-center">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center mr-4"
                                  style={{
                                    backgroundColor: `${currentColor?.value}20`,
                                  }}
                                >
                                  <Users
                                    className="w-4 h-4"
                                    style={{ color: currentColor?.value }}
                                  />
                                </div>
                                <div>
                                  <p
                                    className="font-medium"
                                    style={{ color: currentColor?.value }}
                                  >
                                    Guest Arrival
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    4:00 PM
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center mr-4"
                                  style={{
                                    backgroundColor: currentColor?.value,
                                  }}
                                >
                                  <Heart className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <p
                                    className="font-medium"
                                    style={{ color: currentColor?.value }}
                                  >
                                    {"Bride and Groom's Entrance"}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    5:00 PM
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-400">
                                    Ceremony
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    5:30 PM
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                                  <MessageCircle className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-400">
                                    Dinner Service
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Message */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                                <div>
                                  <p className="font-medium text-sm">
                                    Jane Brown
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Two ago
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700">
                                Congratulations on your wedding day! 🎉 Wishing
                                you a lifetime of love, laughter, and...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === "style" && (
                <div className="space-y-8">
                  {/* Style Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 sm:grid-cols-5 gap-3">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`border rounded-md overflow-hidden transition-all duration-200 ${
                          selectedStyle === style.id
                            ? "ring-2 ring-primary ring-offset-2"
                            : "hover:scale-105"
                        }`}
                      >
                        <img
                          src={style.image || "/placeholder.svg"}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col max-w-lg justify-center items-center text-center">
            <Image
              className="mb-4"
              src="/assets/gifs/couples.gif"
              alt="Couples gif"
              width={147}
              height={147}
              unoptimized={true}
            />
            <h1 className="text-5xl font-mauline mb-4">
              {"And just like that.. The fun begins!"}
            </h1>
          </div>
        );
      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 1:
        return "Let's do it!";
      case 2:
        return "Done";
      case 3:
        return "Take me to my wedding space";
      default:
        return "Next";
    }
  };
  return (
    <div
      className={`relative max-h-[100vh] h-dvh flex bg-background ${
        currentStep !== 2 ? "bg-cover bg-center" : ""
      }`}
      style={
        currentStep !== 2
          ? { backgroundImage: "url('/assets/onboard-bg.jpg')" }
          : {}
      }
    >
      {/* Header */}
      <div className="absolute top-4 left-4 px-6 py-8 items-center">
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col justify-center items-center ">
          {renderStepContent()}
          {/* Action Buttons */}
          <div className="flex w-full justify-center items-center gap-4 mt-12  max-w-md">
            {currentStep !== 3 && (
              <Button
                variant="ghost"
                size="lg"
                className="flex-1 text-gray-600"
              >
                Skip
              </Button>
            )}
            <Button
              size="lg"
              className="flex-1 text-white"
              onClick={handleNext}
              style={{ backgroundColor: currentColor?.value }}
            >
              {getButtonText()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
