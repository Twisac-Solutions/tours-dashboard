import { Button } from "@/components/ui/button";
import { Heart, Camera, Cake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Component() {
  return (
    <div className="min-h-screen bg-[#fff8f9] relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-[#ed6559] rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold text-primary">GatherGram</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] relative">
        {/* Decorative Circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer circle - orange/peach */}
          <div className="w-[800px] h-[800px] rounded-full border-2 border-[#ed6559] opacity-30"></div>
          {/* Inner circle - pink */}
          <div className="absolute w-[600px] h-[600px] rounded-full border-2 border-primary opacity-40"></div>
        </div>

        {/* Floating Icons */}
        {/* Flowers - top left */}
        <div className="absolute top-[20%] left-[21%] w-12 h-12 bg-[#72be47] rounded-full flex items-center justify-center transform rotate-12">
          <div className="text-2xl">🌻</div>
        </div>

        {/* Heart with arrow - left */}
        <div className="absolute top-[45%] left-[19%] w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <Heart className="w-6 h-6 text-white fill-white" />
        </div>

        {/* Bride figure - top */}
        <div className="absolute top-[0%] left-[74%] transform -translate-x-1/2 w-16 h-16 bg-white rounded-full border-2 border-[#cfd0d1] flex items-center justify-center">
          <div className="text-2xl">👰</div>
        </div>

        {/* Camera - right */}
        <div className="absolute top-[35%] right-[26.5%] w-12 h-12 bg-[#e1c04c] rounded-lg flex items-center justify-center transform -rotate-12">
          <Camera className="w-6 h-6 text-white" />
        </div>

        {/* Groom figure - bottom left */}
        <div className="absolute bottom-[25%] left-[27%] w-16 h-16 bg-white rounded-full border-2 border-[#cfd0d1] flex items-center justify-center">
          <div className="text-2xl">🤵</div>
        </div>

        {/* Wedding cake - bottom right */}
        <div className="absolute bottom-[20%] right-[20%] w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
          <Cake className="w-6 h-6 text-white" />
        </div>

        {/* Central Content */}
        <div className="text-center z-10 max-w-md mx-auto px-6">
          {/* Central Heart Icon */}
          <div className="mb-8 flex justify-center">
            <Image src="/assets/logo.png" alt="Heart" width={64} height={64} />
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#3d4043] mb-8 leading-tight">
            Let&apos;s create your wedding space together!
          </h1>

          {/* CTA Button */}
          <Button
            className=" bg-primary hover:bg-[#e82e62] text-white font-semibold py-4 px-16 rounded-xl mb-6 shadow-lg transition-all duration-200 hover:shadow-xl"
            size="lg"
          >
            Let&apos;s do this!
          </Button>

          {/* Login Link */}
          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
