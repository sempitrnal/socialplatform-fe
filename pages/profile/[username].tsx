"use client";

import HomeNav from "@/components/home-nav";
import BosInput from "@/components/myinput";
import Select from "@/components/myselect";
import { InputRefProps, RegisterInputErrors } from "@/components/register";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useSP } from "@/context/context";
import {
	formatDate,
	getDateYYYYMMDD,
	getImageName,
	getPronouns,
	pronounOptions,
} from "@/utils/utils";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Settings = () => {
	const router = useRouter();
	const { userData, getUser, setUserData } = useSP();
	const [selectedFile, setSelectedFile] = useState<any>();
	const [submitClicked, setSubmitClicked] = useState<boolean>(false);
	const [previewUrl, setPreviewUrl] = useState<any>();
	const [imageHover, setImageHover] = useState<boolean>(false);
	const [request, setRequest] = useState<any>();
	const [isEdit, setIsEdit] = useState(false);

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
	const ref = useRef();

	// useEffect for getting user data
	useEffect(() => {
		if (typeof window !== "undefined") {
			if (userData) {
				setRequest({
					firstName: userData?.firstName,
					lastName: userData?.lastName,
					username: userData?.username,
					nickname:
						userData?.nickname !== "undefined" ? userData?.nickname : "",
					birthdate: getDateYYYYMMDD(new Date(userData?.birthdate)),
					pronouns: userData?.pronouns.toString(),
					password: userData?.password,
					confirmPassword: userData?.confirmPassword,
				});
				setPreviewUrl(getImageName(userData));
			}
		}
	}, [userData]);

	const requestValidation = {
		firstName: [
			"First name is required",
			"First name must be at least 2 characters long and no more than 16 characters long.",
		],
		lastName: [
			"Last name is required",
			"Last name must be at least 2 characters long and no more than 16 characters long.",
		],
		username: [
			"Username is required",
			"Username must be at least 6 characters long and no more than 15 characters long.",
		],
		birthdate: ["Birthdate is required"],
		pronouns: ["Pronouns are required"],
		password: [
			"Password is required",
			"Password must be at least 8 characters, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
		],
	};
	const inputRefs: InputRefProps = {
		firstName: useRef<HTMLInputElement>(null),
		lastName: useRef<HTMLInputElement>(null),
		username: useRef<HTMLInputElement>(null),
		nickname: useRef<HTMLInputElement>(null),
		birthdate: useRef<HTMLInputElement>(null),
		pronouns: useRef<HTMLInputElement>(null),
		password: useRef<HTMLInputElement>(null),
		confirmPassword: useRef<HTMLInputElement>(null),
	};
	const [errors, setErrors] = useState<RegisterInputErrors>({
		firstName: {
			value: true,
			errors: [],
		},
		lastName: {
			value: true,
			errors: [],
		},
		username: {
			value: true,
			errors: [],
		},

		birthdate: {
			value: true,
			errors: [],
		},
		pronouns: {
			value: true,
			errors: [],
		},

		password: {
			value: true,
			errors: [],
		},
		confirmPassword: {
			value: true,
			errors: [],
		},
		// Initialize errors for each input field
	});

	const inputHandler = (e: React.FormEvent<HTMLInputElement>) => {
		const { name, value } = e.target as HTMLInputElement;
		setRequest({ ...request, [name]: value });

		const validateInput = (isValid: boolean, errors: string[]) => {
			setErrors((prev: RegisterInputErrors) => ({
				...prev,
				[name]: {
					value: isValid,
					errors: isValid ? [] : errors,
				},
			}));
		};

		if (name === "firstName" || name === "lastName") {
			const isValid = value.length >= 2 && value.length <= 16;
			validateInput(isValid, isValid ? [] : [requestValidation[name][1]]);
		}

		if (name === "username") {
			const isValid = value.length >= 6 && value.length <= 15;
			validateInput(isValid, isValid ? [] : [requestValidation[name][1]]);
		}

		if (name === "birthdate") {
			const yearNow = new Date();
			const year = new Date(value);
			const isValid = yearNow >= year;
			validateInput(isValid, isValid ? [] : ["Birthdate must be in the past"]);
		}
	};

	const selectHandler = (e: React.FormEvent<HTMLSelectElement>) => {
		const { name, value } = e.target as HTMLSelectElement;

		setRequest({ ...request, [name]: value });
	};
	const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
		const { name, value } = e.target as HTMLInputElement;
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

		if (submitClicked) {
			if (name === "firstName") {
				const isValid = value.length >= 2 && value.length <= 16;

				setErrors((prev: RegisterInputErrors) => ({
					...prev,
					[name]: {
						value: isValid,
						errors: isValid ? [] : [requestValidation[name][1]],
					},
				}));
			}
		}
	};
	const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
		const { name, value } = e.target as HTMLInputElement;

		if (value.length === 0) {
			if (Object.keys(errors).includes(name)) {
				setErrors((prev: RegisterInputErrors) => ({
					...prev,
					[name]: { ...[name], value: false },
				}));
			}
		}
	};
	const update = async () => {
		console.log(selectedFile);
		const formData = new FormData();
		formData.append("id", userData.id);
		formData.append("firstName", request.firstName);
		formData.append("lastName", request.lastName);
		formData.append("username", request.username);
		formData.append("nickname", request.nickname);
		formData.append("birthdate", request.birthdate);
		formData.append("pronouns", request.pronouns);
		if (selectedFile) {
			formData.append("imageFile", selectedFile);
		} else {
			formData.append("imageName", userData.imageName);
		}
		formData.append("passwordHash", userData.passwordHash);
		formData.append("following", userData.following);
		formData.append("followers", userData.followers);
		formData.append("name", `${request.firstName} ${request.lastName}`);

		try {
			await axios({
				url: `${process.env.API_BASE_URL}/user/${userData.id}`,
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
				method: "PUT",
			}).then((e) => {
				setUserData(e.data);
				setIsEdit(false);
				const res = getUser();
				if (res) {
					toast({
						title: "Profile updated",
						description: "Your profile has been updated",
					});
				}
			});
		} catch (error) {
			console.log(error);
		}
	};
	function submitHandler(event: any) {
		event.preventDefault();
		console.log("yew");
		setErrors((prev: RegisterInputErrors) => {
			Object.entries(request).map(([key, value]) => {
				if (value === "") {
					prev[key] = false;
				}
			});
			return prev;
		});
		const hasErrors = Object.values(request).some((error, i) => {
			if (i !== 3 && error === "") {
				return true;
			} else return false;
		});
		if (hasErrors) {
			for (const inputName in errors) {
				if (errors[inputName].value !== true) {
					inputRefs[inputName].current!.focus();
					break;
				}
			}
		} else {
			update();
		}
	}
	if (request) {
		return (
			<div>
				<HomeNav />
				<div className="flex flex-col mt-[5.5rem] items-center ">
					<div className="p-10 py-20">
						<div
							className="cursor-pointer hover:underline text-stone-500 underline-offset-4"
							onClick={() => {
								router.back();
							}}
						>{` Back`}</div>
						<h1 className="mb-[4rem] flex justify-center text-xl font-semibold">
							Edit profile
						</h1>
						{isEdit ? (
							<motion.form
								noValidate
								onSubmit={submitHandler}
								className="flex gap-20 w-[50rem]"
							>
								<div
									onMouseEnter={() => {
										setImageHover(true);
									}}
									onMouseLeave={() => {
										setImageHover(false);
									}}
									className="flex flex-col items-center gap-2"
								>
									<div className="relative w-40 h-40">
										<Avatar
											onClick={() => {
												ref.current.click();
											}}
											className="w-40 h-40 border"
										>
											<AvatarImage
												className="object-cover w-full"
												src={previewUrl}
											/>
										</Avatar>
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
													className="absolute top-0 left-0 flex items-center justify-center w-full h-full rounded-full cursor-pointer bg-black/50"
												>
													<Camera className="text-2xl scale-[1.2] text-stone-200" />
												</motion.div>
											)}
										</AnimatePresence>
									</div>
									<input
										ref={ref as MutableRefObject<HTMLInputElement>}
										type="file"
										accept="image/*"
										onChange={handleFileInputChange}
										style={{ display: "none" }}
									/>
								</div>
								<div className="">
									<div className="flex flex-col gap-5">
										<div className="flex gap-2">
											<BosInput
												changeHandler={inputHandler}
												label="First name"
												name="firstName"
												errors={errors.firstName.errors}
												focusHandler={focusHandler}
												blurHandler={blurHandler}
												thisRef={inputRefs.firstName}
												isValid={errors.firstName.value!}
												value={request?.firstName}
											/>
											<BosInput
												changeHandler={inputHandler}
												label="Last name"
												name="lastName"
												errors={errors.lastName.errors}
												focusHandler={focusHandler}
												blurHandler={blurHandler}
												thisRef={inputRefs.lastName}
												isValid={errors.lastName.value!}
												value={request?.lastName}
											/>
										</div>
										<div className="flex gap-2">
											<BosInput
												changeHandler={inputHandler}
												label="Nickname (Optional)"
												name="nickname"
												focusHandler={focusHandler}
												blurHandler={blurHandler}
												thisRef={inputRefs.nickname}
												optional
												value={request.nickname}
											/>{" "}
											<Select
												options={pronounOptions}
												label="Pronouns"
												name="pronouns"
												changeHandler={selectHandler}
												value={request.pronouns}
											/>
										</div>
										<div className="">
											<BosInput
												changeHandler={inputHandler}
												type="date"
												label="Birthdate"
												name="birthdate"
												focusHandler={focusHandler}
												blurHandler={blurHandler}
												thisRef={inputRefs.birthdate}
												errors={errors.birthdate.errors}
												isValid={errors.birthdate.value!}
												value={request?.birthdate}
											/>
										</div>
									</div>
									<div className="flex justify-end gap-2 mt-10">
										<Button
											variant={"secondary"}
											onClick={() => {
												setIsEdit(false);
											}}
										>
											{"Cancel"}
										</Button>
										<Button type="submit">{"Save Changes"}</Button>
									</div>
								</div>
							</motion.form>
						) : (
							<div className="flex gap-20 w-[50rem]">
								<Avatar className="w-40 h-40 shadow-md cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-300">
									<AvatarImage
										className="object-cover w-full"
										src={getImageName(userData)}
									/>
								</Avatar>
								<div className="flex flex-col gap-5">
									<div className="flex flex-col">
										<p className="text-sm font-medium text-stone-400">Name</p>
										<p className="text-stone-700">
											{request.firstName} {request.lastName}
										</p>
									</div>
									<div className="flex flex-col">
										<p className="text-sm font-medium text-stone-400">
											Nickname
										</p>
										<p className="text-stone-700">
											{request.nickname ? request.nickname : "None"}
										</p>
									</div>
									<div className="flex flex-col">
										<p className="text-sm font-medium text-stone-400">
											Pronouns
										</p>
										<p className="text-stone-700">
											{getPronouns(request.pronouns)}
										</p>
									</div>
									<div className="flex flex-col">
										<p className="text-sm font-medium text-stone-400">
											Birthdate
										</p>
										<p className="text-stone-700">
											{formatDate(request.birthdate)}
										</p>
									</div>
								</div>
							</div>
						)}
					</div>
					<div className="flex justify-center">
						{!isEdit && (
							<Button
								onClick={() => {
									setIsEdit(!isEdit);
								}}
							>
								{" "}
								{"Edit"}
							</Button>
						)}
					</div>
				</div>
			</div>
		);
	}
};

export default Settings;
