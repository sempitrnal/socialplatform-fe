import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { UserDto, useSP } from "@/context/context";
import { useEffect, useState } from "react";
import Login from "@/components/login";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import useDarkMode from "@/hooks/useDarkMode";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";
import AuthLoading from "@/utils/loading";
import LoadingPage from "@/utils/loading";
import Head from "next/head";

export default function LoginPage() {
	const { isDarkMode, toggleDarkMode } = useDarkMode();

	return (
		<>
			<Head>
				<title>Gazebo | Login</title>
			</Head>
			<LoadingPage />
			<motion.main
				initial={{ x: 100, opacity: 0 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -100 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
			>
				{/* <Button onClick={toggleDarkMode}>sad</Button> */}
				<Layout>
					<Login />
				</Layout>
			</motion.main>
		</>
	);
}
