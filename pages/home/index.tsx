"use client";

import HomeNav from "@/components/home-nav";
import Layout from "@/components/layout";
import Post from "@/components/post";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSP } from "@/context/context";
import { getFormattedDate, getTimeAgo } from "@/utils/utils";
import { Tooltip } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { ClipLoader } from "react-spinners";
const Home = () => {
	const { toast } = useToast();
	const { currentUser, setUser, getUser, userData } = useSP();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [notifications, setNotifications] = useState<any[]>([]);
	const [posts, setPosts] = useState<any>();
	const [isPostsLoading, setIsPostsLoading] = useState<boolean>(true);
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
	const getPosts = async () => {
		if (currentUser) {
			try {
				await axios
					.get(
						`${process.env.API_BASE_URL}/post/getPostsByFollowing?userId=${currentUser.userId}`
					)
					.then((e) => {
						setPosts(e.data);
						setIsPostsLoading(false);
					});
			} catch (error) {}
		}
	};
	useEffect(() => {
		getPosts();
	}, [currentUser]);

	return (
		<>
			<Head>
				<title>Gazebo</title>
			</Head>
			<HomeNav />
			<div className="flex justify-center gap-10 mt-[5.5rem]">
				<div className="w-1/4"></div>
				<div className="flex flex-col justify-start w-1/2 min-h-screen gap-10 px-10 py-10 border-l border-r">
					{isPostsLoading
						? null
						: posts
						? posts.map((post) => {
								return <Post post={post} key={post.id} user={post.user} />;
						  })
						: ""}
				</div>
				<div className="w-1/4"></div>
			</div>
		</>
	);
};

export default Home;
