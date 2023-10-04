/* eslint-disable @next/next/no-img-element */
import HomeNav from "@/components/home-nav";
import Layout from "@/components/layout";
import Logo from "@/components/logo";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSP } from "@/context/context";
import { getFormattedDate, getPronouns, getTimeAgo } from "@/utils/utils";
import { Tooltip } from "@chakra-ui/react";
import axios from "axios";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";

const User = () => {
	const [user, setUser] = useState<any>();
	const [posts, setPosts] = useState<any>();
	const [userNotFound, setUserNotFound] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isPostsLoading, setIsPostsLoading] = useState<boolean>(true);
	const { currentUser, userData } = useSP();
	const router = useRouter();
	const { username } = router.query;
	const getUser = async (username: string) => {
		try {
			const res = await fetch(
				`${process.env.API_BASE_URL}/user/getuserbyusername?username=${username}`
			);
			const data = await res.json();
			setUser(data);
			setIsLoading(false);
			setUserNotFound(false);
		} catch (error) {
			setUserNotFound(true);
		}
	};
	const getPosts = async (id: string) => {
		try {
			await axios.get(`${process.env.API_BASE_URL}/posts/${id}`).then((e) => {
				setPosts(e.data);
				setTimeout(() => {
					setIsPostsLoading(false);
				}, 2000);
			});
		} catch (error) {
			console.log(error);
		}
	};
	const followHandler = async (username, userToFollow) => {
		try {
			await axios
				.post(
					`${process.env.API_BASE_URL}/user/followAUser?username=${username}&userToFollow=${userToFollow}`
				)
				.then((e) => {
					console.log(e.data);
				});
		} catch (error) {
			console.log(error);
		}
	};
	const unfollowHandler = async (username, userToUnfollow) => {
		try {
			await axios
				.post(
					`${process.env.API_BASE_URL}/user/unfollowAUser?username=${username}&userToUnfollow=${userToUnfollow}`
				)
				.then((e) => {
					console.log(e.data);
				});
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		if (username !== undefined) {
			getUser(username as string);
		}
	}, [username]);
	useEffect(() => {
		if (user) {
			getPosts(user.id);
		}
	}, [user]);

	if (isLoading)
		return (
			<Layout>
				<ClipLoader />
			</Layout>
		);
	console.log(user);
	console.log(userData);

	if (userNotFound) {
		return (
			<div className="">
				<Head>
					<title>404 Not found</title>
				</Head>
				<HomeNav />
				<div className="mt-[5.5rem] flex justify-center items-center min-h-[75vh]">
					<div className="flex flex-col items-center gap-2">
						<p className="text-3xl font-bold text-center uppercase">oops!</p>
						<p className="text-xl text-stone-500">
							We&apos;re sorry, but the page you&apos;re looking for cannot be
							found.
						</p>
						<p className="mb-5 text-sm text-stone-400">
							You can go back to the home page by clicking the button below.
						</p>

						<div className="flex flex-col items-center justify-center gap-4">
							<Logo />
							<Separator className="w-[10rem]" />
							<div
								className="cursor-pointer hover:underline text-stone-500 underline-offset-4"
								onClick={() => {
									router.back();
								}}
							>{` Back`}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className="mx-[22rem] min-h-screen">
			<Head>
				<title>
					{user.firstName} {user.lastName}
				</title>
			</Head>
			<HomeNav />
			<div className="mt-[5.5rem] flex  pt-20 pb-5">
				{" "}
				<div className="flex items-center justify-between w-full">
					<div className="flex gap-3">
						<img
							src={`https://localhost:7221/images/users/${user.imageName}`}
							alt=""
							className="rounded-full w-[6rem] h-[6rem] object-cover"
						/>
						<div className="flex flex-col mt-5 ">
							<div className="text-xs text-stone-400">@{user.username}</div>
							<div className="text-lg font-medium">
								{user.firstName} {user.lastName}
							</div>
							<div className="text-sm text-stone-500">
								{getPronouns(user.pronouns)}
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center">
						<div className="text-sm text-stone-500">
							<Dialog>
								<DialogTrigger>Followers</DialogTrigger>
								<DialogContent>
									<h2 className="font-medium">Followers</h2>
									<Separator />
									<div className="flex flex-col">
										{user.followers.map((e) => {
											return (
												<div
													className="p-2 transition rounded-md cursor-pointer hover:bg-stone-100"
													key={e.id}
												>
													<div className="flex items-center gap-3 ">
														<Avatar className="w-8 h-8">
															<AvatarImage
																className="object-cover w-full"
																src={
																	e.imageName == ""
																		? "/static/default-profile-pic.png"
																		: `https://localhost:7221/images/users/${e.imageName}`
																}
															/>
														</Avatar>
														<div className="">
															{e.firstName} {e.lastName}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</DialogContent>
							</Dialog>
						</div>

						<div className="font-medium text-stone-700">
							{user.followers.length}
						</div>
					</div>
					<div className="flex flex-col items-center">
						<div className="text-sm text-stone-500">
							<Dialog>
								<DialogTrigger>Following</DialogTrigger>
								<DialogContent>
									<h2 className="font-medium">Following</h2>
									<Separator />
									<div className="flex flex-col">
										{user.following.map((e) => {
											return (
												<div
													className="p-2 transition rounded-md cursor-pointer hover:bg-stone-100"
													key={e.id}
												>
													<div className="flex items-center gap-3 ">
														<Avatar className="object-cover w-8 h-8">
															<AvatarImage
																className="object-cover w-full"
																src={
																	e.imageName == ""
																		? "/static/default-profile-pic.png"
																		: `https://localhost:7221/images/users/${e.imageName}`
																}
															/>
														</Avatar>
														<div className="">
															{e.firstName} {e.lastName}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</DialogContent>
							</Dialog>
						</div>
						<div className="font-medium text-stone-700">
							{user.following.length}
						</div>
					</div>
					{currentUser ? (
						currentUser.userId == user.id ? (
							<Button>Edit profile</Button>
						) : user?.followers.some((e) => e.id == userData.id) ? (
							<Button
								variant="secondary"
								onClick={() => {
									unfollowHandler(currentUser.username, user.username);
									setUser((prev) => {
										return {
											...prev,
											followers: [
												...prev.followers.filter((e) => e.id != userData.id),
											],
										};
									});
								}}
							>
								Following
							</Button>
						) : (
							<Button
								onClick={() => {
									followHandler(currentUser.username, user.username);
									setUser((prev) => {
										return {
											...prev,
											followers: [...prev.followers, userData],
										};
									});
								}}
							>
								Follow
							</Button>
						)
					) : null}
				</div>
			</div>
			<Separator />
			<div className="my-10 ">
				<p className="mb-10 text-sm font-bold text-stone-700">POSTS</p>
				{isPostsLoading ? (
					<div className="p-16 py-10 border rounded-lg ">
						<div className="flex items-center gap-2">
							<Skeleton className="w-8 h-8 rounded-full" />
							<div className="flex flex-col gap-2">
								<Skeleton className="w-[10rem] h-3" />
								<Skeleton className="w-[3rem] h-2" />
							</div>
						</div>
						<Skeleton className="w-[20rem] h-3 mt-5" />
						<Skeleton className="w-full h-[30rem] rounded-md mt-5" />
					</div>
				) : posts?.length > 0 ? (
					<div className="flex flex-col gap-5">
						{posts.map((post: any) => {
							return (
								<div key={post.id} className="p-16 py-10 border rounded-lg ">
									<div className="flex items-center gap-2">
										<Avatar
											onClick={() => {}}
											className="w-8 h-8 transition-all duration-300 rounded-full shadow-sm cursor-pointer hover:scale-[1.02] hover:shadow-md"
										>
											<AvatarImage
												className="object-cover w-full"
												src={
													user.imageName == ""
														? "/static/default-profile-pic.png"
														: `https://localhost:7221/images/users/${user.imageName}`
												}
											/>
										</Avatar>
										<div className="">
											<p className="text-sm font-medium transition duration-300 cursor-pointer hover:text-stone-700/80 text-stone-700">
												{user.firstName} {user.lastName}
											</p>
											<Tooltip
												placement="top"
												label={getFormattedDate(post.postCreatedAt)}
												className="p-2 text-xs bg-white rounded-md shadow-md text-stone-500 "
											>
												<p className="text-xs font-medium transition duration-300 cursor-pointer w-max text-stone-400 ">
													{getTimeAgo(post.postCreatedAt)}
												</p>
											</Tooltip>
										</div>
									</div>
									<div className="mt-5">
										<p className="text text-stone-500">{post.description}</p>
									</div>
									{post.imageName ? (
										<div className="my-5">
											<img
												className="object-cover w-full h-[30rem] rounded-md"
												src={`https://localhost:7221/images/posts/${post.imageName}`}
											/>
										</div>
									) : null}
									<p className="my-5 text-xs text-stone-500">23,420 likes</p>
									<div className="flex mb-3 translate-x-[-5px]">
										<AiFillStar className="text-3xl text-yellow-400" />
									</div>
									<Input
										className="rounded-full placeholder:text-stone-400"
										placeholder="Write a comment..."
									/>
								</div>
							);
						})}
					</div>
				) : (
					<div className=""></div>
				)}
			</div>
		</div>
	);
};

export default User;
