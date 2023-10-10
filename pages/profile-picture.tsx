import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useSP } from "@/context/context";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { get } from "http";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
const ProfilePicture = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [selectedFile, setSelectedFile] = useState<any>();

	const [previewUrl, setPreviewUrl] = useState<any>(
		"/static/default-profile-pic.png"
	);
	const [user, setUser] = useState<any>();
	const [imageHover, setImageHover] = useState<boolean>(false);
	const ref = useRef<HTMLInputElement>();

	const router = useRouter();
	const { currentUser } = useSP();
	const { toast } = useToast();
	const redirect = async () => {
		router.push("/");
		toast({
			title: "You are not logged in",
			description: "Please login to continue",
		});
	};
	const check = async () => {
		if ((await router.back()) != null)
			toast({
				title: "Invalid request",
				description: "Page is only for newly registered users",
			});
	};
	useEffect(() => {
		if (typeof window !== "undefined") {
			if (currentUser == undefined) {
				redirect();
			} else {
				if (currentUser.newlyRegistered) {
					setIsLoading(false);
				} else {
					check();
				}
			}
		}
	}, []);

	const getUser = async (id: string) => {
		try {
			await axios.get(`${process.env.API_BASE_URL}/user/${id}`).then((e) => {
				setUser(e.data);
			});
		} catch (error) {}
	};
	const updateUser = async () => {
		let formData = new FormData();
		formData.append("id", user.id);
		formData.append("username", user.username);
		formData.append("firstName", user.firstName);
		formData.append("lastName", user.lastName);
		formData.append("nickname", user.nickname);
		formData.append("passwordHash", user.passwordHash);
		formData.append("birthdate", user.birthdate);
		formData.append("pronouns", user.pronouns);
		formData.append("imageFile", selectedFile);
		formData.append("name", user.name);
		try {
			await axios({
				url: `${process.env.API_BASE_URL}/user/${user.id}`,
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
				method: "PUT",
			}).then((e) => {
				router.push("/home");
			});
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		getUser(currentUser?.userId);
	}, []);

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

	if (isLoading)
		return (
			<Layout>
				<ClipLoader />
			</Layout>
		);
	console.log(selectedFile);
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<input
				ref={ref as MutableRefObject<HTMLInputElement>}
				type="file"
				accept="image/*"
				onChange={handleFileInputChange}
				style={{ display: "none" }}
			/>

			<Card className="px-5">
				<CardHeader>
					<CardTitle className="text-2xl">Choose a profile picture</CardTitle>
					<CardDescription>This will be visible to others.</CardDescription>
				</CardHeader>
				<CardContent className="px-20 ">
					<div className="flex justify-center">
						{previewUrl && (
							<div
								onMouseEnter={() => {
									setImageHover(true);
								}}
								onMouseLeave={() => {
									setImageHover(false);
								}}
								className="relative w-[200px] h-[200px]"
							>
								<Image
									onClick={() => {
										if (ref.current) {
											ref.current.click();
										}
									}}
									className="shadow-md cursor-pointer overflow-hidden w-[200px] h-[200px] rounded-full object-cover "
									src={previewUrl}
									alt="Preview"
									width={200}
									height={200}
								/>
								<AnimatePresence>
									{imageHover && (
										<motion.div
											onClick={() => {
												if (ref.current) {
													ref.current.click();
												}
											}}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="absolute top-0 left-0 flex items-center justify-center w-full h-full rounded-full cursor-pointer bg-black/10"
										>
											<Camera className="text-2xl scale-[1.2] text-stone-600" />
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						)}
					</div>
					<div className="flex justify-center mt-5 text-lg font-medium">
						{user ? (
							`${user?.firstName} ${user?.lastName}`
						) : (
							<Skeleton className="w-full h-5" />
						)}
					</div>
				</CardContent>
				<CardFooter className="flex flex-col justify-center gap-5">
					<Button onClick={updateUser}> Continue</Button>
					<Separator />
					<p className="text-sm cursor-pointer hover:underline underline-offset-4">
						Skip
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default ProfilePicture;
