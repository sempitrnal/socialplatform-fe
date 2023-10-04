import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSP } from "@/context/context";

const Home = () => {
	const router = useRouter();
	const { currentUser } = useSP();
	useEffect(() => {
		// Redirect to '/login' when the root URL is accessed
		if (typeof window !== "undefined") {
			if (currentUser == undefined) {
				router.push("/login");
			} else {
				router.push("/home");
			}
		}
	}, []);

	return null; // This page does not render anything
};

export default Home;
