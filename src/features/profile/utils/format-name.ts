/**
 * Extracts initials from a full name, up to 2 characters
 * @example
 * formatNameToInitials("John Doe") // returns "JD"
 * formatNameToInitials("Sarah Jane Wilson") // returns "SJ"
 */
export function formatNameToInitials(name: string): string {
  if (!name) return "";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
