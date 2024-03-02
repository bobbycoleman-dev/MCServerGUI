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
	const regex = /(\w+) left the game/;
	const match = logEntry.match(regex);

	// If a match is found, return the username (first capture group)
	if (match) {
		return match[1];
	}

	// If no match is found, return null
	return null;
}
