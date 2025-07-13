"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  CheckCircle2,
  CircleXIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { axiosPrivate } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

/* ---------- TYPES ---------- */
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  is_verified: boolean;
  profile_picture: string | null;
  city?: string;
  country?: string;
  phone?: string;
  bio?: string;
  language?: string;
  created_at: string;
  updated_at: string;
}

interface ListResponse {
  data: User[];
  meta: {
    limit: number;
    page: number;
    total: number;
    total_pages: number;
  };
}

/* ---------- MAIN PAGE ---------- */
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<ListResponse["meta"]>({
    limit: 10,
    page: 1,
    total: 0,
    total_pages: 0,
  });

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  /* fetch */
  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/users`, {
        params: { page, limit: meta.limit },
      });
      setUsers(data.data);
      setMeta(data.meta);
    } catch {
      toast({ title: "Could not load users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers(meta.page);
  }, [meta.page]);

  /* delete */
  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/users/${id}`);
      toast({ title: "User deleted" });
      fetchUsers(meta.page);
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  /* pagination helper */
  const pages = Array.from({ length: meta.total_pages }, (_, i) => i + 1);

  return (
    <div className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Users</h1>
          <p className="text-muted-foreground">
            Manage platform users, roles and verification status.
          </p>
        </div>
        <CreateEditDialog onSuccess={() => fetchUsers(meta.page)} />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: meta.limit }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} className="h-16">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, idx) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {(meta.page - 1) * meta.limit + idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profile_picture ?? ""} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.city || user.country || "-"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>@{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.is_verified ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <CircleXIcon className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <CreateEditDialog
                          user={user}
                          onSuccess={() => fetchUsers(meta.page)}
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
                              <AlertDialogTitle>Delete user?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDelete(user.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta.total_pages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => meta.page > 1 && fetchUsers(meta.page - 1)}
                className={
                  meta.page <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {pages.map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  onClick={() => fetchUsers(p)}
                  isActive={p === meta.page}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  meta.page < meta.total_pages && fetchUsers(meta.page + 1)
                }
                className={
                  meta.page >= meta.total_pages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

/* ---------- CREATE / EDIT MODAL ---------- */
function CreateEditDialog({
  user,
  onSuccess,
  triggerLabel = "Create User",
}: {
  user?: User;
  onSuccess: () => void;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /* form */
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    role: "USER",
    city: "",
    country: "",
    phone: "",
    bio: "",
    language: "",
    is_verified: false,
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        city: user.city ?? "",
        country: user.country ?? "",
        phone: user.phone ?? "",
        bio: user.bio ?? "",
        language: user.language ?? "",
        is_verified: user.is_verified,
      });
    } else {
      setForm({
        name: "",
        username: "",
        email: "",
        role: "USER",
        city: "",
        country: "",
        phone: "",
        bio: "",
        language: "",
        is_verified: false,
      });
    }
  }, [user, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (checked: boolean) => {
    setForm((prev) => ({ ...prev, is_verified: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        await axiosPrivate.put(`/users/${user.id}`, form);
        toast({ title: "User updated" });
      } else {
        await axiosPrivate.post("/users", form);
        toast({ title: "User created" });
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
        {triggerLabel === "Create User" ? (
          <Button>
            <Plus size={16} className="mr-2" />
            {triggerLabel}
          </Button>
        ) : (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pencil className="mr-2 h-4 w-4" />
            {triggerLabel}
          </DropdownMenuItem>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user ? "Edit User" : "Create User"}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            <Input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
              required
            />
            <Input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />
            <Input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
            />
            <Input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />
            <textarea
              name="bio"
              placeholder="Bio"
              value={form.bio}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={3}
              className="w-full rounded-md border p-2"
            />
            <Input
              name="language"
              placeholder="Language"
              value={form.language}
              onChange={handleChange}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_verified}
                onChange={(e) => handleCheckbox(e.target.checked)}
              />
              Verified
            </label>
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
