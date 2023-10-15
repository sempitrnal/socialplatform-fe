import { useSP } from "@/context/context";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, MessageCircle, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, Ref, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Layout from "./layout";
import Logo from "./logo";
import BosInput from "./myinput";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Tooltip } from "@chakra-ui/react";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { useRef } from "react";
import { RiImageAddFill } from "react-icons/ri";
import Image from "next/image";
import { getImageName, getTimeAgo } from "@/utils/utils";
import Notification from "./notification";
export interface Post {
	userId: number;
	description: string;
	imageFile?: File;
}

const HomeNav = () => {
	const { toast } = useToast();
	const { setUser, userData, setUserData } = useSP();
	const router = useRouter();
	const PostDefaultValues = {
		userId: userData?.id,
		description: "",
		imageFile: undefined,
	};

	const [isLoading, setIsLoading] = useState<boolean>(true);

	// search states
	const [searchUsers, setSearchUsers] = useState<any>([]);
	const [search, setSearch] = useState<string>("");

	// notifs states
	const [notifications, setNotifications] = useState<any[]>([]);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>();
	const [isFocused, setIsFocused] = useState<boolean>(false);

	// post states
	const [post, setPost] = useState<Post>(PostDefaultValues);
	const [selectedFile, setSelectedFile] = useState<any>();
	const [previewUrl, setPreviewUrl] = useState<any>();

	//

	//refs for dom manipulation
	const createPostRef = useRef<any>();
	const imageUploadRef = useRef<any>();
	const searchRef = useRef<any>();
	const notificationDialogRef = useRef<any>();
	const dialogCloseRef = useRef<any>();
	const getNotifications = async () => {
		await axios
			.get(`${process.env.API_BASE_URL}/user/notifications/${userData?.id}`)
			.then((e) => {
				setNotifications(e.data);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const logout = () => {
		localStorage.removeItem("user");

		setUser(undefined);
		setUserData(undefined);

		toast({
			title: "Logged out",
			description: "You have been logged out!",
		});
		router.push("/");
		console.log(document.body.style);
		document.body.style.setProperty("pointerEvents", "");
		document.body.removeAttribute("style");
	};

	const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
		setIsFocused(true);
	};
	const searchHandler = (e: React.FormEvent<HTMLInputElement>) => {
		console.log("rendered");
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
	useEffect(() => {
		if (userData) {
			setIsLoading(false);
		}
	}, [userData]);

	const postDesciptionHandler = (e: any) => {
		const { name, value } = e.target as HTMLInputElement;

		setPost({ ...post, [name]: value });
	};

	function postHandler(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();

		const formData = new FormData();
		formData.append("userId", post.userId.toString());
		formData.append("description", post.description);
		if (selectedFile) {
			formData.append("imageFile", selectedFile);
		}

		try {
			axios
				.post(`${process.env.API_BASE_URL}/post/createpost`, formData)
				.then((e) => {
					createPostRef.current.click();
					window.location.reload();
				});
		} catch (error) {
			console.log(error);
		}
	}
	const handleFileInputChange = (e: any) => {
		const file = e.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (x) => {
				setSelectedFile(file);
				setPreviewUrl(reader.result);
			};

			reader.readAsDataURL(file);
		}
	};

	const openNotifications = async () => {
		setIsNotificationsOpen(!isNotificationsOpen);
		if (!isNotificationsOpen) {
			setTimeout(async () => {
				await axios
					.put(
						`${process.env.API_BASE_URL}/user/readnotifications/${userData?.id}`
					)
					.then((e) => {
						getNotifications();
					})
					.catch((error) => {
						console.log(error);
					});
			}, 500);
		}
	};

	useEffect(() => {
		if (userData) {
			getNotifications();
		}
	}, [userData]);
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				notificationDialogRef.current &&
				!notificationDialogRef.current.contains(event.target)
			) {
				setIsNotificationsOpen(false);
			}
		};
		if (isNotificationsOpen) {
			setTimeout(() => {
				document.addEventListener("click", handleClickOutside);
			}, 1);
		}
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isNotificationsOpen]);
	if (isLoading) {
		return (
			<Layout>
				<div className=""></div>
			</Layout>
		);
	}

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 flex justify-between px-20 py-5 bg-white shadow-sm">
			<Tooltip
				className="p-2 text-xs border rounded-md border-stone-100"
				placement="top"
				label="Create a post"
				aria-label="A tooltip"
			>
				<div className="fixed bottom-10 right-20">
					<Dialog>
						{router.pathname !== "/messages" && (
							<DialogTrigger asChild>
								<div className="flex items-center justify-center bg-black rounded-full w-14 h-14 text-white shadow-md hover:scale-[1.03] transition cursor-pointer">
									<Plus />
								</div>
							</DialogTrigger>
						)}
						<DialogContent className="">
							<DialogHeader className="font-medium">
								Create a new post
							</DialogHeader>
							<DialogClose className="hidden" ref={createPostRef}>
								hello
							</DialogClose>

							<form
								onSubmit={postHandler}
								action=""
								className="flex flex-col gap-5"
							>
								<Textarea
									required
									name="description"
									onChange={postDesciptionHandler}
									className="resize-none h-[7rem]"
									placeholder="What's on your alimpatakan?"
								/>
								<input
									type="file"
									accept="image/*"
									onChange={handleFileInputChange}
									ref={imageUploadRef}
									style={{ display: "none" }}
								/>
								<div>
									<RiImageAddFill
										onClick={() => {
											imageUploadRef.current.click();
										}}
										className="text-2xl transition duration-300 cursor-pointer hover:text-stone-700"
									/>
								</div>
								<AnimatePresence>
									{previewUrl && (
										<motion.div
											layout
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="relative w-max"
										>
											<Image
												src={previewUrl}
												width={100}
												height={100}
												alt="preview"
												className="rounded-md"
											/>
											<div className="absolute top-1 right-1">
												<Trash
													onClick={() => {
														setSelectedFile(undefined);
														setPreviewUrl(undefined);
													}}
													className="p-1 text-xl transition duration-300 rounded-md cursor-pointer text-stone-700 bg-stone-200 hover:bg-stone-300"
												/>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
								<Button className="self-end w-max" type="submit">
									Post
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</Tooltip>
			<div className="flex items-center gap-5">
				<Logo />
				<div className="w-[20rem] relative">
					<BosInput
						changeHandler={searchHandler}
						isValid={true}
						thisRef={searchRef}
						focusHandler={focusHandler}
						blurHandler={() => {
							setIsFocused(false);
						}}
						name="search"
						label="Search Gazebo"
					/>
					<AnimatePresence>
						{search.length > 0 && isFocused && (
							<motion.div
								initial={{ y: 5, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 5, opacity: 0 }}
								className="absolute left-0 w-full p-5 text-sm bg-white rounded-md shadow-md top-14 h-max"
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
														router.push(`/${e.username}`);
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
																<p className="text-xs text-stone-500">You</p>
															)}
														</div>
													</div>
												</div>
											);
										})
									) : (
										<div className=" text-stone-500">oops no users found!</div>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
			<div className="flex gap-3">
				<div className=" rounded-full h-12 w-12 flex justify-center items-center bg-[#dddddd] hover:bg-[#cfcfcf] transition duration-300">
					<Link href="/messages">
						<MessageCircle />
					</Link>
				</div>

				<div className="relative">
					<div
						onClick={openNotifications}
						className="rounded-full h-12 w-12 flex justify-center items-center bg-[#dddddd] hover:bg-[#cfcfcf] transition duration-300  cursor-pointer"
					>
						<Bell className="" />
						<AnimatePresence initial={false}>
							{notifications.filter((e) => e.isRead == false).length > 0 && (
								<motion.div
									initial={{ y: 5, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									exit={{ scale: 0, opacity: 0 }}
									className="absolute flex items-center justify-center w-5 h-5 p-2 text-xs text-white bg-red-400 rounded-full -top-1 -right-1"
								>
									{notifications.filter((e) => e.isRead == false).length}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
					<AnimatePresence>
						{isNotificationsOpen && (
							<motion.div
								ref={notificationDialogRef}
								initial={{ y: 5, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 5, opacity: 0 }}
								className="absolute left-[-270px] z-[999] w-[20rem] text-sm bg-white rounded-md shadow-md top-14 h-max overflow-hidden"
							>
								<div className="">
									<h2 className="w-full px-5 py-3 font-medium text-white bg-stone-700">
										Notifications
									</h2>
									<div className="flex flex-col pt-2 ">
										{notifications.map((e) => {
											return (
												<Notification
													notification={e}
													key={e.id}
													thisKey={e.id}
												/>
											);
										})}
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger
						ref={dialogCloseRef}
						asChild
						className="transition-opacity outline-none "
					>
						<div className="flex items-center">
							<Avatar className="border shadow-sm ">
								<AvatarImage
									className="object-cover"
									src={
										userData?.imageName == ""
											? "/static/default-profile-pic.png"
											: `https://localhost:7221/images/users/${userData?.imageName}`
									}
								/>
								<AvatarFallback className="uppercase transition duration-300">
									<img src="/static/default-profile-pic.png" alt="" />
								</AvatarFallback>
							</Avatar>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className=" translate-x-[-3.5rem] translate-y-[.5rem] w-[10rem]">
						<DropdownMenuLabel className="px-2">
							{userData?.firstName} {userData?.lastName}
						</DropdownMenuLabel>
						<Separator />
						<DropdownMenuItem
							onClick={() => {
								router.push(`/${userData?.username}`);
							}}
							className="cursor-pointer"
						>
							Profile
						</DropdownMenuItem>
						<Dialog>
							<DialogTrigger className="w-full p-2 text-sm text-left hover:bg-stone-100">
								Logout
							</DialogTrigger>

							<DialogContent className="w-[1rem]">
								<DialogHeader className="">
									<DialogTitle>Logout</DialogTitle>
									<DialogDescription>
										Are you sure you want to logout?
									</DialogDescription>
								</DialogHeader>
								<div className="flex justify-end gap-2 mt-5">
									<DialogClose
										ref={dialogCloseRef}
										className="px-3 text-sm font-medium transition-colors rounded-md bg-stone-200 hover:bg-stone-200/80"
									>
										Cancel
									</DialogClose>
									<Button onClick={logout}>Logout</Button>
								</div>
							</DialogContent>
						</Dialog>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</nav>
	);
};

export default HomeNav;
