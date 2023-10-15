import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";

export const Pronouns: any = Object.freeze({
	1: "she/her",
	2: "he/him",
	3: "they/them",
	0: "other",
});

export function getPronouns(pronounIndex: number) {
	return Pronouns[pronounIndex];
}
export const pronounOptions = [
	{ name: "She/Her", value: 1 },
	{ name: "He/Him", value: 2 },
	{ name: "They/Them", value: 3 },
	{ name: "I prefer not to say", value: 0 },
];
export function getTimeAgo(target: string) {
	const now = new Date();
	const date = new Date(target);
	const diff = now.getTime() - date.getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) {
		return `${days}d ago`;
	} else if (hours > 0) {
		return `${hours}h ago`;
	} else if (minutes > 0) {
		return `${minutes}m ago`;
	} else {
		return `${seconds}s ago`;
	}
}

export function getFormattedDate(target: string) {
	const date = new Date(target);
	const daysOfWeek = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const monthsOfYear = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const dayOfWeek = daysOfWeek[date.getDay()];
	const monthOfYear = monthsOfYear[date.getMonth()];
	const dayOfMonth = date.getDate();
	const year = date.getFullYear();
	const hours = date.getHours() % 12 || 12;
	const minutes = date.getMinutes();
	const ampm = date.getHours() >= 12 ? "PM" : "AM";

	return `${dayOfWeek}, ${monthOfYear} ${dayOfMonth}, ${year} ${hours}:${minutes
		.toString()
		.padStart(2, "0")} ${ampm}`;
}

export function capitalizeFirstLetter(str: string) {
	const words = str.split(" ");

	const capitalizedWords = words.map((word) => {
		if (word.length > 0) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		} else {
			return "";
		}
	});

	const capitalizedString = capitalizedWords.join(" ");

	return capitalizedString;
}

export function getImageName(image: any) {
	return image?.imageName == ""
		? "/static/default-profile-pic.png"
		: `https://localhost:7221/images/users/${image?.imageName}`;
}

export function getDateYYYYMMDD(date: Date) {
	return `${date.getFullYear()}-${(date.getMonth() + 1)
		.toString()
		.padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

export function formatDate(date: string) {
	const newDate = new Date(date);
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const monthIndex = newDate.getMonth();
	const year = newDate.getFullYear();
	const day = newDate.getDate();

	return `${months[monthIndex]} ${day}, ${year}`;
}
