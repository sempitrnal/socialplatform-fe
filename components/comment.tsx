import { useRouter } from "next/router";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getImageName, getTimeAgo } from "@/utils/utils";

interface CommentProps {
	e: any;
	thisKey: any;
	user: any;
}

const Comment = ({ e, user, thisKey }: CommentProps) => {
	console.log(user);
	const router = useRouter();
	return (
		<div key={thisKey} className="w-full break-normal">
			<div className="flex gap-2">
				<Avatar
					onClick={() => {
						router.push(`/${user.username}`);
					}}
					className="w-10 h-10 rounded-full cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-300"
				>
					<AvatarImage
						className="object-cover w-full"
						src={getImageName(e.user)}
					/>
				</Avatar>
				<div className="w-max max-w-[90%] text-sm">
					<div className="flex flex-col gap-1 px-3 py-2 overflow-hidden bg-white rounded-xl">
						<p
							onClick={() => {
								router.push(`/${user?.username}`);
							}}
							className="text-xs font-semibold cursor-pointer hover:underline"
						>
							{user?.firstName} {user?.lastName}
						</p>
						<p className="overflow-hidden font-normal break-words whitespace-pre-wrap">
							{e.content}{" "}
						</p>
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
