import HomeNav from "@/components/home-nav";
import NotFound from "@/components/not-found";
import Post from "@/components/post";
import PostSkeleton from "@/components/post-skeleton";
import { useSP } from "@/context/context";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const UserPost = () => {
	//hooks
	const { currentUser, redirect } = useSP();
	const { postId } = useRouter().query;

	//states
	const [post, setPost] = useState<any>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [postNotFound, setPostNotFound] = useState<boolean>(false);
	//functions

	const getPost = async () => {
		console.log(postId);
		await axios
			.get(`${process.env.API_BASE_URL}/post/getPostById?id=${postId}`)
			.then((e) => {
				setPost(e.data);
				setIsLoading(false);
			})
			.catch((error) => {
				if (error.response.status == 404) {
					setPostNotFound(true);
					setIsLoading(false);
				}
				console.log(error);
			});
	};

	//useEffect for redirecting if user is not logged in
	useEffect(() => {
		if (currentUser == undefined) {
			redirect();
		}
	}, [currentUser]);

	useEffect(() => {
		if (postId) {
			getPost();
		}
	}, [postId]);
	useEffect(() => {
		if (post) {
			console.log(post);
		}
	}, [post]);

	if (postNotFound) {
		return <NotFound />;
	}
	return (
		<>
			<Head>
				<title>
					{post?.user.name} | {post?.description}
				</title>
			</Head>
			<HomeNav />
			<div className="mt-[5.5rem] flex justify-center   pt-20 pb-5">
				<div className="md:w-[45rem]">
					{isLoading ? (
						<PostSkeleton />
					) : (
						<div className="">
							<Post post={post} user={post.user} />
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default UserPost;
