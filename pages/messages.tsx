import HomeNav from "@/components/home-nav";
import Message from "@/components/message";
import BosInput from "@/components/myinput";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useSP } from "@/context/context";
import { getImageName } from "@/utils/utils";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

type MessageProps = {
	chatId: number;
	senderId: number;
	receiverId: number;
	content: string;
};
const Messages = () => {
	const { userData, chatConnection } = useSP();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// chat states
	const [chats, setChats] = useState<any[]>([]);
	const [selectedChat, setSelectedChat] = useState<any>(null);
	const [message, setMessage] = useState<string>("");
	const memoizedSelectedChat = useMemo(() => selectedChat, [selectedChat]);
	// search states
	const [search, setSearch] = useState<string>("");
	const [searchUsers, setSearchUsers] = useState<any[]>([]);
	const [isFocused, setIsFocused] = useState<boolean>(false);

	const searchRef = useRef<any>(null);

	// search functions

	const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
		setIsFocused(true);
	};
	const searchHandler = (e: React.FormEvent<HTMLInputElement>) => {
		const { value, name } = e.target as HTMLInputElement;
		setSearch(value);
		if (value.length > 0) {
			try {
				axios
					.get(`${process.env.API_BASE_URL}/user/searchusers?query=${value}`)
					.then((e) => {
						setSearchUsers(e.data);
					});
			} catch (error) {}
		} else {
			setSearchUsers([]);
		}
	};

	//chat functions
	const getChats = async () => {
		await axios
			.get(
				`${process.env.API_BASE_URL}/chat/getChatsByUser?userId=${userData?.id}`
			)
			.then((e) => {
				setChats(e.data);
			})
			.catch((error) => console.log(error));
	};
	const messageHandler = (e) => {
		setMessage(e.target.value);
	};
	const sendMessage = async ({
		chatId,
		senderId,
		receiverId,
		content,
	}: MessageProps) => {
		await axios
			.post(`${process.env.API_BASE_URL}/chat/sendMessage`, {
				chatId,
				senderId,
				receiverId,
				content,
			})
			.then(async (e) => {
				await chatConnection
					?.invoke(
						"SendMessage",
						userData?.id,
						selectedChat.otherUser.id,
						message
					)
					.then((e) => {
						console.log(e);
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((error) => console.log(error));
	};
	const sendMessageHandler = async (e: any) => {
		e.preventDefault();
		await sendMessage({
			chatId: selectedChat.chat.id,
			senderId: userData.id,
			receiverId: selectedChat.otherUser.id,
			content: message,
		});
		setMessage("");
		getChats();
	};
	useEffect(() => {
		if (userData) {
			getChats();
		}
	}, [userData]);
	useEffect(() => {
		if (chats) {
			setSelectedChat(chats[0]);
			setIsLoading(false);
		} else setSelectedChat(null);
	}, [chats]);
	useEffect(() => {
		chatConnection?.on("ReceiveMessage", (name, message) => {
			toast({
				title: name,
				description: message,
			});
			getChats();
		});
	}, [chats]);
	const chatMessages = memoizedSelectedChat?.messages.map((e: any) => {
		const isCurrentUser = e.senderId == userData?.id;
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
	});

	if (chats) {
		return (
			<div className="overflow-hidden mt-[5.5rem]">
				<Head>
					<title>Messages (0)</title>
				</Head>
				<HomeNav />
				{isLoading ? (
					<div className="">Loading</div>
				) : (
					<div className="flex  min-h-[49.9rem]">
						<div className="border-r w-[30rem]  p-5 fixed bottom-0 top-[5.5rem]">
							<div className="top-[7rem] flex flex-col ">
								<h1 className="mb-5 text-3xl font-semibold">Chats</h1>
								{/* search bar */}
								<div className="relative mb-5  lg:w-[20rem]">
									<BosInput
										changeHandler={searchHandler}
										isValid={true}
										thisRef={searchRef}
										focusHandler={focusHandler}
										blurHandler={() => {
											setIsFocused(false);
										}}
										name="search"
										label="serts"
									/>
									<AnimatePresence>
										{search.length > 0 && isFocused && (
											<motion.div
												initial={{ y: 5, opacity: 0 }}
												animate={{ y: 0, opacity: 1 }}
												exit={{ y: 5, opacity: 0 }}
												className="absolute left-0 z-50 w-full p-5 text-sm bg-white rounded-md shadow-md top-14 h-max"
											>
												{search.length > 0 && (
													<div className="mb-5">
														Search results for{" "}
														<span className="font-bold">{search}</span>
													</div>
												)}
												<div className="flex flex-col ">
													{searchUsers.length > 0 ? (
														searchUsers.map((e: any) => {
															return (
																<div
																	onClick={() => {
																		setSearch("");
																		searchRef.current.value = "";
																	}}
																	className="px-1 py-2 transition duration-150 rounded-md cursor-pointer hover:bg-stone-100"
																	key={e.id}
																>
																	<div className="flex items-center gap-2 ">
																		<Avatar className=" w-7 h-7">
																			<AvatarImage
																				className="object-cover"
																				src={
																					e.imageName == ""
																						? "/static/default-profile-pic.png"
																						: `https://localhost:7221/images/users/${e.imageName}`
																				}
																			/>
																		</Avatar>
																		<div className="flex flex-col">
																			<div className="">
																				{e.firstName} {e.lastName}
																			</div>
																			{e.username == userData?.username && (
																				<p className="text-xs text-stone-500">
																					You
																				</p>
																			)}
																		</div>
																	</div>
																</div>
															);
														})
													) : (
														<div className=" text-stone-500">
															oops no users found!
														</div>
													)}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
								<div className="flex flex-col ">
									{chats?.map((e) => {
										const { chat, otherUser, messages } = e;
										const isSelected = selectedChat?.chat.id == chat.id;

										return (
											<div
												onClick={() => setSelectedChat(e)}
												className={`px-2 py-5 transition rounded-md cursor-pointer  ${
													isSelected
														? "bg-stone-800 hover:bg-stone-800/90 text-white"
														: "bg-white hover:bg-stone-100"
												}`}
												key={chat.id}
											>
												<div className="flex gap-5 ">
													<Avatar className="w-10 h-10">
														<AvatarImage
															className="object-cover w-full"
															src={getImageName(otherUser)}
														></AvatarImage>
													</Avatar>
													<div className="flex flex-col">
														<p className="text-sm font-medium">
															{otherUser.name}
														</p>
														<p className="text-sm text-stone-200">
															{messages[0].content}
														</p>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
						<div className="fixed h-screen overflow-y-scroll left-[30rem] right-10">
							<div className="relative flex flex-col justify-between h-full">
								<div className="fixed w-full p-3 border-b">
									<p className="flex items-center gap-3">
										<Avatar className="w-10 h-10">
											<AvatarImage
												className="object-cover w-full"
												src={getImageName(selectedChat?.otherUser)}
											></AvatarImage>
										</Avatar>
										{selectedChat?.otherUser.name}
									</p>
								</div>
								<div className="fixed overflow-scroll left-[30rem] right-0 top-[10rem] bottom-[5rem]  flex flex-col  gap-2 p-5">
									{memoizedSelectedChat?.messages.map((e: any) => {
										const isCurrentUser = e.senderId == userData?.id;
										return (
											<Message e={e} isCurrentUser={isCurrentUser} key={e.id} />
										);
									})}
								</div>
								<div className="fixed bottom-0 left-[30rem] right-0 p-3  ">
									<form action="" onSubmit={sendMessageHandler}>
										<Input
											onChange={messageHandler}
											value={message}
											placeholder="Type a message"
											className="h-[3rem]"
										/>
									</form>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
};

export default Messages;
