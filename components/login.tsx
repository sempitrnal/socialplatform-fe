import { UserDto, useSP } from "@/context/context";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import BosInput from "./myinput";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useToast } from "./ui/use-toast";
import { get } from "http";
interface Validation {
	username: boolean;
	password: boolean;
}
const Login = () => {
	const { login, currentUser, userData, getUser } = useSP();
	const [user, setUser] = useState<UserDto>({
		username: "",
		password: "",
	});
	const [errors, setErrors] = useState<any>({
		username: true,
		password: true,
		// Initialize errors for each input field
	});
	const [loginError, setLoginError] = useState(null);
	const inputRefs: any = {
		username: useRef<HTMLInputElement>(null),
		password: useRef<HTMLInputElement>(null),
	};
	const { toast } = useToast();
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [submitClicked, setSubmitClicked] = useState<boolean>(false);
	const router = useRouter();
	const inputHandler = (e: React.FormEvent<HTMLInputElement>) => {
		const { name, value } = e.target as HTMLInputElement;
		setUser({ ...user, [name]: value });

		if (value.length > 0) {
			setErrors((prev: any) => ({ ...prev, [name]: true }));
		}
	};

	const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
		const { name, value } = e.target as HTMLInputElement;

		if (submitClicked) {
			if (value.length === 0) {
				setErrors((prev: any) => ({ ...prev, [name]: false }));
			}
		}
	};
	const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
		const { name, value } = e.target as HTMLInputElement;
		if (value.length === 0) {
			setErrors((prev: any) => ({ ...prev, [name]: false }));
		}
	};
	const loginHandler = async () => {
		setSubmitted(true);
		const error = await login(user);
		if (error != null) {
			setLoginError(error);
			setSubmitted(false);
		} else {
			setSubmitted(true);
			const res = await router.push("/home");
			if (currentUser) {
				getUser(currentUser?.userId);
			}
			if (res != null && userData != null) {
				toast({
					title: `Hello there, ${userData.firstName}!`,
					description: `Welcome to Gazebo!`,
				});
			}
		}
	};

	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const hasErrors = Object.values(user).some((error) => error === "");
		setErrors((prev: any) => {
			Object.entries(user).map(([key, value]) => {
				if (value === "") {
					prev[key] = false;
				}
			});
			return prev;
		});

		if (hasErrors) {
			for (const inputName in errors) {
				if (errors[inputName] !== true) {
					inputRefs[inputName].current.focus();
					break;
				}
			}
		} else {
			loginHandler();
		}
	};

	return (
		<motion.div className="w-[25rem] flex flex-col gap-5 justify-center items-center border rounded-lg p-10 pt-12">
			<AnimatePresence>
				{loginError && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="w-full py-2 mb-5 text-sm text-center text-white bg-[#f87171] border border-[#ff6969] rounded-md shadow-lg"
					>
						{loginError}
					</motion.div>
				)}
			</AnimatePresence>
			<form
				noValidate
				className="flex flex-col w-full gap-5"
				onSubmit={submitHandler}
			>
				<BosInput
					changeHandler={inputHandler}
					name="username"
					label="Username"
					thisRef={inputRefs.username}
					isValid={errors.username}
					focusHandler={focusHandler}
					blurHandler={blurHandler}
				/>{" "}
				<BosInput
					changeHandler={inputHandler}
					name="password"
					type="password"
					thisRef={inputRefs.password}
					label="Password"
					isValid={errors.password}
					focusHandler={focusHandler}
					blurHandler={blurHandler}
				/>
				<Button disabled={submitted} type="submit" className="w-full h-10">
					{submitted ? <ClipLoader size="20px" color="grey" /> : "Login"}
				</Button>
			</form>

			<Separator />

			<p className="text-sm text-stone-500">
				Don{"'"}t have an account?{" "}
				<span className="text-stone-900 hover:underline">
					<Link href="/register">Sign up here</Link>
				</span>
			</p>
		</motion.div>
	);
};

export default Login;
