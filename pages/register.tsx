import { motion } from "framer-motion";

import Register from "@/components/register";
import LoadingPage from "@/utils/loading";
import Head from "next/head";

const RegisterPage = () => {
	return (
		<>
			<Head>
				<title>Gazebo | Register</title>
			</Head>
			<LoadingPage />{" "}
			<motion.div
				transition={{ duration: 0.3, ease: "easeInOut" }}
				initial={{ x: 100, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				exit={{ opacity: 0, x: -100 }}
				className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
			>
				{" "}
				<div className="">
					<p className="font-black uppercase">Register</p>
				</div>
				<Register />
			</motion.div>
			{/* <motion.div
				initial={{ x: 300, opacity: 0 }}
				animate={{
					x: 0,
					opacity: 1,
					transition: {
						delay: 0.2,
						type: "spring",
						damping: 30,
						stiffness: 100,
					},
				}}
				exit={{ opacity: 0 }}
				className="absolute top-0 right-0 -z-10"
			>
				<div className="relative w-[50rem] h-[50rem] opacity-70">
					<Image src="/static/blobs/blob1.svg" fill />
				</div>
			</motion.div>{" "}
			<motion.div
				initial={{ x: -300, opacity: 0 }}
				animate={{
					x: 0,
					opacity: 1,
					transition: {
						delay: 0.2,
						type: "spring",
						damping: 30,
						stiffness: 100,
					},
				}}
				exit={{ opacity: 0 }}
				className="absolute top-0 left-0 -z-10"
			>
				<div className="relative w-[50rem] h-[50rem] opacity-30 ">
					<Image src="/static/blobs/blob2.svg" fill />
				</div>
			</motion.div> */}
		</>
	);
};

export default RegisterPage;
