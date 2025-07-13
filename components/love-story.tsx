"use client";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OurStoryData } from "@/data/api";
import { useEffect, useState } from "react";

interface LoveStoryProps {
  ourStory: OurStoryData;
}

export default function LoveStory({ ourStory }: LoveStoryProps) {
  const [weddingData, setWeddingData] = useState<OurStoryData>(ourStory);

  useEffect(() => {
    setWeddingData(ourStory);
  }, [ourStory]);

  return (
    <div>
      {weddingData && (
        <div>
          {/* Hero Section */}
          <section className="relative h-[400px] overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <Image
              src={weddingData.mediaUrl || "/placeholder.svg"}
              alt="Wedding couple"
              fill
              className="object-cover"
              priority
            />
            <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
              <Badge className="mb-4 w-fit text-primary-foreground">
                Love Story
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {weddingData.brideName} & {weddingData.groomName}
              </h1>
              <div className="flex items-center text-white">
                <Calendar size={18} className="mr-2" />
                <span>
                  {format(new Date(weddingData.weddingDate), "MMMM d, yyyy")}
                </span>
              </div>
            </div>
          </section>

          {/* Our Story Timeline */}
          <section className="py-16 container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-10">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <Heart className="text-primary" size={20} />
                </div>
                <h2 className="text-3xl font-bold">Our Story</h2>
              </div>

              <div className="space-y-16">
                {weddingData?.ourStorySections?.map((section, index) => (
                  <div
                    key={section.id}
                    className={`flex flex-col ${
                      index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                    } gap-8`}
                  >
                    <div className="md:w-1/2">
                      <div className="grid grid-cols-1 gap-4">
                        {section.mediaUrls.map((url, i) => (
                          <div
                            key={i}
                            className="relative h-64 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={section.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="md:w-1/2 flex flex-col justify-center">
                      <div className="mb-2 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <h3 className="text-2xl font-bold">{section.title}</h3>
                      </div>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {section.content}
                      </p>
                      {/* <div className="mt-2 text-xs text-muted-foreground">
                        {format(new Date(section.createdAt), "MMMM yyyy")}
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Favorite Characteristics */}
          <section className="py-16 bg-accent/20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-10">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-4">
                    <Heart className="text-primary" size={20} />
                  </div>
                  <h2 className="text-3xl font-bold">
                    What We Love About Each Other
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {weddingData?.favoriteCharacteristics?.map((trait) => (
                    <Card key={trait.id} className="overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={trait.mediaUrl || "/placeholder.svg"}
                          alt={trait.trait}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <Badge
                            className={
                              trait.host === "bride"
                                ? "bg-primary"
                                : "bg-blue-500"
                            }
                          >
                            {trait.host === "bride" ? "Bride" : "Groom"}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2">
                          {trait.trait}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {trait.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Wedding Party */}
          <section className="py-16 container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-10">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-4">
                  <Users className="text-primary" size={20} />
                </div>
                <h2 className="text-3xl font-bold">Wedding Party</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {weddingData?.ourStoryPartyMember?.map((member) => (
                  <Card key={member.id} className="overflow-hidden">
                    <div className="relative h-64">
                      <Image
                        src={member.mediaUrl || "/placeholder.svg"}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <Badge
                          className={
                            member.partyType === "BRIDESMAIDS"
                              ? "bg-primary"
                              : "bg-blue-500"
                          }
                        >
                          {member.partyType}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mt-2">
                        {member.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
