"use client";

import HomeNav from "@/components/home-nav";
import Layout from "@/components/layout";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSP } from "@/context/context";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
const Home = () => {
	const { toast } = useToast();
	const { currentUser, setUser, getUser, userData } = useSP();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [notifications, setNotifications] = useState<any[]>([]);
	const router = useRouter();
	const redirect = async () => {
		router.push("/");
		toast({
			title: "You are not logged in",
			description: "Please login to continue",
		});
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			if (currentUser == undefined) {
				redirect();
			} else {
				setIsLoading(false);
			}
		}
	}, []);
	console.log(currentUser);
	return (
		<>
			<Head>
				<title>Gazebo</title>
			</Head>
			<HomeNav />
			<div className="flex justify-center gap-10 mt-[5.5rem]">
				<div className="w-1/4"></div>
				<div className="flex justify-center w-1/2 min-h-screen border-l border-r"></div>
				<div className="w-1/4"></div>
			</div>
		</>
	);
};

export default Home;
