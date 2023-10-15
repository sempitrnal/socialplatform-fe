import { useRouter } from "next/router";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { getImageName, getTimeAgo } from "@/utils/utils";
import { useState } from "react";

interface NotificationProps {
	notification: any;
	key: any;
	thisKey: any;
}
const Notification = ({ notification, thisKey }: NotificationProps) => {
	const router = useRouter();
	const [isUsernameNotificationHovered, setIsUsernameNotificationHovered] =
		useState<boolean>(false);

	return (
		<div
			className={`px-5 pt-2 pb-2 transition cursor-pointer  border-b hover:bg-stone-100`}
			key={thisKey}
			onClick={() => {
				if (
					notification.notificationType !== 3 &&
					!isUsernameNotificationHovered
				) {
					router.push(
						`/${notification.user.username}/post/${notification.postId}`
					);
				} else {
					router.push(`/${notification.user.username}`);
				}
			}}
		>
			<div className="flex items-center justify-between">
				<div className="relative flex gap-2">
					<Avatar className="w-8 h-8">
						<AvatarImage
							className="object-cover"
							src={getImageName(notification.user)}
						/>
					</Avatar>
					<div className="flex flex-col">
						<p className="text-sm">
							<motion.span
								onMouseEnter={() => setIsUsernameNotificationHovered(true)}
								onMouseLeave={() => setIsUsernameNotificationHovered(false)}
								onClick={() => router.push(`/${notification.user.username}`)}
								className="font-semibold hover:underline"
							>
								{notification.user.username}
							</motion.span>{" "}
							{notification.content}
						</p>
						<p className="text-[.6rem] text-stone-400">
							{getTimeAgo(notification.createdAt)}
						</p>
					</div>
				</div>
				<AnimatePresence>
					{!notification.isRead && (
						<motion.div
							initial={{ y: 5, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ opacity: 0 }}
							className="w-3 h-3 -translate-y-2 bg-red-400 rounded-full"
						></motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Notification;
