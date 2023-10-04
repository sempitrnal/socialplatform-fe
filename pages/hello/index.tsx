"use client";
import { motion } from "framer-motion";
import Link from "next/link";
const Hello = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<Link href={"/"}>home</Link>
		</motion.div>
	);
};

export default Hello;
