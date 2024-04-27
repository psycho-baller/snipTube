import React, {
	useState,
	useRef,
	type KeyboardEvent,
	type FC,
	useEffect,
} from "react";

interface Props {
	tags: string[];
	setTags: (tags: string[]) => void;
	[x: string]: any;
}

const InputTag: FC<Props> = (props) => {
	const { tags, setTags, ...rest } = props;

	const [width, setWidth] = useState<number>(1);
	const [focused, setFocused] = useState<boolean>(false);
	const [inputVal, setInputVal] = useState<string>("");
	const input = useRef<HTMLInputElement>(null);
	const span = useRef<HTMLSpanElement>(undefined!);

	const removeTag = (i: number) => {
		setTags([...tags.slice(0, i), ...tags.slice(i + 1)]);
	};

	const inputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		e.stopPropagation();
		if ((e.key === "Tab" || e.key === "," || e.key === "Enter") && inputVal) {
			e.preventDefault();
			if (tags.find((tag) => tag.toLowerCase() === inputVal.toLowerCase())) {
				// select the input
				if (input.current) {
					input.current.select();
				}
				return;
			}
			setTags([...tags, inputVal.trim()]);
			if (input.current) {
				input.current.value = "";
				setInputVal("");
			}
		} else if (e.key === "Backspace" && !inputVal) {
			removeTag(tags.length - 1);
		}
	};

	useEffect(() => {
		// set the width of the input to the width of the span(text)
		// min width of 1 so component always shows
		setWidth(
			span.current.getBoundingClientRect().width < 1
				? 1
				: span.current.getBoundingClientRect().width,
		);
	}, [inputVal]);

	return (
		<div
			className="w-full px-3 py-2 overflow-hidden overflow-x-hidden overflow-y-auto scrolling-touch transition-all ease-in-out border border-gray-600 rounded-md cursor-text focus-within:outline-none scrollbar dark:bg-gray-700 dark:text-gray-300 dark:focus-within:bg-gray-900 focus-within:ring-3 focus-within:ring-gray-600"
			onClick={() => {
				if (input.current) {
					input.current.focus();
				}
			}}
		>
			<ul className="inline-flex flex-wrap w-full space-x-2">
				{tags.map((tag, i) => (
					<li
						key={tag}
						className={`flex self-center px-2 py-1.5 text-lg rounded-3xl gap-x-2 whitespace-nowrap transition ${
							inputVal === tag || !focused ? "bg-gray-500" : "bg-gray-700"
						}`}
					>
						{tag}
						<button type="button" onClick={() => removeTag(i)}>
							<svg
								width="14"
								height="14"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M5.55264 4.24155C5.38267 4.08257 5.15785 3.99603 4.92556 4.00014C4.69327 4.00425 4.47163 4.09871 4.30735 4.2636C4.14307 4.4285 4.04897 4.65096 4.04487 4.88412C4.04077 5.11728 4.127 5.34294 4.28538 5.51355L8.73274 9.97755L4.28538 14.4416C4.19729 14.5239 4.12663 14.6233 4.07762 14.7337C4.02861 14.8441 4.00226 14.9633 4.00014 15.0841C3.99802 15.205 4.02016 15.325 4.06526 15.4371C4.11035 15.5491 4.17748 15.6509 4.26262 15.7364C4.34776 15.8219 4.44919 15.8892 4.56083 15.9345C4.67248 15.9798 4.79207 16.002 4.91246 15.9999C5.03286 15.9977 5.15159 15.9713 5.26158 15.9221C5.37156 15.8729 5.47055 15.802 5.55264 15.7136L10 11.2496L14.4474 15.7136C14.5294 15.802 14.6284 15.8729 14.7384 15.9221C14.8484 15.9713 14.9671 15.9977 15.0875 15.9999C15.2079 16.002 15.3275 15.9798 15.4392 15.9345C15.5508 15.8892 15.6522 15.8219 15.7374 15.7364C15.8225 15.6509 15.8896 15.5491 15.9347 15.4371C15.9798 15.325 16.002 15.205 15.9999 15.0841C15.9977 14.9633 15.9714 14.8441 15.9224 14.7337C15.8734 14.6233 15.8027 14.5239 15.7146 14.4416L11.2673 9.97755L15.7146 5.51355C15.873 5.34294 15.9592 5.11728 15.9551 4.88412C15.951 4.65096 15.8569 4.4285 15.6926 4.2636C15.5284 4.09871 15.3067 4.00425 15.0744 4.00014C14.8421 3.99603 14.6173 4.08257 14.4474 4.24155L10 8.70555L5.55264 4.24155Z"
									fill="white"
								/>
							</svg>
						</button>
					</li>
				))}
				<li className="flex my-auto">
					<span
						ref={span}
						className="absolute text-xl font-medium whitespace-pre border-none outline-none opacity-0 bg-inherit -z-50"
					>
						{inputVal}
					</span>
					<input
						value={inputVal}
						onFocus={() => setFocused(true)}
						onBlur={() => setFocused(false)}
						onChange={(e) => {
							setInputVal(e.target.value.replace(/,/g, ""));
						}}
						style={{ width }}
						type="text"
						className="text-xl font-medium placeholder-gray-500 border-none outline-none bg-inherit focus:placeholder-transparent"
						onKeyDown={inputKeyDown}
						ref={input}
						{...rest}
					/>
				</li>
			</ul>
		</div>
	);
};

export default InputTag;
