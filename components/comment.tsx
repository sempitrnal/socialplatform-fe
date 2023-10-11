import { useRouter } from "next/router";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getTimeAgo } from "@/utils/utils";

interface CommentProps {
	e: any;
	thisKey: any;
	user: any;
}

const Comment = ({ e, user, thisKey }: CommentProps) => {
	const router = useRouter();
	return (
		<div key={thisKey} className="">
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
				<div className="text-sm w-max">
					<div className="flex flex-col gap-1 px-3 py-2 bg-white rounded-xl">
						<p
							onClick={() => {
								router.push(`/${user.username}`);
							}}
							className="text-xs font-semibold cursor-pointer hover:underline"
						>
							{user.firstName} {user.lastName}
						</p>
						<p className="w-full font-normal">{e.content}</p>
					</div>
					<p className=" text-[.7rem] translate-x-2 text-stone-400">
						{getTimeAgo(e.commentCreatedAt)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Comment;
