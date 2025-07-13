"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TriviaAnswerResponse, TriviaQuestionsResponse } from "@/data/api";
import { axiosPrivate } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, Pencil, Trash2, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface GroupTriviaAnswerProps {
  questionId: string;
  eventId: string;
  groupId: string;
  onClose: () => void;
}

const GroupTriviaAnswer: React.FC<GroupTriviaAnswerProps> = ({
  questionId,
  eventId,
  groupId,
  onClose,
}) => {
  const { toast } = useToast();
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editCorrect, setEditCorrect] = useState<boolean>(false);
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    try {
      const res = await axiosPrivate.get(
        `/admin/event/${eventId}/trivia/question/${questionId}/answer`,
      );
      setAnswers(res.data.data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch answers",
        variant: "destructive",
      });
    }
  };

  const fetchQuestion = async () => {
    try {
      const response = await axiosPrivate.get<TriviaQuestionsResponse>(
        `/admin/event/${eventId}/trivia/question`,
      );
      const foundQuestion = response.data.data.find((q) => q.id === questionId);
      setQuestion(
        foundQuestion ? foundQuestion.question : "Question not found",
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load question",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!answer) {
      toast({
        title: "Missing Answer",
        description: "Please enter an answer.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosPrivate.post<TriviaAnswerResponse>(
        `/admin/event/${eventId}/trivia/question/${questionId}/answer`,
        { answer, isCorrect },
      );

      toast({
        title: "Answer Added",
        description: `Answer: "${response.data.data.answer}" added successfully!`,
      });

      setAnswer("");
      setIsCorrect(false);
      fetchAnswers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add answer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAnswer = async (answerId: string) => {
    try {
      await axiosPrivate.delete(
        `/admin/event/${eventId}/trivia/question/${questionId}/answer/${answerId}`,
      );
      setAnswers(answers.filter((ans) => ans.id !== answerId));
      fetchAnswers();
      toast({
        title: "Deleted",
        description: "Answer deleted successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete answer.",
        variant: "destructive",
      });
    }
  };

  const startEdit = (ans: any) => {
    setEditingId(ans.id);
    setEditText(ans.answer);
    setEditCorrect(ans.isCorrect);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditCorrect(false);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await axiosPrivate.patch(
        `/admin/event/${eventId}/trivia/question/${questionId}/answer/${editingId}`,
        {
          answer: editText,
          isCorrect: editCorrect,
        },
      );

      const updated = res.data.data;
      setAnswers((prev) =>
        prev.map((ans) => (ans.id === editingId ? updated : ans)),
      );
      fetchAnswers();
      toast({
        title: "Updated",
        description: "Answer updated successfully.",
      });
      cancelEdit();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update answer.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuestion = async (groupId: string) => {
    if (!question || !groupId) {
      toast({
        title: "Missing Fields",
        description: "Please enter a question ",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosPrivate.patch(
        `/admin/event/${eventId}/trivia/question/${questionId}`,
        { question, groupId },
      );

      if (response.status === 201) {
        toast({
          title: "Trivia Question Updated",
          description: `Question: "${response.data.data.question}" added successfully!`,
        });
        setQuestion(response.data.data.question);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to Update trivia question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto  space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Trivia Answer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-semibold">Question: {question}</h1>
          <Input
            placeholder="Enter Question"
            value={question || ""}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <div className="flex justify-between">
            <Button variant="secondary" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button
              onClick={() => handleUpdateQuestion(groupId)}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Update Question"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Answers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-semibold">Create Answer</h1>
          <Textarea
            placeholder="Enter Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            <Checkbox
              className="h-5 w-5 "
              id="correct"
              checked={isCorrect}
              onCheckedChange={(checked) => setIsCorrect(checked === true)}
            />
            <Label htmlFor="correct" className="text-base">
              Is Correct Answer?
            </Label>
          </div>
          <div className="flex justify-between">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Add Answer"}
            </Button>
          </div>
          {answers.length > 0 ? (
            answers.map((ans) => (
              <div key={ans.id} className="flex flex-col border p-3 rounded-md">
                {editingId === ans.id ? (
                  <div className="space-y-4">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      placeholder="Edit answer"
                    />
                    <div className="flex items-center space-x-2">
                      <label>Correct?</label>
                      <Checkbox
                        className="h-5 w-5"
                        checked={editCorrect}
                        onCheckedChange={() => setEditCorrect(!editCorrect)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveEdit} size="sm">
                        <Check className="w-4 h-4 mr-1" /> Save
                      </Button>
                      <Button onClick={cancelEdit} size="sm" variant="outline">
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 ">
                      <Checkbox
                        className="h-5 w-5 rounded-lg"
                        id="correct"
                        checked={ans.isCorrect}
                      />
                      <Label htmlFor="correct" className="text-base">
                        {ans.answer}
                      </Label>
                    </div>
                    <div className="flex gap-2 ">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(ans)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteAnswer(ans.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No answers available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default GroupTriviaAnswer;
