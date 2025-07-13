import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "active" | "inactive";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = status === "active" ? "default" : "secondary";

  return (
    <Badge variant={variant} className="py-1 rounded-md">
      {status}
    </Badge>
  );
}
