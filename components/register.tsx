import { useSP } from "@/context/context";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import BosInput from "./myinput";
import Select from "./myselect";
import { Button } from "./ui/button";

export interface RegisterDto {
	firstName: string;
	lastName: string;
	username: string;
	nickName?: string;
	birthdate: string;
	pronouns?: string;
	password: string;
	confirmPassword: string;
}
export const RegisterDtoDefaultValues: RegisterDto = {
	firstName: "",
	lastName: "",
	username: "",
	nickName: "",
	birthdate: "",
	pronouns: "1",
	password: "",
	confirmPassword: "",
};
export type RegisterInputErrorProps = {
	value?: boolean;
	errors?: string[];
};
export type RegisterInputErrors = {
	firstName: RegisterInputErrorProps;
	lastName: RegisterInputErrorProps;
	username: RegisterInputErrorProps;
	birthdate: RegisterInputErrorProps;
	pronouns: RegisterInputErrorProps;
	password: RegisterInputErrorProps;
	confirmPassword: RegisterInputErrorProps;
	[key: string]: RegisterInputErrorProps;
};
interface InputRefProps {
	firstName: React.RefObject<HTMLInputElement>;
	lastName: React.RefObject<HTMLInputElement>;
	username: React.RefObject<HTMLInputElement>;
	nickname: React.RefObject<HTMLInputElement>;
	birthdate: React.RefObject<HTMLInputElement>;
	pronouns: React.RefObject<HTMLInputElement>;
	password: React.RefObject<HTMLInputElement>;
	confirmPassword: React.RefObject<HTMLInputElement>;
	[key: string]: React.RefObject<HTMLInputElement>;
}
const Register = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [request, setRequest] = useState<RegisterDto>(RegisterDtoDefaultValues);
	const [submitClicked, setSubmitClicked] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const { registerError, login, setUser } = useSP();
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
	const pronounOptions = [
		{ name: "She/Her", value: 1 },
		{ name: "He/Him", value: 2 },
		{ name: "They/Them", value: 3 },
		{ name: "I prefer not to say", value: 0 },
	];
	const router = useRouter();
	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

	const handleLogin = async (registerDto: RegisterDto) => {
		const result = await login({
			username: registerDto.username,
			password: registerDto.password,
		});
		let user = JSON.parse(localStorage.getItem("user")!);
		if (result !== null) {
			setUser((prev) => {
				return { ...prev, newlyRegistered: true };
			});
		}
		user = { ...user, newlyRegistered: true };
		localStorage.setItem("user", JSON.stringify(user));
		router.push("/profile-picture");
	};
	const register = async (registerDto: RegisterDto) => {
		try {
			await axios
				.post(process.env.API_BASE_URL + "/user/register", {
					firstName:
						registerDto.firstName[0].toUpperCase() +
						registerDto.firstName.slice(1),
					lastName:
						registerDto.lastName[0].toUpperCase() +
						registerDto.lastName.slice(1),
					nickname: registerDto.nickName ?? registerDto,
					username: registerDto.username,
					birthdate: registerDto.birthdate,
					pronouns: parseInt(registerDto.pronouns!),
					password: registerDto.password,
				})
				.then((res) => {
					if (res.status == 200) {
						setUser((prev: any) => {
							return { ...prev, newlyRegistered: true };
						});
						handleLogin(registerDto);
					}
				});
		} catch (error: any) {
			if (error.response.data) {
				setErrors((prev: RegisterInputErrors) => {
					return {
						...prev,
						username: {
							value: false,
							errors: [error.response.data],
						},
					};
				});
				inputRefs.username.current!.focus();
				setSubmitted(false);
			}
		}
	};
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

		if (name === "password") {
			const errors: string[] = [];
			let isValid = true;

			if (value !== request.confirmPassword && request.confirmPassword !== "") {
				errors.push("Passwords do not match");
				isValid = false;
			}

			if (!passwordRegex.test(value)) {
				errors.push(requestValidation[name][1]);
				isValid = false;
			}

			validateInput(isValid, errors);
		}

		if (name === "confirmPassword") {
			const errors: string[] = [];
			let isValid = true;
			const test = !passwordRegex.test(value);

			if (value !== request.password) {
				errors.push("Passwords do not match");
				isValid = false;
			}

			if (test) {
				errors.push(requestValidation["password"][1]);
				isValid = false;
			}

			validateInput(isValid, errors);

			// Also update the 'password' field separately
			setErrors((prev: RegisterInputErrors) => ({
				...prev,
				password: {
					value: isValid,
					errors: isValid ? [] : ["Passwords do not match"],
				},
			}));
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
			// if (value.length === 0) {
			// 	if (Object.keys(errors).includes(name)) {
			// 		setErrors((prev: RegisterInputErrors) => ({
			// 			...prev,
			// 			[name]: {
			// 				...[name],
			// 				value: false,
			// 			},
			// 		}));
			// 	}
			// }
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

	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

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

		setSubmitClicked(true);
		if (hasErrors) {
			for (const inputName in errors) {
				if (errors[inputName].value !== true) {
					inputRefs[inputName].current!.focus();
					break;
				}
			}
		} else {
			setSubmitted(true);
			register(request);
			if (registerError) {
				setSubmitted(false);
			}
		}
	};
	useEffect(() => {}, []);
	return (
		<div className="w-[30rem] shadow-sm flex flex-col gap-5 justify-center items-center  rounded-lg p-10 pt-12 bg-white ">
			<form
				noValidate
				className="flex flex-col w-full gap-5 "
				onSubmit={submitHandler}
			>
				<div className="flex gap-3">
					<BosInput
						changeHandler={inputHandler}
						label="First name"
						name="firstName"
						errors={errors.firstName.errors}
						focusHandler={focusHandler}
						blurHandler={blurHandler}
						thisRef={inputRefs.firstName}
						isValid={errors.firstName.value!}
						value={request.firstName}
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
						value={request.lastName}
					/>
				</div>
				<div className="flex gap-3">
					<BosInput
						changeHandler={inputHandler}
						label="Username"
						name="username"
						focusHandler={focusHandler}
						blurHandler={blurHandler}
						thisRef={inputRefs.username}
						isValid={errors.username.value!}
						errors={errors.username.errors}
						value={request.username}
					/>
					<BosInput
						changeHandler={inputHandler}
						label="Nickname (Optional)"
						name="nickName"
						focusHandler={focusHandler}
						blurHandler={blurHandler}
						thisRef={inputRefs.nickname}
						optional
						value={request.nickName}
					/>
				</div>
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
					value={request.birthdate}
				/>
				<Select
					options={pronounOptions}
					label="Pronouns"
					name="pronouns"
					changeHandler={selectHandler}
					value={request.pronouns}
				/>
				<BosInput
					changeHandler={inputHandler}
					type="password"
					label="Password"
					name="password"
					focusHandler={focusHandler}
					blurHandler={blurHandler}
					thisRef={inputRefs.password}
					errors={errors.password.errors}
					isValid={errors.password.value!}
					value={request.password}
				/>{" "}
				<BosInput
					changeHandler={inputHandler}
					type="password"
					label="Confirm Password"
					name="confirmPassword"
					focusHandler={focusHandler}
					blurHandler={blurHandler}
					thisRef={inputRefs.confirmPassword}
					isValid={errors.confirmPassword.value!}
					errors={errors.confirmPassword.errors}
					value={request.confirmPassword}
				/>
				<Button disabled={submitted} type="submit" className="w-full h-10">
					{submitted ? <ClipLoader size="20px" color="grey" /> : "Register"}
				</Button>
			</form>
			{/* <Link href={"/"} className="text-sm hover:underline underline-offset-2">
				Forgot password?
			</Link>
			<Separator />
			<Button className="w-[50%] bg-indigo-950 hover:bg-indigo-950/90">
				Register
			</Button> */}
			<p className="text-sm text-stone-500">
				Already have an account?{" "}
				<span className="text-stone-900 hover:underline">
					<Link href="/">Login here</Link>
				</span>
			</p>
		</div>
	);
};

export default Register;
