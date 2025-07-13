"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BoxesIcon,
  DicesIcon,
  Edit,
  FileQuestion,
  GroupIcon,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useEvent } from "@/providers/EventProvider";
import {
  TriviaGroupData,
  TriviaQuestion,
  TriviaQuestionData,
  TriviaQuestionsResponse,
} from "@/data/api";
import { axiosPrivate } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import GroupTriviaAnswer from "@/components/question-edit";
import { Label } from "@/components/ui/label";

export default function TriviaPage() {
  const { currentEvent } = useEvent();
  const router = useRouter();
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const eventId = currentEvent?.id ?? "";
  const [selectedGroup, setSelectedGroup] = useState<TriviaGroupData | null>(
    null,
  );
  const [groups, setGroups] = useState<TriviaGroupData[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [question, setQuestion] = useState("");

  // State for create/edit group
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch trivia questions
  useEffect(() => {
    fetchTriviaQuestions();
  }, [eventId]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const res = await axiosPrivate.get(
          `/admin/event/${eventId}/trivia/group`,
        );
        setGroups(res.data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch groups",
          variant: "destructive",
        });
        setError("Failed to load groups. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [eventId]);

  const handleClose = () => {
    setSelectedQuestion(null);
  };

  const fetchTriviaQuestions = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get<TriviaQuestionsResponse>(
        `/admin/event/${currentEvent?.id}/trivia/question`,
      );
      if (response.status === 200) {
        setQuestions(response.data.data);
      }
    } catch (err) {
      setError("Failed to load trivia questions");
      setLoading(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axiosPrivate.post(
        `/admin/event/${currentEvent?.id}/trivia/group`,
        {
          name: groupName,
        },
      );

      setGroups([...groups, res.data]);
      setGroupName("");
      setIsSubmitting(false);
      setIsCreateSheetOpen(false);

      toast({
        title: "Group created",
        description: "Your group has been created successfully.",
      });
    } catch (error) {
      console.error("Failed to create group:", error);
      setIsSubmitting(false);

      toast({
        title: "Error",
        description: "Failed to create group Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateGroup = async () => {
    if (!selectedGroup || !groupName.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await axiosPrivate.patch(
        `/admin/event/${eventId}/trivia/group/${selectedGroup.id}`,
        {
          name: groupName,
        },
      );

      setGroups(
        groups.map((group) =>
          group.id === selectedGroup.id ? { ...group, name: groupName } : group,
        ),
      );

      setGroupName("");
      setIsSubmitting(false);
      setIsEditSheetOpen(false);

      toast({
        title: "Group updated",
        description: "Your group has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update group:", error);
      setIsSubmitting(false);

      toast({
        title: "Error",
        description: "Failed to update group. Please try again.",
        variant: "destructive",
      });
    }
  };
  const submitQuestion = async (groupId: string) => {
    if (!question || !groupId) {
      toast({
        title: "Missing Fields",
        description: "Please enter a question ",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosPrivate.post(
        `/admin/event/${currentEvent?.id}/trivia/question`,
        { question, groupId },
      );

      if (response.status === 201) {
        toast({
          title: "Trivia Question Added",
          description: `Question: "${response.data.data.question}" added successfully!`,
        });
        setQuestions([...questions, response.data.data]);
        setQuestion("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add trivia question",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditSheet = (trivaGroup: TriviaGroupData) => {
    setSelectedGroup(trivaGroup);
    setGroupName(trivaGroup.name);
    setIsEditSheetOpen(true);
  };

  // Filter questions based on search query
  const filteredQuestions = questions.filter(
    (q) => q.group.id === selectedGroup?.id,
  );

  const handleDelete = async (questionId: string) => {
    try {
      await axiosPrivate.delete(
        `/admin/event/${currentEvent?.id}/trivia/question/${questionId}`,
      );
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      fetchTriviaQuestions();
      toast({
        title: "Deleted",
        description: "Trivia question deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await axiosPrivate.delete(
        `/admin/event/${currentEvent?.id}/trivia/group/${groupId}`,
      );
      setGroups((prev) => prev.filter((q) => q.id !== groupId));
      toast({
        title: "Deleted",
        description: "Trivia Group deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Trivia Questions</h1>
              <p className="text-muted-foreground">
                Create fun trivia questions for your wedding guests to answer
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Sheet
                open={isCreateSheetOpen}
                onOpenChange={setIsCreateSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button className="bg-primary hover:bg-pink-600 text-white">
                    <Plus size={16} className="mr-2" />
                    Add Group
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Create New Group</SheetTitle>
                    <SheetDescription>
                      Create a new group to organize your questions.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="grid  gap-4 py-4">
                    <div className="grid gap-4">
                      <Label htmlFor="group-name">Group Name</Label>
                      <Input
                        id="group-name"
                        placeholder="e.g., Wedding Group"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                      />
                    </div>
                  </div>

                  <SheetFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setGroupName("");
                        setIsCreateSheetOpen(false);
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary hover:bg-pink-600 text-white"
                      onClick={handleCreateGroup}
                      disabled={!groupName.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Group"
                      )}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit Group</SheetTitle>
                    <SheetDescription>
                      Update the name of your group.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-4">
                      <Label htmlFor="edit-group-name">Group Name</Label>
                      <Input
                        id="edit-group-name"
                        placeholder="e.g., Wedding Ceremony"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                      />
                    </div>
                  </div>

                  <SheetFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setGroupName("");
                        setIsEditSheetOpen(false);
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary hover:bg-pink-600 text-white"
                      onClick={handleUpdateGroup}
                      disabled={!groupName.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Group"
                      )}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Groups List */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border p-4">
                <h2 className="text-lg font-semibold mb-4">Groups</h2>

                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">
                      Loading groups...
                    </span>
                  </div>
                ) : error ? (
                  <div className="text-center py-6">
                    <p className="text-red-500 mb-2">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLoading(true);
                        setError(null);
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                ) : groups.length === 0 ? (
                  <div className="text-center py-8">
                    <BoxesIcon className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground mb-4">
                      No groups found. Create your first group to get started.
                    </p>
                    <Button
                      className="bg-primary hover:bg-pink-600 text-white"
                      onClick={() => setIsCreateSheetOpen(true)}
                    >
                      <Plus size={16} className="mr-2" />
                      Create Group
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                          selectedGroup?.id === group.id
                            ? "bg-accent border"
                            : "hover:bg-accent   border border-transparent"
                        }`}
                        onClick={() => {
                          setSelectedQuestion(null);
                          setSelectedGroup(group);
                        }}
                      >
                        <div className="flex items-center">
                          <BoxesIcon
                            className={`h-5 w-5 mr-2 ${
                              selectedGroup?.id === group.id
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span className="font-medium truncate">
                            {group.name.length > 20
                              ? `${group.name.substring(0, 20)}...`
                              : group.name}
                          </span>{" "}
                        </div>
                        <div className="flex items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditSheet(group);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    className="text-red-500 focus:text-red-500"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {`This will permanently delete the group "
                                      ${group.name}" and all its questions. This
                                      action cannot be undone.`}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-500 hover:bg-red-600"
                                      onClick={() =>
                                        handleDeleteGroup(group.id)
                                      }
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* questions Grid */}
            <div className="lg:col-span-3">
              {selectedGroup ? (
                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                      {selectedGroup.name}
                    </h2>

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus size={16} className="mr-2" />
                          Add Question
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Add New Question</SheetTitle>
                          <SheetDescription>
                            Create a new question to a group.
                          </SheetDescription>
                        </SheetHeader>

                        <div className="grid  gap-4 py-4">
                          <div className="grid gap-4">
                            <Label htmlFor="question-name">Question</Label>
                            <Input
                              id="question-name"
                              placeholder="Question"
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                            />
                          </div>
                        </div>

                        <SheetFooter>
                          <SheetClose>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setQuestion("");
                              }}
                              disabled={isSubmitting}
                            >
                              Cancel
                            </Button>
                          </SheetClose>
                          <Button
                            className="bg-primary hover:bg-pink-600 text-white"
                            onClick={() => submitQuestion(selectedGroup.id)}
                            disabled={!question.trim() || isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              "Add Question"
                            )}
                          </Button>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>

                  {questionsLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">
                        Loading questions...
                      </span>
                    </div>
                  ) : questionsError ? (
                    <div className="text-center py-6">
                      <p className="text-red-500 mb-2">{questionsError}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setQuestionsLoading(true);
                          setQuestionsError(null);
                        }}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : filteredQuestions.length === 0 ? (
                    <div className="text-center py-16 border rounded-lg">
                      <FileQuestion className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground mb-4">
                        No questions in this group yet.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {selectedQuestion ? (
                        <GroupTriviaAnswer
                          questionId={selectedQuestion}
                          eventId={eventId}
                          groupId={selectedGroup.id}
                          onClose={handleClose}
                        />
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {filteredQuestions.map((question) => (
                            <Card key={question.id} className="overflow-hidden">
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-lg font-medium">
                                    Question
                                  </CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-muted-foreground h-12 text-lg">
                                  {question.question}
                                </p>
                              </CardContent>
                              <CardFooter className="flex items-center  pb-2  pt-2 border-t">
                                <div className="flex items-center justify-between w-full ">
                                  <div className="text-xs text-muted-foreground">
                                    ID: {question.id.substring(0, 8)}...
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-2"
                                      onClick={() =>
                                        setSelectedQuestion(question.id)
                                      }
                                    >
                                      Edit
                                    </Button>

                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                        >
                                          Delete
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Are you sure?
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            {`This will permanently delete the Question". This action cannot be undone`}
                                            .
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            className="bg-red-500 hover:bg-red-600"
                                            onClick={() =>
                                              handleDelete(question.id)
                                            }
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full border rounded-lg p-8">
                  <div className="text-center">
                    <DicesIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a Group</h3>
                    <p className="text-muted-foreground mb-4">
                      Choose an group from the list to view its questions
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
