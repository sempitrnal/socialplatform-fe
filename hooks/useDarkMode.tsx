import { useEffect, useState } from "react";

function useDarkMode() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		// Load dark mode preference from localStorage if available
		const savedDarkMode = localStorage.getItem("darkMode");
		if (savedDarkMode) {
			setIsDarkMode(savedDarkMode === "true");
		} else {
			// If no preference is saved, use the user's system preference
			setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
		}
	}, []);

	useEffect(() => {
		// Update the localStorage value whenever the dark mode state changes
		localStorage.setItem("darkMode", isDarkMode.toString());
		// Apply the dark mode class to the HTML element
		document.documentElement.classList.toggle("dark", isDarkMode);
	}, [isDarkMode]);

	return { isDarkMode, toggleDarkMode: () => setIsDarkMode((prev) => !prev) };
}

export default useDarkMode;
