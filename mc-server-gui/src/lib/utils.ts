import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLogEntries(log: string): string {
  const regex = /(?<!^)\[([\d]{2}):([\d]{2}):([\d]{2})\]/g;
  // Replace matches with a newline followed by the matched timestamp
  return log.replace(regex, "\n$&");
}

export function userLoggedOn(logEntry: string): string | null {
  // Regular expression to match the username followed by "joined the game"
  // Assumes usernames can consist of letters, numbers, and underscores
  const regex = /(\w+) joined the game/;
  const match = logEntry.match(regex);

  // If a match is found, return the username (first capture group)
  if (match) {
    return match[1];
  }

  // If no match is found, return null
  return null;
}

export function userLoggedOff(logEntry: string): string | null {
  // Regular expression to match the username followed by "joined the game"
  // Assumes usernames can consist of letters, numbers, and underscores
  const regex1 = /(\w+) left the game/;
  const match1 = logEntry.match(regex1);

  const regex2 = /(\w+) lost connection: Disconnected/;
  const match2 = logEntry.match(regex2);

  // If a match is found, return the username (first capture group)
  if (match1) {
    return match1[1];
  } else if (match2) {
    return match2[1];
  }

  // If no match is found, return null
  return null;
}
