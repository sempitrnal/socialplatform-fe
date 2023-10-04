import { useSP } from "@/context/context";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Logout = () => {
	const router = useRouter();
	const { setUser } = useSP();
	useEffect(() => {
		// Redirect to '/login' when the root URL is accessed
		if (typeof window !== "undefined") {
			router.push("/login");

			localStorage.removeItem("user");
		}
	}, []);

	return <div>Logging you out...</div>;
};

export default Logout;
