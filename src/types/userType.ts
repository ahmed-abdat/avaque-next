import type { Database } from "./database.types";

export type UserType =
  | Database["public"]["Tables"]["profiles"]["Row"]
  | Database["public"]["Tables"]["consultant_profiles"]["Row"];
