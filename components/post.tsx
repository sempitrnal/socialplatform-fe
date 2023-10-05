import { Tooltip } from "@chakra-ui/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getFormattedDate, getTimeAgo } from "@/utils/utils";
import { AiFillStar } from "react-icons/ai";
import { Input } from "./ui/input";

const Post = ({ post, user, key }: any) => {
	return (
		<div key={key} className="p-16 py-10 border rounded-lg ">
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
};

export default Post;
