"use client";

import { useOptimistic } from "react";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";

import { dislikeTweet, likeTweet } from "@/app/tweets/[id]/actions";

interface LikeButtonProps {
	isLiked: boolean;
	likeCount: number;
	tweetId: number;
}

export default function ButtonLike({
	isLiked,
	likeCount,
	tweetId,
}: LikeButtonProps) {
	const [state, reducerFn] = useOptimistic(
		{ isLiked, likeCount },
		(prevState, payload) => ({
			isLiked: !prevState.isLiked,
			likeCount: prevState.isLiked
				? prevState.likeCount - 1
				: prevState.likeCount + 1,
		})
	);
	const onClick = async () => {
		// button-like.tsx:30 Warning: An optimistic state update occurred outside a transition or action. To fix, move the update to an action, or wrap with startTransition.
		reducerFn(undefined);
		if (isLiked) {
			await dislikeTweet(tweetId);
		} else {
			await likeTweet(tweetId);
		}
	};
	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-2 text-neutral-400 text-sm rounded-full transition-colors ${
				state.isLiked
					? "text-white"
					: "hover:bg-teal-300 hover:text-black hover:p-1"
			}`}
		>
			{state.isLiked ? (
				<HandThumbUpIcon className="size-5 text-orange-500" />
			) : (
				<OutlineHandThumbUpIcon className="size-5" />
			)}
			{state.isLiked ? (
				<span> {state.likeCount}</span>
			) : (
				<span>Like ({state.likeCount})</span>
			)}
		</button>
	);
}
