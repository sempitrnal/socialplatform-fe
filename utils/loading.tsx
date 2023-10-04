import React, { useEffect, useState } from "react";
import { useSP } from "@/context/context";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { ClipLoader } from "react-spinners";

const LoadingPage: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { currentUser } = useSP();
	const router = useRouter();

	useEffect(() => {
		const checkUser = async () => {
			if (typeof window !== "undefined") {
				if (currentUser) {
					if (!currentUser?.newlyRegistered) {
						router.push("/home");
					}
				} else {
					setIsLoading(false);
				}
			}
		};

		checkUser();
	}, [currentUser, router]);

	if (isLoading) {
		return (
			<Layout>
				<ClipLoader />
			</Layout>
		);
	}

	return null;
};

export default LoadingPage;
