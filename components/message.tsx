type MessageProps = {
	isCurrentUser: boolean;
	e: any;
};

const Message = ({ isCurrentUser, e }: MessageProps) => {
	return (
		<div
			className={`${
				isCurrentUser ? "self-end bg-stone-800 text-white " : "bg-stone-200 "
			} rounded-full px-4 py-2 w-max`}
			key={e.id}
		>
			{e.content}
		</div>
	);
};

export default Message;
