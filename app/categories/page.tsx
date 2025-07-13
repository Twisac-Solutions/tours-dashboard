"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Tag, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { axiosPrivate } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

/* ---------- TYPE ---------- */
interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

/* ---------- MAIN PAGE ---------- */
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  /* fetch */
  const fetchCategories = async () => {
    try {
      const { data } = await axiosPrivate.get("/categories");
      setCategories(data);
    } catch {
      toast({ title: "Failed to load categories", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  /* delete */
  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/categories/${id}`);
      toast({ title: "Category deleted" });
      fetchCategories();
    } catch {
      toast({ title: "Could not delete", variant: "destructive" });
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">
            Manage all tour categories in one place.
          </p>
        </div>
      </div>

      {/* controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <CreateEditDialog onSuccess={fetchCategories} />
      </div>

      {/* skeleton */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-10 w-10 rounded-full mb-3" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <Tag className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No categories yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first category to get started.
          </p>
          <CreateEditDialog
            onSuccess={fetchCategories}
            triggerLabel="Create Category"
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cat) => (
            <Card key={cat.id} className="overflow-hidden">
              <CardHeader className="pb-1 flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{cat.icon}</span>
                  {cat.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <CreateEditDialog
                      category={cat}
                      onSuccess={fetchCategories}
                      triggerLabel="Edit"
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete “{cat.name}”.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDelete(cat.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {cat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- DIALOG FOR CREATE / EDIT ---------- */
function CreateEditDialog({
  category,
  onSuccess,
  triggerLabel = "Create Category",
}: {
  category?: Category;
  onSuccess: () => void;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /* form */
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "",
  });

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        description: category.description,
        icon: category.icon,
      });
    } else {
      setForm({ name: "", description: "", icon: "" });
    }
  }, [category, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        await axiosPrivate.put(`/categories/${category.id}`, form);
        toast({ title: "Category updated" });
      } else {
        await axiosPrivate.post("/categories", form);
        toast({ title: "Category created" });
      }
      setOpen(false);
      onSuccess();
    } catch {
      toast({ title: "Operation failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {triggerLabel === "Create Category" ? (
          <Button>
            <Plus size={16} className="mr-2" />
            {triggerLabel}
          </Button>
        ) : (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Edit className="mr-2 h-4 w-4" />
            {triggerLabel}
          </DropdownMenuItem>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {category ? "Edit Category" : "Create Category"}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <Input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              name="icon"
              placeholder="Emoji / icon (e.g. 🏖️)"
              value={form.icon}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full rounded-md border p-2"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
