"use client";

import Image from "next/image";

export function OnboardImage({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col justify-between">
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt="Wedding ceremony background"
            fill
            priority
            className="object-cover rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
}
