import { useEffect, useRef, useState } from "react";
import { AlertCircle, Calendar, Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip } from "@chakra-ui/react";

type BosInputType = {
	changeHandler?: (e: React.FormEvent<HTMLInputElement>) => void;
	label: string;
	type?: string;
	name: string;
	min?: number;
	disabled?: boolean;
	errors?: string[];
	max?: number;
	value?: string;
	thisRef?: any;
	isValid?: boolean;
	focusHandler?: (e: React.FocusEvent<HTMLInputElement>) => void;
	blurHandler?: (e: React.FocusEvent<HTMLInputElement>) => void;
	clicked?: any;
	optional?: boolean;
};
const BosInput = ({
	changeHandler,
	label,
	type,
	name,
	min,
	disabled,
	errors,
	max,
	value,
	thisRef,
	isValid,
	focusHandler,
	blurHandler,
	clicked,
	optional,
}: BosInputType) => {
	if (optional) {
		isValid = true;
	}
	const [showPassword, setShowPassword] = useState<any>({
		password: false,
		confirmPassword: false,
	});
	const showPasswordHandler = (e: any) => {
		setShowPassword((prev: any) => {
			return { ...prev, [name]: !prev[name] };
		});
	};
	const currentDate = new Date();
	const year = currentDate.getFullYear() - 18;
	const day = currentDate.getDate().toString().padStart(2, "0");
	const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
	const minYear = year - 100;
	const minDay = day;
	const minMonth = month;
	const now = `${year}-${month}-${day}`;
	const _100YrsAgo = `${minYear}-${minMonth}-${minDay}`;
	const [isFocused, setIsFocused] = useState(false);
	return (
		<div className="w-full">
			<div className="relative z-0 ">
				<input
					onBlur={(e) => {
						if (blurHandler) {
							blurHandler(e);
							setIsFocused(false);
						}
					}}
					onFocus={(e) => {
						if (focusHandler) {
							focusHandler(e);
							setIsFocused(true);
						}
					}}
					autoComplete="off"
					required
					type={
						type === "password"
							? !showPassword[name]
								? "password"
								: "text"
							: type
					}
					id={name}
					disabled={disabled}
					ref={thisRef}
					name={name}
					value={value}
					minLength={min}
					// value={input}
					maxLength={max}
					max={type === "date" ? now : ""}
					min={type === "date" ? _100YrsAgo : ""}
					onChange={(e) => {
						if (changeHandler) {
							changeHandler(e);
						}
					}}
					className={`h-[1rem]  rounded-md py-5 ${
						type === "password" ? "px-4 pr-16" : "px-4 pr-10"
					} w-full  outline-none 
           bg-[#f9f9f9]   focus:bg-white  
           border 
           hover:bg-[#f7f7f7] 
           ${
							!isValid
								? "border-[#e55f5f] focus:border-[#e55f5f] text-[#e55f5f] "
								: "border-[#f5f5f5] valid:border-[#292929] text-black focus:border-[#292929]"
						} ${value ? (!isValid && value!.length > 0 ? "" : "") : ""}
					
           valid:bg-white valid:hover:bg-white
            dark:bg-[#292929]  dark:focus:bg-dark
           dark:border-[#292929] dark:focus:border-[#7a7a7a]
           
           dark:text-white transition-all duration-300  dark:shadow-none  
					 ${disabled ? "text-stone-400 " : "text-black"}
            `}
				/>
				<AnimatePresence initial={false}>
					{!disabled ? (
						<motion.label
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.1 }}
							htmlFor={name}
							className={`absolute font-[400] dark:bg-[#292929]   rounded-md pointer-events-none left-4  top-[10.5px] text-sm dark:text-white  ${
								isValid ? "text-[#a0a0a0]" : "text-[#e55f5f]"
							} `}
						>
							{label}
						</motion.label>
					) : disabled ? (
						value == "" || value == null ? (
							<motion.label
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.1 }}
								htmlFor={name}
								className={`absolute font-[400] dark:bg-[#292929]   rounded-md pointer-events-none left-4  top-[10.5px] text-sm dark:text-white  ${
									isValid ? "text-[#a0a0a0]" : "text-[#e55f5f]"
								} `}
							>
								{label}
							</motion.label>
						) : null
					) : null}
				</AnimatePresence>
				{type === "date" && (
					<div className="absolute scale-75 pointer-events-none top-2 hover:text-[#333] right-3">
						<Calendar />
					</div>
				)}
				<AnimatePresence>
					{!isValid && (
						<div
							onMouseEnter={() => {
								setIsFocused(true);
							}}
							className={`absolute   ${
								type === "date" ? "  right-10" : " right-3"
							} top-[50%] translate-y-[-50%] )}`}
						>
							<Tooltip
								placement="bottom-end"
								isOpen={isFocused}
								size={"md"}
								fontSize={"small"}
								backgroundColor={"#e55f5f"}
								className={`pt-2 pb-1 px-2.5 absolute  text-white rounded-md `}
								label={errors?.map((error: string, i: number) => {
									console.log(error);
									return (
										<p key={i} className={`mb-1  max-w-[12rem]`}>
											{error}
										</p>
									);
								})}
							>
								<AlertCircle size="20px" color="#e55f5f" />
							</Tooltip>
						</div>
					)}
				</AnimatePresence>
				<AnimatePresence>
					{type === "password" && (
						<motion.div
							onClick={showPasswordHandler}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0.1 } }}
							exit={{ opacity: 0 }}
							className={`absolute ${
								isValid ? "right-[10px]" : "right-[35px]"
							}   top-[10px] scale-75 cursor-pointer hover:text-[#646464] transition-all duration-300"`}
						>
							{!showPassword[name] ? <EyeOff /> : <Eye />}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default BosInput;
