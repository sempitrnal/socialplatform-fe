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
import { useRouter } from "next/router";
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
	chatConnection?: HubConnection | null;
	redirect?: any;
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
	chatConnection: null,
	redirect: () => {},
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
	const router = useRouter();

	// notification connection state
	const [notificationConnection, setNotificationConnection] =
		useState<HubConnection>();

	const [chatConnection, setChatConnection] = useState<HubConnection>();

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

	// useEffect for getting user data
	useEffect(() => {
		if (currentUser) {
			getUser(currentUser?.userId);
		}
	}, [currentUser]);

	// authentication and registration functions
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
					nickname: registerDto.nickname ?? registerDto,
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

	// useEffect for hub connections
	useEffect(() => {
		if (userData) {
			const notificationConnection = new HubConnectionBuilder()
				.withUrl(`${process.env.BACKEND_BASE_URL}/notifications`, {
					skipNegotiation: true,
					transport: HttpTransportType.WebSockets,
				})
				.withAutomaticReconnect()
				.build();
			const chatConnection = new HubConnectionBuilder()
				.withUrl(`${process.env.BACKEND_BASE_URL}/chat`, {
					skipNegotiation: true,
					transport: HttpTransportType.WebSockets,
				})
				.withAutomaticReconnect()
				.build();
			const startNotificationConnection = async () => {
				await notificationConnection
					.start()
					.then(
						fulfilledNotificationConnection,
						rejectedNotificationConnection
					);
			};
			const startChatConnection = async () => {
				await chatConnection
					.start()
					.then(fulfilledChatConnection, rejectedChatConnection);
			};
			setNotificationConnection(notificationConnection);
			setChatConnection(chatConnection);
			notificationConnection.on("UserJoined", (userId) => {});

			notificationConnection.on(
				"ReceiveLikeNotification",
				(name, message, userId, postId) => {
					if (currentUser.userId != userId) {
						toast({
							title: "Notification",
							description: (
								<div className="">
									<span className="font-medium">{name}</span> {message}
								</div>
							),
						});
					}
					getUser(currentUser.userId);
				}
			);
			notificationConnection.on(
				"ReceiveCommentNotification",
				(name, message, userId, postId) => {
					if (currentUser.userId != userId) {
						toast({
							title: "Notification",
							description: (
								<div className="">
									<span className="font-medium">{name}</span> {message}
								</div>
							),
						});
					}
					getUser(currentUser.userId);
				}
			);
			notificationConnection.on(
				"ReceiveFollowNotification",
				(name, message, userId) => {
					if (currentUser.userId != userId) {
						toast({
							title: "Notification",
							description: (
								<div className="">
									<span className="font-medium">{name}</span> {message}
								</div>
							),
						});
					}
					getUser(currentUser.userId);
				}
			);
			const fulfilledNotificationConnection = async () => {
				console.log("connected");
				await notificationConnection.send(
					"OnConnectedAsync",
					userData?.id.toString()
				);
			};
			const rejectedNotificationConnection = () => {
				console.log("rejectedNotificationConnection");
			};

			const fulfilledChatConnection = async () => {
				console.log("chat connected!");
				await chatConnection.send("OnConnectedAsync", userData?.id.toString());
			};
			const rejectedChatConnection = () => {
				console.log("chat rejected!");
			};

			startNotificationConnection();
			startChatConnection();
		}
	}, [userData]);

	const redirect = () => {
		router.push("/");
		toast({
			title: "You are not logged in",
			description: "Please login to continue",
		});
	};

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
		chatConnection,
		redirect,
	};

	return <SPContext.Provider value={value}>{children}</SPContext.Provider>;
}
