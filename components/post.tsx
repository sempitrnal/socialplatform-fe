/* eslint-disable @next/next/no-img-element */
import { useSP } from "@/context/context";
import { getFormattedDate, getTimeAgo } from "@/utils/utils";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { memo, useEffect, useRef, useState } from "react";

//components
import {
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tooltip,
	useDisclosure,
} from "@chakra-ui/react";
import Comment from "./comment";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import UserDialog from "./user-dialog";

// icons
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import { MdStart } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
export interface PostProps {
	post: Post;
	user: any;
	thisKey?: number;
	setPosts?: any;
	getPosts?: any;
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
	const router = useRouter();
	const { comments } = post;
	const { userData, notificationConnection } = useSP();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [comment, setComment] = useState<string>("");
	const [isViewMoreComments, setIsViewMoreComments] = useState<boolean>(false);
	const [visibleComments, setVisibleComments] = useState(
		comments.length > 1 ? 2 : comments.length
	);

	const commentInputRef = useRef<any>(null);
	const postLikesRef = useRef();
	const commentsToShow = isViewMoreComments
		? post.comments
		: post.comments.slice(0, 2);

	const viewMoreComments = () => {
		setIsViewMoreComments(true);
	};

	const viewLessComments = () => {
		setIsViewMoreComments(false);
	};

	useEffect(() => {
		if (isViewMoreComments) {
			viewMoreComments();
		} else {
			viewLessComments();
		}
	}, [isViewMoreComments]);

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
			.then(async (e) => {
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
				await notificationConnection
					?.invoke(
						"NotifyComment",
						userData.id,
						post.id,
						post.user.id.toString(),
						comment
					)

					.catch((error) => {
						console.log(error);
					});

				setIsViewMoreComments(true);
				window.scrollTo({
					top: 500,
					behavior: "smooth",
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
	console.log(isViewMoreComments);
	const isInThePost = router.query.postId == post.id.toString();
	const isPostOfTheCurrentUser = userData?.id === post.user.id;
	return (
		<div key={thisKey} className="px-5 py-5 rounded-lg bg-stone-100 ">
			<div className="flex items-center justify-between">
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

				<div className="text-xl -translate-y-2">
					<Menu>
						<MenuButton>
							<PiDotsThreeOutlineLight />
						</MenuButton>
						<MenuList className="flex flex-col p-1 overflow-hidden text-sm bg-white rounded-md shadow-md">
							{!isInThePost && (
								<MenuItem
									onClick={() =>
										router.push(`/${post.user.username}/post/${post.id}`)
									}
									className="flex items-center gap-2 p-2 transition rounded-sm hover:bg-stone-100"
								>
									<MdStart />
									View post
								</MenuItem>
							)}
							{isPostOfTheCurrentUser && (
								<MenuItem className="p-2 text-red-400 transition rounded-sm hover:bg-stone-100 ">
									<Dialog>
										<DialogTrigger asChild>
											<div className="flex items-center gap-2 text-red-400 ">
												<FiTrash2 />
												Delete
											</div>
										</DialogTrigger>
										<DialogContent className="w-max">
											<DialogHeader>Delete post</DialogHeader>
											<div className="flex flex-col justify-center gap-2">
												<p className="mb-5 text-sm text-stone-500">
													Are you sure you want to delete this post?
												</p>
												<div className="flex items-center gap-2">
													<DialogClose className="p-3 py-1.5 shadow-sm rounded-md bg-stone-200 hover:bg-stone-200/80 transition">
														Cancel
													</DialogClose>

													<Button variant="destructive" className="w-max">
														Delete
													</Button>
												</div>
											</div>
										</DialogContent>
									</Dialog>
								</MenuItem>
							)}
						</MenuList>
					</Menu>
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
						{commentsToShow.map((e: any) => {
							const { user } = e;
							return <Comment e={e} user={user} key={e.id} thisKey={e.id} />;
						})}

						{comments.length > 2 && (
							<p
								onClick={() => {
									if (!isViewMoreComments) {
										viewMoreComments();
									} else {
										viewLessComments();
									}
									setIsViewMoreComments(!isViewMoreComments);
								}}
								className="text-sm cursor-pointer hover:underline text-stone-500 underline-offset-2"
							>
								{isViewMoreComments
									? " View less comments"
									: `View ${comments.length - visibleComments} more
								${comments.length - visibleComments === 1 ? "comment" : "comments"}`}
							</p>
						)}
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
