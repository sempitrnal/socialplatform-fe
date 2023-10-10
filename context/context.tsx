"use client";

import { RegisterDto } from "@/components/register";
import { toast } from "@/components/ui/use-toast";
import {
	HttpTransportType,
	HubConnection,
	HubConnectionBuilder,
} from "@microsoft/signalr";
import axios, { Axios, AxiosError } from "axios";
import jwtDecode from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";

type SPContextType = {
	login: (userDto: UserDto) => void;
	currentUser: any;
	register: (registerDto: RegisterDto) => void;
	registerError?: string;
	setRegisterError?: any;
	setUser?: any;
	getUser?: any;
	userData?: any;
	setUserData?: any;
	notificationConnection?: HubConnection | null;
	setNotificationConnection?: any;
};

const SPContextDefaultValues: SPContextType = {
	login: () => {},
	register: () => {},
	currentUser: null,
	registerError: "",
	setRegisterError: () => {},
	setUser: () => {},
	getUser: () => {},
	userData: {},
	setUserData: () => {},
	notificationConnection: null,
	setNotificationConnection: () => {},
};
const SPContext = createContext<SPContextType>(SPContextDefaultValues);

export function useSP() {
	return useContext(SPContext);
}
export interface UserDto {
	username: string;
	password: string;
}
export function SPProvider({ children }: { children: React.ReactNode }) {
	const [notificationConnection, setNotificationConnection] =
		useState<HubConnection>();

	//login states

	const [currentUser, setUser] = useState<any>(
		typeof window !== "undefined"
			? JSON.parse(localStorage.getItem("user")!)
			: null
	);
	const [userData, setUserData] = useState<any>();

	//register states
	const [registerError, setRegisterError] = useState<string>();

	const getUser = async (id: string) => {
		try {
			await axios.get(`${process.env.API_BASE_URL}/user/${id}`).then((e) => {
				setUserData(e.data);
			});
		} catch (error) {}
	};
	useEffect(() => {
		if (currentUser) {
			getUser(currentUser?.userId);
		}
	}, [currentUser]);
	const login = async (userDto: UserDto) => {
		try {
			const res = await axios.post(process.env.API_BASE_URL + "/auth/login", {
				username: userDto.username,
				password: userDto.password,
			});
			console.log(res.data);
			setUser({
				...jwtDecode(res.data),
				exp: new Date(jwtDecode(res.data)?.exp * 1000),
			});
			localStorage.setItem(
				"user",
				JSON.stringify({
					...jwtDecode(res.data),
					exp: new Date(jwtDecode(res.data)?.exp * 1000),
				})
			);
		} catch (error: any) {
			return error.response.data; // Return the error message
		}
	};
	const register = async (registerDto: RegisterDto) => {
		try {
			await axios
				.post(process.env.API_BASE_URL + "/user/register", {
					firstName: registerDto.firstName,
					lastName: registerDto.lastName,
					nickname: registerDto.nickName ?? registerDto,
					username: registerDto.username,
					birthdate: registerDto.birthdate,
					pronouns: parseInt(registerDto.pronouns!),
					password: registerDto.password,
				})
				.then((res) => {
					console.log(res);
				});
		} catch (error: any) {
			console.log(error);
			setRegisterError(error.response.data);
		}
	};

	useEffect(() => {
		if (userData) {
			const notificationConnection = new HubConnectionBuilder()
				.withUrl(`${process.env.BACKEND_BASE_URL}/notifications`, {
					skipNegotiation: true,
					transport: HttpTransportType.WebSockets,
				})
				.withAutomaticReconnect()
				.build();

			const startConnection = async () => {
				await notificationConnection.start().then(fulfilled, rejected);
			};
			setNotificationConnection(notificationConnection);
			notificationConnection.on("UserJoined", (userId) => {});

			notificationConnection.on(
				"ReceiveLikeNotification",
				(message, postId) => {
					// Handle the "Like" notification
					// Display a notification to the user, update the UI, etc.
					toast({
						title: "Notification",
						description: message,
					});
				}
			);
			const fulfilled = async () => {
				console.log("connected");
				console.log(userData?.id.toString());
				await notificationConnection.send(
					"OnConnectedAsync",
					userData?.id.toString()
				);
			};
			const rejected = () => {
				console.log("rejected");
			};
			startConnection();
		}
	}, [userData]);
	const value = {
		login,
		register,
		currentUser,
		registerError,
		setRegisterError,
		setUser,
		userData,
		getUser,
		setUserData,
		notificationConnection,
		setNotificationConnection,
	};
	useEffect(() => {}, []);
	return <SPContext.Provider value={value}>{children}</SPContext.Provider>;
}
