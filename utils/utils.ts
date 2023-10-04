export const Pronouns: any = Object.freeze({
	1: "she/her",
	2: "he/him",
	3: "they/them",
	0: "other",
});

export function getPronouns(pronounIndex: number) {
	return Pronouns[pronounIndex];
}

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
