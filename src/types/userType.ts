import { Tables } from "./database.types";

export type UserType =
| Tables["profiles"]["Row"]
| Tables["consultant_profiles"]["Row"];