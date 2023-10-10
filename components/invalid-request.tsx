import Head from "next/head";
import HomeNav from "./home-nav";
import Logo from "./logo";
import { Separator } from "./ui/separator";
import { useRouter } from "next/router";

const InvalidRequest = () => {
	const router = useRouter();
	return (
		<div className="min-h-screen overflow-y-hidden">
			<Head>
				<title>Invalid Request</title>
			</Head>
			<HomeNav />
			<div className="mt-[5.5rem] flex justify-center items-center min-h-[85vh]">
				<div className="flex flex-col items-center gap-2">
					<p className="text-3xl font-bold text-center uppercase">oops!</p>
					<p className="text-xl text-stone-500">
						The page you requested is invalid. :(
					</p>
					<p className="mb-5 text-sm text-stone-400">
						You can go back to the home page by clicking the button below.
					</p>

					<div className="flex flex-col items-center justify-center gap-4">
						<Logo />
						<Separator className="w-[10rem]" />
						<div
							className="cursor-pointer hover:underline text-stone-500 underline-offset-4"
							onClick={() => {
								router.back();
							}}
						>{` Back`}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InvalidRequest;
