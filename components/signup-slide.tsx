"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "Share your love story",
    description:
      "From your first date to the proposal—add your favorite moments!",
    image: "/assets/slides/1.png",
  },
  {
    id: 2,
    title: "Set up your cash & gift funds",
    description:
      "Make it easy for guests to contribute to the things you truly want!",
    image: "/assets/slides/2.png",
  },
  {
    id: 3,
    title: "Customize your app",
    description: "Personalize your app content, colors, fonts & styles!",
    image: "/assets/slides/3.png",
  },
];

export default function SignupSlide() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="hidden lg:flex lg:w-1/2 relative">
      <div className="h-full w-full overflow-hidden absolute ">
        <div className="absolute inset-0">
          <Image
            src="/assets/slides/bg.png"
            alt="Wedding ceremony background"
            fill
            priority
            className="object-cover rounded-3xl"
          />
        </div>
      </div>
      <div className="w-full  items-center justify-center  flex flex-col z-20">
        <div className="">
          <div className="text-center mb-8">
            <h1 className="text-4xl  font-bold mb-4 transition-all duration-500 ">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl px-12 font-semibold text-muted-foreground max-w-xl mx-auto transition-all duration-500">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Navigation Dots (Alternative) */}
          <div className="flex justify-center mb-2 space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>

          {/* iPhone Mockup */}
          <div className="flex flex-shrink justify-center">
            <div className="relative">
              <div className="w-[400px] h-[490px]  p-2 ">
                <div className="w-full h-full   overflow-hidden relative">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentSlide
                          ? "opacity-100 transform translate-x-0"
                          : index < currentSlide
                            ? "opacity-0 transform -translate-x-full"
                            : "opacity-0 transform translate-x-full"
                      }`}
                    >
                      <Image
                        src={slide.image || "/placeholder.svg"}
                        alt={slide.title}
                        fill
                        className="object-contain"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
