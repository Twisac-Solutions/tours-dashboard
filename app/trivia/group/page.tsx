"use client";

import { useState } from "react";
import { useEvent } from "@/providers/EventProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { axiosPrivate } from "@/lib/axios";
import { TriviaGroupData, TriviaQuestionData } from "@/data/api";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TriviaGroup() {
  const { currentEvent } = useEvent();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const router = useRouter();
  const [group, setGroup] = useState<TriviaGroupData | null>(null);
  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !question) {
      toast({
        title: "Error",
        description: "Group name and Question is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axiosPrivate.post<TriviaGroupData>(
        `/admin/event/${currentEvent?.id}/trivia/group`,
        { name }
      );

      if (response.status === 201) {
        setGroup(response.data);
        toast({
          title: "Trivia Group Created",
          description: `Group "${response.data.name}" created successfully!`,
        });

        submitQuestion(response.data.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create trivia group",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const submitQuestion = async (groupId: string) => {
    if (!question || !groupId) {
      toast({
        title: "Missing Fields",
        description: "Please enter a question and select a group.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosPrivate.post<TriviaQuestionData>(
        `/admin/event/${currentEvent?.id}/trivia/question`,
        { question, groupId }
      );

      if (response.status === 201) {
        toast({
          title: "Trivia Question Added",
          description: `Question: "${response.data.data.question}" added successfully!`,
        });

        setQuestion("");
        setName("");
        router.push(`/trivia/question/${response.data.data.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add trivia question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Trivia Group</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="block mb-3">Group Name</Label>
              <Input
                type="text"
                placeholder="Enter trivia group name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label className="block mb-3">Question</Label>
              <Textarea
                placeholder="Enter Question"
                value={question}
                required
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
