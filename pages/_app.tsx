import { SPProvider, useSP } from "@/context/context";
import "@/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/toaster";
import HomeNav from "@/components/home-nav";
export default function App({ Component, pageProps, router }: AppProps) {
	return (
		<div className="overflow-x-hidden  transition-colors duration-300 dark:bg-[#292929] scroll-smooth app">
			<Toaster />
			<SPProvider>
				<AnimatePresence initial={false} mode="wait">
					<Component key={router.pathname} {...pageProps} />
				</AnimatePresence>
			</SPProvider>
		</div>
	);
}
