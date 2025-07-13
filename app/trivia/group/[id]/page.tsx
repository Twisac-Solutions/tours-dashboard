"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { axiosPrivate } from "@/lib/axios";
import { TriviaQuestionData } from "@/data/api";
import { useEvent } from "@/providers/EventProvider";
import { useParams } from "next/navigation";

export default function TriviaQuestion() {
  const { id } = useParams();
  const groupId = id || "";
  const { currentEvent } = useEvent();
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question) {
      toast({
        title: "Missing Fields",
        description: "Please enter a question",
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
    <div className="max-w-lg mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Trivia Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
