"use client";

import HomeNav from "@/components/home-nav";
import Post from "@/components/post";
import PostSkeleton from "@/components/post-skeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useSP } from "@/context/context";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
import Image from "next/image";
const Home = () => {
	const { toast } = useToast();
	const { currentUser, setUser, getUser, userData, notificationConnection } =
		useSP();
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
		// This useEffect depends on posts and will run whenever posts change.
		// You don't need separate useEffects for different events.
		if (posts) {
			notificationConnection?.on(
				"ReceiveLikeNotification",
				(name, message, userId, postId) => {
					getPosts();
				}
			);

			notificationConnection?.on(
				"ReceiveCommentNotification",
				(name, message, userId, postId) => {
					getPosts();
				}
			);
		}
	}, [posts]);
	useEffect(() => {
		getPosts();
	}, [currentUser]);

	if (!userData) {
		return <div></div>;
	}
	return (
		<>
			<Head>
				<title>Gazebo</title>
			</Head>
			<HomeNav />
			<div className="flex justify-center gap-10 mt-[5.5rem]">
				<div className="  left-0 hidden lg:flex  lg:flex-col h-full justify-between fixed w-[30%] p-10">
					<div
						onClick={() => {
							router.push(`/${userData.username}`);
						}}
						className="p-5 py-3 transition rounded-lg shadow-md cursor-pointer hover:bg-stone-100"
					>
						<div className="flex items-center gap-3 ">
							<Avatar className="w-12 h-12">
								<AvatarImage
									className="object-cover w-full"
									src={
										userData.imageName == ""
											? "/static/default-profile-pic.png"
											: `https://localhost:7221/images/users/${userData.imageName}`
									}
								/>
							</Avatar>
							<div className="">
								{userData.firstName} {userData.lastName}
							</div>
						</div>
					</div>
					<Image
						src="/static/chopper.gif"
						width={400}
						height={400}
						alt="chopper"
					/>
				</div>
				<div className="flex flex-col justify-start w-full relative lg:w-[40%] min-h-screen gap-10 px-10 py-10 border-l border-r">
					{isPostsLoading ? (
						<div className="flex flex-col gap-10">
							<PostSkeleton />
							<PostSkeleton />
							<PostSkeleton withPic />
						</div>
					) : posts.length > 0 ? (
						posts.map((post: any) => {
							return (
								<Post
									thisKey={post.id}
									setPosts={setPosts}
									post={post}
									key={post.id}
									user={post.user}
									getPosts={getPosts}
								/>
							);
						})
					) : (
						<div className="flex flex-col items-center gap-5 justify-center h-[60vh]">
							<p>wala pay posts mingaw kaau huhubells</p>
						</div>
					)}
				</div>
				<div className="fixed hidden lg:block right-0 w-[30%] p-10">
					<p className="text-sm font-medium text-stone-500">
						Suggested for you
					</p>
					<div className="flex flex-col gap-5 my-5">
						{Array.from(Array(5).keys()).map((e) => {
							return (
								<div
									key={e}
									className="flex items-center justify-between gap-2 p-2 border rounded-md"
								>
									<div className="flex items-center gap-2 ">
										<Skeleton className="w-10 h-10 rounded-full" />
										<div className="flex flex-col gap-2">
											<div className="flex gap-2">
												<Skeleton className="h-3 w-14" />
												<Skeleton className="w-20 h-3" />
											</div>
											<div className="flex gap-2">
												<Skeleton className="w-[10rem] h-2" />
											</div>
										</div>
									</div>
									<Button className="h-6 p-2 text-xs" variant="outline">
										Follow
									</Button>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
