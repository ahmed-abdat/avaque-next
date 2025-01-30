export enum Status {
  pending = "pending",
  confirmed = "confirmed",
  completed = "completed",
  cancelled = "cancelled",
  rejected = "rejected",
}

export const statusColors = {
  pending: "bg-yellow-500",
  confirmed: "bg-green-500",
  completed: "bg-blue-500",
  cancelled: "bg-red-500",
  rejected: "bg-gray-500",
};
