import { Tooltip } from "@chakra-ui/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getFormattedDate, getTimeAgo } from "@/utils/utils";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Input } from "./ui/input";
import { useRouter } from "next/router";
import { UserDto, useSP } from "@/context/context";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "./ui/dialog";
import { get } from "http";
import UserDialog from "./user-dialog";
import { memo, useEffect, useRef, useState } from "react";
import {
	HttpTransportType,
	HubConnection,
	HubConnectionBuilder,
} from "@microsoft/signalr";

export interface PostProps {
	post: Post;
	user: any;
	thisKey: number;
	setPosts: any;
	getPosts: any;
}

export type Post = {
	id: number;
	description: string;
	imageName: string;
	postCreatedAt: string;
	likes: any;
	comments: any;
	user: any;
};
export type PostLike = {
	id: number;
	user: any;
	userId: number;
};

const Post = ({ post, user, thisKey, setPosts }: PostProps) => {
	const { userData, notificationConnection } = useSP();
	const [comment, setComment] = useState<string>("");
	const commentInputRef = useRef<any>(null);
	const postLikesRef = useRef();

	const likeAPost = async (
		userId: number,
		postId: number,
		postUserId: number
	) => {
		if (notificationConnection?.state === "Connected") {
			try {
				axios
					.post(
						`${process.env.API_BASE_URL}/post/likeapost?userId=${userId}&postId=${postId}`
					)
					.then(async (e) => {
						setPosts((prev) => {
							return prev.map((e: any) => {
								if (e.id === postId) {
									return {
										...e,
										likes: [
											...e.likes,
											{
												user: userData,
												userId: userId,
												id: e.likes.length + 1,
											},
										],
									};
								}
								return e;
							});
						});
						await notificationConnection
							?.invoke("NotifyLike", userId, postId, postUserId.toString())
							.catch((error) => {
								console.log(error);
							});
					});
			} catch (error) {}
		}
	};

	const unlikeAPost = async (userId: number, postId: number) => {
		console.log(`${userId} ,  ${postId}`);
		try {
			axios
				.post(
					`${process.env.API_BASE_URL}/post/unlikeapost?userId=${userId}&postId=${postId}`
				)
				.then((e) => {
					setPosts((prev) => {
						return prev.map((e: any) => {
							if (e.id === postId) {
								return {
									...e,
									likes: e.likes.filter((e: any) => e.userId !== userId),
								};
							}
							return e;
						});
					});
				});
		} catch (error) {}
	};
	const commentHandler = async (e) => {
		e.preventDefault();
		console.log("submit!");
		setComment("");

		commentInputRef.current.value = "";
		await axios
			.post(
				`${process.env.API_BASE_URL}/post/commentapost?userId=${userData.id}&postId=${post.id}&content=${comment}`
			)
			.then((e) => {
				console.log(e);
				setPosts((prev) => {
					return prev.map((e: any) => {
						if (e.id === post.id) {
							return {
								...e,
								comments: [
									...e.comments,
									{
										...e.comments,
										user: userData,
										content: comment,
										commentCreatedAt: new Date(),
									},
								],
							};
						}
						return e;
					});
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};
	const commentInputHandler = (e) => {
		const { value } = e.target;
		setComment(value);
	};

	const router = useRouter();

	return (
		<div key={thisKey} className="px-5 py-5 rounded-lg bg-stone-100 ">
			<div className="flex items-center gap-3">
				<Avatar
					onClick={() => {
						router.push(`/${user.username}`);
					}}
					className="w-12 h-12 transition-all duration-300 rounded-full shadow-sm cursor-pointer hover:scale-[1.02] hover:shadow-md"
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
					<p
						onClick={() => {
							router.push(`/${user.username}`);
						}}
						className="text-sm font-medium transition duration-300 cursor-pointer hover:text-stone-700/80 text-stone-700"
					>
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
				<p className="mb-5 text text-stone-900">{post.description}</p>
			</div>

			{post.imageName ? (
				<div className="mb-5">
					<img
						className="object-cover w-full h-[30rem] rounded-md"
						src={`https://localhost:7221/images/posts/${post.imageName}`}
					/>
				</div>
			) : null}
			<div className="relative flex items-center gap-2 mb-4">
				{post.likes.find((like: any) => like.userId === userData?.id) ? (
					<AiFillStar
						onClick={() => {
							unlikeAPost(userData?.id, post.id);
						}}
						className="text-2xl text-yellow-400 cursor-pointer"
					/>
				) : (
					<AiOutlineStar
						onClick={() => {
							likeAPost(userData?.id, post.id, post.user.id);
						}}
						className="text-2xl text-yellow-400 cursor-pointer"
					/>
				)}
				<AnimatePresence>
					{post.likes.length > 0 && (
						<Dialog>
							<DialogTrigger className="absolute my-5 text-xs left-8 text-stone-500">
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
									className=""
								>
									{post.likes.length > 0
										? post.likes.length === 1
											? `${post.likes.length} like`
											: `${post.likes.length} likes`
										: ""}
								</motion.p>
							</DialogTrigger>

							<DialogContent>
								{" "}
								<DialogHeader>Likes</DialogHeader>
								<div className="flex flex-col gap-2">
									{post.likes.map((e: PostLike) => {
										return (
											<UserDialog
												thisRef={postLikesRef}
												user={e.user}
												key={e.id}
												thisKey={e.id}
											/>
										);
									})}
								</div>
							</DialogContent>
						</Dialog>
					)}
				</AnimatePresence>
			</div>
			{post.comments.length > 0 && (
				<div className="">
					<div className="mb-5 text-sm font-medium text-stone-600">
						Comments ({post.comments.length})
					</div>
					<div className="flex flex-col gap-5 mb-5">
						{post.comments.map((e: any) => {
							const { user } = e;
							return (
								<div key={e.id} className="">
									<div className="flex gap-2">
										<Avatar
											onClick={() => {
												router.push(`/${user.username}`);
											}}
											className="w-10 h-10 rounded-full cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-300"
										>
											<AvatarImage
												className="object-cover w-full"
												src={
													e.user.imageName !== "" && e.user.imageName !== null
														? `https://localhost:7221/images/users/${e.user.imageName}`
														: "/static/default-profile-pic.png"
												}
											/>
										</Avatar>
										<div className="text-sm ">
											<div className="flex flex-col gap-1 px-3 py-2 bg-white rounded-xl w-max">
												<p
													onClick={() => {
														router.push(`/${user.username}`);
													}}
													className="text-xs font-semibold cursor-pointer hover:underline"
												>
													{user.firstName} {user.lastName}
												</p>
												<p className="font-normal">{e.content}</p>
											</div>
											<p className=" text-[.7rem] translate-x-2 text-stone-400">
												{getTimeAgo(e.commentCreatedAt)}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
			<form onSubmit={commentHandler}>
				<Input
					onChange={commentInputHandler}
					ref={commentInputRef}
					className="bg-white rounded-full placeholder:text-stone-400"
					placeholder="Write a comment..."
				/>
			</form>
		</div>
	);
};

export default memo(Post);
