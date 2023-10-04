import { useSP } from "@/context/context";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, MessageCircle, PictureInPicture, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
import { Separator } from "./ui/separator";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import { RiImageAddLine } from "react-icons/ri";
import { Tooltip } from "@chakra-ui/react";
const HomeNav = () => {
	const { toast } = useToast();
	const { setUser, userData, setUserData } = useSP();
	const [searchUsers, setSearchUsers] = useState<any>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [notifications, setNotifications] = useState<any[]>([]);
	const router = useRouter();
	const redirect = async () => {
		router.push("/");
		toast({
			title: "You are not logged in",
			description: "Please login to continue",
		});
	};

	const logout = () => {
		localStorage.removeItem("user");
		const result = router.push("/login");
		setUser(undefined);
		setUserData(undefined);
		if (result != null) {
			toast({
				title: "Logged out",
				description: "You have been logged out!",
			});
		}
	};
	const [search, setSearch] = useState<string>("");
	const [isFocused, setIsFocused] = useState<boolean>(false);
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
	console.log(searchUsers);
	useEffect(() => {
		if (userData) {
			setIsLoading(false);
		}
	}, [userData]);
	if (isLoading) {
		return (
			<Layout>
				<ClipLoader />
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
						<DialogTrigger>
							<div className="flex items-center justify-center bg-[#eaaa5d] rounded-full w-14 h-14 text-white shadow-md hover:scale-[1.03] transition cursor-pointer">
								<Plus />
							</div>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader className="font-medium">
								Create a new post
							</DialogHeader>
							<form action="" className="flex flex-col gap-2">
								<Textarea
									className="resize-none h-[7rem]"
									placeholder="What's on your alimpatakan?"
								/>
								<Tooltip label="Add a photo " className="z-[9999] bg-red-500">
									<RiImageAddLine className="text-2xl" />
								</Tooltip>
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
				<DropdownMenu>
					<DropdownMenuTrigger className="outline-none ">
						<div className="rounded-full h-12 w-12 flex justify-center items-center bg-[#dddddd] hover:bg-[#cfcfcf] transition duration-300">
							<Bell />
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[20rem] translate-x-[-8rem] translate-y-1 min-h-[40rem] ">
						<DropdownMenuLabel>Notifications</DropdownMenuLabel>
						<Separator />
					</DropdownMenuContent>
				</DropdownMenu>
				<DropdownMenu>
					<DropdownMenuTrigger className="transition-opacity outline-none ">
						<div className="flex items-center">
							<Avatar className="shadow-sm ">
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
									<DialogClose className="px-3 text-sm font-medium transition-colors rounded-md bg-stone-200 hover:bg-stone-200/80">
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
