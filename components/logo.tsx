import Image from "next/image";
import Link from "next/link";

const Logo = () => {
	return (
		<Link href="/home">
			<Image
				src="/static/gazebo.png"
				className="p-2 transition-all duration-300 bg-orange-100 rounded-md shadow-md hover:scale-[1.04]"
				width={45}
				height={45}
				alt="logo"
			/>
		</Link>
	);
};

export default Logo;
