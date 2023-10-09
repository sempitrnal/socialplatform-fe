import { useRouter } from "next/router";
import { Avatar, AvatarImage } from "./ui/avatar";

export interface UserDialogProps {
	thisRef?: any;
	user: any;
	thisKey: any;
}
const UserDialog = ({ thisRef, user, thisKey }: UserDialogProps) => {
	const router = useRouter();
	return (
		<div
			onClick={() => {
				router.push(`/${user.username}`);
				if (thisRef.current) thisRef.current.click();
			}}
			className="p-2 transition rounded-md cursor-pointer hover:bg-stone-100"
			key={thisKey}
		>
			<div className="flex items-center gap-3 ">
				<Avatar className="w-8 h-8">
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
					{user.firstName} {user.lastName}
				</div>
			</div>
		</div>
	);
};

export default UserDialog;
