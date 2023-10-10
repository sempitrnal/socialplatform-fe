import { Skeleton } from "./ui/skeleton";

export interface PostSkeletonProps {
	withPic?: boolean;
}

const PostSkeleton = ({ withPic }: PostSkeletonProps) => {
	return (
		<div className="p-16 py-10 border rounded-lg ">
			<div className="flex items-center gap-2">
				<Skeleton className="w-8 h-8 rounded-full" />
				<div className="flex flex-col gap-2">
					<Skeleton className="w-[10rem] h-3" />
					<Skeleton className="w-[3rem] h-2" />
				</div>
			</div>
			<Skeleton className="w-[20rem] h-3 mt-5" />
			{withPic && <Skeleton className="w-full h-[20rem] rounded-md mt-5" />}
		</div>
	);
};

export default PostSkeleton;
